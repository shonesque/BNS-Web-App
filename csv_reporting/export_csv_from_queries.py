#!/usr/bin/env python

"""
This python script is used to generate .csv files from queries that are hold in
.json files. (Every json describes a query)

Steps:
1. Open evey file from FILE_QUERIES list (every file must exist in the current directory)
2. Extract the json object from every file
3. Add the current timestamp (today) in the json query (for every query).
4. Make requests to the Learning Locker instance (Reporting system) using the above queries.
5. Serialize every response.
6. Write the needed data to .csv files.
Important: every query (json file) has a coresponding .csv file in a day.
"""


import os
from sys import version_info
py_version = version_info[0]

import csv
import requests
import json
if py_version < 3:
  from urllib import quote_plus
else:
  from urllib.parse import quote
import pprint
import json
import datetime


# Learning Locker instace URL (Reporting System)
ll_url = "https://xapianalytics.cosminsimion.com/api/statements/aggregate"
# Request headers
headers = {'Authorization' : 'Basic Njc0YjExNjMyNTg0OTU2NmViMGRjYjY3YTZiNWI0MTY5NjY5NDg4YzoxNjkyMGNiYTQ3OGQ2MmJiMmRjODRkNzc0N2FlN2NhYjczNGFiOTdj',
            'Content-Type' : 'application/json'}

# List of file names to be used in queries
FILE_QUERIES = [
  'users_launched.json',
  'users_completed.json'
]


class CSV_Record:
  """
  Class that describes a .csv file record.
  """
  name = ""
  email_address = ""
  verb = ""
  object_course_name = ""
  timestamp = ""


def read_queries_from_files(files=FILE_QUERIES):
  """
  This method is used to extract the json queries from 
  a list of files, given as a parameter.
  """

  result = {}

  for file_name in files:
    with open(file_name, 'rb') as file_handler:
      contents = json.load(file_handler)
    
      
      # Append today's timestamp to the query to get the today's results.
      today_max = datetime.datetime.combine(datetime.datetime.now(), datetime.datetime.max.time())
      today_min = datetime.datetime.combine(datetime.datetime.now(), datetime.datetime.min.time())

      contents[0]['$match']['$and'].append({ 
          "statement.timestamp" : {
            "$lte" : {
              "$dte" : today_max.isoformat()
            }
          }
        }
      )
      contents[0]['$match']['$and'].append({ 
          "statement.timestamp" : {
            "$gte" : {
              "$dte" : today_min.isoformat()
            }
          }
        }
      )
      contents_string = json.dumps(contents)

      # Construct the URL (Encode & Append)
      if py_version < 3:
          url_param_econded = quote_plus(contents_string)
      else:
          url_param_econded = quote(contents_string)
      
      url = ll_url
      url += '?pipeline=' + url_param_econded

      result[file_name] = url

  return result


def make_request(url, file_name):
  """
  This method makes a HTTP request to the specified URL, and saves the 
  response in a json file.

  This method returns a list of csv records to be written in files.
  """

  csv_records = []

  response = requests.get(url, headers=headers)
  if(response.ok):
      json_data = json.loads(response.content)

      for key in json_data:
        csv_record = CSV_Record()
        csv_record.name = key['statement']['actor']['name']
        csv_record.email_address = key['statement']['actor']['mbox']
        csv_record.verb = key['statement']['verb']['display']['en-US']
        csv_record.object_course_name = key['statement']['object']['definition']['name']['en']
        
        timestamp = key['statement']['timestamp']
        timestamp = datetime.datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
        csv_record.timestamp = "{0}-{1}-{2} {3}:{4}:{5}".format(timestamp.year, timestamp.month, timestamp.day, timestamp.hour, timestamp.minute, timestamp.second)

        csv_records.append(csv_record)

        # print(csv_record.name)
        # print(csv_record.email_address)
        # print(csv_record.verb)
        # print(csv_record.object_course_name)
        # print(csv_record.timestamp + '\n')

      today_string_format = datetime.date.today().strftime('%d_%b_%Y')
      print("{0}: The response for {1} contains {2} properties".format(today_string_format, file_name,len(json_data)))
      print("\n")

      # logFile=open('response_'+ file_name, 'w')
      # pprint.pprint(json_data, logFile)

  else:
      response.raise_for_status()

  return csv_records


def export_csv(records, file_name):
  """
  This method is used to export records (given as parameter) in a csv file that is 
  created if it does not exist.
  """

  csv_headers = [
    'Full name',
    'Email address',
    'Status',
    'Course Name',
    'Date Completed'
  ]

  # Construct the csv file name.
  # 'todaydate_queryfilename.csv'
  today_string_format = datetime.date.today().strftime('%d_%b_%Y')
  csv_file_name = today_string_format + '_' + file_name
  csv_file_name = os.path.splitext(csv_file_name)[0] + '.csv'
  current_directory = os.getcwd()
  csv_file_name = os.path.join(current_directory, csv_file_name)

  # Open and write to csv file.
  with open(csv_file_name, 'w+') as csv_file:
    filewriter = csv.writer(csv_file, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    filewriter.writerow(csv_headers)

    for record in records:
      list_record = [
        record.name,
        record.email_address.replace('mailto:', ''),
        record.verb,
        record.object_course_name,
        record.timestamp
      ]
      filewriter.writerow(list_record)


def main():
  """
  Main method.
  """
  request_urls = read_queries_from_files()

  for file_name, url in request_urls.items():
    csv_records = make_request(url, file_name)
    export_csv(csv_records, file_name)


if __name__ == '__main__':
  main()