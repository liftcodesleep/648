from .models import *
from .constants import *
from email_validator import validate_email, EmailNotValidError
import re
import uuid
import traceback
import json
from django.shortcuts import render, redirect

# Create your views here.


def render_index_page(request):
    return render(request, 'index.html')


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
                logged_out = insert_activity(username, "User logged in")
                return login_response('SUCCESS', True, 'User has been logged in successfully.',
                                      data[2])

            else:
                return login_response('SUCCESS', False, 'User credentials are incorrect',
                                      "")

        return login_response('SUCCESS', False, 'This API has been called incorrectly. Needs to be POST method',
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
            email = collected_data.get("email")
            password = collected_data.get("password")
            phonenum = collected_data.get("phonenum")
            userid = uuid.uuid1()
            collected_data["userid"] = userid

            if email_is_valid(email):
                if phonenum_is_valid(phonenum):
                    if password_is_valid(password):
                        insert_register(collected_data)
                        return register_response('SUCCESS', True, "Welcome to PicturePerfect " + name, True)
                    else:
                        message = get_pw_message(password)
                        return register_response('SUCCESS', False, message, False)
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


def get_pw_message(password):
    message = check_pw_len(password) + check_pw_lowercase(password)
    message += check_pw_uppercase(password) + check_pw_digit(password)
    message += check_pw_special_char(password)
    return message


def check_pw_len(password):
    if len(password) < 6 or len(password) > 20:
        return "Password must be 6 to 20 characters in length.\n"
    else:
        return ""


def check_pw_lowercase(password):
    reg = "^(?=.*[a-z])$"
    pat = re.compile(reg)
    mat = re.search(pat, password)
    if mat:
        return ""
    else:
        return "Password must contain a lowercase letter.\n"


def check_pw_uppercase(password):
    reg = "^(?=.*[A-Z])$"
    pat = re.compile(reg)
    mat = re.search(pat, password)
    if mat:
        return ""
    else:
        return "Password must contain an uppercase letter.\n"


def check_pw_digit(password):
    reg = "^(?=.*\d)$"
    pat = re.compile(reg)
    mat = re.search(pat, password)
    if mat:
        return ""
    else:
        return "Password must contain a digit.\n"


def check_pw_special_char(password):
    reg = "^(?=.*[@$!%*#?&])$"
    pat = re.compile(reg)
    mat = re.search(pat, password)
    if mat:
        return ""
    else:
        return "Password must contain at least one of the following characters: @$!%*#?&\n"


def phonenum_is_valid(phonenum):
    reg = re.compile(r'^\d{10}$')
    return bool(reg.match(phonenum))


def logout(request):
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            username = collected_data.get("username")

            logged_out = insert_activity(username, "User logged out")

            if logged_out:
                return logout_response("SUCCESS", "Logout successful", True)
            else:
                return logout_response("SUCCESS", "Something went wrong", True)

    except Exception as e:
        print(traceback.print_exc())
        return logout_response('FAILED', f'API failed with error: {e}')


def handle_404_view(request, exception):
    return redirect("http://44.197.240.111/login")
