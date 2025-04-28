from rest_framework import serializers
from .models import Appointment, Clinic

class ClinicSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Clinic
        fields = ['id', 'Name', 'Work_start_time', 'Work_end_time']

class AppointmentSerializer(serializers.ModelSerializer):
    
    Clinic = ClinicSerializer()

    class Meta:
        model = Appointment
        fields = ['id', 'Patient_full_name', 'Phone_number', 'DateAndTime', 'Patient_case', 'Clinic']
