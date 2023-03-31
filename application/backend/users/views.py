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