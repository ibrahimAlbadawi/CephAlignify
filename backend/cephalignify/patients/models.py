from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.core.validators import EmailValidator
from datetime import date

# اضافة القيود على الحقول
# Create your models here.

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'ذكر'),
        ('F', 'أنثى'),
    ]
    Full_name = models.CharField(max_length=30)
    Gender = models.CharField(max_length=5, choices=GENDER_CHOICES)
    Birthdate = models.DateField()
    Phone_number = PhoneNumberField(null=False, blank=False)
    Email = models.EmailField(max_length=254, null=True, blank=True, validators=[EmailValidator()])
    Address = models.CharField(max_length=40, null=True, blank=True)
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE)

    def calculate_age(self):
        today = date.today()
        born = self.Birthdate
        age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
        return age

    def __str__(self):
        return (
            f"Full_name: {self.Full_name} | "
            f"Gender: {'ذكر' if self.Gender == 'M' else 'أنثى'} | "
            f"Age: {self.calculate_age()} سنة | "
            f"Phone_number: {self.Phone_number} | "
            f"Email: {self.Email or '---'} | "
            f"Address: {self.Address or '---'}"
        )
