getSold(false)

function getSold(status) {
    console.log("Get start");
    document.getElementById("productWrapper").innerHTML = "";
    
    if(status == false){
        document.getElementById("cate").innerHTML = "Selling";
    }else{
        document.getElementById("cate").innerHTML = "Sold";
    }

    $.ajax({
        // TODO filter the product that the user listed
        url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-search',
          // data: ,
        // crossDomain: true,
        success: function (response) {
            console.log(response)
            for(i = 0; i < response.length; i++){
                item = response[i]
                
                var id = item['id']
                var title = item['title']
                var price = item['price']
                var pic_url = item['pic_url']
                var sold = item['sold']

                if(sold == status){
                    $('#productWrapper').append( 
                    '<div class="col-lg-4 col-md-4 col-sm-6">' +
                        '<!-- single-product-wrap start -->' +
                        '<div class="single-product-wrap">' +
                            '<div class="product-image">' +
                                '<a href="product-details.html?id=' + id + '"><img src=' + pic_url + '></a>' + 
                            '</div>' +
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html">'+ title +'</a></h3>' + 
                                '<div class="price-box">' + 
                                    '<span class="new-price"> $' + price+ ' </span>' + 
                                '</div>' + 
                                '<p style="cursor:pointer;" id="mark_sold" onclick="mark_sold(' + id + ', ' + sold + ')"><u>Mark Sold</u></p>'+
                            '</div>' + 
                        '</div>' + 
                        '<!-- single-product-wrap end -->' + 
                    '</div>'
                    );  
                }
            }
        },
        error: function (data) {
            alert("Please wait for some time!")
            console.log(data);
        }
    });

}

// function getSold(){
//     console.log(category)
//     var resultlabel = document.getElementById("productWrapper");
//     resultlabel.innerHTML = "";

//     $.ajax({
//         // TODO filter the product that the user listed
//         url: 'https://48s8ko4xrd.execute-api.us-east-1.amazonaws.com/test',
//         success: function (response) {
//             for(i = 0; i < response.length; i++){
//                 item = response[i]

//                 var id = item['id']
//                 var title = item['title']
//                 var price = item['price']
//                 var pic_url = item['pic_url']
//                 var sold = item['sold']

//                 if(sold == "true"){
//                     $('#productWrapper').append( 
//                         '<div class="col-lg-4 col-md-4 col-sm-6">' +
//                             '<!-- single-product-wrap start -->' +
//                             '<div class="single-product-wrap">' +
//                                 '<div class="product-image">' +
//                                     '<a href="product-details.html?id=' + id + '"><img src=' + pic_url + '></a>' + 
//                                 '</div>' +
//                                 '<div class="product-content">' + 
//                                     '<h3><a href="product-details.html">'+ title +'</a></h3>' + 
//                                     '<div class="price-box">' + 
//                                         '<span class="new-price"> $' + price+ ' </span>' + 
//                                     '</div>' + 
//                                 '</div>' + 
//                             '</div>' + 
//                             '<!-- single-product-wrap end -->' + 
//                         '</div>'
//                     );
//                 }
//             }
//         },
//         error: function (data) {
//             alert("Please wait for some time!")
//             console.log(data);
//         }

//     });
// }

function mark_sold(id, status) {
    console.log(id);
    console.log(status);
    var bool_status = status;

    if (status == true){
        status = "false";
    }else{
        status = "true";
    }

    param={
        "id" : id.toString(),
        "mark" : status
    }
    $.ajax({
        url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-marksold',
        type: 'POST',
        data: JSON.stringify(param),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            console.log(response);
            setTimeout(function(){
                //put your code in here to be delayed by 2 seconds
                getSold(bool_status);
            },1000);
            
        },
        error: function (data) {
            alert("Please wait for some time!")
            console.log(data);
        }

    });
}