from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


class CustomUserAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = CustomUser
    list_display = [ 'id', 'username', 'is_superuser', 'last_login', ]
    fieldsets = (
        (None, {'fields': ('username',),}),
        ('Personal info', {'fields': ('about',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'about',),
        }),
    )
    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ()
    

admin.site.register(CustomUser, CustomUserAdmin)


