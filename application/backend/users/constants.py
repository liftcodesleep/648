from django.http import JsonResponse


def edit_profile_response(status="SUCCESS", message="", is_updated=False):
    edit_profile_response_obj = {
        'status': status,
        'message': message,
        "isUpdated": is_updated
    }

    return JsonResponse(edit_profile_response_obj)
