from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
import redis
import json
import uuid
import secrets
import asyncio
from asgiref.sync import async_to_sync, sync_to_async

from .serializers import CanvasImageSerializer
from .models import RoomInformation, CanvasImage, ActivePlayers
import os
from dotenv import load_dotenv
from rest_framework.permissions import AllowAny
load_dotenv()

# Initialize redis cache
redis_instance = redis.StrictRedis(
	host='sketchify.redis.cache.windows.net',
	port=6380,
	db=0,
	password="",
	ssl=True
)

class RedisTestView(APIView):
	"""
	A simple APIView for testing Redis cache setup.
	"""

	def get(self, request, *args, **kwargs):
		try:
			# Ping Redis
			result = redis_instance.ping()
			ping_response = f"Ping returned: {str(result)}"

			# Set a value in Redis
			set_result = redis_instance.set("Message", "Hello!, The cache is working with Python!")
			set_response = f"SET Message returned: {str(set_result)}"

			# Get the value from Redis
			get_result = redis_instance.get("Message")
			get_response = f"GET Message returned: {get_result.decode('utf-8')}"
		   
			
			# Get client list
			client_list_result = redis_instance.client_list()
			clients = [{"id": c['id'], "addr": c['addr']} for c in client_list_result]
			client_list_response = f"CLIENT LIST returned: {json.dumps(clients)}"
			
			# Construct response
			response = {
				"ping": ping_response,
				"set": set_response,
				"get": get_response,
				"client_list": client_list_response,
			}

			return Response(response, status=status.HTTP_200_OK)

		except Exception as e:
			return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateRoom(APIView):
	"""
	An APIView for creating new rooms
	"""
	permission_classes = [AllowAny]

	parser_classes = [JSONParser]

	def insert_room_data(self, room_id, entry_code, user_name, players, user_id):
		RoomInformation.objects.create(
            record_id=room_id,
            admin_name=user_name,
            room_code=entry_code,
            user_id=user_id,
            players=players
        )
		
		print(f"Room data inserted into DB: RoomInformation: {room_id}, {entry_code}, {user_name}, {players}")
		
	def print_room_details(self, room_id, entry_code, user_name, players, user_id):
		print(f"Room ID: {room_id}, Entry Code: {entry_code}, User Name: {user_name}, User ID: {user_id}, Players: {players}")

	def generate_user_id(self):
		return str(uuid.uuid4())
	
	def post(self, request, *args, **kwargs):
		try:
			# Get the room name and user name from the request data
			user_name = request.data.get('user_name')
			players = request.data.get('players')

			if not players or not user_name:
				return Response({"error": "players and user_name are required."}, status=status.HTTP_400_BAD_REQUEST)

			#Generate unique room ID and entry code
			room_id = str(uuid.uuid4())
			entry_code = secrets.token_hex(4)
			user_id = self.generate_user_id()

			self.print_room_details(room_id, entry_code, user_name, players,user_id)

			# Use sync_to_async to await the async function in the synchronous post method 
			self.insert_room_data(room_id, entry_code, user_name, players, user_id)



			# Respond with the received data
			response = {
				"room_id": room_id,
				"entry_code": entry_code,
				"user_id":user_id,
				"user_name": user_name,
				"players":players
			}

			return Response(response, status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	

class JoinRoom(APIView):
	"""
	An APIView to Join a room
	"""
	permission_classes = [AllowAny]
	parser_classes = [JSONParser]

	def generate_user_id(self):
		return str(uuid.uuid4())

	def insert_to_active_users_table(self, user_name, user_id, room_code):
		ActivePlayers.objects.create(
			record_id = str(uuid.uuid4()),
			user_name = user_name,
			user_id = user_id,
			room_code = room_code
		)
		print(f"Room data inserted into DB: ActivePlayers: {user_name}, {user_id}, {room_code}")

	def post(self, request, *args, **kwargs):
		try:
			room_code = request.data.get('room_code')
			user_name = request.data.get('user_name')

			if not room_code or not user_name:
				return Response({"error": "room_code and user_name are required."}, status=status.HTTP_400_BAD_REQUEST)
			
			

			#Generate unique user id for the joining user
			user_id = self.generate_user_id()
			self.insert_to_active_users_table(user_id=user_id, user_name=user_name, room_code=room_code)
			

			# Respond with the received data
			response = {
                "room_code": room_code,
                "user_name": user_name,
				"user_id":user_id
            }

			return Response(response, status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		
class DisplayAvailableRoom(APIView):
    """
    An APIView to display available rooms.
    """

    def get(self, request, *args, **kwargs):
        try:
            # Query available rooms from the database
            available_rooms = RoomInformation.objects.all()

            # Serialize the queryset into JSON
            room_list = []
            for room in available_rooms:
                room_data = {
                    'room_id': room.record_id,
                    'admin_name': room.admin_name,
                    'room_code': room.room_code,
                    'players': room.players,
                    'user_id': room.user_id,
                    # Add more fields as needed
                }
                room_list.append(room_data)

            # Construct response
            response = {
                'count': len(room_list),
                'rooms': room_list,
            }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		

class SaveCanvasImage(APIView):
    """
    API endpoint to save canvas image uploads.
    """
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        try:
            room_id = request.data.get('room_id')
            image_data = request.data.get('image_data')
            user_id = request.data.get('user_id')
			
            if not room_id or not image_data:
              return Response({"error": "room_id, image_data and user_id are required."}, status=status.HTTP_400_BAD_REQUEST)

            # Save image data to the database
            canvas_image = CanvasImage(user_id= user_id, room_id=room_id, image_data=image_data)
            canvas_image.save()

            # Serialize the response data
            serializer = CanvasImageSerializer(canvas_image)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    