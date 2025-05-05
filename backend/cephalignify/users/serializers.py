from rest_framework import serializers
from .models import User

class SecretaryManageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'clinic', 'city', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def validate_role(self, value):
        # Make sure the role is 'secretary'
        if value != 'secretary':
            raise serializers.ValidationError("This serializer is only for secretaries.")
        return value

    def update(self, instance, validated_data):
        request = self.context['request']
        user = request.user

        # Secretaries cannot update their own account
        if user.role == 'secretary':
            raise serializers.ValidationError("You do not have permission to modify this account.")
from rest_framework import serializers
from .models import Clinic

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'Name', 'Work_start_time', 'Work_end_time']

    def update(self, instance, validated_data):
        request = self.context['request']
        user = request.user

        # Only doctors can modify clinic details
        if user.role != 'doctor':
            raise serializers.ValidationError("Only doctors can modify clinic details.")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance
