# Generated by Django 5.1.7 on 2025-04-19 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0004_alter_itinerary_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itinerary',
            name='tag',
            field=models.CharField(blank=True, choices=[('no-tag', 'No Tag'), ('transit', 'Transit'), ('sightseeing', 'Sightseeing'), ('food', 'Food'), ('accommodation', 'Accommodation'), ('activity', 'Activity'), ('shopping', 'Shopping'), ('leisure', 'Leisure'), ('other', 'Other')], default=None, max_length=20, null=True),
        ),
    ]
