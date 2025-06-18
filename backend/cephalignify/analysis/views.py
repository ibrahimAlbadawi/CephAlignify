import os
from io import BytesIO
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import cm
from django.utils import timezone

from cephalignify.analysis.models import Analysis, Report
from cephalignify.visits.models import Visit


def generate_pdf(report):
    report_dir = os.path.join(settings.MEDIA_ROOT, 'reports')
    os.makedirs(report_dir, exist_ok=True)

    filename = f'report_{report.id}.pdf'
    filepath = os.path.join(report_dir, filename)

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Title', fontSize=18, alignment=1, spaceAfter=20))
    styles.add(ParagraphStyle(name='Heading', fontSize=14, textColor=colors.darkblue, spaceAfter=10))
    styles.add(ParagraphStyle(name='NormalBold', fontSize=12, fontName='Helvetica-Bold'))

    elements = []

    doctor = report.doctor
    visit = report.visit
    patient = visit.patient
    appointment = visit.appointment

    elements.append(Paragraph("تقرير التحليل السيفالومتري", styles['Title']))

    info = [
        ['اسم الطبيب:', doctor.get_full_name()],
        ['رقم الطبيب:', doctor.username],
        ['اسم المريض:', patient.Full_name],
        ['تاريخ الموعد:', appointment.DateAndTime.strftime('%Y-%m-%d')],
        ['الوقت:', appointment.DateAndTime.strftime('%H:%M')],
    ]
    table = Table(info, colWidths=[4*cm, 10*cm], hAlign='RIGHT')
    table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("التشخيص:", styles['Heading']))
    elements.append(Paragraph(visit.Analysis_diagnosis or "لا يوجد", styles['Normal']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("الوصفات الطبية:", styles['Heading']))
    elements.append(Paragraph(visit.Prescriptions or "لا يوجد", styles['Normal']))
    elements.append(Spacer(1, 12))

    if visit.Additional_notes:
        elements.append(Paragraph("ملاحظات إضافية:", styles['Heading']))
        elements.append(Paragraph(visit.Additional_notes, styles['Normal']))
        elements.append(Spacer(1, 12))

    elements.append(Spacer(1, 50))
    elements.append(Paragraph("توقيع الطبيب:", styles['NormalBold']))
    elements.append(Spacer(1, 40))
    elements.append(Paragraph("__________________________", styles['Normal']))

    doc.build(elements)

    with open(filepath, 'wb') as f:
        f.write(buffer.getvalue())

    buffer.close()
    report.pdf_file.name = f'reports/{filename}'
    report.save()


class StartAnalysisAPIView(View):
    def post(self, request, visit_id):
        visit = get_object_or_404(Visit, id=visit_id)

        # تحقق من عدم وجود تحليل وتقرير مسبق
        if visit.analysis or visit.report:
            return JsonResponse({'error': 'تم إنشاء التحليل أو التقرير مسبقاً لهذه الزيارة'}, status=400)

        # استخرج القيم من الطلب
        analysis_type = request.POST.get('analysis_type')
        image = request.FILES.get('image')
        result_data = request.POST.get('result')  # JSON كـ string

        if not (analysis_type and image and result_data):
            return JsonResponse({'error': 'البيانات المطلوبة ناقصة'}, status=400)

        # أنشئ تحليل
        analysis = Analysis.objects.create(
            image=image,
            Analysis_type=analysis_type,
            Result=result_data,
            visit=visit
        )
        visit.analysis = analysis
        visit.save()

        # أنشئ تقرير
        doctor = visit.appointment.clinic.user  # حسب تنظيمك لعلاقة العيادة بالطبيب
        content = f"""
        Doctor: {doctor.get_full_name()}
        Patient: {visit.patient.Full_name}
        Diagnosis: {visit.Analysis_diagnosis or 'N/A'}
        """
        report = Report.objects.create(
            analysis=analysis,
            visit=visit,
            doctor=doctor,
            content=content.strip()
        )
        visit.report = report
        visit.save()

        # أنشئ PDF
        generate_pdf(report)

        return JsonResponse({
            'message': 'تم إنشاء التحليل والتقرير بنجاح',
            'report_id': report.id,
            'pdf_url': request.build_absolute_uri(report.pdf_file.url),
        })
