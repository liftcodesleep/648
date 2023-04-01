from django.http import JsonResponse


def view_post_response(status="SUCCESS", message="", posts=[], count=0):
    view_post_response_obj = {
        'status': status,
        'message': message,
        "posts": posts,
        "noOfPosts": count
    }

    return JsonResponse(view_post_response_obj)


def create_post_response(status="SUCCESS", message="", is_post_created=False, post_id=''):
    create_post_response_obj = {
        'status': status,
        'message': message,
        "isPostCreated": is_post_created,
        "postid": post_id
    }

    return JsonResponse(create_post_response_obj)
