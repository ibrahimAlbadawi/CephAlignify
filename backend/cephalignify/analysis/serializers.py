from rest_framework import serializers
from .models import Analysis, Report

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = ['id', 'Analysis_type_display', 'Result', 'visit', 'image']
        read_only_fields = ['Result']


class ReportSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.Full_name', read_only=True)
    patient_name = serializers.CharField(source='visit.patient.Full_name', read_only=True)
    appointment_datetime = serializers.DateTimeField(source='visit.appointment.DateAndTime', read_only=True)
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id',
            'doctor_name',
            'patient_name',
            'appointment_datetime',
            'visit',
            'content',
            'pdf_file',
            'pdf_url',
        ]

        read_only_fields = ['doctor_name', 'patient_name', 'appointment_datetime', 'pdf_url', 'pdf_file']

    def get_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.pdf_file and hasattr(obj.pdf_file, 'url'):
            return request.build_absolute_uri(obj.pdf_file.url) if request else obj.pdf_file.url
        return None
