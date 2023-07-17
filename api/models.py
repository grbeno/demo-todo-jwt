from django.db import models
from django.contrib.auth import get_user_model


class Todo(models.Model):
    
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    
    title = models.CharField(max_length=200)
    body = models.TextField()

    def __str__(self):
        return self.title
