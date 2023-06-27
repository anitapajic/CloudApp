import json
import os
import boto3
import base64
# Import local utility module
from utility.utils import create_response
# Import non standard library
from requests import get

# Extract environment variable
table_name = "inviteTable"
dynamodb = boto3.resource('dynamodb')

def create(event, context):
    # Extract data from request
    body = json.loads(event['body'])

    # Get table instance connection
    table = dynamodb.Table(table_name)

    # Put item into table
    response = table.put_item(
        Item={
            'id': body['id'],
            'username': body['username'],
        }
    )
    # Create response
    body = {
        'message': 'Successfully uploaded code'
    }
    return create_response(200, body)
