from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Travel, Itinerary
from .serializer import TravelSerializer, ItinerarySerializer


class TravelViewSet(viewsets.ModelViewSet):
    queryset = Travel.objects.all()
    serializer_class = TravelSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny]

    '''
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
    '''
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Auto-set user on creation
    '''
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)  # Only show user's trips

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Auto-set user on creation
    '''

class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny]

    '''
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def get_queryset(self):
        # Only show itineraries for trips owned by the user
        return self.queryset.filter(travel__user=self.request.user)
    '''
    def get_serializer_context(self):
        # Pass the travel_id from URL kwargs to the serializer
        context = super().get_serializer_context()
        context['travel_id'] = self.kwargs.get('travel_id')
        return context
    
    def perform_create(self, serializer):
        travel_id = self.kwargs.get('travel_id')
        if travel_id:
            serializer.save(travel_id=travel_id)
        else:
            serializer.save()

