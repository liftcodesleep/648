from ast import match_case
from .models import *
from .constants import *
from email_validator import validate_email, EmailNotValidError
import re
import random
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

def register(request):
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            name = collected_data.get("name")
            email= collected_data.get("email")
            password = collected_data.get("password")
            dob = collected_data.get("dob")
            username = collected_data.get("username")
            phonenum = collected_data.get("phonenum")
            userpic = collected_data.get("userpic")
            about = collected_data.get("about")
            usertype = collected_data.get("usertype")
            userid = name[0] + random.randint(0,999999)
            collected_data["userid"] = userid
            
            if email_is_valid(email):
                if phonenum_is_valid(phonenum):
                    if password_is_valid(password):
                        insert_register(collected_data)
                        return register_response('SUCCESS', True, "Welcome to PicturePerfect " + name, True)
                    else:
                        return register_response('SUCCESS', False, "Invalid password", False)
                else:
                    return register_response('SUCCESS', False, "Invalid phone number", False)
            else:
                return register_response('SUCCESS', False, "Invalid email", False)

    except Exception as e:
        print(traceback.print_exc())
        return register_response('FAILED', False, f'API failed with error: {e}',
                              False)


            

def email_is_valid(email):
    try:
        validity = validate_email(email)
        email = validity["email"]
        return True
    except Exception as e:
        return False

def password_is_valid(password):
    reg = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$"
    pat = re.compile(reg)
    mat = re.search(pat, password)
    if mat: 
        return True
    return False

def phonenum_is_valid(phonenum):
    reg = re.compile(r'^\d{10}$')
    return bool(pattern.match(phonenum))