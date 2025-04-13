from rest_framework import serializers
from .models import Budget, Expense, Income
from users.models import CustomUser

class UserUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username']
        read_only_fields = ['username']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'budget', 'date', 'amount', 'description', 'categories']

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'budget', 'date', 'amount', 'description', 'categories']

class BudgetSerializer(serializers.ModelSerializer):
    user = UserUsernameSerializer(read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    incomes = IncomeSerializer(many=True, read_only=True)

    class Meta:
        model = Budget
        fields = ['id', 'user', 'date', 'name', 'expenses', 'incomes']
        read_only_fields = ['user']  # Make user read-only to prevent direct assignment