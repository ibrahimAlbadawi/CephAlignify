from django.db import models
from cephalignify import settings

# Create your models here.

class Analysis(models.Model):
    ANALYSIS_CHOICES = [
        ('Steiner', 'Steiner'),
    ]
    image = models.ImageField(upload_to='analysis_results/Images/',
                               null=True, blank=True, max_length=255)
    Analysis_type = models.CharField(max_length=7,
                 choices=ANALYSIS_CHOICES, null=False, blank=False)
    Result = models.JSONField(null=True, blank=True)
    steiner_report = models.FileField(upload_to='analysis_results/Steiner_Reports/',
                                          null=True, blank=True, max_length=255)
    steiner_image = models.FileField(upload_to='analysis_results/Steiner_Images/',
                                      null=True, blank=True, max_length=255)
    analysis_diagnosis = models.TextField(blank=True, null=True)
               


    def __str__(self):
        return (
            f"Analysis:\n"
            f"- Type: {self.Analysis_type}\n"
            f"- Image Path: {self.image}\n"
            f"- Result: {self.Result}"
        )


class Report(models.Model):
    analysis = models.OneToOneField('Analysis',
                            on_delete=models.CASCADE, related_name='report')   
    visit = models.OneToOneField('visits.Visit',
                 on_delete=models.CASCADE, related_name='report_visit')
 
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL,
                            on_delete=models.CASCADE, related_name='reports')
    content = models.TextField(blank=True, null=True)
    pdf_file = models.FileField(upload_to='reports/',
                                 null=True, blank=True)  # ملف PDF الناتج

    def __str__(self):
        return f"Report #{self.id} for visit {self.visit.id}"



