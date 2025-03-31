from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

users_router = DefaultRouter()
users_router.register(r'signup', RegisterViewset, basename='register')
users_router.register(r'login', LoginViewset, basename='login')
users_router.register(r'userinfo', UserInfoViewSet, basename='info')