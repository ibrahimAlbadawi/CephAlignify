from django.contrib import admin
from cephalignify.patients.models import Patient 
from cephalignify.appointments.models import Appointment
from cephalignify.users.models import User, City, Country
from cephalignify.analysis.models import Analysis, Report
from cephalignify.visits.models import Visit
from cephalignify.clinics.models import Clinic
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class CustomUserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'full_name', 'role', 'clinic')

    list_filter = ('full_name',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('معلومات شخصية', {'fields': ('username', 'full_name', 'role', 'clinic', 'city')}),
        ('تسجيل الدخول', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'role', 'clinic', 'city', 'password1', 'password2'),
        }),
    )

    search_fields = ('email', 'full_name', 'username')

    ordering = ('email',)

    filter_horizontal = ()

admin.site.register(Patient)
admin.site.register(Country)
admin.site.register(City)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Appointment)
admin.site.register(Visit)
admin.site.register(Analysis)
admin.site.register(Report)
admin.site.register(Clinic)
