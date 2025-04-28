from rest_framework import serializers
from .models import Analysis, Report, Visit, Patient

class AnalysisSerializer(serializers.ModelSerializer):
   
    Analysis_type_display = serializers.CharField(source='get_Analysis_type_display', read_only=True)

    class Meta:
        model = Analysis
        fields = ['id', 'Image_path', 'Analysis_type', 'Analysis_type_display', 'Result', 'Visit']


class ReportSerializer(serializers.ModelSerializer):
   
    Analysis = AnalysisSerializer()

    class Meta:
        model = Report
        fields = ['id', 'Analysis', 'Visit']


class VisitSerializer(serializers.ModelSerializer):
   
    Patient = serializers.StringRelatedField()  
    Analysis = AnalysisSerializer()
    Report = ReportSerializer()

    def create(self, validated_data):
     
        visit = Visit.objects.create(**validated_data)
        return visit

    class Meta:
        model = Visit
        fields = [
            'id', 'Patient', 'DateAndTime', 'Analysis', 'Additional_notes', 
            'Visit_summary', 'Prescriptions', 'Analysis_diagnosis', 'Report'
        ]
