import unittest
from app import app

class TestApp(unittest.TestCase):
    
    def test_home(self):
        tester = app.test_client(self)
        response = tester.get("/")
        status_code = response.status_code
        self.assertEqual(status_code, 200)
        self.assertEqual(response.data, b"Hello, World!")
