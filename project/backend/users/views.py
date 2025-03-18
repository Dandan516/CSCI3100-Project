from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def index(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("users:login"))
    return render(request, "users/index.html")

def login_user(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("users:index"))
        else: 
            return render(request, "users/login.html", {
                "message": "Incorrect username or password"
            })
    return render(request, "users/login.html", {
        "message":"please login"
    })

def logout_user(request):
    logout(request)
    return render(request, "users/login.html", {
        "message": "Logged out"
    })