from rest_framework import serializers, generics, permissions, status 
from rest_framework.response import Response
from .serializers import UserSerializer 
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

class MyTokenObtainPairSerializer(serializers.Serializer):
    id = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    role = serializers.CharField(write_only=True)  

    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    
    def validate(self, attrs):
        identifier = attrs.get('id')
        password = attrs.get('password')
        requested_role = attrs.get('role')  

        User = get_user_model()
        user = None

        try:
            if '@' in identifier:
                user = User.objects.get(email=identifier)
            else:
                user = User.objects.get(username=identifier)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "success": False,
                "message": "Incorrect username/email."
            })

        if not user.check_password(password):
            raise serializers.ValidationError({
                "success": False,
                "message": "Incorrect password."
            })

        if user.role != requested_role:
            raise serializers.ValidationError({
                "success": False,
                "message": f"User is not registered as a '{requested_role}'."
            })

        refresh = RefreshToken.for_user(user)

        return {
            'success': True,
            'refresh': refresh,
            'access': refresh.access_token,
            'username': user.username,
            'email': user.email,
            'id': user.id,
            'role': user.role,
            'full_name': user.full_name,
            'clinic_id': user.clinic.id     
}



class LoginAPIView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]  
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "message": "User created successfully."
        }, status=status.HTTP_201_CREATED)
