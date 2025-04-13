from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BudgetViewSet


budget_router = DefaultRouter()
budget_router.register(r'budget', BudgetViewSet, basename="budget" )  # Register the budget app with the router