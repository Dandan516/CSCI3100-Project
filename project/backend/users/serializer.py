from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
User = get_user_model()

# Convert JSON object from Web Request to Python data type or vice versa
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password')
        # Do not show password in request
        extra_kwargs = {'password': {'write_only':True}}
                        
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
    