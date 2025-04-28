from django.contrib import admin
from cephalignify.patients.models import Patient 
from cephalignify.appointments.models import Appointment
from cephalignify.users.models import Role, User, City, Country
from cephalignify.analysis.models import Analysis, Report
from cephalignify.visits.models import Visit
from cephalignify.clinics.models import Clinic

# Register your models here.

admin.site.register(Patient)
admin.site.register(Country)
admin.site.register(City)
admin.site.register(User)
admin.site.register(Role)
admin.site.register(Appointment)
admin.site.register(Visit)
admin.site.register(Analysis)
admin.site.register(Report)
admin.site.register(Clinic)
