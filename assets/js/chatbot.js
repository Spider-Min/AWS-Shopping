var outputArea = $("#chat-output");
var i = 1

function chat(code){
    $("#user-input-form").on("submit", function (e) {
        e.preventDefault();
        i += 1
        var message = $("#user-input").val();
        outputArea.append("\n<div class='bot-message'>\n<div class='message'>\n" +
        message + "\n</div>\n</div>\n");
        document.getElementById('chat-output').scrollTop = document.getElementById('chat-output').scrollHeight;

        $("#user-input").val("");

        if (i > 7){
            $(outputArea).children().eq(0).remove();
        }

        console.log("beforAll")

        console.log("beforCredential")
        // AWS.config.credentials.get(function() {
            // Credentials will be available when this function is called.
            // accessKeyId = AWS.config.credentials.accessKeyId;
            // secretAccessKey = AWS.config.credentials.secretAccessKey;
            // sessionToken = AWS.config.credentials.sessionToken;

            // console.log(accessKeyId)
            // console.log(secretAccessKey)
            // console.log(sessionToken)
            
            // apigClient = apigClientFactory.newClient({
            //     // apiKey: 't5WqChnjfA2885rNY2GNa3124E6dM53c1eEPNne0',
            //     region: "us-west-2",
            //     accessKey: accessKeyId,
            //     secretKey: secretAccessKey,
            //     sessionToken: sessionToken
            // });

            let params = {
                "body-json": {
                    "messages": [
                        {
                            "type": "string",
                            "unstructured": {
                                "id": "1",
                                "text": message,
                                "timestamp": "1"
                            }
                        }
                    ]
                }
            };

            $.ajax({
                url: 'https://fnzqb8xw8h.execute-api.us-east-1.amazonaws.com/beta/' ,
                type: 'POST',
                cache: false, //no cache
                crossDomain: true,
                processData: false, 
                headers : {
                    // 'X-Api-Key' : 'A3GinRuZUS8NhyJ5uiqN75WjWEaCUX077WTpQi8B'
                },
                data: JSON.stringify(params),
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    var text = response.body.messages[0].unstructured.text;
                    var msg = "";
                   var reg = /^,(.)*/;
                   if (reg.exec(text) != null){
                        var sentence = text.split(',')
                        console.log(sentence)
                        // No items find
                        if (sentence[1].length == 0){
                            msg = "Do not have such item.";
                            outputArea.append("\n<div class='user-message'>\n<div class='message'>\n" + msg + "\n </div>\n</div>\n");
                        }
                        // Find items and return html link
                        else{
                            for(var cnt = 1; cnt < sentence.length; cnt++){
                                var newSen = sentence[cnt] + "&code=" + code;
                                // outputArea.append("\n<div class='user-message'>\n<div class='message'>\n" + newSen + "\n </div>\n</div>\n");
                                $('#chat-output div').empty();
                                outputArea.append("\n<div class='bot-message'>\n<div class='message'>\n" +
                                "Hi! I'm a bot. What's up?" + "\n</div>\n</div>\n");
                                window.open(newSen);
                                break;
                            }
                        }
                   }
                   // Regular conversation
                   else{
                    outputArea.append("\n<div class='user-message'>\n<div class='message'>\n" + text + "\n </div>\n</div>\n");
                   }
                    
                   

                   i += 1
                    if (i > 7){
                        $(outputArea).children().eq(0).remove();
                    }
                    document.getElementById('chat-output').scrollTop = document.getElementById('chat-output').scrollHeight;
                },
                error: function (data) {
                    alert("Upload error!")
                    console.log(data);
                }
            }) 

            // apigClient.chatPost(null, params)
            //     .then(function (result) {

            //         setTimeout(function () {
            //             console.log("chatbotPost")
            //             console.log(result)
            //             e.preventDefault();
            //             outputArea.append("\n<div class='user-message'>\n<div class='message'>\n" + result.data.body.messages[0].unstructured.text + "\n </div>\n</div>\n");
            //             i += 1
            //             if (i > 7){
            //                 $(outputArea).children().eq(0).remove();
            //             }
            //             // setDate();
            //             // updateScrollbar();
            //         }, 200);
            //     }).catch(function (result) {
            // });
    });
    // });

}
