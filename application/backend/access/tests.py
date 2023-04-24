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

        response = self.client.post(
            '/user_login', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isLoggedin'], True)

    def test_invalid_login(self):
        input_payload = {
            "username": "ishah_sfsu",
            "password": "incorrect password",
            "user_type": "general"
        }

        response = self.client.post(
            '/user_login', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isLoggedin'], False)

    def test_valid_signup(self):
        input_payload = {
            "name": "Bob",
            "password": "Validpassword1!",
            "email": "validemail@gmail.com",
            "phonenum": "0123456789",
            "userid": "Bob" + str(random.randint(0, 999999))

        }
        response = self.client.post(
            'user_signup', input_payload, content_type='application/json')
        self.assertEqual(response.json()['status'], 'SUCCESS')
        self.assertEqual(response.json()['isRegistered'], True)
