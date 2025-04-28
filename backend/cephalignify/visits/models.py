from django.db import models

# Create your models here.

class Visit(models.Model): ## التعديل على خاصية on delete
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    DateAndTime = models.DateTimeField()
    analysis = models.OneToOneField('analysis.Analysis', on_delete=models.SET_NULL, null=True,
                                     blank=True, related_name='visits')
    Additional_notes = models.TextField(blank=True, null=True)
    Visit_summary = models.TextField(blank=True, null=True)
    Prescriptions = models.TextField(blank=True, null=True)
    Analysis_diagnosis = models.TextField(blank=True, null=True)
    report = models.OneToOneField('analysis.Report', on_delete=models.SET_NULL, null=True,
                                   blank=True, related_name='visits')
     
    def __str__(self):
        return (
            f"Visit:\n"
            f"- Patient: {self.patient}\n"
            f"- Date and Time: {self.DateAndTime.strftime('%Y-%m-%d %H:%M')}\n"
            f"- Analysis: {self.analysis}\n"
            f"- Report: {self.report}\n"
            f"- Additional Notes: {self.Additional_notes or 'لا توجد ملاحظات مكتوبة'}\n"
            f"- Visit Summary: {self.Visit_summary or '---'}\n"
            f"- Prescriptions: {self.Prescriptions or '---'}\n"
            f"- AI Diagnosis: {self.Analysis_diagnosis or 'لم يتم إجراء تشخيص'}"
        )