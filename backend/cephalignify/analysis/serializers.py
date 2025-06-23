from rest_framework import serializers
from .models import Analysis, Report

class AnalysisSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)
    steiner_image = serializers.FileField(read_only=True)
    steiner_report = serializers.FileField(read_only=True)
    report = serializers.PrimaryKeyRelatedField(read_only=True)
    measurements = serializers.SerializerMethodField()
    steiner_report_url = serializers.SerializerMethodField()

    class Meta:
        model = Analysis
        fields = [
            'id',
            'Analysis_type',
            'Result',
            'image',
            'steiner_image',
            'steiner_report',
            'report',
            'steiner_report_url',  # فاصلة هنا مهمة
            'measurements',
        ]
        read_only_fields = fields

    def get_measurements(self, obj):
        if not obj.steiner_report:
            return []
        try:
            with obj.steiner_report.open('rb') as file:
                content_bytes = file.read()
            content_str = content_bytes.decode('UTF-8')
            lines = content_str.splitlines()

            data = []
            for line in lines:
                parts = line.strip().split('=')
                if len(parts) == 2:
                    data.append({
                        "name": parts[0].strip(),
                        "value": parts[1].strip()
                    })
            return data
        except Exception as e:
            return [{"error": str(e)}]

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
            'pdf_file',
            'pdf_url',
        ]
        read_only_fields = fields

    def get_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.pdf_file and hasattr(obj.pdf_file, 'url'):
            return request.build_absolute_uri(obj.pdf_file.url) if request else obj.pdf_file.url
        return None
