from django.shortcuts import render
import json
from .constants import *
from .models import *
import traceback

# Create your views here.


def view_posts(request):
    try:
        if request.method == 'POST':
            collected_data = json.loads(request.body)
            limit = collected_data.get("limit")
            offset = collected_data.get("offset")
            searchText = collected_data.get("searchText")
            sortby = collected_data.get("sortby")
            sort_type = collected_data.get("sortType")

            data = find_post_data(limit, offset, searchText, sortby, sort_type)
            formatted_data = format_post_data(data)

            if data and len(data) > 0:
                return view_post_response('SUCCESS', 'Posts succesfully fetched.', formatted_data, len(data))

            else:
                return view_post_response('SUCCESS', 'No posts found with corresponding search text.', [], 0)

        return view_post_response('SUCCESS', 'This API has been wrongly called. Needs to be POST method', [], 0)

    except Exception as e:
        print(traceback.print_exc())
        return view_post_response('FAILED', f'API failed with error: {e}', [], 0)


def format_post_data(post_list):
    formatted_list = []
    cols = ['made_by', 'creation_date', 'no_likes', 'no_dislikes', 'points',
            'isReshared', 'post_id',  'no_views', 'no_comments', 'image', 'desc']

    for each_post in post_list:
        post_dict = {}
        for ind, each_col in enumerate(cols):
            post_dict[each_col] = each_post[ind]

        formatted_list.append(post_dict)

    return formatted_list
