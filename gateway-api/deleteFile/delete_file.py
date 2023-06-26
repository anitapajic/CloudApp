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

def delete(event, context):
    # Extract data from request
    path = event['pathParameters']['id']
    # Decode name in URL (eg. decode %20 to whitespace)
    path = unquote(path)

    # Connect to S3 and delete object
    s3 = boto3.client('s3')
    s3.delete_object(Bucket=s3_bucket_name, Key=path)

    # Connect to DynamoDB and delete item
    table = dynamodb.Table(table_name)
    table.delete_item(
        Key={
            'id': path
        }
    )

    # Create response
    body = {
        'message': f'Successfully deleted {path} from both S3 and DynamoDB'
    }

    return create_response(200, body)
