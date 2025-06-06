from rest_framework.routers import DefaultRouter
from users.urls import users_router
from travel.urls import travel_router
from budget.urls import budget_router
from django.urls import path, include

router = DefaultRouter()

# users
router.registry.extend(users_router.registry)

# travel
router.registry.extend(travel_router.registry)

# budget
router.registry.extend(budget_router.registry)

# router.registry.extend(itinerary_router.registry)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('knox.urls')),
    path('password_reset/', include('django_rest_passwordreset.urls' , namespace='password_reset')),
]