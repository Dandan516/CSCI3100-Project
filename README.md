# Web Application Backend Development Documentation
This repository contains documentation and code for the backend server of the application

## Folders 
### Folder: Project
The folder **Project** contains all folders and files used for the backend including webapp and planner

### Folder: webapp
The folder **webapp** is created by the command:
```
django-admin startproject webapp
```

### Folder: planner
The folder **planner** is created by this command:
```
python3 manage.py startapp planner
```
The planner folder should be served as the backend server of the application

## Django Web Framework Preview
Most of the information is based on the video in this [CS50 Web programming](https://www.youtube.com/watch?v=w8q0C-C1js4&list=PLhQjrBD2T380xvFSUmToMMzERZ3qB5Ueu&index=5) video

### Files: views.py
This file define the views present to the user
functions are defined in the files to determine what content will be display to user

Examples:
```
def index(request):
    return render(request, "html file", {some information provide to the template})
```

### urls.py
This file contains URL configuration for webapp project
The _urlpatterns_ list routes URLs to views

Examples:
```
\# webapp.urls.py
from django.contrib import admin
from django.urls import path , include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('planner', include("planner.urls"))
]
```






