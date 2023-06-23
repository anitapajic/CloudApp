import json
import os
import boto3

from utility.utils import create_response

# Extract environment variable
table_name = "userTable"
dynamodb = boto3.resource('dynamodb')

def get_all(event, context):
    # Get table instance connection
    table = dynamodb.Table(table_name)
    # Get all items from table
    response = table.scan()
    # Create response
    body = {
        'data': response['Items']
    }
    return create_response(200, body)
