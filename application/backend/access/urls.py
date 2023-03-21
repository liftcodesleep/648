# from django.conf.urls import url
from django.urls import path, include, re_path
from .views import *

app_name = 'access'

urlpatterns = [
    re_path(r'^user_login$', login, name='login'),
]
