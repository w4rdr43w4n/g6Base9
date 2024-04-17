from copyleaks.copyleaks import Copyleaks
from copyleaks.exceptions.command_error import CommandError
import http.client
import json

EMAIL_ADDRESS = 'chatgeneration6@gmail.com'
KEY = 'ec379620-d47a-46cd-ad4b-d7e1dc349441'

def authenticate():
    # Authenticating Process
    try:
       auth_token = Copyleaks.login(EMAIL_ADDRESS, KEY) 
       return auth_token
    except CommandError as ce:
            response = ce.get_response()
            print(f"An error occurred (HTTP status code {response.status_code}):")
            print(response.content)
            return "error"





if __name__ == '__main__':
   a = authenticate()
   conn = http.client.HTTPSConnection("api.copyleaks.com")

   payload = {"purge": False,"scans": [{"id":"2093"}]}

   headers = {
      'Authorization':  f"Bearer {a['access_token']}",
      'Content-Type': "application/json",
      'Accept': "application/json"
   }
   payload = json.dumps(payload)
   conn.request("PATCH", "/v3.1/scans/delete", payload, headers)

   res = conn.getresponse()
   data = res.read()

   print(data.decode("utf-8"))
  