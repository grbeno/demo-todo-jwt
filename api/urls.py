from django.urls import path
from .views import ListTodo


urlpatterns = [
    path('api/', ListTodo.as_view()),
]