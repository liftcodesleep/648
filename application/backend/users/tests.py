from django.test import TestCase
import random

# Create your tests here.


class AccessTestCases(TestCase):
    def test_successful_update_user_profile(self):
        view_profile_input_payload = {
            "username": "ishah_sfsu"
        }

        update_profile_input_payload = {
            "username": view_profile_input_payload['username'],
            "updates": [
                {"updatedColumn": "name", "updatedValue": "Ishika Shah"},
                {"updatedColumn": "email", "updatedValue": "ishikaishu2000@gmail.com"}
            ]
        }

        # update user profile
        update_profile_response = self.client.post('/update_user_profile', update_profile_input_payload, content_type='application/json')
        self.assertEqual(update_profile_response.json()['status'], 'SUCCESS')
        self.assertEqual(update_profile_response.json()['isUpdated'], True)

        # getting updated profile details
        updated_profile_response = self.client.post('/view_user_profile', view_profile_input_payload, content_type='application/json')
        self.assertEqual(updated_profile_response.json()['status'], 'SUCCESS')

        # checking if profile is updated correctly
        self.assertEqual(updated_profile_response.json()['name'], update_profile_input_payload['updates'][0]['updatedValue'])
        self.assertEqual(updated_profile_response.json()['email'], update_profile_input_payload['updates'][1]['updatedValue'])
