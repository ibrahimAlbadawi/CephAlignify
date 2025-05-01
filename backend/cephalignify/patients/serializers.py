from rest_framework import serializers
from .models import Patient
import re

class PatientSerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source='clinic.Name', read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id','Full_name','Gender','Birthdate','Phone_number',
            'Email','Address','clinic'
        ]
   
    age = serializers.SerializerMethodField()

    def get_age(self, obj):
        return obj.calculate_age() 
