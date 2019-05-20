import json
import boto3

client = boto3.client('s3')

def upload_to_s3(file):
    response = client.put_object(
        Body = file,
        Bucket='itemphotos', 
        Key = file
    )
    return response
    

def lambda_handler(event, context):
    # TODO implement
    # return {
    #     'statusCode': 200,
    #     'body': json.dumps('Hello from Lambda!')
    # }
    params = json.loads(event['body'])   
    print("hhhhhh",params)
    # post_data = event['body-json']   
    
    # return event
    return {
        'headers': {
            "Access-Control-Allow-Origin": '*'
        },
        'statusCode': 200,
        'body': json.dumps(params)      
        
    }
    # upload_to_s3(params['image'])
