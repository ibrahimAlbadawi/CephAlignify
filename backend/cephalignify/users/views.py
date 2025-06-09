from rest_framework import serializers, generics, permissions, status 
from rest_framework.response import Response
from .serializers import UserSerializer 
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

class MyTokenObtainPairSerializer(serializers.Serializer):
    id = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    
    def validate(self, attrs):
        identifier = attrs.get('id')
        password = attrs.get('password')

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

        refresh = RefreshToken.for_user(user)

        return {
            'success': True,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': str(user.username),
            'email': str(user.email),
            'id': str(user.id),
            'role': str(user.role),
            'full_name': str(user.full_name)
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
