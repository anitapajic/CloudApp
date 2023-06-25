import json
import os
import boto3

from urllib.parse import unquote
from utility.utils import create_response

# Extract environment variable
bucket_name = "tim19-bucket"
s3_client = boto3.client('s3',  region_name='us-east-1')

def get_one(event, context):
    # Extract data from request
    print()
    try:
        path = event['pathParameters']['sufix']
        path = unquote(path)

        index = len(path.split("/"))
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=path)
        
        if 'Contents' in response:

            contents = response['Contents']
            file_paths_set = set()
            
            for content in contents:
                key = content['Key'].split("/")
                
                file_paths_set.add(key[index-1]+ '/' +key[index])
            
            file_paths = list(file_paths_set)            
            body = {
                'files': file_paths
            }
            return create_response(200, body)
        
    except Exception as e:
        return create_response(500, {'error': str(e)})    # Create response

