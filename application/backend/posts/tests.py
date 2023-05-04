import random
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

# Create your tests here.


class AccessTestCases(TestCase):
    def test_successful_add_view(self):
        input_payload = {
            "postid": random.choice(['P1012', 'P1084', 'P630', 'P959', 'P1456'])
        }

        # getting current number of views
        current_views_response = self.client.post(
            '/get_post_details', input_payload, content_type='application/json')
        self.assertEqual(current_views_response.json()['status'], 'SUCCESS')

        # adding one view
        add_view_response = self.client.post(
            '/add_view', input_payload, content_type='application/json')
        self.assertEqual(add_view_response.json()['status'], 'SUCCESS')
        self.assertEqual(add_view_response.json()['isViewUpdated'], True)

        # checking if new view = old views + 1
        self.assertEqual(add_view_response.json()[
                         'noOfViews'], current_views_response.json()['post']['no_views'] + 1)

    def test_successful_add_comment(self):
        input_payload_add_comment = {
            "postid": random.choice(['P1012', 'P1084', 'P630', 'P959', 'P1456']),
            "comment": "This is a dummy comment made using django tests",
            "username": "ishah_sfsu"
        }

        post_details_input_payload = {
            "postid": input_payload_add_comment['postid']
        }

        # checking current number of comments
        current_views_response = self.client.post(
            '/get_post_details', post_details_input_payload, content_type='application/json')
        self.assertEqual(current_views_response.json()['status'], 'SUCCESS')

        add_comment_response = self.client.post(
            '/add_comment', input_payload_add_comment, content_type='application/json')
        self.assertEqual(add_comment_response.json()['status'], 'SUCCESS')
        self.assertEqual(add_comment_response.json()['isCommentAdded'], True)

        # checking if number of comments is equal to old count + 1
        self.assertEqual(add_comment_response.json()[
                         'no_comments'], current_views_response.json()['post']['no_comments'] + 1)

        # checking if new comment exists in set of comments
        self.assertEqual(any(input_payload_add_comment['comment'] in comment.values(
        ) for comment in add_comment_response.json()['comments']), True)

        return input_payload_add_comment['postid']

    def test_successful_delete_comment(self):
        input_payload_delete_comment = {
            "postid": self.test_successful_add_comment(),
            "commentid": "",
            "username": "ishah_sfsu"
        }

        post_details_input_payload = {
            "postid": input_payload_delete_comment['postid']
        }

        # checking current number of comments
        current_views_response = self.client.post(
            '/get_post_details', post_details_input_payload, content_type='application/json')
        self.assertEqual(current_views_response.json()['status'], 'SUCCESS')
        # if no of comments more than one, consider last comment and delete it
        self.assertGreaterEqual(current_views_response.json()[
                                'post']['no_comments'], 1)
        input_payload_delete_comment['commentid'] = current_views_response.json()[
            'post']['comments'][-1]['comment_id']

        delete_comment_response = self.client.post(
            '/delete_comment', input_payload_delete_comment, content_type='application/json')
        self.assertEqual(delete_comment_response.json()['status'], 'SUCCESS')
        self.assertEqual(delete_comment_response.json()
                         ['isCommentDeleted'], True)

        updated_views_response = self.client.post('/get_post_details', post_details_input_payload,
                                                  content_type='application/json')
        self.assertEqual(updated_views_response.json()['status'], 'SUCCESS')

        # checking if number of comments is equal to old count - 1
        self.assertEqual(updated_views_response.json()[
                         'post']['no_comments'], current_views_response.json()['post']['no_comments'] - 1)

        # checking if new comment exists in set of comments (shouldn't exist)
        self.assertEqual(any(input_payload_delete_comment['commentid'] in comment.values(
        ) for comment in updated_views_response.json()['post']['comments']), False)

    def test_successful_create_post(self):
        file = SimpleUploadedFile(
            "nature_dummy.jpg", b"file_content", content_type='image/jpeg')
        create_post_payload = {
            "username": "ishah_sfsu",
            "is_reshared": True,
            "image": file,
            "description": "This is a post made for testing using django tests",
            "category": "Nature"
        }

        create_post_response = self.client.post(
            '/create_post', create_post_payload,)
        self.assertEqual(create_post_response.json()['status'], 'SUCCESS')
        self.assertEqual(create_post_response.json()['isPostCreated'], True)

        # checking if post is created by using post id
        # if post is created, we will successfully get post details
        post_details_input_payload = {
            "postid": create_post_response.json()['postid']}
        updated_views_response = self.client.post('/get_post_details', post_details_input_payload,
                                                  content_type='application/json')
        self.assertEqual(updated_views_response.json()['status'], 'SUCCESS')
        self.assertEqual(updated_views_response.json()[
                         'post']['post_id'], create_post_response.json()['postid'])

    def test_successful_empty_view_post(self):
        view_posts_payload = {
            "limit": 1,
            "offset": 0,
            "searchText": "animpossiblesearch",
            "sortType": "ASC",
            "category": "nature"
        }
        view_post_response = self.client.post(
            '/view_public_posts', view_posts_payload, content_type='application/json')
        self.assertEqual(view_post_response.json()['status'], 'SUCCESS')
        self.assertEqual(view_post_response.json()[
                         'message'], 'No posts found with corresponding search text.')
        self.assertEqual(view_post_response.json()['posts'], [])
        self.assertEqual(view_post_response.json()['noOfPosts'], 0)

    def test_successful_nonempty_view_post(self):
        print("Testing public posts viewing")
        view_posts_payload = {
            "limit": 1,
            "offset": 0,
            "searchText": "post",
            "sortType": "ASC",
            "category": "nature"
        }
        view_post_response = self.client.post(
            '/view_public_posts', view_posts_payload, content_type='application/json')
        self.assertEqual(view_post_response.json()['status'], 'SUCCESS')
        self.assertEqual(view_post_response.json()[
                         'message'], 'Posts succesfully fetched.')
        # not sure what a json()['post'] response should look like to test for
        self.assertIsNotNone(view_post_response.json()['posts'])
        self.assertGreaterEqual(view_post_response.json()['noOfPosts'], 1)

    def test_dislike_post(self):
        get_post_payload = {
            "postid": "P1273"
        }
        dislike_post_payload = {
            "postid": "P1273",
            "liked": False
        }
        original_dislike_post_response = self.client.post(
            '/get_post_details', get_post_payload, content_type='application/json')
        self.assertEqual(original_dislike_post_response.json()[
                         'status'], 'SUCCESS')
        modified_dislike_post_response = self.client.post(
            '/like_dislike_post', dislike_post_payload, content_type='application/json')
        self.assertEqual(modified_dislike_post_response.json()[
                         'status'], 'SUCCESS')
        self.assertEqual(modified_dislike_post_response.json()[
                         'isUpdated'], True)
        self.assertEqual(modified_dislike_post_response.json()[
                         'message'], "Post succesfully fetched.")

        self.assertEqual(modified_dislike_post_response.json()[
                         'no_dislikes'], original_dislike_post_response.json()['post']['no_dislikes']+1)

    def test_like_post(self):
        print("Testing like/dislike")
        get_post_payload = {
            "postid": "P1273"
        }
        like_post_payload = {
            "postid": "P1273",
            "liked": True
        }
        original_like_post_response = self.client.post(
            '/get_post_details', get_post_payload, content_type='application/json')
        self.assertEqual(original_like_post_response.json()[
                         'status'], 'SUCCESS')
        modified_like_post_response = self.client.post(
            '/like_dislike_post', like_post_payload, content_type='application/json')
        self.assertEqual(modified_like_post_response.json()[
                         'status'], 'SUCCESS')
        self.assertEqual(modified_like_post_response.json()[
                         'isUpdated'], True)
        self.assertEqual(modified_like_post_response.json()[
                         'message'], "Post succesfully fetched.")
        self.assertEqual(modified_like_post_response.json()[
                         'no_likes'], original_like_post_response.json()['post']['no_likes']+1)

    def test_delete_post(self):
        print("Testing post deletion")
        file = SimpleUploadedFile(
            "nature_dummy.jpg", b"file_content", content_type='image/jpeg')
        create_post_payload = {
            "username": "ishah_sfsu",
            "is_reshared": True,
            "image": file,
            "description": "This is a third post made for testing post deletion using django tests",
            "category": "Nature"
        }

        create_post_response = self.client.post(
            '/create_post', create_post_payload,)
        self.assertEqual(create_post_response.json()['status'], 'SUCCESS')
        self.assertEqual(create_post_response.json()['isPostCreated'], True)

        postid = create_post_response.json()['postid']

        delete_post_payload = {
            "username": "ishah_sfsu",
            "postid": postid
        }

        delete_post_response = self.client.post(
            '/delete_post', delete_post_payload, content_type='application/json')
        self.assertEqual(delete_post_response.json()[
                         'message'], 'Post deleted.')
        self.assertEqual(delete_post_response.json()['status'], 'SUCCESS')
        self.assertEqual(delete_post_response.json()['isPostDeleted'], True)

        file = SimpleUploadedFile(
            "nature_dummy.jpg", b"file_content", content_type='image/jpeg')
        create_post_payload = {
            "username": "ishah_sfsu",
            "is_reshared": True,
            "image": file,
            "description": "This is a third post made for testing post deletion using django tests",
            "category": "Nature"
        }

    def test_list_user_posts(self):
        print("Test listing user posts")
        input_payload = {
            "limit": 1,
            "username": "ishah_sfsu",
            "offset": 0,
            "searchtext": "post",
            "sortby": "Creation_date",
            "sortType": "ASC"
        }
        user_post_list_response = self.client.post(
            '/list_user_posts', input_payload, content_type="application/json"
        )
        self.assertEqual(user_post_list_response.json()['status'], 'SUCCESS')
        self.assertEqual(user_post_list_response.json()[
                         'message'], 'Posts successfully fetched.')

    def test_list_fake_user_posts(self):
        input_payload = {
            "limit": 1,
            "username": "fake_user",
            "offset": 0,
            "searchtext": "post",
            "sortby": "Creation_date",
            "sortType": "ASC"
        }
        user_post_list_response = self.client.post(
            '/list_user_posts', input_payload, content_type="application/json"
        )
        self.assertEqual(user_post_list_response.json()['status'], 'SUCCESS')
        self.assertEqual(user_post_list_response.json()[
                         'message'], 'No posts found with corresponding search text.')
