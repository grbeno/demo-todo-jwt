from rest_framework import status
from .serializers import CustomUserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.http import JsonResponse


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        
        for key, value in serializer.errors.items():
            error_message = str(value[0])
            affected_field = key
        # print(error_message)
        
        return JsonResponse({'error_message': error_message, 'affected_field': affected_field}, status=status.HTTP_400_BAD_REQUEST)

        

