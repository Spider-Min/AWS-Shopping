const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    // print(event.body)
    // print(JSON.parse(event.body))
     let encodedImage =JSON.parse(event.body);
    //  let decodedImage = Buffer.from(encodedImage, 'base64');
    // //  var filePath = "avatars/" + event.queryStringParameters.username + ".jpg"
    //  var params = {
    //   "Body": decodedImage,
    //   "Bucket": "itemphotos",
    //   "Key": "hhhhhhhhh.jpg"
    // };
    // s3.upload(params, function(err, data){
    //   if(err) {
    //       callback(err, null);
    //   } else {
    //       let response = {
    //     "statusCode": 200,
    //     "headers": {
    //         "my_header": "my_value"
    //     },
    //     "body": JSON.stringify(data),
    //     "isBase64Encoded": false
    // };
    //       callback(null, response);
    // }
    // });
    
    let response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify(encodedImage),
        "isBase64Encoded": false
    };
    return response;
};

