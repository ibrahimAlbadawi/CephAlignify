from rest_framework import serializers
from cephalignify.analysis.serializers import AnalysisSerializer, ReportSerializer
from cephalignify.visits.models import Visit

class VisitSerializer(serializers.ModelSerializer):
    analysis = AnalysisSerializer(read_only=True)
    report = ReportSerializer(read_only=True)
    analysis_diagnosis = serializers.SerializerMethodField()

    # معلومات المريض
    patient_name = serializers.SerializerMethodField()
    patient_gender = serializers.SerializerMethodField()
    patient_age = serializers.SerializerMethodField()

    # معلومات الموعد
    appointment_datetime = serializers.DateTimeField(source='appointment.DateAndTime', read_only=True)

    class Meta:
        model = Visit
        fields = [
            'id',
            'appointment',
            'appointment_datetime',
            'analysis',
            'Additional_notes',
            'Visit_summary',
            'Prescriptions',
            'analysis_diagnosis',
            'report',
            'patient_name',
            'patient_gender',
            'patient_age',
        ]
        # الحقول التي لا يمكن تعديلها من الواجهة الأمامية (read-only)
        read_only_fields = [
            'analysis', 'report',
            'patient_name', 'patient_gender', 'patient_age',
            'appointment_datetime', 'analysis_diagnosis'
        ]
        extra_kwargs = {
            'appointment': {'required': False},
        }

    def get_patient_name(self, obj):
        if obj.appointment and obj.appointment.patient:
            return obj.appointment.patient.Full_name
        return None

    def get_patient_gender(self, obj):
        if obj.appointment and obj.appointment.patient:
            return obj.appointment.patient.Gender
        return None

    def get_patient_age(self, obj):
        if obj.appointment and obj.appointment.patient:
            return obj.appointment.patient.calculate_age  
        return None

    def get_analysis_diagnosis(self, obj):
        if obj.analysis:
            return obj.analysis.analysis_diagnosis
        return None
