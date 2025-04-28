from django.db import models

# Create your models here.

class Analysis(models.Model):
    ANALYSIS_CHOICES = [
        ('01', 'Steiner'),
    ]
    Image_path = models.CharField(max_length=100)
    Analysis_type = models.CharField(max_length=7,
                 choices=ANALYSIS_CHOICES) #اضافة قائمة بأسماء العلماء
    Result = models.JSONField()
    visit = models.ForeignKey('visits.Visit', on_delete=models.CASCADE, related_name='analyses') 

    def __str__(self):
        return (
            f"Analysis:\n"
            f"- Type: {self.Analysis_type}\n"
            f"- Image Path: {self.Image_path}\n"
            f"- Result: {self.Result}"
        )


class Report(models.Model):
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE)    
    visit = models.ForeignKey('visits.Visit', on_delete=models.CASCADE,
                               related_name='reports') 
    # User foreignKey (Role: Doctor)

    def __str__(self):
        return f"Report for {self.analysis}"


