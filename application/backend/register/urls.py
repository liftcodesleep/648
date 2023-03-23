# from django.conf.urls import url
from django.urls import path, include, re_path
from .views import *

app_name = 'register'

urlpatterns = [
    re_path('^$', render_register, name='register'),
]
