# urls.py
from django.urls import include, path
from rest_framework import routers
from .views import RedisTestView,CreateRoom,JoinRoom

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('redis-test/', RedisTestView.as_view(), name='redis-test'),
    path('create-room/', CreateRoom.as_view(), name='create-room'),
    path('join-room/', JoinRoom.as_view(), name='join-room')
]
