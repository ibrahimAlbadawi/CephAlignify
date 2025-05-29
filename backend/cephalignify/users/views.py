from rest_framework import serializers, viewsets, generics, permissions, status
from .models import User, Country, City
from .serializers import SecretaryManageSerializer, UserSerializer
from cephalignify.users.permissions import IsDoctor 
from rest_framework.response import Response
from django.contrib.auth import get_user_model

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]  
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "تم إنشاء المستخدم بنجاح"}, status=status.HTTP_201_CREATED)


class SecretaryViewSet(viewsets.ModelViewSet):
    serializer_class = SecretaryManageSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return User.objects.filter(clinic=self.request.user.clinic, role='secretary')


