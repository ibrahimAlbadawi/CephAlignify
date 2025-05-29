from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    Clinic = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'Patient_full_name', 'Phone_number', 'DateAndTime', 'Patient_case', 'Clinic']

    def validate(self, data):
        date_time = data.get('DateAndTime')
        # لا تجلب العيادة من البيانات، بل من المستخدم الحالي
        clinic = self.context['request'].user.clinic

        if Appointment.objects.filter(clinic=clinic, DateAndTime=date_time).exists():
            raise serializers.ValidationError("The appointment time conflicts with an existing appointment.")
        return data

