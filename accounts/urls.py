# accounts.urls
from django.urls import path
from .views import SignupView


urlpatterns = [
    path('signup/', SignupView.as_view(), name="create_user"),
]