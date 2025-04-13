from django.db import models

# Create your models here.
class Budget(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name="budgets")
    name = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)


class Expense(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="expenses") # related_name need to be same as serializer fields
    date = models.DateField(null=True) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    CAT = (
        ('food', 'Food'),
        ('transport', 'Transport'),
        ('accommodation', 'Accommodation'),
        ('entertainment', 'Entertainment'),
        ('shopping', 'Shopping'),
        ('other', 'Other'),
    )

    categories = models.CharField(max_length=20, choices=CAT , blank=True, null=True, default=None)

class Income(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="incomes")
    date = models.DateField(null=True) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    CAT = (
        ('salary', 'Salary'),
        ('investment', 'Investment'),
        ('gift', 'Gift'),
        ('other', 'Other'),
        ('business', 'Business'),
        ('rental_income', 'Rental Income'),
        ('interest_income', 'Interest Income'),
        ('dividends', 'Dividends'),
    )

    categories = models.CharField(max_length=20, choices=CAT , blank=True, null=True, default=None)