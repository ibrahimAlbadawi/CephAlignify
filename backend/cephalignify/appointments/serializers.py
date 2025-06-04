from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    clinic = serializers.PrimaryKeyRelatedField(read_only=True)
    patient_name = serializers.ReadOnlyField(source='patient.Full_name')
    patient_phone = serializers.ReadOnlyField(source='patient.Phone_number')
    patient_gender = serializers.ReadOnlyField(source='patient.Gender')
    patient_age = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    

    class Meta:
        model = Appointment
        fields = ['id', 'patient_name', 'patient_phone', 'patient_gender',
                  'DateAndTime', 'Patient_case', 'clinic', 'patient_age',
                    'is_completed']
        
    def get_is_completed(self, obj):
        return hasattr(obj, 'visit')

    def get_patient_age(self, obj):
        return obj.patient.calculate_age()

    def validate(self, data):
        date_time = data.get('DateAndTime')
        clinic = self.context['request'].user.clinic

        if Appointment.objects.filter(clinic=clinic, DateAndTime=date_time).exists():
            raise serializers.ValidationError("This time slot is already booked.")
        return data

    def create(self, validated_data):
        validated_data['clinic'] = self.context['request'].user.clinic
        return super().create(validated_data)
