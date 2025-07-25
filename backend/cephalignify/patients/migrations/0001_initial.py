# Generated by Django 5.1.3 on 2025-06-23 20:38

import django.db.models.deletion
import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clinics', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Full_name', models.CharField(max_length=30)),
                ('Gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=1)),
                ('Birthdate', models.DateField()),
                ('Phone_number', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None, unique=True)),
                ('Email', models.EmailField(blank=True, max_length=254)),
                ('Address', models.CharField(blank=True, max_length=40, null=True)),
                ('clinic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='clinics.clinic')),
            ],
        ),
    ]
