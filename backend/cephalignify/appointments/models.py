from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.

class Appointment(models.Model):
    Patient_full_name = models.CharField(max_length=30)
    Phone_number = PhoneNumberField(null=False, blank=False) 
    DateAndTime = models.DateTimeField()
    Patient_case = models.TextField(null=True, blank=True)
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE)

    def __str__(self):
        return f"Appointment for {self.Patient_full_name} on {self.DateAndTime.strftime('%Y-%m-%d %H:%M')} - Case: {self.Patient_case or 'لم يتم إدخال الحالة المرضية'}"
    
