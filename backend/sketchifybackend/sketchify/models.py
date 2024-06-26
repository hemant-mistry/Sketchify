from django.db import models

class UploadedImage(models.Model):
    file = models.ImageField(upload_to='uploaded_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    room_name = models.CharField(max_length=255)
