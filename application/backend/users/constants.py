from django.http import JsonResponse


def edit_profile_response(status="SUCCESS", message="", is_updated=False):
    edit_profile_response_obj = {
        'status': status,
        'message': message,
        "isUpdated": is_updated
    }

    return JsonResponse(edit_profile_response_obj)


def view_profile_response(status="SUCCESS", message="", user_details={}):
    view_profile_response_obj = {
        'status': status,
        'message': message
    }
    view_profile_response_obj = view_profile_response_obj | user_details
    return JsonResponse(view_profile_response_obj)
