from django.http import JsonResponse


def login_response(status="SUCCESS", isloggedin=False, message="", userid=""):
    login_response_obj = {
        'status': status,
        'isLoggedin': isloggedin,
        'message': message,
        "userId": userid
    }

    return JsonResponse(login_response_obj)

def register_response(status="SUCCESS", isRegistered=False, message="", isUnique=False):
    register_response_obj = {
        'status': status,
        'isRegistered': isRegistered,
        'message': message,
        'isUnique' : isUnique,
    }

    return JsonResponse(register_response_obj)


def logout_response(status="SUCCESS", message="", isloggedout=False):
    logout_response_obj = {
        'status': status,
        'message': message,
        'isLoggedout' : isloggedout,
    }

    return JsonResponse(logout_response_obj)