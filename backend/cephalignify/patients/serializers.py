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
    
    def validate_Phone_number(self, value):
        if not value.startswith("09"):
            raise serializers.ValidationError("رقم الهاتف يجب أن يبدأ بـ 09.")
    
        if len(value) != 10 or not re.match(r"^\d{10}$", value):
            raise serializers.ValidationError("رقم الهاتف يجب أن يتكون من 10 أرقام.")
        
        return value
    
   
    age = serializers.SerializerMethodField()

    def get_age(self, obj):
        return obj.calculate_age() 
