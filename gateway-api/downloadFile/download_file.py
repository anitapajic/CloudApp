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
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': s3_bucket_name, 'Key': path},
        ExpiresIn=3600  # The URL will be valid for 1 hour
    )

    # Send presigned URL
    body = {
        'message': 'Generated presigned URL for object {} from bucket {}'.format(path, s3_bucket_name),
        'url': url,
    }
    return {
        'statusCode': 200,
        'body': json.dumps(body)
    }
