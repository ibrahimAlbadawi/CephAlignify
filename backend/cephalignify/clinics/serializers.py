from rest_framework import serializers
from .models import Clinic

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'Name', 'Work_start_time', 'Work_end_time']

    def get_user(self):
        request = self.context.get('request')
        return request.user if request else None

    def update(self, instance, validated_data):
        user = self.get_user()
        if not user or user.role != 'doctor':
            raise serializers.ValidationError("Only doctors can modify clinic details.")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def create(self, validated_data):
        user = self.get_user()
        if not user or user.role != 'doctor':
            raise serializers.ValidationError("Only doctors can create clinic information.")
        return Clinic.objects.create(**validated_data)
