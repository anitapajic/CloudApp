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

    body = json.loads(event['body'])

    id = body['id']
    id = unquote(id)
    


    s3 = boto3.client('s3')
    table = dynamodb.Table(table_name)

    objects = s3.list_objects_v2(Bucket = s3_bucket_name, Prefix=id)['Contents']
    

    for obj in objects:
        s3.delete_object(Bucket=s3_bucket_name, Key=obj['Key'])
        table.delete_item(
            Key={
                'id': obj['Key']
            }
        )
    
    # Delete the folder itself
    s3.delete_object(Bucket=s3_bucket_name, Key=id)



    # Create response
    body = {
        'message': f'Successfully deleted {id} from both S3 and DynamoDB'
    }

    return create_response(200, body)
