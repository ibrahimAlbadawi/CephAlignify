from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from datetime import date
from .encryption import encrypt_text, decrypt_text

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    Full_name = models.CharField(max_length=30)
    Gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    Birthdate = models.DateField()

    # The real DB field that stores encrypted phone number
    _Phone_number = PhoneNumberField(unique=True, db_column='Phone_number')

    Email = models.EmailField(max_length=254, blank=True)
    Address = models.CharField(max_length=40, null=True, blank=True)
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE)

    @property
    def calculate_age(self):
        today = date.today()
        born = self.Birthdate
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

    def __str__(self):
        return (
            f"Full_name: {self.Full_name} | "
            f"Gender: {'ذكر' if self.Gender == 'M' else 'أنثى'} | "
            f"Age: {self.calculate_age} سنة | "
            f"Phone_number: {self.Phone_number} | "
            f"Email: {self.Email or '---'} | "
            f"Address: {self.Address or '---'}"
        )

    @property
    def Phone_number(self):
        """
        Decrypt the stored phone number if possible; otherwise, return the raw value as string.
        """
        try:
            return decrypt_text(self._Phone_number)
        except Exception:
            return str(self._Phone_number)  # ✅ Always return a string

    @Phone_number.setter
    def Phone_number(self, value):
        """
        Encrypt the phone number before storing it in the DB.
        """
        self._Phone_number = encrypt_text(value)
