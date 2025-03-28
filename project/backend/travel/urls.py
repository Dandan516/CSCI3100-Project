from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TravelViewSet, ItineraryViewSet

travel_router = DefaultRouter()
travel_router.register(r'travels', TravelViewSet)
# travel_router.register(r'itineraries', ItineraryViewSet)

# Nested itineraries (simpler, no extra features)
itinerary_router = DefaultRouter()
itinerary_router.register(r'itineraries', ItineraryViewSet)

