from rest_framework import serializers
from django.contrib.auth.models import User
from .models import User, Role, Country, City
from .serializers import RoleSerializer
from rest_framework import serializers
from .serializers import CountrySerializer

class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id','Email', 'Password', 'Full_name', 'clinic',
           'city', 'role',
      ]
#تجعل كلمة المرور تظهر فقط عند الإدخال (وليس عند الاسترجاع عبر الـ API)، لحماية الخصوصية.
        extra_kwargs = {
            'Password': {'write_only': True}
        }


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'Name']


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'Name']


class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)  #لعرض تفاصيل البلد المرتبطة بدلا من المعرف

    class Meta:
        model = City
        fields = ['id', 'Name', 'country']