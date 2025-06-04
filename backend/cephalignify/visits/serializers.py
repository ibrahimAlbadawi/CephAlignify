from cephalignify.visits.models import Visit
from rest_framework import serializers


class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = [
            'id', 'patient', 'appointment', 'analysis',
            'Additional_notes', 'Visit_summary', 'Prescriptions',
            'Analysis_diagnosis', 'report'
        ]

        read_only_fields = ['patient'] 
######It is not important
    def validate(self, data):
        # Prevent double visit for same appointment
        if Visit.objects.filter(appointment=data['appointment']).exists():
            raise serializers.ValidationError("A visit for this appointment already exists.")
        return data

def create(self, validated_data):
    appointment = validated_data['appointment']
    validated_data['patient'] = appointment.patient
    return super().create(validated_data)
