from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BudgetViewSet, ExpenseViewSet, IncomeViewSet


budget_router = DefaultRouter()
budget_router.register(r'budget/(?P<budget_id>[\d]+)/expenses', ExpenseViewSet, basename='Expenses')
budget_router.register(r'budget/(?P<budget_id>[\d]+)/incomes', IncomeViewSet, basename='Incomes')
budget_router.register(r'budget', BudgetViewSet, basename="budget" )  # Register the budget app with the router