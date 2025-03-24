# Running and Testing Server

## Download Docker Desktop

Download [Docker Desktop](https://www.docker.com/) to use this application

## Build Containers

Containers are isolated processes for each of your app's components

Build a Container from the Dockerfile:
```
% cd project
% docker-compose up --build
```
The Docker container will run automatically after the command

The React server and Django server should be hosted in the container
go to http://localhost:5173 to connect the React server

Stop the container:
```
% [CONTROL-C]
% docker-compose down
```

# Web Application Backend Development Documentation






