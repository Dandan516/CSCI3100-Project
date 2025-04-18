from rest_framework import serializers
from .models import Travel, Itinerary
from users.models import CustomUser

class UserUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username']
        read_only_fields = ['username']


class ItinerarySerializer(serializers.ModelSerializer):

    class Meta:
        model = Itinerary
        fields = ['id', 'date', 'start_time', 'end_time', 'activity', 'location', 'notes',  'tag']

    
        
class TravelSerializer(serializers.ModelSerializer):
    itineraries = ItinerarySerializer(many=True, read_only=True)  # Nested serializer
    user = UserUsernameSerializer(read_only=True)
    collaborators = UserUsernameSerializer(
        many=True,
        required=False
    )
    class Meta:
        model = Travel
        fields = ['id', 'title', 'start_date', 'end_date', 'description', 'itineraries', 'user', 'collaborators']
        read_only_fields = ['user']