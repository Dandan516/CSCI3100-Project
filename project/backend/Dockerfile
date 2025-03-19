# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install any needed packages specified in requirements.txt
RUN pip install django djangorestframework django-cors-headers

# Copy the current directory contents into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Run the Django development server
CMD ["python", "manage.py", "runserver","8080"]