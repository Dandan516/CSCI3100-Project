import django_filters
from .models import Budget

class BudgetFilter(django_filters.FilterSet):

    date = django_filters.DateFilter(field_name='date')
    date_gte = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_lte = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    amount_gte = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    amount_lte = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    exp_category = django_filters.CharFilter(field_name='expenses__categories', lookup_expr='icontains')
    inc_category = django_filters.CharFilter(field_name='incomes__categories', lookup_expr='icontains')
    
    class Meta:
        model = Budget
        fields = ['category', 'date', 'amount']