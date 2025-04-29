from rest_framework import serializers
from .models import Visit
from .serializers import PatientSerializer, AnalysisSerializer, ReportSerializer  # تأكد من استيراد السيريالايزر المناسب

class VisitSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)  # لعرض تفاصيل المريض بدلاً من الرقم
    analysis = AnalysisSerializer(read_only=True, required=False)  # عرض تفاصيل التحليل
    report = ReportSerializer(read_only=True, required=False)  # عرض تفاصيل التقرير

    class Meta:
        model = Visit
        fields = [
            'id','patient', 'DateAndTime','analysis','Additional_notes',
            'Visit_summary','Prescriptions','Analysis_diagnosis','report'  
        ]
