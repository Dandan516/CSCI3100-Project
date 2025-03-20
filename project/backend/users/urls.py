from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewset

users_router = DefaultRouter()
users_router.register(r'users', RegisterViewset)
