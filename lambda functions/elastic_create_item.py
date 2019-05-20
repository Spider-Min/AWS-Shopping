import json
import botocore.vendored.requests as requests
import boto3
import collections
from datetime import datetime
url = 'https://search-item-ukstc6rnkcf25xfuertoqu32fe.us-east-1.es.amazonaws.com/item/'
nested_dict = lambda: collections.defaultdict(nested_dict)

def get_max_id():
    maxurl = url+'_search?size=0'
    query = {
    "aggs" : {
        "max_id" : { "max" : { "field" : "id" } }
            }
        }
        
    headers = { "Content-Type": "application/json" }
    r = requests.post(maxurl, headers=headers, data=json.dumps(query))
    print(r.json())
#     POST /sales/_search?size=0
    return r.json()['aggregations']['max_id']['value']


def lambda_handler(event, context):
    # TODO implement
    max_id=get_max_id()
    
    
    params = json.loads(event['body'])
    
    headers = { "Content-Type": "application/json" }
    # header = {"index": {"_index": "item", "_type": "item_type", "_id": 1}}
    # body ={"id": max_id+1, 
    #     "category": "Other",
    #     "date": datetime.today().strftime('%Y-%m-%d'), 
    #     "description":"An overpriced amazon gift card, all new",
    #     "location": "40.689247,-74.044502", 
    #     "pic_url": "https://s3.amazonaws.com/itemphotos/ab8bdba7-65c6-4ef5-bc3f-d0b2d4d74845.jpeg", 
    #     "price": 999, 
    #     "seller_id": 1234567, 
    #     "sold": False, 
    #     "sub_cat": "Giftcard", 
    #     "title": "$100 Amazon giftcard"
    # }

    body = {"id": max_id+1, 
            "category": params['category'],
            "date": datetime.today().strftime('%Y-%m-%d'), 
            "description": params['description'],
            "location": params['location'], 
            "pic_url": params['pic_url'], 
            "price": params['price'], 
            "seller_id": params['seller_id'], 
            "sold": params['sold'], 
            "sub_cat": params['sub_cat'], 
            "title": params['title']
    }
    # params['id'] = str(max_id+1)
    # params['title'] = '\'' + params['title']+'\''
    # params['pic_url'] = '\'' + params['pic_url']+'\''
    # params['seller_id'] = '\'' + params['seller_id']+'\''
    # params['create_time'] = '\'' + str(time.time())+'\''
    # params['category'] = '\'' + params['category']+'\''
    # params['sub_cat'] = '\'' + params['sub_cat']+'\''
    # params['description'] = '\'' + params['description']+'\''
    # params['price'] = '\'' + params['price']+'\''
    puturl = url+'_doc'
    r = requests.post(puturl, headers=headers, data=json.dumps(body))
    print(r.json())
    return  {
        'headers': {
            "Access-Control-Allow-Origin": '*'
        },
        'statusCode': 200,
        'body': json.dumps('created,id='+str(max_id+1))
    }
