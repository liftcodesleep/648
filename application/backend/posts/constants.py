from django.http import JsonResponse


def view_post_response(status="SUCCESS", message="", posts=[], count=0):
    login_response_obj = {
        'status': status,
        'message': message,
        "posts": posts,
        "noOfPosts": count
    }

    return JsonResponse(login_response_obj)
