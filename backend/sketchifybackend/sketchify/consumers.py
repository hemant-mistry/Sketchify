from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
import threading
import time

class RoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = self.room_name

        # Adding client to the group based on the room_name provided
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        print("Received message:", text_data)
        data = json.loads(text_data)
        
        message = data.get("message")
        user = data.get("user")

        if user == "Client":
            response_message = "Hello, client"
            self.send(text_data=json.dumps({"message": response_message}))
            # Start the timer
            threading.Thread(target=self.start_timer).start()

    def send(self, text_data=None, bytes_data=None, close=False):
        if text_data is not None:
            super().send(text_data=text_data)
        if bytes_data is not None:
            super().send(bytes_data=bytes_data)
        if close:
            self.close()

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({"message": message}))

    def start_timer(self):
        for i in range(10, 0, -1):
            time.sleep(1)
            # Broadcast the timer countdown to all clients in the room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'timer_message',
                    'message': f'Timer: {i} seconds left'
                }
            )
        # Send final message when timer ends
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'timer_message',
                'message': 'Timer ended'
            }
        )

    def timer_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({"message": message}))
