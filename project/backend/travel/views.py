from django.shortcuts import render, get_object_or_404
from django.db import models

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import Travel, Itinerary
from .serializer import TravelSerializer, ItinerarySerializer
from .filters import ItineraryFilter

from users.models import CustomUser


class TravelViewSet(viewsets.ModelViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny]

    # only show travels owned by current user
    def get_queryset(self):
        return Travel.objects.filter(
            models.Q(user=self.request.user) |
            models.Q(collaborators=self.request.user)
        ).distinct()
    

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Auto-set user on creation

    @action(detail=True, methods=['post'])
    def invite_collaborator(self, request, pk=None):
        travel = self.get_object()
        email = request.data.get('email')  # Now expecting { "email": "user@example.com" }

        if not email:
            return Response({"error": "email is required"}, status=400)

        try:
            # Find user by email
            collaborator = CustomUser.objects.get(email=email)
            
            # Check if already a collaborator
            if travel.collaborators.filter(id=collaborator.id).exists():
                return Response({"error": "User is already a collaborator"}, status=400)
                
            travel.collaborators.add(collaborator)
            return Response({
                "status": "Invitation sent",
                "user": {
                    "id": collaborator.id,
                    "email": collaborator.email,
                    "username": collaborator.username
                }
            })
        except CustomUser.DoesNotExist:
            # User doesn't exist - you could create an invitation system here
            return Response({"error": "User with this email not found"}, status=404)


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
    
