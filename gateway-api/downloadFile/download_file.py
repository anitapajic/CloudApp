import json
import os
import boto3
from urllib.parse import unquote

# Extract environment variable
table_name = "fileTable"
dynamodb = boto3.resource('dynamodb')
s3_bucket_name = "tim19-bucket"  # Replace with your S3 bucket name

def download_object(event, context):
    # Extract data from request
    path = event['pathParameters']['id']
    # Decode name in URL (eg. decode %20 to whitespace)
    path = unquote(path)

    # Get S3 service resource
    s3 = boto3.client('s3')

    # Generate presigned URL for the S3 object
    response = s3.get_object(Bucket=s3_bucket_name, Key=path)
    url = s3.generate_presigned_url(response,ExpiresIn=3600)

    # Send presigned URL
    body = {
        'file': response,
        'url': url,
    }
    return create_response(200, body)
