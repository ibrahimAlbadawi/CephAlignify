from rest_framework import serializers
from django.contrib.auth.models import User
from .models import User as CustomUser, Role, Country, City, Clinic
from django.contrib.auth.hashers import make_password, check_password

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'Name']

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'Name']

class CitySerializer(serializers.ModelSerializer):
    Country = CountrySerializer()  

    class Meta:
        model = City
        fields = ['id', 'Name', 'Country']

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'Name', 'Work_start_time', 'Work_end_time']

class UserSerializer(serializers.ModelSerializer):
    Clinic = ClinicSerializer()  
    City = CitySerializer()  
    Role = RoleSerializer()  

    class Meta:
        model = CustomUser
        fields = ['id', 'Email', 'Full_name', 'Clinic', 'City', 'Role']

 
    def create(self, validated_data):
        clinic_data = validated_data.pop('Clinic')
        city_data = validated_data.pop('City')
        role_data = validated_data.pop('Role')

        clinic = Clinic.objects.create(**clinic_data)
        city = City.objects.create(**city_data)
        role = Role.objects.create(**role_data)

        user = CustomUser.objects.create(**validated_data)
        user.set_password(validated_data['Password']) 
        user.save()
        return user


    def check_password(self, raw_password):
        return check_password(raw_password, self.Password)
