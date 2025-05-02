from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'Full_name', 'Gender', 'Birthdate',
                   'Phone_number', 'Email', 'Address', 'clinic']

    def validate(self, data):
        # Ensure that the patient has a valid clinic
        if not data.get('clinic'):
            raise serializers.ValidationError("A patient must have a clinic.")
        return data
