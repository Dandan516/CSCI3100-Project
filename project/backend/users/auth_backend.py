from django.contrib.auth import get_user_model
User = get_user_model()

class EmailAuthBackend:
    # Similar to django default authenticate()
    # user = authenticate(username=username, password=password)
    def authenticate(self, request, email=None, password=None):
        try:
            user = User.objects.get(email=email)
            if user.check_password(password): # django built-in check password function
                return user
        except User.DoesNotExist:
            return None
        
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None