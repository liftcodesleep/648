# from django.conf.urls import url
from django.urls import path, include, re_path
from .views import *

app_name = 'access'

urlpatterns = [
    re_path(r'^view_public_posts$', view_posts, name='view_posts')
]
