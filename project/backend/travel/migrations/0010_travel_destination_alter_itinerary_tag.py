# Generated by Django 5.1.7 on 2025-04-19 16:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0009_rename_activity_itinerary_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='travel',
            name='destination',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='itinerary',
            name='tag',
            field=models.CharField(blank=True, choices=[('no-tag', 'No Tag'), ('visit', 'Visit'), ('transit', 'Transit'), ('sightseeing', 'Sightseeing'), ('food', 'Food'), ('accommodation', 'Accommodation'), ('activity', 'Activity'), ('shopping', 'Shopping'), ('leisure', 'Leisure'), ('other', 'Other')], default=None, max_length=20, null=True),
        ),
    ]
