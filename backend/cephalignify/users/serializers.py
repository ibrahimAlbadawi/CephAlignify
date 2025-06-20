from rest_framework import serializers
from .models import User, Country, City
from cephalignify.clinics.models import Clinic
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'password', 'role',
                  'username', 'clinic', 'city', 'Phone_number']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # تشفير كلمة المرور
        user.save()
        return user

class SecretarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


class DoctorProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    clinic_work_start = serializers.TimeField(source='clinic.Work_start_time', read_only=True)
    clinic_work_end = serializers.TimeField(source='clinic.Work_end_time', read_only=True)
    city = serializers.SerializerMethodField(read_only=True)
    country = serializers.SerializerMethodField(read_only=True)
    secretary = serializers.SerializerMethodField(read_only=True)

    full_name = serializers.CharField(required=False)
    address = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)

    def get_first_name(self, obj):
        return obj.full_name.split()[0] if obj.full_name else ""

    def get_last_name(self, obj):
        return " ".join(obj.full_name.split()[1:]) if obj.full_name and len(obj.full_name.split()) > 1 else ""

    def get_city(self, obj):
        return obj.city.Name if obj.city else None

    def get_country(self, obj):
        return obj.city.country.Name if obj.city and obj.city.country else None

    def get_secretary(self, obj):
        secretary = User.objects.filter(clinic=obj.clinic, role='secretary').first()
        if secretary:
            return SecretarySerializer(secretary).data
        return None

    class Meta:
        model = User
        fields = [
            'username', 'email', 'full_name', 'first_name', 'last_name',
            'address', 'clinic_work_start', 'clinic_work_end',
            'city', 'country', 'secretary'
        ]
        extra_kwargs = {field: {"required": False} for field in fields}
