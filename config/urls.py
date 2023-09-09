from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import MyTokenObtainPairView, LogoutView
from api.views import React


urlpatterns = [
    
    # Admin
    path('admin/', admin.site.urls),
    
    # User model
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    
    # Todos app
    path('', include('api.urls')),

    # JWT
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', LogoutView.as_view(), name='blacklist'),

    re_path(r'.*', React.as_view(), name='frontend'),  # Turn off for react development -> npm start ...
    
]
