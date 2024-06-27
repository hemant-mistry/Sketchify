# urls.py
from django.urls import include, path
from rest_framework import routers
from .views import RedisTestView,CreateRoom,JoinRoom,DisplayAvailableRoom,SaveCanvasImage

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('redis-test/', RedisTestView.as_view(), name='redis-test'),
    path('create-room/', CreateRoom.as_view(), name='create-room'),
    path('join-room/', JoinRoom.as_view(), name='join-room'),
    path('display-rooms/', DisplayAvailableRoom.as_view(), name='display_rooms'),
    path('save_canvas_image/', SaveCanvasImage.as_view(), name='save_canvas_image'),
]
