from rest_framework import serializers
from .models import Analysis, Report

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = ['id', 'Analysis_type', 'Result', 'Visit']


class ReportSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.Full_name', read_only=True)
    Analysis = AnalysisSerializer()

    class Meta:
        model = Report
        fields = ['id', 'Analysis', 'Visit']


  
     
       
        