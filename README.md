<br>
<h1 align="center">
    Multi-Purpose Planner
</h1>
<p align="center"><b> This Planner allow users to manage their Travel Plan and Budget</b></p>

## Getting Started

Download [Docker Desktop](https://www.docker.com/) to use this application

### Build Containers

Build a Container from the Dockerfile:
```
% cd project
% docker-compose up --build
```
The Docker container will run automatically after the command

The React server and Django server should be hosted in the container\
Go to http://localhost:5173 to use the application

Stop the container:
```
% [CONTROL-C]
% docker-compose down
```

## Features

### Travel Planner

* Add/Edit Trip
  * Plan title
  * Start/End Date
  * Destination
  * Description
* Add/Edit Itinerary
  * Itinerary title
  * Start/End Time
  * Location
  * Notes
  * Tags
* Collaboration
  * Invite collaborator with account email
 
### Budget Tracker

* Add/Edit Budget Plan
  * View balance
  * View total expenses/incomes
* Add/Edit Expense/Income Entry
  * Amount
  * Date
  * Description
  * Categories






