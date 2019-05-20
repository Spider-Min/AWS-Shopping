import json
import botocore.vendored.requests as requests
import boto3
import collections
url='https://search-item-ukstc6rnkcf25xfuertoqu32fe.us-east-1.es.amazonaws.com/item/_update_by_query?pretty'
nested_dict = lambda: collections.defaultdict(nested_dict)

def lambda_handler(event, context):
    # TODO implement
    
    d = json.loads(event['body'])
    sold =d['mark'] 
    id = d['id']
    mark = d['mark'] 
    # id='1'
    # mark='true'
    

    url1= url+'_id='+id
    print(url1)
    headers = { "Content-Type": "application/json" }
    # query={"sold":"true"}
    query = {'query':{'match':{'id':id}},
             'script':{'inline':"ctx._source.sold ="+mark}
            }
    r = requests.post(url, headers=headers, data=json.dumps(query))
    print(r.json())
    
    
    
    return {
        'headers': {
            "Access-Control-Allow-Origin": '*'
        },
        'statusCode': 200,
        'body': json.dumps('Done')
    }
