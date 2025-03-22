from rest_framework.routers import DefaultRouter
from users.urls import users_router
from django.urls import path, include

router = DefaultRouter()

# users
router.registry.extend(users_router.registry)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('knox.urls')),
]