# Generated by Django 5.1.7 on 2025-04-18 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0003_travel_collaborators_alter_itinerary_tag'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itinerary',
            name='location',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
