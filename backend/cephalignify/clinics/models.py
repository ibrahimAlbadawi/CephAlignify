from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class Clinic(models.Model): ##التعديل على وقت العمل
    Name = models.CharField(max_length=254)
    Work_start_time = models.TimeField()
    Work_end_time = models.TimeField() 

    def clean(self):
        if self.Work_start_time >= self.Work_end_time:
            raise ValidationError('وقت بدء العمل يجب أن يكون قبل وقت الانتهاء.')

    def __str__(self):
        return f"{self.Name} - ساعات العمل: {self.Work_start_time.strftime('%H:%M')} إلى {self.Work_end_time.strftime('%H:%M')}"
        