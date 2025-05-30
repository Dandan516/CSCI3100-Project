# Generated by Django 5.1.7 on 2025-05-11 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0003_alter_expense_categories_alter_income_categories'),
    ]

    operations = [
        migrations.RenameField(
            model_name='expense',
            old_name='categories',
            new_name='category',
        ),
        migrations.RemoveField(
            model_name='income',
            name='categories',
        ),
        migrations.AddField(
            model_name='income',
            name='category',
            field=models.CharField(blank=True, choices=[('no-category', 'No Category'), ('salary', 'Salary'), ('investment', 'Investment'), ('gift', 'Gift'), ('other', 'Other'), ('business', 'Business'), ('rental-income', 'Rental Income'), ('interest-income', 'Interest Income'), ('dividends', 'Dividends')], default=None, max_length=20, null=True),
        ),
    ]
