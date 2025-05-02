from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'Patient_full_name', 'Phone_number', 'DateAndTime', 'Patient_case', 'Clinic']

    def validate(self, data):
        # Validate that the appointment does not conflict with an existing one
        date_time = data.get('DateAndTime')
        clinic = data.get('Clinic')
        if Appointment.objects.filter(Clinic=clinic, DateAndTime=date_time).exists():
            raise serializers.ValidationError("The appointment time conflicts with an existing appointment.")
        return data
