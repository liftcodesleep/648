from django.http import JsonResponse


def login_response(status="SUCCESS", isloggedin=False, message="", userid=""):
    login_response_obj = {
        'status': status,
        'isLoggedin': isloggedin,
        'message': message,
        "userId": userid
    }

    return JsonResponse(login_response_obj)
