from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.core.files.base import ContentFile
from .models import UploadedImage
class RoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = self.room_name

        #Adding client to the group based on the room_name provided
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            #Create a new unique channel for each client
            self.channel_name 
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def send(self, text_data):
        print("Send the message", text_data)


    def receive(self, text_data, bytes_data):
        print("Received message:", text_data)

        #Received data is expected to be binary
        if isinstance(bytes_data, bytes):
            async_to_sync(self.save_image)(bytes_data)
        
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type':'chat_message',
                    'message':bytes_data
                }
            )


    def chat_message(self,event):
        message = event['message']
        self.send(text_data=message)

    def save_image(self, image_data):
        image = UploadedImage()
        image.file.save('uploaded_image.jpg', ContentFile(image_data))
        image.room_name = self.room_name
        image.save()