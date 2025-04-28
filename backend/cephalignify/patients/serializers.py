from rest_framework import serializers
from .models import Patient, Clinic
import re

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = '__all__' 


class PatientSerializer(serializers.ModelSerializer):
    clinic_id = serializers.IntegerField(source='clinic.id')
    
    class Meta:
        model = Patient
        fields = '__all__'
    
    def validate_Phone_number(self, value):
        if not value.startswith("09"):
            raise serializers.ValidationError("رقم الهاتف يجب أن يبدأ بـ 09.")
    
        if len(value) != 10 or not re.match(r"^\d{10}$", value):
            raise serializers.ValidationError("رقم الهاتف يجب أن يتكون من 10 أرقام.")
        
        return value
    
   
    age = serializers.SerializerMethodField()

    def get_age(self, obj):
        return obj.calculate_age()  
