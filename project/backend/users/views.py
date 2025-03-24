from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .serializer import *
from .models import *
from knox.models import AuthToken
# from django.contrib.auth.models import User (for default user)
from django.contrib.auth import get_user_model, authenticate
User = get_user_model()


# Create your views here.
class RegisterViewset(viewsets.ViewSet):
    # Allow anyone to register an account
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    # Everytime POST request occurs, do the function below
    def create(self, request):
        serializer = self.serializer_class( data=request.data )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
        
class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(self,email=email,password=password)

            if user:
                # create tuple
                _, token = AuthToken.objects.create(user)
                return Response(
                    {
                        "user" : self.serializer_class(user).data,
                        "token" : token
                    }
                )
            else:
                return Response({"error":"Invalid credentials"}, status=401)

        else:
            return Response(serializer.errors, status=400)
