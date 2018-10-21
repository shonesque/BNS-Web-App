import requests
import json
import urllib
import pprint
import json
import datetime


ll_url = "https://xapianalytics.cosminsimion.com/api/statements/aggregate"
headers = {'Authorization' : 'Basic Njc0YjExNjMyNTg0OTU2NmViMGRjYjY3YTZiNWI0MTY5NjY5NDg4YzoxNjkyMGNiYTQ3OGQ2MmJiMmRjODRkNzc0N2FlN2NhYjczNGFiOTdj',
            'Content-Type' : 'application/json'}


FILE_QUERIES = [
  'users_launched.json',
  'users_completed.json'
]


def make_request(url, file_name):
  response = requests.get(url, headers=headers)
  print(response.status_code)

  # For successful API call, response code will be 200 (OK)
  if(response.ok):

      jData = json.loads(response.content)

      for key in jData:
        print(key['statement']['actor']['name'])
        print(key['statement']['actor']['mbox'])
        print(key['statement']['verb']['display']['en-US'])
        print(key['statement']['object']['definition']['name']['en'])
        print(key['statement']['timestamp'] + '\n')

      print("The response contains {0} properties".format(len(jData)))
      print("\n")

      logFile=open('response_'+ file_name, 'w')
      pprint.pprint(jData, logFile)

  else:
    # If response code is not ok (200), print the resulting http error code with description
      response.raise_for_status()


for file_name in FILE_QUERIES:
  with open(file_name, 'rb') as file_handler:
    contents = json.load(file_handler)
  
    now = datetime.datetime.now()
    contents[0]['$match']['$and'].append({ 
        "statement.timestamp" : {
          "$lte" : {
            "$dte" : now.isoformat()
          }
        }
      }
    )
    contents_string = json.dumps(contents)

    url_param_econded = urllib.parse.quote(contents_string)
    url = ll_url
    url += '?pipeline=' + url_param_econded
    make_request(url, file_name)
