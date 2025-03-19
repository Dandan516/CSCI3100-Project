# Running and Testing Server

## To run React server:  
```
cd frontend  
npm install  
npm run dev  
```

# Backend TO-DO

### 1. User Account Creation
### 2. User Login/Logout

## User Management

# Web Application Backend Development Documentation

## Django , Django REST framework
```
pip install django djangorestframework django-cors-headers
```

# Web Application Backend Development Documentation

This repository contains documentation and code for the backend server of the application


## Folders 
### Folder: project
The folder **project** contains all folders and files used for the backend including webapp and planner

### Folder: project/webapp
The folder **webapp** is created by the command:
```
django-admin startproject webapp
```


### Folder: project/webapp/planner
The folder **planner** is created by this command:
```
python3 manage.py startapp planner
```
The planner folder served as the backend server of the application



## Django Web Framework Preview
Most of the information is based on the video in this [CS50 Web programming](https://www.youtube.com/watch?v=w8q0C-C1js4&list=PLhQjrBD2T380xvFSUmToMMzERZ3qB5Ueu&index=5) video\

More details can refer to [Django Tutorial](https://www.w3schools.com/django/index.php) provided by W3School

### File : views.py
This file define the views present to the user

functions are defined in this file to determine what kind of content will be display to user

The function may use `render()` to render templates (similar to HTML files)

Examples:
```
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello World")
```
or
```
from django.shortcuts import render

def index(request):
    return render(request, "templates", {some information provide to the template} )
```

### File : webapp/urls.py
This file contains URL configuration for webapp project

The _urlpatterns_ list routes URLs to views

Examples:
```
# webapp.urls.py
from django.contrib import admin
from django.urls import path , include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('planner/', include("planner.urls"))
]
```

### File : planner/urls.py
This file contains URL configuration for planner app

The _urlpatterns_ list routes URLs to views

Examples:
```
from django.urls import path
from . import views

urlpatterns = [
    path( "" , views.index, name="index" )
]
```

### Folder : templates
This is the default folder for Django to store templates language (similar to markup language)

A file called "templates" is needed to create under the app folder e.g. planner such that Django is able to find the templates used for rendering
```
# settings.py

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```





