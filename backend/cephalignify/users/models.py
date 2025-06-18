from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')

        email = self.normalize_email(email)
        
        # الطبيب والسكرتير لا يملكون صلاحية دخول لوحة الإدارة
        role = extra_fields.get('role')
        if role in ['doctor', 'secretary']:
            extra_fields.setdefault('is_staff', False)
            extra_fields.setdefault('is_superuser', False)

        elif role == 'admin':
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.full_clean()
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('role') != 'admin':
            raise ValueError('Superuser must have role=admin.')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('doctor', 'Doctor'),
        ('secretary', 'Secretary'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=100)  
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, null=True, blank=True)
    city = models.ForeignKey('City', on_delete=models.SET_NULL, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    Phone_number = PhoneNumberField(unique=True, blank=True, null=True)
    address = models.CharField(max_length=255, null=True, blank=True) 

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # افتراضياً False
    is_superuser = models.BooleanField(default=False)

    def clean(self):
        super().clean()
        if self.role in ['doctor', 'secretary'] and self.clinic is None:
            raise ValidationError({'clinic': f"A {self.role} must be assigned to a clinic."})

        if self.role in ['doctor'] and not self.Phone_number:
            raise ValidationError({'Phone_number': "Phone number is required for doctors and secretaries."})

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
