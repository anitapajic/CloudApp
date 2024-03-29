import json
import os
import boto3
import base64
# Import local utility module
from utility.utils import create_response
# Import non standard library
from requests import get

# Extract environment variable
table_name = "fileTable"
dynamodb = boto3.resource('dynamodb')
s3_bucket_name = "tim19-bucket"  # Replace with your S3 bucket name

def create(event, context):
    # Extract data from request
    body = json.loads(event['body'])

    file_data = base64.b64decode(body['file'])
    key = Key=body['id']


    s3 = boto3.client('s3')


    s3.put_object(Body=file_data, Bucket=s3_bucket_name, Key=key)

    # Get table instance connection
    table = dynamodb.Table(table_name)
    # Put item into table
    response = table.put_item(
        Item={
            'id': body['id'],
            'name': body['name'],
            'type': body['type'],
            'size': body['size'],
            'description': body['description'],
            'date_uploaded': body['date_uploaded'],
            'date_modified': body['date_modified'],
            'tags': body['tags'],
            'username': body['username'],
            'favourite': body['favourite'],
        }
    )
    # Create response
    body = {
        'message': 'Successfully uploaded file'
    }
    return create_response(200, body)
