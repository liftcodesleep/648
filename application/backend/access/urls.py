# from django.conf.urls import url
from django.urls import path, include, re_path
from .views import *

app_name = 'access'

urlpatterns = [
    re_path(r'^user_login$', login, name='login'),
    re_path(r'^register_user$', register, name='register'),
    re_path(r'^login$', render_login, name='render_login'),
    re_path(r'^signup$', render_register, name='render_register'),
    re_path(r'^logout$', logout, name='logout'),
]

handler404 = "access.views.handle_404_view"
