from django.db import models

class Travel(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name="travels")
    title = models.CharField(max_length=100) 
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    description = models.TextField(blank=True)
    destination = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    collaborators = models.ManyToManyField('users.CustomUser', blank=True, related_name="collaborated_travels")

    def __str__(self):
        return self.title
    
class Itinerary(models.Model):

    travel = models.ForeignKey(Travel, on_delete=models.CASCADE, related_name="itineraries")
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    title = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    location_lat = models.CharField(max_length=20, blank=True, null=True)
    location_lon = models.CharField(max_length=20, blank=True, null=True)
    location_url = models.URLField(max_length=500, blank=True, null=True)

    TAGS = (
        ('no-tag', 'No Tag'),
        ('visit', 'Visit'),
        ('transit', 'Transit'),
        ('sightseeing', 'Sightseeing'),
        ('food', 'Food'),
        ('accommodation', 'Accommodation'),
        ('activity', 'Activity'),
        ('shopping', 'Shopping'),
        ('leisure', 'Leisure'),
        ('other', 'Other'),
    )
    tag = models.CharField(max_length=20, choices=TAGS, blank=True, null=True, default=None)
    
    def __str__(self):
        return f"{self.date} - {self.activity}"