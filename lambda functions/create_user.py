import json
from boto3 import resource
from boto3.dynamodb.conditions import Key

# The boto3 dynamoDB resource
dynamodb = resource('dynamodb')

def handle_post(event):
    
    item= json.loads(event['body'])
    params={}
    params['email']=item['email']
    params['nickname']=item['nickname']
    params['phone']=item['phone']

    table = dynamodb.Table('user')
    response=table.put_item(
            Item=params
        )
    return 'uploaded user'+params['email']

def handle_get(event):
    para = event['queryStringParameters']
    email = para['email']
    table = dynamodb.Table('user')
    
    response=table.get_item(
            Key={'email':email}
        )
        
    print(response)
    return response['Item']
    
def lambda_handler(event, context):
    
    
    
    if event["httpMethod"]=="GET":
        response = handle_get(event)
    
    elif event["httpMethod"]=="POST":
        response = handle_post(event)
    

        
    # print(response)
    # TODO implement
    res={
        'headers': {
            "Access-Control-Allow-Origin": '*'
        },
        'statusCode': 200,
        'body': json.dumps(response)
    }
    return res
