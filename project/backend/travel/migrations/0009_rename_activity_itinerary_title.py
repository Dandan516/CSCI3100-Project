# Generated by Django 5.1.7 on 2025-04-19 15:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0008_rename_latitude_itinerary_location_lat_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='itinerary',
            old_name='activity',
            new_name='title',
        ),
    ]
