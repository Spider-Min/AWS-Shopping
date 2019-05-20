
import json
import botocore.vendored.requests as requests
import collections
from boto3 import resource
from boto3.dynamodb.conditions import Key

# The boto3 dynamoDB resource
dynamodb = resource('dynamodb')
url = 'https://search-item-ukstc6rnkcf25xfuertoqu32fe.us-east-1.es.amazonaws.com/item/_search'
nested_dict = lambda: collections.defaultdict(nested_dict)


def query_handle(params):
    
  
    query = nested_dict()
    

    
    query['query']['bool']['must']=[]
    if params['key_word'] is not None:
        a =nested_dict()
        a["query_string"]['query']='*'+params['key_word']+'*'
        a["query_string"]['fields']=["description","title","category","sub_cat","address"]
        query['query']['bool']['must'].append(a)
        
    if params['id'] is not None:
        a={ "match": { "id": params['id'] }}
        query['query']['bool']['must'].append(a)
    
    if params['seller_id'] is not None:
        
        a={ "match": { "seller_id": params['seller_id'] }}
        query['query']['bool']['must'].append(a)
    
    if params['seller_email'] is not None:
        
        a={ "match": { "seller_email": params['seller_email'] }}
        query['query']['bool']['must'].append(a)
    
    if params['sold'] is not None:
        
        a={ "match": { "sold": params['sold'] }}
        query['query']['bool']['must'].append(a)
    else:
        a={ "match": { "sold": False }} 
        query['query']['bool']['must'].append(a)
    
    if params['category'] is not None:
        
        a={ "match": { "category": params['category']}}
        query['query']['bool']['must'].append(a)
    
    if params['price_upper'] is None:
        params['price_upper']=100000
    a={"range":{
         "price":{
            "lte":params['price_upper']
         }}}
    query['query']['bool']['must'].append(a)
    
    if params['price_lower'] is None:
        params['price_lower']=0
    a={"range":{
         "price":{
            "gte":params['price_lower']
         }}}
    query['query']['bool']['must'].append(a)
    
    if params['sort_by'] is None:
        params['sort_by']='date'

    if params['sort_order_asc'] is None:
        params['sort_order_asc']='desc'
    else:
        params['sort_order_asc']='asc'
    
    if params['sort_by']=='distance' and 'coor' in params:
        print('yes')
        a= {        "_geo_distance": {
                    "location": params['coor'],
                    "order":"asc",
                    "unit": "km", 
                    "distance_type": "plane" 
                  }
                }
        query['sort'] = [a]
    else:
        query['sort']=[ { params['sort_by']: {"order":params['sort_order_asc']}}]
    
    
    if params['page'] is not None and params['page_size'] is not None:
        query['from']=params['page']*params['page_size']
        query['size']=params['page_size']
            
    return query
    
def get_params(context,event):
    
    params = {
        'id':None,
        'seller_id':None,
        'category':None,
        'sort_by':None,
        'sort_order_asc':None,
        'key_word':None,
        'price_upper':None,
        'price_lower':None,
        'sold':None,
        'id_only':None,
        'page':None,
        'page_size':100,
        'coor':None,
        'seller_email':None,
    }
    if_chatbot=False
    if 'queryStringParameters' in event:
        print('netnet')
        para = event['queryStringParameters']
        if para is not None:
                for key in para:
                    if key in params:
                        params[key] = para[key]
    elif 'currentIntent' in event:
        
        print('chatchat')
        if_chatbot = True
        para = event['currentIntent']['slots']
        if para is not None:
            for key in para:
                if key in params:
                    params[key] = para[key]
    
    return params,if_chatbot
def lambda_handler(event, context):

    params,if_chatbot = get_params(context,event)
    
    #   page_num=0
    # page_size=5
    # category='Kitchen'
    # sub_cat= None
    # keyword = 'Kitchen'
    # id = '1'
    # seller_id='1234567'
    # sold=False
    # sort_by='price'
    # order='asc'
    # query = {
    #     "size": 25,
    #     "query": {
    #         "multi_match": {
    #             "query": event['queryStringParameters']['q'],
    #             "fields": ["fields.title^4", "fields.plot^2", "fields.actors", "fields.directors"]
    #              }
    #         }
    #  }
    
    # params = {
    #     'id':None,
    #     'seller_id':None,
    #     'category':None,
    #     'sort_by':'price',
    #     'sort_order_asc':'abc', 
    #     'key_word':None,
    #     'price_upper':None,
    #     'price_lower':None,
    #     'sold':None,
    #     'id_only':None,
    #     'page':None,
    #     'page_size':100,
    #     'coor':'40.812715, -73.958113'
    # }
    print(params)
    query = query_handle(params)
    
    headers = { "Content-Type": "application/json" }

    # Make the signed HTTP request
    r = requests.get(url, headers=headers, data=json.dumps(query))
    output = r.json()
    res=[]
    # print(output['hits']['hits'][0]) 
    for item in output['hits']['hits']:
        item['_source']['distance']=item['sort'][0]
        if params['id'] is not None:
            email = item['_source']['seller_email']
            print(email)
            table = dynamodb.Table('user')
            response=table.get_item(
                Key={'email':email}
                )
            detail = response['Item']
            item['_source']['seller_email']=detail['email']
            item['_source']['nickname']=detail['nickname']
            item['_source']['phone']=detail['phone']
            
        res.append(item['_source'])
        
    
    # print(res[0])
    print(len(res))
    
    
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        'body': json.dumps(res)
    }
    
    print(if_chatbot)
    if if_chatbot:
            message = ""
            i = 1
            for item in output['hits']['hits']:
                if i < 4:
                    message += ", " +"https://d2xcb4zq5w9bzj.cloudfront.net/product-details.html?id="+ str(item['_source']['id'])
                    i += 1
                else:
                    break
            # for item in output['hits']['hits']:
            #     if i < 4:
            #         message += ", " + str(item['_source']['id'])
            #         i += 1
            #     else:
            #         break
            response = {
                "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                      "contentType": "PlainText",       
                      "content": message
                    }
                }
            }
    
    # print(response)
    return response
