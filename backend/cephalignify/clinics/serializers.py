from rest_framework import serializers
from .models import Clinic

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'Name', 'Work_start_time', 'Work_end_time']

    def update(self, instance, validated_data):
        request = self.context['request']
        user = request.user

        # Ensure only the doctor can update the clinic information
        if user.role != 'doctor':
            raise serializers.ValidationError("You do not have permission to update clinic information.")

        # Update the clinic instance with the new validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        # Ensure only the doctor can create the clinic information
        if user.role != 'doctor':
            raise serializers.ValidationError("You do not have permission to create clinic information.")

        # Create the clinic instance with the validated data
        clinic = Clinic.objects.create(**validated_data)
        return clinic
