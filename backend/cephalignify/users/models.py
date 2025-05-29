from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.exceptions import ValidationError

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
             raise ValueError('البريد الإلكتروني مطلوب')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # تشفير كلمة السر تلقائيا
        user.full_clean() 
        user.save()
        return user


    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('doctor', 'Doctor'),
        ('secretary', 'Secretary'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=100)  
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, null=True, blank=True)
    city = models.ForeignKey('City', on_delete=models.SET_NULL, null=True
                             , blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def clean(self):
            super().clean()
            if self.role in ['doctor', 'secretary'] and self.clinic is None:
                raise ValidationError({'clinic': f"A {self.role} must be assigned to a clinic."})



    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name', 'role']

    def __str__(self):
        return f"{self.full_name} ({self.role})"


class Country(models.Model):
    Name = models.CharField(max_length=10)

    def __str__(self):
        return self.Name


class City(models.Model):
    Name = models.CharField(max_length=10)
    country = models.ForeignKey('Country', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.Name}, {self.country.Name}"
