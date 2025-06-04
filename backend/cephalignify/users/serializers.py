from rest_framework import serializers
from .models import User, Country, City
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'password', 'role',
                  'username', 'clinic', 'city']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # تشفير كلمة المرور
        user.save()
        return user


class UserForDoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username' ,'email', 'full_name', 'role', 'clinic', 'city', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance


class SecretaryManageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'clinic', 'city', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_role(self, value):
        if value != 'secretary':
            raise serializers.ValidationError("This serializer is only for secretaries.")
        return value

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        # منع السكرتير من تعديل حسابه أو حساب سكرتير آخر
        if user and user.role == 'secretary':
            raise serializers.ValidationError("You do not have permission to modify this account.")

        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'Name']


class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)

    class Meta:
        model = City
        fields = ['id', 'Name', 'country']