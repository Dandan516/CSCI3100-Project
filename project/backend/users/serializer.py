from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from django.utils import timezone
User = get_user_model()

# Convert JSON object from Web Request to Python data type or vice versa
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password')
        # Do not show password in request
        extra_kwargs = {'password': {'write_only':True}}

    # Invoked when serializer.save() is call in views.py            
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    # Do not present password
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret


class UserInfoSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    last_login = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = User
        fields = ('id', 'email', 'date_joined', 'last_login','first_name','last_name','username', 'birthday')
        read_only_fields = ('email' , 'date_joined', 'last_login')

    def get_date_joined(self, obj):
        local_time = timezone.localtime(obj.date_joined)  # Convert to local timezone
        return local_time.strftime("%Y-%m-%d %H:%M:%S")
    
    def get_last_login(self, obj):
        local_time = timezone.localtime(obj.date_joined)  # Convert to local timezone
        return local_time.strftime("%Y-%m-%d %H:%M:%S")
    
    def get_birthday(self, obj):
        local_time = timezone.localtime(obj.date_joined)  # Convert to local timezone
        return local_time.strftime("%Y-%m-%d %H:%M:%S")
    
    def update(self, instance, validated_data):
        # Ensure read-only fields are not updated even if sent in request
        for field in self.Meta.read_only_fields:
            validated_data.pop(field, None)  # Remove from update data
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret
