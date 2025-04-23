from rest_framework import serializers
from .models import Budget, Expense, Income
from users.models import CustomUser
from django.db.models import Sum

# Username
class UserUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username']
        read_only_fields = ['username']

# Expense Serializer
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'budget', 'date', 'amount', 'description', 'categories']

# Income Serializer
class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'budget', 'date', 'amount', 'description', 'categories']

# Budget Serializer
class BudgetSerializer(serializers.ModelSerializer):
    user = UserUsernameSerializer(read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    incomes = IncomeSerializer(many=True, read_only=True)

    total_balance = serializers.SerializerMethodField()
    total_income = serializers.SerializerMethodField()
    total_expense = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = ['id', 'user', 'date', 'title', 'expenses', 'incomes', 'total_balance', 'total_income', 'total_expense']
        read_only_fields = ['user']  # Make user read-only to prevent direct assignment
    
    def get_total_balance(self, obj):
        total_income = obj.incomes.aggregate(total=Sum('amount'))['total'] or 0
        total_expense = obj.expenses.aggregate(total=Sum('amount'))['total'] or 0
        return total_income - total_expense

    def get_total_income(self, obj):
        return obj.incomes.aggregate(total=Sum('amount'))['total'] or 0

    def get_total_expense(self, obj):
        return obj.expenses.aggregate(total=Sum('amount'))['total'] or 0