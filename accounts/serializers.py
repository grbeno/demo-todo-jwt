from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)
    about = serializers.CharField(required=False, allow_blank=True, max_length=500)

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'about')
        validators = []
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        """
        Customize the validate method and the messages to be returned.
        1. Ensure the username is unique.
        """
        username = data['username']
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
