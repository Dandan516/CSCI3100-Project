from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TravelViewSet, ItineraryViewSet

travel_router = DefaultRouter()
travel_router.register(r'travel/(?P<travel_title>[-\w]+)/itineraries', ItineraryViewSet, basename='travel-itineraries')
travel_router.register(r'travel', TravelViewSet, basename='travel')




