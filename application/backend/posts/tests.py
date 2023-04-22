import random
from django.test import TestCase

# Create your tests here.


class AccessTestCases(TestCase):
    def test_successful_add_view(self):
        input_payload = {
            "postid": random.choice(['P1012', 'P1084', 'P630', 'P959', 'P1456'])
        }

        # getting current number of views
        current_views_response = self.client.post('/get_post_details', input_payload, content_type='application/json')
        self.assertEqual(current_views_response.json()['status'], 'SUCCESS')

        # adding one view
        add_view_response = self.client.post('/add_view', input_payload, content_type='application/json')
        self.assertEqual(add_view_response.json()['status'], 'SUCCESS')
        self.assertEqual(add_view_response.json()['isViewUpdated'], True)

        # checking if new view = old views + 1
        self.assertEqual(add_view_response.json()['noOfViews'], current_views_response.json()['post']['no_views'] + 1)

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
        current_views_response = self.client.post('/get_post_details', post_details_input_payload, content_type='application/json')
        self.assertEqual(current_views_response.json()['status'], 'SUCCESS')

        add_comment_response = self.client.post('/add_comment', input_payload_add_comment, content_type='application/json')
        self.assertEqual(add_comment_response.json()['status'], 'SUCCESS')
        self.assertEqual(add_comment_response.json()['isCommentAdded'], True)

        # checking if number of comments is equal to old count + 1
        self.assertEqual(add_comment_response.json()['no_comments'], current_views_response.json()['post']['no_comments'] + 1)

        # checking if new comment exists in set of comments
        self.assertEqual(any(input_payload_add_comment['comment'] in comment.values() for comment in add_comment_response.json()['comments']), True)

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
        current_views_response = self.client.post('/get_post_details', post_details_input_payload, content_type='application/json')
        self.assertEqual(current_views_response.json()['status'], 'SUCCESS')
        # if no of comments more than one, consider last comment and delete it
        self.assertGreaterEqual(current_views_response.json()['post']['no_comments'], 1)
        input_payload_delete_comment['commentid'] = current_views_response.json()['post']['comments'][-1]['comment_id']

        delete_comment_response = self.client.post('/delete_comment', input_payload_delete_comment, content_type='application/json')
        self.assertEqual(delete_comment_response.json()['status'], 'SUCCESS')
        self.assertEqual(delete_comment_response.json()['isCommentDeleted'], True)

        updated_views_response = self.client.post('/get_post_details', post_details_input_payload,
                                                  content_type='application/json')
        self.assertEqual(updated_views_response.json()['status'], 'SUCCESS')

        # checking if number of comments is equal to old count - 1
        self.assertEqual(updated_views_response.json()['post']['no_comments'], current_views_response.json()['post']['no_comments'] - 1)

        # checking if new comment exists in set of comments (shouldn't exist)
        self.assertEqual(any(input_payload_delete_comment['commentid'] in comment.values() for comment in updated_views_response.json()['post']['comments']), False)
