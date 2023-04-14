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


def view_activity_log_response(status="SUCCESS", message="", log={}, no_of_posts=0):
    view_activity_log_response_obj = {
        'status': status,
        'message': message,
        'log': log,
        'no_of_posts': no_of_posts
    }
    return JsonResponse(view_activity_log_response_obj)
