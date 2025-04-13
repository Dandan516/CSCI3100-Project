from django.shortcuts import render, get_object_or_404
from django.db import models

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import Budget, Expense, Income
from .serializer import BudgetSerializer, ExpenseSerializer, IncomeSerializer
# from .filters import 

from users.models import CustomUser

# Create your views here.
class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    # only show budgets owned by current user
    def get_queryset(self):
        return Budget.objects.filter(
            models.Q(user=self.request.user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    # only show expenses owned by current user
    def get_queryset(self):
        return Expense.objects.filter(
            models.Q(budget__user=self.request.user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [permissions.IsAuthenticated]

    # only show incomes owned by current user
    def get_queryset(self):
        return Income.objects.filter(
            models.Q(budget__user=self.request.user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)