import json
import os
import boto3
import base64
from urllib.parse import unquote
from utility.utils import create_response

# Extract environment variable
table_name = "fileTable"
dynamodb = boto3.resource('dynamodb')
s3_bucket_name = "tim19-bucket"  # Replace with your S3 bucket name

def get_one(event, context):
    # Extract data from request

    path = event['pathParameters']['id']
    # Decode name in URL (eg. decode %20 to whitespace)

    path = unquote(path)

    s3 = boto3.client('s3')
    response = s3.get_object(Bucket=s3_bucket_name, Key=path)

    file_content = response['Body'].read()
    # Encode file as base64
    encoded_file = base64.b64encode(file_content).decode()
    # Get table instance connection
    table = dynamodb.Table(table_name)
    # Get all items from table
    response = table.get_item(
        Key={
            'id': path
        }
    )
    # Create response
    body = {
        'data': response['Item'],
        'file' : encoded_file
    }
    return create_response(200, body)
