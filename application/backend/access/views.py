from .models import *
from .constants import *
import traceback
import json
import os
import logging

# Create your views here.


# This method is used to log in a given user by verifying their credentials
def login(request):
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            username = collected_data.get("username")
            password = collected_data.get("password")
            user_type = collected_data.get("user_type")

            data = check_login_info(username, password, user_type)

            if data and len(data) > 0:
                return login_response('SUCCESS', True, 'User has been logged in successfully.',
                                      data[2])

            else:
                return login_response('SUCCESS', False, 'User credentials are incorrect',
                                      "")

        return login_response('SUCCESS', False, 'This API has been wrongly called. Needs to be POST method',
                              "")

    except Exception as e:
        print(traceback.print_exc())
        return login_response('FAILED', False, f'API failed with error: {e}',
                              "")
