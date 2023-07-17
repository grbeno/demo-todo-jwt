from django.views.generic import TemplateView

from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Todo
from .serializers import TodoSerializer


class React(TemplateView):
    template_name = 'index.html'
    

class ListTodo(generics.ListAPIView):
    
    serializer_class = TodoSerializer
    
    def get(self, request, *args, **kwargs):
        user = request.user.id
        queryset = Todo.objects.filter(user=user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


# Custom TokenObtainPairView
class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer 


# Logout & Blacklist Token
class LogoutView(generics.GenericAPIView):
    
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response(status=status.HTTP_205_RESET_CONTENT)
            except Exception as e:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Refresh token is missing.'}, status=status.HTTP_400_BAD_REQUEST)
        
