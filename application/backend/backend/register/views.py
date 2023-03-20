from django.shortcuts import render, redirect
from .forms import RegisterForm

def render_register(response):
    if response.method == "POST":
        form = RegisterForm(response.POST)
        if form.is_valid():
            form.save()

        return redirect("/home")
    else:
        form = RegisterForm()

    return render(response, "main.html", {"form":form})
