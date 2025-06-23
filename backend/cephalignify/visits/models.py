from django.db import models

# Create your models here.

class Visit(models.Model): 
    analysis = models.OneToOneField('analysis.Analysis', null=True, blank=True,
                            on_delete=models.SET_NULL, related_name='visit')
    Additional_notes = models.TextField(blank=True, null=True)
    Visit_summary = models.TextField(blank=True, null=True)
    Prescriptions = models.TextField(blank=True, null=True)
    Analysis_diagnosis = models.TextField(blank=True, null=True)
    report = models.OneToOneField('analysis.Report', null=True,
        blank=True, on_delete=models.SET_NULL, related_name='visit_report')

    appointment = models.OneToOneField('appointments.Appointment',
                            on_delete=models.CASCADE, related_name='visit')
    enable_ai_diagnosis = models.BooleanField(default=False)
    


     
    def __str__(self):
        return (
            f"Visit:\n"
            f"- Patient: {self.patient}\n"
            f"- Analysis: {self.analysis}\n"
            f"- Report: {self.report}\n"
            f"- Additional Notes: {self.Additional_notes or 'لا توجد ملاحظات مكتوبة'}\n"
            f"- Visit Summary: {self.Visit_summary or '---'}\n"
            f"- Prescriptions: {self.Prescriptions or '---'}\n"
            f"- AI Diagnosis: {self.Analysis_diagnosis or 'لم يتم إجراء تشخيص'}"
            f"Visit for {self.patient.Full_name} at {self.appointment.DateAndTime}"
        )