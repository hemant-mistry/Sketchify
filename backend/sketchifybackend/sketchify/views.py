from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
import redis
import json
import uuid
import secrets
import asyncio
from asgiref.sync import async_to_sync

# Initialize redis cache
redis_instance = redis.StrictRedis(
	host='sketchify.redis.cache.windows.net',
	port=6380,
	db=0,
	password='',
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

	parser_classes = [JSONParser]

	async def insert_room_data(self,room_id,entry_code, user_name,players):
		# Simulate async DB insertion, replace with actual async DB code
		await asyncio.sleep(1)  # Simulate IO delay
		print(f"Room data inserted into DB: {room_id}, {entry_code}, {user_name}, {players}")
		

	def store_room_data_in_redis(self,room_key,entry_code,user_name,players, user_id):

		#Initializing the hashset
		redis_instance.hmset(entry_code,{
			"room_key":room_key,
			"users":user_id,
			"user_names":user_name,
			"current_players":1,
			"max_players":players
		})
		
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

			# Print the room name and user name in the terminal
			print(f"Room Name: {players}, User Name: {user_name}")

			
			#Generate unique room ID and entry code
			room_id = str(uuid.uuid4())
			entry_code = secrets.token_hex(4)
			user_id = self.generate_user_id()
			room_key = room_id

			self.store_room_data_in_redis(room_key,entry_code,user_name,players,user_id)

			self.print_room_details(room_id, entry_code, user_name, players,user_id)

			# Use sync_to_async to await the async function in the synchronous post method 
			asyncio.run(self.insert_room_data(room_id, entry_code, user_name, players))


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
	parser_classes = [JSONParser]

	def generate_user_id(self):
		return str(uuid.uuid4())

	def post(self, request, *args, **kwargs):
		try:
			room_code = request.data.get('room_code')
			user_name = request.data.get('user_name')

			if not room_code or not user_name:
				return Response({"error": "room_code and user_name are required."}, status=status.HTTP_400_BAD_REQUEST)
			
			# Print the room name and user name in the terminal
			print(f"Room code: {room_code}, User Name: {user_name}")

			#Generate unique user id for the joining user
			user_id = self.generate_user_id()

			room_data = redis_instance.hgetall(room_code)
			if not room_data:
				return Response({"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

			#Decode room data from bytes to string
			decoded_room_data = {key.decode('utf-8'):value.decode('utf-8') for key,value in room_data.items()}

			#update current players count
			current_players = int(decoded_room_data.get('current_players',0))+1
			redis_instance.hset(room_code, "current_players", current_players)
			
			#Append new user ID and user name to existing lists
			redis_instance.hset(room_code,"users",f"{decoded_room_data['users']},{user_id}")
			redis_instance.hset(room_code,"user_names", f"{decoded_room_data['user_names']},{user_name}")
			fresh_room_data = redis_instance.hgetall(room_code)
			fresh_decoded_room_data = {key.decode('utf-8'):value.decode('utf-8') for key,value in fresh_room_data.items()}

			# Respond with the received data
			response = {
                "room_code": room_code,
                "user_name": user_name,
                "room_data": fresh_decoded_room_data,
				"user_id":user_id
            }

			return Response(response, status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)