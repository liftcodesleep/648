from django.http import JsonResponse

categories = ['Nature', 'Trip', 'Sports', 'Fashion',
              'Funny', 'Games', 'Space', 'Movies',
              'Crafts', 'Music', 'Art']


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


def view_categories_response(status="SUCCESS", message="", categories=[]):
    view_categories_response_obj = {
        'status': status,
        'message': message,
        "categories": categories
    }

    return JsonResponse(view_categories_response_obj)


def view_single_post_response(status="SUCCESS", message="", posts={}):
    view_single_post_response_obj = {
        'status': status,
        'message': message,
        "post": posts
    }

    return JsonResponse(view_single_post_response_obj)


def liked_disliked_response(status="SUCCESS", message="", isupdated=False, no_likes=0, no_dislikes=0):
    liked_disliked_response_obj = {
        'status': status,
        'message': message,
        "isUpdated": isupdated,
        "no_likes": no_likes,
        "no_dislikes": no_dislikes
    }

    return JsonResponse(liked_disliked_response_obj)


def add_comment_response(status="SUCCESS", message="", iscommentadded=False, no_comments=0, comments=[]):
    add_comment_response_obj = {
        'status': status,
        'message': message,
        "isCommentAdded": iscommentadded,
        "no_comments": no_comments,
        "comments": comments
    }

    return JsonResponse(add_comment_response_obj)


def delete_comment_response(status="SUCCESS", message="", isdeleted=False):
    delete_comment_response_obj = {
        'status': status,
        'message': message,
        "isCommentDeleted": isdeleted,
    }

    return JsonResponse(delete_comment_response_obj)


def add_view_response(status="SUCCESS", message="", isviewupdated=False, no_views=0, postid=""):
    add_view_response_obj = {
        'status': status,
        'message': message,
        "isViewUpdated": isviewupdated,
        "noOfViews": no_views,
        "postid": postid
    }

    return JsonResponse(add_view_response_obj)


def delete_post_response(status="SUCCESS", message="", isdeleted=False):
    delete_post_response_obj = {
        'status': status,
        'message': message,
        "isPostDeleted": isdeleted,
    }

    return JsonResponse(delete_post_response_obj)
