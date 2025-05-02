from rest_framework import serializers
from .models import User, Country, City
from django.contrib.auth.hashers import make_password


class UserForDoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'clinic', 'city', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def update(self, instance, validated_data):
        request = self.context['request']
        user = request.user

        # السماح فقط للطبيب بتعديل السكرتير
        if user.role != 'doctor':
            raise serializers.ValidationError("فقط الطبيب يمكنه تعديل حساب السكرتير.")

        # التأكد أن المستهدف للتعديل سكرتير
        if instance.role != 'secretary':
            raise serializers.ValidationError("يمكن للطبيب تعديل حساب السكرتير فقط.")

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
            raise serializers.ValidationError("هذا السيريالايزر مخصص فقط للسكرتير.")
        return value

    def update(self, instance, validated_data):
        request = self.context['request']
        user = request.user

        # السكرتير لا يمكنه تعديل بياناته
        if user.role == 'secretary':
            raise serializers.ValidationError("ليس لديك صلاحية تعديل هذا الحساب.")

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
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)

    class Meta:
        model = City
        fields = '__all__'
