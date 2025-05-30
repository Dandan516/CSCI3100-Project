from django.db import models

# Create your models here.
class Budget(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name="budgets")
    title = models.CharField(max_length=100,blank=True)
    date = models.DateField(auto_now=True)

    def __str__(self):
        return self.title


class Expense(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="expenses") # related_name need to be same as serializer fields
    date = models.DateField(null=True) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    CAT1 = (
        ('no-category', 'No Category'),
        ('food', 'Food'),
        ('transport', 'Transport'),
        ('accommodation', 'Accommodation'),
        ('entertainment', 'Entertainment'),
        ('shopping', 'Shopping'),
        ('other', 'Other'),
    )

    category = models.CharField(max_length=20, choices=CAT1 , blank=True, null=True, default='no-category')

    def __str__(self):
        return self.description

class Income(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="incomes")
    date = models.DateField(null=True) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    CAT2 = (
        ('no-category', 'No Category'),
        ('salary', 'Salary'),
        ('investment', 'Investment'),
        ('gift', 'Gift'),
        ('other', 'Other'),
        ('business', 'Business'),
        ('rental-income', 'Rental Income'),
        ('interest-income', 'Interest Income'),
        ('dividends', 'Dividends'),
    )

    category = models.CharField(max_length=20, choices=CAT2 , blank=True, null=True, default=None)

    def __str__(self):
        return self.description