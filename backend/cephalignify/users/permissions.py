from rest_framework.permissions import BasePermission

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'doctor'

class IsSecretary(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'secretary'

    def has_object_permission(self, request, view, obj):
        # تأكد أن السكرتير لا يغير مواعيد تخص عيادة أخرى
        return obj.clinic == request.user.clinic