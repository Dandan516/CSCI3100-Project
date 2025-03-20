from rest_framework.routers import DefaultRouter
from users.urls import users_router
from django.urls import path, include

router = DefaultRouter()

# words
router.registry.extend(users_router.registry)

# 定義主要的 API URL 路徑
urlpatterns = [
    path('', include(router.urls)),
]