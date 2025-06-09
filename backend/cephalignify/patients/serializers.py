from time import localtime
from rest_framework import serializers

from cephalignify.appointments.serializers import AppointmentSerializer
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    last_visit = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    appointments = AppointmentSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'Full_name', 'Gender', 'Birthdate',
            'Phone_number', 'Email', 'Address', 'clinic',
            'age', 'last_visit', 'appointments'
        ]
        read_only_fields = ['age', 'last_visit', 'appointments']

    def get_last_visit(self, obj):
        last = obj.visit_set.order_by('-DateAndTime').first()
        return localtime(last.DateAndTime) if last else None

    def get_age(self, obj):
        # Calculate age using model method
        return obj.calculate_age()
    
    def validate_gender(self, value):
        if value.lower() == 'male':
            return 'M'
        elif value.lower() == 'female':
            return 'F'
        raise serializers.ValidationError("Gender must be 'Male' or 'Female'.")

    def validate(self, data):
        # Ensure that a clinic is always assigned to the patient
        if not data.get('clinic'):
            raise serializers.ValidationError("A patient must have a clinic.")
        return data
