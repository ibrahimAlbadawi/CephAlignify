from rest_framework import serializers
from .models import Analysis, Report

class AnalysisSerializer(serializers.ModelSerializer):
   
    Analysis_type_display = serializers.CharField(
    source='get_Analysis_type_display', 
    read_only=True)

    class Meta:
        model = Analysis
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
   
    Analysis = AnalysisSerializer()

    class Meta:
        model = Report
        fields = '__all__'


  
     
       
        