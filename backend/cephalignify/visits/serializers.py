from rest_framework import serializers
from .models import Visit

class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = [
            'id', 'patient', 'DateAndTime', 'analysis', 'Additional_notes',
            'Visit_summary', 'Prescriptions', 'Analysis_diagnosis', 'report'
        ]
