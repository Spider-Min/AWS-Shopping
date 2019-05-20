#!/usr/bin/python
import sys
import logging
import psycopg2
import json
import time

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

def get_params(event,context):
    #### TODO: get params from event and context
    params = json.loads(event['body'])
    return params
    
def query_maker(event, context, max_id):
    ##make a query from given params
    
    params = get_params(event, context)
    params['id'] = str(max_id+1)
    params['title'] = '\'' + params['title']+'\''
    params['pic_url'] = '\'' + params['pic_url']+'\''
    params['seller_id'] = '\'' + params['seller_id']+'\''
    # params['create_time'] = '\'' + str(time.time())+'\''
    params['create_time'] = '\'' +"2019-03-03"+'\''
    params['category'] = '\'' + params['category']+'\''
    params['sub_cat'] = '\'' + params['sub_cat']+'\''
    params['description'] = '\'' + params['description']+'\''
    params['price'] = '\'' + params['price']+'\''
    
    # params={
    #     'id':max_id+1,
    #     'title':'\'Amazon credit $100\'',
    #     'price':1000,
    #     'sold':False,
    #     'pic_url':'\'https://s3.amazonaws.com/itemphotos/ab8bdba7-65c6-4ef5-bc3f-d0b2d4d74845.jpeg\'',
    #     'seller_id':'\'1234567\'',
    #     'create_time':'\'2019-03-31 17:27:20.880986\'',
    #     'category':'\'Other\'',
    #     'sub_cat':'\'Giftcard\'',
    #     'description':'\'A gift card (also known as gift certificate in North America, or gift voucher or gift token in the UK[1]) is a prepaid stored-value money card usually issued by a retailer or bank to be used as an alternative to cash for purchases within a particular store or related businesses. Gift cards are also given out by retailers and marketers as part of a promotion strategy, to entice the recipient to come in or return to the store, and at times such cards are called cash cards. Gift cards are generally redeemable only for purchases at the relevant retail premises and cannot be cashed out, and in some situations may be subject to an expiry date or fees. Visa and MasterCard credit cards produce generic gift cards which need not be redeemed at particular stores, and which are widely used for cashback marketing strategies. A feature of these cards is that they are generally anonymous and are disposed of when the stored value on a card is exhausted.From the purchasers point of view, a gift card is a gift, given in place of an object which the recipient may not need, when the giving of cash as a present may be regarded as socially inappropriate. In the United States, gift cards are highly popular, ranking in 2006 as the second-most given gift by consumers and the most-wanted gift by women, and the third-most wanted by males.[citation needed] Gift cards have become increasingly popular as they relieve the donor of selecting a specific gift.[2] In 2012, nearly 50% of all US consumers claimed to have purchased a gift card as a present during the holiday season.[3] In Canada, $1.8 billion was spent on gift cards, and in the UK it is estimated to have reached £3 billion in 2009,[needs update] whereas in the United States about US$80 billion was paid for gift cards in 2006.[4][5] The recipient of a gift card can use it at their discretion within the restrictions set by the issue, for example as to validity period and businesses that accept a particular card.\''
    # }
    
    
# booktown=# INSERT INTO books (subject_id, author_id, id, title)
# booktown-#        VALUES (4, 7805, 41473, 'Programming Python') RETURNING did;;
# INSERT 3574041 1
   
    query1 ='INSERT INTO items ('
    query2 = 'VALUES ('
    for key in params.keys():
        query1+= key+','
        query2+= str(params[key])+','
    query1 = query1[:-1] + ') '
    query2 = query2[:-1]+') '
    query = query1 + query2 + ' returning id'
    #query=query1 + query2
    
    return query
def lambda_handler(event, context):

    # get a connection, if a connect cannot be made an exception will be raised here
    get_max ='select max(id) from items'
    conn = make_conn()
    result = fetch_data(conn, get_max)
    max_id = list(result[0])[0]
    conn.close()

    conn2 = make_conn()
    
    query  = query_maker(event, context,max_id)
    print (query)
    
    result = fetch_data(conn2, query)
    
    conn2.commit()
    conn2.close()
    
    print('result is',result)
    return {
        'headers': {
            "Access-Control-Allow-Origin": '*'
        },
        'statusCode': 200,
        'body': json.dumps(result)
    }