from rest_framework.routers import DefaultRouter
from users.urls import users_router
from travel.urls import travel_router, itinerary_router
from django.urls import path, include

router = DefaultRouter()

# users
router.registry.extend(users_router.registry)

# travel
router.registry.extend(travel_router.registry)
router.registry.extend(itinerary_router.registry)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('knox.urls')),
    path('travel/', include(travel_router.urls)),
    path('travels/<int:travel_id>/', include(itinerary_router.urls)),
]