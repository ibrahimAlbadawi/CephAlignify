import os
from io import BytesIO
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import requests
from rest_framework.views import APIView    
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
)
from reportlab.platypus import PageBreak
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import cm 

from cephalignify.analysis.models import Analysis, Report
from cephalignify.visits.models import Visit

from django.core.files import File

from AI_model.Main import analyze
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied


def generate_pdf(report):
    report_dir = os.path.join(settings.MEDIA_ROOT, 'reports')
    os.makedirs(report_dir, exist_ok=True)

    filename = f'report_{report.id}.pdf'
    filepath = os.path.join(report_dir, filename)

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='MyTitle', fontSize=18, alignment=1, spaceAfter=20))
    styles.add(ParagraphStyle(name='Heading', fontSize=14, textColor=colors.darkblue, spaceAfter=10))
    styles.add(ParagraphStyle(name='NormalBold', fontSize=12, fontName='Helvetica-Bold'))

    elements = []

    doctor = report.doctor
    visit = report.visit
    patient = visit.appointment.patient
    appointment = visit.appointment
    clinic = doctor.clinic

    clinic_name = clinic.Name if clinic else "Not specified"
    phone_number = str(doctor.Phone_number) if doctor.Phone_number else "Not available"
    address = doctor.address or "Not available"

    # ------------------- الصفحة الأولى -------------------
    elements.append(Paragraph("Cephalometric Analysis Report", styles['Title']))

    info = [
        ['Doctor Name:', doctor.full_name],
        ['Phone:', phone_number],
        ['Address:', address],
        ['Clinic:', clinic_name],
        ['Patient Name:', patient.Full_name],
        ['Appointment Date:', appointment.DateAndTime.strftime('%Y-%m-%d')],
        ['Time:', appointment.DateAndTime.strftime('%H:%M')],
    ]
    table = Table(info, colWidths=[5*cm, 10*cm], hAlign='LEFT')
    table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))

    # صورة ستينر في الصفحة الأولى
    analysis = report.analysis
    if analysis.steiner_image:
        try:
            image_path = analysis.steiner_image.path
            elements.append(Paragraph("Steiner Analysis Image:", styles['Heading']))
            img = Image(image_path)
            img._restrictSize(16*cm, 18*cm)  # تناسب A4
            img.hAlign = 'CENTER'
            elements.append(img)
        except Exception as e:
            elements.append(Paragraph(f"Unable to display image: {str(e)}", styles['Normal']))

    # ------------------- الصفحة الثانية -------------------
    elements.append(PageBreak())

    # 6. القياسات - عرض جدول 
    if analysis.steiner_report:
        try:
            with analysis.steiner_report.open('rb') as f:
                content_bytes = f.read()
            content_str = content_bytes.decode('UTF-8')
            lines = content_str.splitlines()

            measurements_data = [['Measurement', 'Value']]  
            for line in lines:
                if '=' in line:
                    parts = line.strip().split('=')
                    if len(parts) == 2:
                        name = parts[0].strip()
                        value = parts[1].strip()
                        measurements_data.append([name, value])

            if len(measurements_data) > 1:
                elements.append(Paragraph("Cephalometric Measurements:", styles['Heading']))
                measurements_table = Table(measurements_data, hAlign='LEFT', colWidths=[7*cm, 4*cm])
                measurements_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ]))
                elements.append(measurements_table)
                elements.append(Spacer(1, 20))

        except Exception as e:
            elements.append(Paragraph(f"Error reading measurements file: {str(e)}", styles['Normal']))

    # التشخيص
    elements.append(Paragraph("Diagnosis:", styles['Heading']))
    elements.append(Paragraph(report.content or "Not available", styles['Normal']))
    elements.append(Spacer(1, 12))

    # الملاحظات الإضافية
    elements.append(Paragraph("Additional Notes:", styles['Heading']))
    elements.append(Paragraph(visit.Additional_notes or "Not available", styles['Normal']))
    elements.append(Spacer(1, 12))

    # الوصفات
    elements.append(Paragraph("Prescriptions:", styles['Heading']))
    elements.append(Paragraph(visit.Prescriptions or "Not available", styles['Normal']))
    elements.append(Spacer(1, 20))

    # التوقيع
    elements.append(Spacer(1, 40))
    elements.append(Paragraph("Doctor's Signature:", styles['NormalBold']))
    elements.append(Spacer(1, 30))
    elements.append(Paragraph("__________________________", styles['Normal']))

    # إنشاء الملف
    doc.build(elements)

    with open(filepath, 'wb') as f:
        f.write(buffer.getvalue())

    buffer.close()
    report.pdf_file.name = f'reports/{filename}'
    report.save()

class IsDoctor(BasePermission):
    message = "Only doctors are authorized to perform cephalometric analysis."

    def has_permission(self, request, view):
        if request.user.role == 'doctor':
            return True
        raise PermissionDenied(self.message)


class StartAnalysisAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]
    enable_diagnosis = Visit.enable_ai_diagnosis
    def post(self, request, visit_id):
        visit = get_object_or_404(Visit, id=visit_id)

        if visit.analysis or visit.report:
            return JsonResponse({'error': 'Analysis or report already exists for this visit'}, status=400)

        analysis_type = request.POST.get('analysis_type')
        image = request.FILES.get('image')

        if not (analysis_type and image):
            return JsonResponse({'error': 'Missing required data'}, status=400)

        output_dir = os.path.join(settings.MEDIA_ROOT, 'analysis_results')
        base_name = os.path.splitext(image.name)[0]

        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, image.name)
        with open(temp_path, 'wb+') as f:
            for chunk in image.chunks():
                f.write(chunk)

        analysis_outputs = analyze(
            image_path=temp_path,
            analysis_type=analysis_type,
            output_dir=output_dir,
            base_name=base_name
        )
        os.remove(temp_path)

        analysis = Analysis.objects.create(
            image=image,
            Analysis_type=analysis_type,
            Result={},
            steiner_image=analysis_outputs.get('steiner_image'),
            steiner_report=analysis_outputs.get('steiner_report') 
        )

        steiner_image_path = analysis_outputs.get('steiner_image')
        if steiner_image_path and os.path.exists(steiner_image_path):
            with open(steiner_image_path, 'rb') as f:
                analysis.steiner_image.save(os.path.basename(steiner_image_path), File(f))

        # حفظ ملف تقرير ستاينر 
        steiner_report_path = analysis_outputs.get('steiner_report')
        if steiner_report_path and os.path.exists(steiner_report_path):
            with open(steiner_report_path, 'rb') as f:
                analysis.steiner_report.save(os.path.basename(steiner_report_path), File(f))

        analysis.save()
        visit.analysis = analysis
        visit.save()

        # استرجاع الطبيب من العيادة
        from django.contrib.auth import get_user_model
        User = get_user_model()
        clinic = visit.appointment.patient.clinic
        doctor = User.objects.filter(clinic=clinic, role='doctor').first()
        if not doctor:
            return JsonResponse({'error': 'Doctor not found for this clinic'}, status=400)

        content = f"""Doctor: {doctor.full_name}
        Patient: {visit.appointment.patient.Full_name}
        Diagnosis: {analysis.analysis_diagnosis or 'N/A'}"""

        report = Report.objects.create(
            analysis=analysis,
            visit=visit,
            doctor=doctor,
            content=content.strip()
        )
        visit.report = report
        visit.save()

        generate_pdf(report)
     #البيانات المرسلة إلى الفرونت عند تشغيل مودل التحليل
        return JsonResponse({
            'message': 'Analysis and report have been successfully created',
            'analysis_id': analysis.id,
            'report_id': report.id,
            'pdf_url': request.build_absolute_uri(report.pdf_file.url),
            'steiner_report_url': request.build_absolute_uri(analysis.steiner_report.url) if analysis.steiner_report else None,
            
        })
    

class AnalysisMeasurementsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request, analysis_id):
        analysis = get_object_or_404(Analysis, id=analysis_id)

        if not analysis.steiner_report:
            return JsonResponse({'error': 'ملف القياسات غير متوفر'}, status=404)

        try:
            # افتح ملف القياسات بوضعية 'rb' (بايت) ثم فك الترميز إلى نص
            with analysis.steiner_report.open('rb') as f:
                content_bytes = f.read()
            content_str = content_bytes.decode('UTF-8')
            lines = content_str.splitlines()

            measurements = []
            for line in lines:
                if '=' in line:
                    parts = line.strip().split('=')
                    if len(parts) == 2:
                        measurements.append({
                            'name': parts[0].strip(),
                            'value': parts[1].strip()
                        })

            # بناء رابط تحميل الملف كاملًا (URL)
            steiner_report_url = request.build_absolute_uri(analysis.steiner_report.url)

            # إرسال القياسات مع رابط الملف في الاستجابة JSON
            return JsonResponse({
                'measurements': measurements,
                'steiner_report_url': steiner_report_url
            })

        except Exception as e:
            return JsonResponse({'error': f'خطأ في قراءة ملف القياسات: {str(e)}'}, status=500)


class SteinerImageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, analysis_id):
        analysis = get_object_or_404(Analysis, id=analysis_id)
        if analysis.steiner_image and hasattr(analysis.steiner_image, 'url'):
            return JsonResponse({'steiner_image_url': request.build_absolute_uri(analysis.steiner_image.url)})
        else:
            return JsonResponse({'error': 'صورة ستينر غير متوفرة'}, status=404)
        

    import requests
import json
from django.conf import settings

def call_deepseek_api(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://127.0.0.1:8000/",  # غيّره عند النشر
        "X-Title": "MyDjangoApp"
    }

    payload = {
        "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        data=json.dumps(payload)
    )

    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']
