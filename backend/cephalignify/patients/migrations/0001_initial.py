# Generated by Django 5.1.3 on 2025-04-28 20:57

import django.core.validators
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
                ('Gender', models.CharField(choices=[('M', 'ذكر'), ('F', 'أنثى')], max_length=5)),
                ('Birthdate', models.DateField()),
                ('Phone_number', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None)),
                ('Email', models.EmailField(blank=True, max_length=254, null=True, validators=[django.core.validators.EmailValidator()])),
                ('Address', models.CharField(blank=True, max_length=40, null=True)),
                ('clinic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='clinics.clinic')),
            ],
        ),
    ]
