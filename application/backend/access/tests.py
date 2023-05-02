from django.test import TestCase
import random

# Create your tests here.


class AccessTestCases(TestCase):
    def test_successful_login(self):
        input_payload = {
            "username": "ishah_sfsu",
            "password": "Ishika2510#",
            "user_type": "general"
        }

        print("Testing valid login case")
        response = self.client.post('/user_login', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isLoggedin'], True)

    def test_invalid_login(self):
        input_payload = {
            "username": "ishah_sfsu",
            "password": "incorrect password",
            "user_type": "general"
        }

        print("Testing invalid login case")
        response = self.client.post('/user_login', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isLoggedin'], False)

    def test_successful_logout(self):
        input_payload = {
            "username": "ishah_sfsu",

        }

        print("Testing logout API with valid ouput")
        response = self.client.post('/logout', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isLoggedout'], True)
