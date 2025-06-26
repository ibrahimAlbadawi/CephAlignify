from rest_framework import serializers
from .models import Analysis, Report

class AnalysisSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)
    steiner_image = serializers.FileField(read_only=True)
    report = serializers.PrimaryKeyRelatedField(read_only=True)
    steiner_report_url = serializers.SerializerMethodField()

    class Meta:
        model = Analysis
        fields = [
            'id',
            'Analysis_type',
            'image',
            'steiner_image',
            'report',
            'steiner_report_url',  
            'enable_ai_diagnosis',
        ]
        read_only_fields = fields

    def get_steiner_report_url(self, obj):
        request = self.context.get('request')
        if obj.steiner_report and hasattr(obj.steiner_report, 'url'):
            if request:
                return request.build_absolute_uri(obj.steiner_report.url)
            return obj.steiner_report.url
        return None

class ReportSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id',
            'content',
            'pdf_file', #يعرض اسم أو مسار الملف كما هو مخزن في النظام
            'pdf_url', #يعطي رابط تحميل مباشر يمكن للفرونت استخدامه لعرض أو تنزيل الملف
        ]
        read_only_fields = fields

    def get_steiner_report_url(self, obj):
        request = self.context.get('request')
        if obj.steiner_report and hasattr(obj.steiner_report, 'url'):
            return request.build_absolute_uri(obj.steiner_report.url) if request else obj.steiner_report.url
        return None


    def get_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.pdf_file and hasattr(obj.pdf_file, 'url'):
            return request.build_absolute_uri(obj.pdf_file.url) if request else obj.pdf_file.url
        return None
