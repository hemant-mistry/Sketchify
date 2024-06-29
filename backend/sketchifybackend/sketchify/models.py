import uuid
from django.db import models

class CanvasImage(models.Model):
    room_id = models.CharField(max_length=100)
    image_data = models.TextField()  # Storing base64 image data
    user_id = models.CharField(max_length=255, default='')
    # Add other fields as needed

    def __str__(self):
        return f"Canvas Image for Room ID: {self.room_id}"


class RoomInformation(models.Model):
    record_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin_name = models.CharField(max_length=255)
    room_code = models.CharField(max_length=255)
    user_id = models.CharField(max_length=255, default='')
    players = models.IntegerField()


class ActivePlayers(models.Model):
    record_id = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
    room_code = models.CharField(max_length=255)
    user_id = models.CharField(max_length=255)
    user_name = models.CharField(max_length=255, default="")
