from rest_framework import serializers
from .models import Travel, Itinerary

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['id', 'date', 'start_time', 'end_time', 'activity', 'location', 'notes',  'tag']


    '''
    def create(self, validated_data):
        # Auto-assign the travel ID (e.g., from URL kwargs or request context)
        travel_id = self.context.get('travel_id')  # Pass this from the view
        validated_data['travel_id'] = travel_id
        return Itinerary.objects.create(**validated_data)
    '''
    
        
class TravelSerializer(serializers.ModelSerializer):
    itineraries = ItinerarySerializer(many=True, read_only=True)  # Nested serializer
    
    class Meta:
        model = Travel
        fields = ['id', 'title', 'start_date', 'end_date', 'description', 'itineraries']