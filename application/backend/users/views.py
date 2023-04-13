from django.shortcuts import render
import json
from .constants import *
from .models import *
import traceback

# Create your views here.


def edit_profile(request):
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            username = collected_data.get("username")
            updates = collected_data.get("updates")

            data = update_profile(username, updates)

            if data:
                return edit_profile_response('SUCCESS', 'Profile updated succesfully', True)

            else:
                return edit_profile_response('SUCCESS', 'Username not found.', False)

        return edit_profile_response('SUCCESS', 'This API has been wrongly called. Needs to be POST method', False)

    except Exception as e:
        print(traceback.print_exc())
        return edit_profile_response('FAILED', f'API failed with error: {e}', False)


def view_profile(request):
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            username = collected_data.get("username")

            data = view_profile_data(username)
            processed_data = process_data(data)

            if data:
                return view_profile_response('SUCCESS', 'Profile found succesfully', processed_data)

            else:
                return view_profile_response('SUCCESS', 'Username not found.')

        return view_profile_response('SUCCESS', 'This API has been wrongly called. Needs to be POST method')

    except Exception as e:
        print(traceback.print_exc())
        return view_profile_response('FAILED', f'API failed with error: {e}')


def process_data(data):
    data = list(data)
    data.pop(2); data.pop(2); data.pop(3)
    print(data)
    columns = ["name", "email", "dob", "username", "phonenum", "userpic", "about", "usertype"]
    processed_data = {}

    for i in range(len(data)):
        processed_data[columns[i]] = data[i]

    return processed_data
