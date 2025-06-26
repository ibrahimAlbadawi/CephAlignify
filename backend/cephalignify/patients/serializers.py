from datetime import date
from time import localtime
from rest_framework import serializers

from cephalignify.appointments.serializers import AppointmentSerializer
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    last_visit = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    appointments = AppointmentSerializer(many=True, read_only=True)

    # This will return the decrypted phone number
    Phone_number = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'Full_name', 'Gender', 'Birthdate',
            'Phone_number', 'Email', 'Address', 'clinic',   
            'age', 'last_visit', 'appointments'
        ]
        read_only_fields = ['age', 'last_visit', 'appointments']

    def get_last_visit(self, obj):
        last_appointment_with_visit = obj.appointments.filter(visit__isnull=False).order_by('-DateAndTime').first()
        if last_appointment_with_visit:
            return last_appointment_with_visit.DateAndTime 
        return None

    def create(self, validated_data):
        phone = self.initial_data.get("Phone_number")
        instance = Patient(**validated_data)
        if phone:
            instance.Phone_number = str(phone)  # triggers encryption via model setter
        instance.save()
        return instance

    def update(self, instance, validated_data):
        phone = self.initial_data.get("Phone_number")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if phone:
            instance.Phone_number = str(phone)  # triggers encryption
        instance.save()
        return instance

    def get_age(self, obj):
        return obj.calculate_age
    
    def validate_gender(self, value):
        if value.lower() == 'male':
            return 'M'
        elif value.lower() == 'female':
            return 'F'
        raise serializers.ValidationError("Gender must be 'Male' or 'Female'.")

    def validate(self, data):
        if not data.get('clinic'):
            raise serializers.ValidationError("A patient must have a clinic.")
        return data

    def validate_Birthdate(self, value):
        if value > date.today():
            raise serializers.ValidationError("Birthdate cannot be in the future.")
        return value

    def get_Phone_number(self, obj):
        return str(obj.Phone_number)  # 🔓 Will call the model property to decrypt
