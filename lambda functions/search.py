#!/usr/bin/python
import sys
import logging
import psycopg2
import json
import datetime

# def lambda_handler(event, context):
#     # TODO implement
#     return {
#         'statusCode': 200,
#         'body': json.dumps('Hello from Lambda!')
#     }

db_host = 'item.czkdkafoyn34.us-east-1.rds.amazonaws.com'
db_port = 5432
db_name = "postgres"
db_user = "coms6998"
db_pass = "coms6998"
db_table = "items"
if_chatbot = False


def query_maker(params):
    
    
    query_base = "select * from items"
    query_condition = ''
    
    if params['id_only'] is not None and params['id_only']:
        query_base = 'select id from items'
    
    if params['id'] is not None:
        query_condition+=' and id='+str(params['id'])
    
    if params['seller_id'] is not None:
        query_condition+=' and seller_id=\''+ str(params['seller_id']) +'\''
    
    if params['sold'] is not None:
        query_condition+=' and sold='+ str(params['sold'])
    
    if params['price_upper'] is not None:
        query_condition+=' and price<'+ str(params['price_upper'])
        
    if params['price_lower'] is not None:
        query_condition+=' and price>'+ str(params['price_lower'])
    else:
        query_condition+=' and price>'+ str(0)
    
    if params['category'] is not None:
        query_condition+=' and category='+' \''+str(params['category'])+'\''
        
    if params['key_word'] is not None:
        key_match = '\'_%'+params['key_word']+'%\''
        query_condition +=' and ( title like '+key_match+' or sub_cat like '+ key_match + ' or description like '+ key_match +') '

    
    if params['sort_by'] is None:
        query_condition+=' order by create_time'
    else:
        query_condition+=' order by ' + str(params['sort_by'])
    
    if params['sort_order_asc'] is not None:
        if params['sort_order_asc']:
            query_condition+=' asc'
    else:
        query_condition+=' desc'
    
    if params['page_size'] is not None:
        query_condition += ' limit '+str(params['page_size'])
    
    if params['page_size'] is not None and params['page'] is not None:
        query_condition += ' offset '+ str(int(params['page_size'])*int(params['page']))
    
    if query_condition!='':
        query_base += ' where '
    query = query_base + query_condition[4:]
    
    
    print('the query is',query)
    return query 

def make_conn():
    conn = None
    try:
        conn = psycopg2.connect("dbname='%s' user='%s' host='%s' password='%s'" % (db_name, db_user, db_host, db_pass))
    except:
        print("I am unable to connect to the database")
    return conn


def fetch_data(conn, query):
    result = []
    print ("Now executing: %s" % (query))
    cursor = conn.cursor()
    cursor.execute(query)

    raw = cursor.fetchall()
    for line in raw:
        result.append(line)

    return result

def handle_request(event, context):
    ##todo: take inputs from event requests
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
        'page_size':None,
    }
    print('event is ',event['queryStringParameters'])
    if 'queryStringParameters' in event:
        para = event['queryStringParameters']
        if para is not None:
            for key in para:
                if key in params:
                    params[key] = para[key]
    elif 'currentIntent' in event:
        if_chatbot = True
        para = event['currentIntent']['slots']
        if para is not None:
            for key in para:
                if key in params:
                    params[key] = para[key]
    
    
    return params
    
def lambda_handler(event, context):
    
    params = handle_request(event, context)
    
    # params = {
    #     'id':None,
    #     'seller_id':'1234567',
    #     'category':None,
    #     'sort_by':None,
    #     'sort_order_asc':False,
    #     'key_word':None,
    #     'price_upper':3000,
    #     'price_lower':0,
    #     'sold':None,
    #     'id_only':True,
    #     'page':None,
    #     'page_size':None,
    # }
    # params = {
    #     'id':None,
    #     'seller_id':None,
    #     'category':None,
    #     'sort_by':None,
    #     'sort_order_asc':False,
    #     'key_word':'book',
    #     'price_upper':30,
    #     'price_lower':0,
    #     'sold':None,
    #     'id_only':False,
    #     'page':None,
    #     'page_size':None,
    # }
    query_cmd = query_maker(params)
    
    print (query_cmd)

    # get a connection, if a connect cannot be made an exception will be raised here
    conn = make_conn()
    print('connected')

    result = fetch_data(conn, query_cmd)
    conn.close()
    
    
    
    print(len(result))
    # print(result[0][0])
    res = []
    if params['id_only']:
        for row in result:
            print(row[0])
            res.append(row[0])
    else:
        if if_chatbot:
            message = "Here are some suggestions for you:"
            i = 1
            for row in result:
                if i < 4:
                    message += str(i) + "." + row[1]
                    i += 1
                else:
                    break
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
            return response
        else:
            for row in result:
                item={}
                row = list(row)
                #print(row)
                item['id'] = row[0]
                item['title'] = row[1]
                item['price']=float(row[2])
                item['sold'] = row[3]
                item['pic_url'] =row[4]
                item['seller_id'] = row[5]
                item['create_time'] = row[6].strftime('%m/%d/%Y')
                item['category'] = row[7]
                item['sub_cat'] =row[8]
                item['description']=row[9]
                res.append(item)
    return {    "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "statusCode": 200,
                
                'body': json.dumps(res)
            }