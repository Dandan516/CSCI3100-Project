import django_filters
from .models import Itinerary

class ItineraryFilter(django_filters.FilterSet):
    date = django_filters.DateFilter(field_name='date')
    date_gte = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_lte = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    start_time_gte = django_filters.TimeFilter(field_name='start_time', lookup_expr='gte')
    end_time_lte = django_filters.TimeFilter(field_name='end_time', lookup_expr='lte')
    
    class Meta:
        model = Itinerary
        fields = ['tag', 'location']