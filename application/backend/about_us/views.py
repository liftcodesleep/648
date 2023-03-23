from django.shortcuts import render
from .models import *
from django.contrib.auth.forms import UserCreationForm
import os
import logging

# Create your views here.


def render_about(request):
    # details = get_about_details()
    return render(request, 'index.html')


def render_register(request):
    form = UserCreationForm()
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save
    context = {'form'}
    # details = get_register()
    return render(request, 'register.html', context)
