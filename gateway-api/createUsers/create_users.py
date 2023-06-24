import base64
import json
import os
import boto3

# Import local utility module
from utility.utils import create_response
# Import non standard library
from requests import get

# Extract environment variable
table_name = "userTable"
dynamodb = boto3.resource('dynamodb')

def create(event, context):
    # Extract data from request
    body = json.loads(event['body'])

    # Get table instance connection
    table = dynamodb.Table(table_name)
    # Put item into table
    response = table.put_item(
        Item={
            'username': body['username'],
            'password': hash(body['password']),
            'name': body['name'],
            'family_name': body['family_name'],
            'folders': body['folders']
        }
    )
    # Create response
    body = {
        'message': 'Successfully created user'
    }
    return create_response(200, body)
