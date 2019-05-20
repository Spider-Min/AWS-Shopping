#!/usr/bin/python
import sys
import logging
import psycopg2
import json

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
    
def lambda_handler(event, context):
    ###TODO extract data from request
    d = json.loads(event['body'])

    sold =d['mark']
    id = d['id']
    query_cmd = 'UPDATE items SET sold ='+ str(sold) +' WHERE id='+ str(id)+' returning id;'
    print (query_cmd)

    # get a connection, if a connect cannot be made an exception will be raised here
    conn = make_conn()
    result = fetch_data(conn, query_cmd)
    conn.commit()
    conn.close()

    print(result)

    return {
        'headers': {
            "Access-Control-Allow-Origin": '*'
        },
        'statusCode': 200,
        'body': json.dumps(d),
        
    }