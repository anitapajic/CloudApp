import os
import boto3
from utility.utils import create_response

def send_sms(event, context):
    try:
        client = boto3.client('ses', region_name='us-east-1')

        response = client.send_email(
            Source='uberapptim19@gmail.com',  # Replace with your verified email address
            Destination={
                'ToAddresses': ['tamara_dzambic@hotmail.com'],  # Replace with the recipient's email address
            },
            Message={
                'Subject': {
                    'Data': 'Notification',
                },
                'Body': {
                    'Text': {
                        'Data': 'Test message',
                    },
                },
            }
        )
        return create_response(200, response)
    except Exception as e:
        return create_response(500, str(e))
