from time import localtime
from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    last_visit = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'Full_name', 'Gender', 'Birthdate',
            'Phone_number', 'Email', 'Address', 'clinic',
            'age', 'last_visit'
        ]
        read_only_fields = ['age', 'last_visit']

    def get_last_visit(self, obj):
        last = obj.visit_set.order_by('-DateAndTime').first()
        return localtime(last.DateAndTime) if last else None

    def get_age(self, obj):
        # Calculate age using model method
        return obj.calculate_age()

    def validate(self, data):
        # Ensure that a clinic is always assigned to the patient
        if not data.get('clinic'):
            raise serializers.ValidationError("A patient must have a clinic.")
        return data
