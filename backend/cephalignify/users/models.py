from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.

class User(models.Model):
    Email = models.EmailField(max_length=254,null=True, blank=True)
    Password = models.CharField(max_length=20)
    Full_name = models.CharField(max_length=30)
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE)
    city = models.ForeignKey('City', on_delete=models.SET_NULL, null=True)
    role = models.ForeignKey('Role', on_delete=models.CASCADE)

    def set_password(self, raw_password):
        "تشفير كلمة السر عند الحفظ"
        self.Password = make_password(raw_password)

    def check_password(self, raw_password):
        "التحقق من كلمة السر عند تسجيل الدخول"
        return check_password(raw_password, self.Password)
    
    def __str__(self):
        return f"{self.Full_name}\n{self.Email}\n{self.city}\n{self.role}"


class Role(models.Model):
    Name = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.Name
    

class Country(models.Model):
    Name = models.CharField(max_length=10)

    def __str__(self):
        return self.Name


class City(models.Model):
    Name = models.CharField(max_length=10)
    country = models.ForeignKey('Country', on_delete=models.SET_NULL
                                , null=True)

    def __str__(self):
        return f"{self.Name}, {self.country.Name}"