from rest_framework import serializers
from .models import Appointment
from django.utils.timezone import localtime

class AppointmentSerializer(serializers.ModelSerializer):
    clinic = serializers.ReadOnlyField(source='patient.clinic.pk')
    patient_name = serializers.ReadOnlyField(source='patient.Full_name')
    patient_phone = serializers.SerializerMethodField()
    def get_patient_phone(self, obj):
        return str(obj.patient.Phone_number) if obj.patient.Phone_number else ""
    patient_gender = serializers.ReadOnlyField(source='patient.Gender')
    patient_age = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    

    class Meta:
        model = Appointment
        fields = ['id','patient', 'patient_name', 'patient_phone', 'patient_gender',
                  'DateAndTime', 'Patient_case', 'clinic', 'patient_age',
                    'is_completed']
        
    def get_is_completed(self, obj):
        return hasattr(obj, 'visit')

    def get_patient_age(self, obj):
        return obj.patient.calculate_age

    def create(self, validated_data):
        return super().create(validated_data)
    
    def validate(self, data):
        date_time = data.get('DateAndTime')
        clinic = self.context['request'].user.clinic

        # Get the current instance if this is an update (PUT) operation
        instance = getattr(self, 'instance', None)

        # Find appointments that conflict (same clinic and datetime)
        conflicting_appointments = Appointment.objects.filter(
            patient__clinic=clinic,
            DateAndTime=date_time,
    )
        if instance:
               conflicting_appointments = conflicting_appointments.exclude(pk=instance.pk)

        if conflicting_appointments.exists():
             raise serializers.ValidationError("This time slot is already booked.")

         # Check if the appointment time is within the clinic's working hours
        work_start = clinic.Work_start_time
        work_end = clinic.Work_end_time
        appointment_time = date_time.time()

        if not (work_start <= appointment_time < work_end):
            raise serializers.ValidationError("Appointment time must be within clinic's working hours.")

        return data

    def validate_DateAndTime(self, value):
        # يستخدم الوقت المحلي الحالي
        current_time = localtime()
        if value < current_time:
            raise serializers.ValidationError("Appointments cannot be scheduled in the past.")
        return value