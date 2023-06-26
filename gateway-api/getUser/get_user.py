import json
import os
import boto3

from urllib.parse import unquote
from utility.utils import create_response

# Extract environment variable
table_name = "userTable"
dynamodb = boto3.resource('dynamodb')

def get_one(event, context):
    # Extract data from request

    path = event['pathParameters']['username']
    # Decode name in URL (eg. decode %20 to whitespace)
    path = unquote(path)
    # Get table instance connection
    table = dynamodb.Table(table_name)
    # Get all items from table
    response = table.get_item(
        Key={
            'username': path
        }
    )
    # Create response
    body = {
        'data': response['Item']
    }
    return create_response(200, body)
