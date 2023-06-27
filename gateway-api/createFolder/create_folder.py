import json
import os
import boto3
import base64
# Import local utility module
from utility.utils import create_response
# Import non standard library
from requests import get

# Extract environment variable
dynamodb = boto3.resource('dynamodb')
s3_bucket_name = "tim19-bucket"  # Replace with your S3 bucket name

def create(event, context):
    # Extract data from request

    body = json.loads(event['body'])

    key = Key=body['id'] + '/'
    s3 = boto3.client('s3')


    s3.put_object(Body="",Bucket=s3_bucket_name, Key=key)

    # Create response
    body = {
        'message': 'Successfully uploaded file'
    }
    return create_response(200, body)
