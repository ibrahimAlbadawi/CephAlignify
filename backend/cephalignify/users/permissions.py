from rest_framework.permissions import BasePermission
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'doctor'

class IsSecretary(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'secretary'

    def has_object_permission(self, request, view, obj):
        # تأكد أن السكرتير لا يغير مواعيد تخص عيادة أخرى
        return obj.clinic == request.user.clinic
    

    class CanDoctorEditSecretaryPermission(permissions.BasePermission):
     def has_object_permission(self, request, view, obj):
        current_user = request.user

        if current_user.role == 'doctor':
            # الطبيب يمكنه تعديل فقط السكرتير
            return obj.role == 'secretary'
        elif current_user.role == 'secretary':
            return False
        return False