import os
from io import BytesIO
from urllib import request
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
    styles.add(ParagraphStyle(name='TitleCenter', fontSize=20, alignment=1, spaceAfter=24, fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='HeadingBlue', fontSize=14, textColor=colors.HexColor("#003366"), spaceAfter=14, fontName='Helvetica-Bold'))
    styles.add(ParagraphStyle(name='NormalBold', fontSize=12, fontName='Helvetica-Bold'))
    styles['Normal'].fontSize = 11
    styles['Normal'].spaceAfter = 8

    elements = []

    doctor = report.doctor
    visit = report.visit
    patient = visit.appointment.patient
    appointment = visit.appointment
    clinic = doctor.clinic

    clinic_name = clinic.Name if clinic else "Not specified"
    phone_number = str(doctor.Phone_number) if doctor.Phone_number else "Not available"
    address = doctor.address or "Not available"

    # Title
    elements.append(Paragraph("Cephalometric Analysis Report", styles['TitleCenter']))

    # Info table (doctor, patient, appointment)
    info = [
        ['Doctor Name:', doctor.full_name],
        ['Phone:', phone_number],
        ['Address:', address],
        ['Clinic:', clinic_name],
        ['Patient Name:', patient.Full_name],
        ['Appointment Date:', appointment.DateAndTime.strftime('%Y-%m-%d')],
        ['Appointment Time:', appointment.DateAndTime.strftime('%H:%M')],
    ]
    info_table = Table(info, colWidths=[5*cm, 9*cm], hAlign='LEFT')
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#e0f0ff")),  # Light blue for labels
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor("#003366")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.grey),
        ('BOX', (0,0), (-1,-1), 0.5, colors.grey),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 20))

    # Steiner image (fixed max size, centered)
    analysis = report.analysis
    if analysis.steiner_image:
        try:
            elements.append(Paragraph("Steiner Analysis Image", styles['HeadingBlue']))
            img = Image(analysis.steiner_image.path)
            img.drawHeight = 14 * cm
            img.drawWidth = img.drawHeight * img.imageWidth / img.imageHeight
            img.hAlign = 'CENTER'
            elements.append(img)
            elements.append(Spacer(1, 20))
        except Exception as e:
            elements.append(Paragraph(f"Unable to display image: {str(e)}", styles['Normal']))

    # Page break before measurements
    elements.append(PageBreak())

    # Measurements table with normal ranges (example values, adjust as needed)
    if analysis.steiner_report:
        try:
            with analysis.steiner_report.open('rb') as f:
                content_bytes = f.read()
            content_str = content_bytes.decode('UTF-8')
            lines = content_str.splitlines()

            normal_ranges = {
                "SNA": (79, 85),
                "SNB": (78, 82),
                "ANB": (1, 4),
                "SND": (70, 74),
                "SN-Occl": (6, 8),
                "U1-NA": (22, 28),
                "L1-NB": (25, 30),
                "InterInc": (130, 135),
        }
            
            def format_range(min_val, max_val):
                mean = round((min_val + max_val) / 2)
                diff = round((max_val - min_val) / 2)
                return f"{mean}° ± {diff}°"
            
            formatted_normal_ranges = {k: format_range(v[0], v[1]) for k, v in normal_ranges.items()}
            
            measurements_data = [['Measurement', 'Value', 'Normal Range']]  

            for line in lines:
                if '=' in line:
                    parts = line.strip().split('=')
                    if len(parts) == 2:
                        name = parts[0].strip()
                        value = parts[1].strip()
                        normal_range = formatted_normal_ranges.get(name, '-')
                        measurements_data.append([name, value, normal_range])

            if len(measurements_data) > 1:
                elements.append(Paragraph("Cephalometric Measurements", styles['HeadingBlue']))
                measurements_table = Table(measurements_data, colWidths=[6*cm, 4*cm, 4*cm], hAlign='LEFT')
                measurements_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#cce5ff")),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#003366")),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                ]))
                elements.append(measurements_table)
                elements.append(Spacer(1, 20))
        except Exception as e:
            elements.append(Paragraph(f"Error reading measurements file: {str(e)}", styles['Normal']))

    # Diagnosis
    elements.append(Paragraph("Diagnosis", styles['HeadingBlue']))
    elements.append(Paragraph(report.content or "Not available", styles['Normal']))
    elements.append(Spacer(1, 12))

    # Additional Notes
    elements.append(Paragraph("Additional Notes", styles['HeadingBlue']))
    elements.append(Paragraph(visit.Additional_notes or "Not available", styles['Normal']))
    elements.append(Spacer(1, 12))

    # Prescriptions
    elements.append(Paragraph("Prescriptions", styles['HeadingBlue']))
    elements.append(Paragraph(visit.Prescriptions or "Not available", styles['Normal']))
    elements.append(Spacer(1, 20))

    # Signature
    elements.append(Spacer(1, 40))
    elements.append(Paragraph("Doctor's Signature:", styles['NormalBold']))
    elements.append(Spacer(1, 30))
    elements.append(Paragraph("__________________________", styles['Normal']))

    # Build PDF
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

    def post(self, request, visit_id):
        visit = get_object_or_404(Visit, id=visit_id)
        enable_ai = request.POST.get('enable_ai_diagnosis') == 'true'

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
            steiner_image=analysis_outputs.get('steiner_image'),
            enable_ai_diagnosis=enable_ai,
        )

        steiner_image_path = analysis_outputs.get('steiner_image')
        if steiner_image_path and os.path.exists(steiner_image_path):
            with open(steiner_image_path, 'rb') as f:
                analysis.steiner_image.save(os.path.basename(steiner_image_path), File(f), save=False)

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

        content = f""" {analysis.analysis_diagnosis or "Not available"}"""



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
    permission_classes = [IsAuthenticated]
    
    # القيم الطبيعية للزوايا (approximate normal ranges)
    NORMAL_RANGES = {
        "SNA": (79, 85),
        "SNB": (78, 82),
        "ANB": (1, 4),
        "SND": (70, 74),
        "SN-Occl": (6, 8),
        "U1-NA": (22, 28),
        "L1-NB": (25, 30),
        "InterInc": (130, 135),
    }

    def get(self, request, analysis_id):
        analysis = get_object_or_404(Analysis, id=analysis_id)

        if not analysis.steiner_report:
            return JsonResponse({'error': 'Measurements file not found'}, status=404)

        try:
            with analysis.steiner_report.open('rb') as f:
                content_bytes = f.read()
            content_str = content_bytes.decode('UTF-8')
            lines = content_str.splitlines()

            measurements = []
            for line in lines:
                if '=' in line:
                    parts = line.strip().split('=')
                    if len(parts) == 2:
                        name = parts[0].strip()
                        value_str = parts[1].strip().replace('°', '')  # Remove degree symbol if present
                        try:
                            value = float(value_str)
                        except ValueError:
                            value = None

                        normal_range = self.NORMAL_RANGES.get(name)
                        if normal_range:
                            normal_min, normal_max = normal_range
                            normal_str = f"{(normal_min + normal_max)//2}° ± {(normal_max - normal_min)//2}°"
                            in_normal_range = value is not None and normal_min <= value <= normal_max
                        else:
                            normal_min = normal_max = None
                            normal_str = None
                            in_normal_range = None

                        measurements.append({
                            'name': name,
                            'value': value,
                            'normal_range': normal_str,
                            'in_normal_range': in_normal_range,
                        })

            steiner_report_url = request.build_absolute_uri(analysis.steiner_report.url)

            return JsonResponse({
                'steiner_report_url': steiner_report_url,
            })

        except Exception as e:
            return JsonResponse({'error': f'Error reading measurements file: {str(e)}'}, status=500)


class SteinerImageAPIView(APIView):
        permission_classes = [IsAuthenticated]

        def get(self, request, analysis_id):
            analysis = get_object_or_404(Analysis, id=analysis_id)
            if analysis.steiner_image and hasattr(analysis.steiner_image, 'url'):
               return JsonResponse({'steiner_image_url': request.build_absolute_uri(analysis.steiner_image.url)})
            else:
               return JsonResponse({'error': 'Steiner image not available'}, status=404)


class UpdateAnalysisAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def put(self, request, visit_id):
        return self._process_analysis_update(request, visit_id, partial=False)

    def patch(self, request, visit_id):
        return self._process_analysis_update(request, visit_id, partial=True)

    def _process_analysis_update(self, request, visit_id, partial):
        visit = get_object_or_404(Visit, id=visit_id)

        analysis_type = request.data.get('analysis_type')
        image = request.data.get('image')
        enable_ai = request.data.get('enable_ai_diagnosis') == 'true'

        if not (analysis_type and image):
            return JsonResponse({'error': 'Missing required data (analysis_type or image)'}, status=400)

        # Delete old analysis and report safely
        if visit.analysis:
            if visit.analysis.steiner_image:
                visit.analysis.steiner_image.delete(save=False)
            if visit.analysis.steiner_report:
                visit.analysis.steiner_report.delete(save=False)
            visit.analysis.delete()

        if visit.report:
            if visit.report.pdf_file:
                visit.report.pdf_file.delete(save=False)
            visit.report.delete()

        output_dir = os.path.join(settings.MEDIA_ROOT, 'analysis_results')
        base_name = os.path.splitext(image.name)[0]

        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, image.name)

        try:
            with open(temp_path, 'wb+') as f:
                for chunk in image.chunks():
                    f.write(chunk)

            analysis_outputs = analyze(
                image_path=temp_path,
                analysis_type=analysis_type,
                output_dir=output_dir,
                base_name=base_name
            )
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

        analysis = Analysis.objects.create(
            image=image,
            Analysis_type=analysis_type,
            enable_ai_diagnosis=enable_ai,
        )

        if analysis_outputs.get('steiner_image') and os.path.exists(analysis_outputs['steiner_image']):
            with open(analysis_outputs['steiner_image'], 'rb') as f:
                analysis.steiner_image.save(os.path.basename(analysis_outputs['steiner_image']), File(f))

        if analysis_outputs.get('steiner_report') and os.path.exists(analysis_outputs['steiner_report']):
            with open(analysis_outputs['steiner_report'], 'rb') as f:
                analysis.steiner_report.save(os.path.basename(analysis_outputs['steiner_report']), File(f))

        analysis.save()

        visit.analysis = analysis
        visit.save()

        from django.contrib.auth import get_user_model
        User = get_user_model()
        doctor = User.objects.filter(clinic=visit.appointment.patient.clinic, role='doctor').first()
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

        return JsonResponse({
            'message': 'Analysis and report updated successfully',
            'analysis_id': analysis.id,
            'report_id': report.id,
            'pdf_url': request.build_absolute_uri(report.pdf_file.url),
            'steiner_report_url': request.build_absolute_uri(analysis.steiner_report.url) if analysis.steiner_report else None,
        })



 #-------------------------DeepSeek-------------------------#
import os
import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import os
import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from cephalignify.analysis.models import Analysis

@csrf_exempt
def deepseek_chat(request, analysis_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    try:
        analysis = Analysis.objects.get(id=analysis_id)
    except Analysis.DoesNotExist:
        return JsonResponse({"error": "Analysis not found."}, status=404)

    if not analysis.enable_ai_diagnosis:
        return JsonResponse({"error": "AI diagnosis is not enabled for this analysis."}, status=403)

    try:
        steiner_text = ""
        if analysis.steiner_report:
            with analysis.steiner_report.open("r", encoding="utf-8") as f:
                steiner_text = f.read()

        prompt = f"""
Please analyze the provided cephalometric X-ray image, which includes anatomical landmarks and measured angles in degrees from the accompanying text file below.

{steiner_text}

Based on these inputs, provide a comprehensive diagnostic summary of the patient’s skeletal and dental relationships in no more than 60 words.
"""

        headers = {
            "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://127.0.0.1:8000/",  # غيّر إلى رابط موقعك بعد النشر
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

        reply = response.json()['choices'][0]['message']['content']

        if hasattr(analysis, 'visit'):
            visit = analysis.visit
            visit.Analysis_diagnosis = reply
            visit.save()

        return JsonResponse({"reply": reply})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

