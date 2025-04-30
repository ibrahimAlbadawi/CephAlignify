from rest_framework import serializers
from .models import User, Country, City
from .serializers import CountrySerializer
from django.contrib.auth.hashers import make_password


class UserForDoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'clinic', 'city', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance

#---------------------------------------------------------------------

class SecretaryManageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'clinic', 'city', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def validate_role(self, value):
        if value != 'secretary':
            raise serializers.ValidationError("هذا السيريالايزر مخصص فقط للمستخدمين بدور سكرتير.")
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance

#---------------------------------------------------------------------

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'Name']


class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)  #لعرض تفاصيل البلد المرتبطة بدلا من المعرف

    class Meta:
        model = City
        fields = ['id', 'Name', 'country']