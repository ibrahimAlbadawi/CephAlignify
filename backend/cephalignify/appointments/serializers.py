from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'Patient_full_name', 'Phone_number', 'DateAndTime',
                   'Patient_case', 'Clinic']
