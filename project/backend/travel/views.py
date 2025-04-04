from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Travel, Itinerary
from .serializer import TravelSerializer, ItinerarySerializer
from .filters import ItineraryFilter


class TravelViewSet(viewsets.ModelViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny]

    # only show travels owned by current user
    def get_queryset(self):
        '''
        travel_title = self.kwargs.get('travel_title')
        if travel_title:
            return self.queryset.filter(user=self.request.user,title=travel_title)
        '''
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Auto-set user on creation


class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ItineraryFilter
    
    def get_queryset(self):
        # Handle both ID and title-based filtering
        travel_title = self.kwargs.get('travel_title')
        travel_id = self.kwargs.get('travel_id')
        
        if travel_title:
            travel = get_object_or_404(
                Travel, 
                title__iexact=travel_title, 
                user=self.request.user
            )
            return travel.itineraries.all()
        
        return self.queryset.none()


    def perform_create(self, serializer):
        travel_title = self.kwargs.get('travel_title')
        
        if travel_title:
            travel = get_object_or_404(
                Travel,
                title__iexact=travel_title,
                user=self.request.user
            )
        else:
            raise serializer.ValidationError("Travel reference required")
        
        serializer.save(travel=travel)
    
