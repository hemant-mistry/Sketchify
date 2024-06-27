# serializers.py
from rest_framework import serializers
from .models import CanvasImage

class CanvasImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanvasImage
        fields = ['room_id', 'image_data']  # Add more fields as needed
