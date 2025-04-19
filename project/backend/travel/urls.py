from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TravelViewSet, ItineraryViewSet

travel_router = DefaultRouter()
travel_router.register(r'travel/(?P<travel_id>\d+)/itineraries', ItineraryViewSet, basename='travel-itineraries')  # Use travel_id instead of travel_title
travel_router.register(r'travel', TravelViewSet)




