from rest_framework import serializers
from cephalignify.analysis.serializers import AnalysisSerializer, ReportSerializer
from cephalignify.visits.models import Visit

class VisitSerializer(serializers.ModelSerializer):
    analysis = AnalysisSerializer(read_only=True)
    report = ReportSerializer(read_only=True)

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
            'Analysis_diagnosis',
            'report',
            'patient_name',
            'patient_gender',
            'patient_age',
        ]


# هذه الحقول يتم إنشاؤها أو ربطها من خلال الباكند فقط (ليس من طرف المستخدم)
#جعلها read_only يمنع المستخدم من تعديلها يدويًا.
# يجعل الـ serializer يعرض البيانات من خلال GET، لكن يمنع تعديلها في POST أو PUT.
        read_only_fields = [
            'analysis', 'report',
            'patient_name', 'patient_gender', 'patient_age',
            'appointment_datetime',
        ]

        extra_kwargs = {
            'appointment': {'required': False},
        }


    def get_patient_name(self, obj):
        return obj.appointment.patient.Full_name if obj.appointment and obj.appointment.patient else None

    def get_patient_gender(self, obj):
        return obj.appointment.patient.Gender if obj.appointment and obj.appointment.patient else None

    def get_patient_age(self, obj):
        return obj.appointment.patient.calculate_age if obj.appointment and obj.appointment.patient else None

    