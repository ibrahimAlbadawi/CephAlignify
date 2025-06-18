from rest_framework import serializers, generics, permissions, status 
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer 
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import DoctorProfileSerializer
from cephalignify.clinics.models import Clinic

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
            'refresh': str(refresh),
            'access': str(refresh.access_token),
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


class ClinicManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'doctor':
            return Response({"detail": "Not allowed."}, status=403)

        data = {
            "doctor": DoctorProfileSerializer(user).data,
        }
        return Response(data)

    def put(self, request):
        return self.update(request, partial=False)

    def patch(self, request):
        return self.update(request, partial=True)

    def update(self, request, partial):
        user = request.user
        if user.role != 'doctor':
            return Response({"detail": "Not allowed."}, status=403)

        # تعديل بيانات الطبيب
        doctor_serializer = DoctorProfileSerializer(user, data=request.data.get('doctor', {}), partial=partial)
        if not doctor_serializer.is_valid():
            return Response(doctor_serializer.errors, status=400)
        doctor_serializer.save()

        # تعديل بيانات العيادة
        clinic = user.clinic
        clinic_data = request.data.get('clinic', {})
        if partial:
            # تحديث جزئي: نحدث الحقول الموجودة فقط
            if 'name' in clinic_data:
                clinic.Name = clinic_data['name']
            if 'work_start' in clinic_data:
                clinic.Work_start_time = clinic_data['work_start']
            if 'work_end' in clinic_data:
                clinic.Work_end_time = clinic_data['work_end']
        else:
            # تحديث كامل: نعطي الحقول كلها (يمكن التعديل حسب الحاجة)
            clinic.Name = clinic_data.get('name', clinic.Name)
            clinic.Work_start_time = clinic_data.get('work_start', clinic.Work_start_time)
            clinic.Work_end_time = clinic_data.get('work_end', clinic.Work_end_time)
        clinic.save()

        # تعديل بيانات السكرتير
        secretary = User.objects.filter(clinic=user.clinic, role='secretary').first()
        if secretary:
            secretary_data = request.data.get('secretary', {})
            if partial:
                if "username" in secretary_data:
                    secretary.username = secretary_data["username"]
                if "email" in secretary_data:
                    secretary.email = secretary_data["email"]
                if "password" in secretary_data:
                    if secretary_data.get("password") != secretary_data.get("confirm_password"):
                        return Response({"detail": "Passwords do not match."}, status=400)
                    secretary.set_password(secretary_data["password"])
            else:
                secretary.username = secretary_data.get("username", secretary.username)
                secretary.email = secretary_data.get("email", secretary.email)
                if secretary_data.get("password"):
                    if secretary_data.get("password") != secretary_data.get("confirm_password"):
                        return Response({"detail": "Passwords do not match."}, status=400)
                    secretary.set_password(secretary_data["password"])
            secretary.save()

        return Response({"detail": "Clinic profile updated successfully."})
