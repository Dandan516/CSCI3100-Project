from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is a required field")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

# Abstract Users extend function for Django Users model 
class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    username = models.CharField(max_length=200, null=True, blank=True)
    birthday = models.DateField(null=True)
    

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args , **kwargs):
    """
    Function to send email when password reset token is created.
    """
    sitelink = "http://localhost:5173/"
    token = "?token={}".format(reset_password_token.key)
    full_url = str(sitelink) + str("password-reset") + str(token)
    # token = ?token=abcdefghijklmnopqrstuvwxyz
    # full_url = http://localhost:5173/password-reset?token=abcdefghijklmnopqrstuvwxyz

    email = reset_password_token.user.email
    context = {
        'full_url': full_url,
        'email_address': email,
    }
    html_message = render_to_string('backend/email.html', context=context)
    plain_message = strip_tags(html_message)
    
    
    msg = EmailMultiAlternatives(
        subject = "Request for Password Reset for {title}".format(title=reset_password_token.user.email), 
        body = plain_message, 
        from_email = "noreply@email.com" ,
        to = [reset_password_token.user.email],
    )
    msg.attach_alternative(html_message, "text/html")
    msg.send()
    