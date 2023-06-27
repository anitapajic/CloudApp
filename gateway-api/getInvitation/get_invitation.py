import json
import os
import boto3
# Import local utility module
from utility.utils import create_response
# Import non standard library
from requests import get

# Extract environment variable
table_name = "inviteTable"
dynamodb = boto3.resource('dynamodb')

def get_one(event, context):
    # Extract data from request
    id = event['pathParameters']['id']
    # Decode name in URL (eg. decode %20 to whitespace)
    # id = unquote(id)

    # Get table instance connection
    table = dynamodb.Table(table_name)
    # Put item into table
    response = table.get_item(
        Key={
            'id': id
        }
    )

    table.delete_item(
        Key={
            'id': id
        }
    )
    # Create response
    body = {
        'data': response['Item']
    }
    return create_response(200, body)
