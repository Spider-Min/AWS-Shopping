const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
let dataStore;

exports.handler = async (event) => {
   dataStore = event['body-json'];
    console.log(dataStore)
    console.log(dataStore.messages)
    console.log(dataStore.messages[0].unstructured)
    console.log(dataStore.messages[0].unstructured.text)
        var lexruntime = new AWS.LexRuntime();
        var params = {
          botAlias: '$LATEST', /* required, has to be '$LATEST' */
          botName: 'recommendbot', /* required, the name of you bot */
          inputText: dataStore.messages[0].unstructured.text, /* required, your text */
        //   inputText: dataStore,
          userId: 'arbitraryid', /* required, arbitrary identifier */
          requestAttributes: {},
          sessionAttributes: {}
        };
        
    //     return inputText;
        
        return lexruntime.postText(params).promise()
        .then((result) =>{
            console.log(result)
            const msgbody = {
                "messages": [
                    {
                        "type" : "string",
                        "unstructured" : {
                            "id" : "1",
                            "text" : result.message,
                            "timestamp" : "1"
                        }
                        
                    }
                ]
            }
            const response = {
                headers: {
                    "Access-Control-Allow-Origin" : "*"
                },
                statusCode: 200,
                body: msgbody
            };
            return response;
        })
        .catch((err) =>{
            console.log(err);
        })
};