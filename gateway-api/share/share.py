import json
import os
import boto3

from urllib.parse import unquote
from utility.utils import create_response

# Extract environment variable
table_name = "userTable"
dynamodb = boto3.resource('dynamodb')

def share(event, context):
    body = json.loads(event['body'])

    path = body['path']

    username = body['username']

    table = dynamodb.Table(table_name)
    response = table.get_item(
        Key={
            'username': username
        }
    )

    if 'Item' in response:
        user = response['Item']
        userFolders = user['folders']
        userFolders.append(path)

     
    table.put_item(
       Item = user
    )    
    body = {
        'message': f'Successfully shared {path} with {username}'
    }
        
    return create_response(200, body)

