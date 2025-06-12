from django.db import models

# Create your models here.

class Appointment(models.Model):
    patient = models.ForeignKey('patients.Patient',
                 on_delete=models.CASCADE, related_name='appointments') 
    DateAndTime = models.DateTimeField()
    Patient_case = models.TextField(null=True, blank=True)
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Appointment for {self.patient.Full_name} on {self.DateAndTime.strftime('%Y-%m-%d %H:%M')} - Case: {self.Patient_case or 'لم يتم إدخال الحالة المرضية'}"

    
