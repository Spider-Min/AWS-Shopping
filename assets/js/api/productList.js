var cate = "";

getAll()

function getAll() {
    console.log("Get start");
    $.ajax({
        url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-search',
          // data: ,
        // crossDomain: true,
        success: function (response) {
            console.log(response)
            for(i = 0; i < response.length; i++){
                item = response[i]
                console.log(item);
                var id = item['id']
                var title = item['title']
                var price = item['price']
                var pic_url = item['pic_url']
                var date = item['date']
                $('#productWrapper').append( 
                    '<div class="col-lg-4 col-md-4 col-sm-6">' +
                        '<!-- single-product-wrap start -->' +
                        '<div class="single-product-wrap">' +
                            '<div class="product-image">' +
                                '<a href="product-details.html?id=' + id + '"><img src=' + pic_url + '></a>' + 
                            '</div>' +
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html">'+ title +'</a></h3>' + 
                                '<u>'+ date +'</u>' + 
                                '<div class="price-box">' + 
                                    '<span class="new-price"> $' + price+ ' </span>' + 
                                '</div>' + 
                            '</div>' + 
                        '</div>' + 
                        '<!-- single-product-wrap end -->' + 
                    '</div>'
                );    
            }
            
        
        },
        error: function (data) {
            alert("Please wait for some time!")
            console.log(data);
        }
      // dataType: 
    });

}

function getCat(category){
    console.log(category)
    cate = category
    document.getElementById("productWrapper").innerHTML = "";

    if(category != "All"){
        $.ajax({
        url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-search?category='+category,
        success: function (response) {
            for(i = 0; i < response.length; i++){
                item = response[i]
                console.log(item);
                var id = item['id']
                var title = item['title']
                var price = item['price']
                var pic_url = item['pic_url']
                var date = item['date']
                $('#productWrapper').append( 
                    '<div class="col-lg-4 col-md-4 col-sm-6">' +
                        '<!-- single-product-wrap start -->' +
                        '<div class="single-product-wrap">' +
                            '<div class="product-image">' +
                                '<a href="product-details.html?id=' + id + '"><img src=' + pic_url + '></a>' + 
                            '</div>' +
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html">'+ title +'</a></h3>' + 
                                '<u>'+ date +'</u>' + 
                                '<div class="price-box">' + 
                                    '<span class="new-price"> $' + price+ ' </span>' + 
                                '</div>' + 
                            '</div>' + 
                        '</div>' + 
                        '<!-- single-product-wrap end -->' + 
                    '</div>'
                );    
            }
            
        },
        error: function (data) {
            alert("Please wait for some time!")
            console.log(data);
        }

    });
    }else{
        getAll();
    }
}

function sortby(mode){
    console.log(mode);
    document.getElementById("productWrapper").innerHTML = "";
    var param = "";

    if(mode == "low"){
        param = "sort_by=price&sort_order_asc=abc";
    }else if(mode == "high"){
        param = "sort_by=price";
    }else{
        param = "sort_by=" + mode;
    }

    if(cate == "" || cate == "All"){
        //pass
    }else{
        param += "&category=" + cate;
    }

    console.log(param);
    $.ajax({
        url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-search?'+param,
        success: function (response) {
            for(i = 0; i < response.length; i++){
                item = response[i]
                console.log(item);
                var id = item['id']
                var title = item['title']
                var price = item['price']
                var pic_url = item['pic_url']
                var date = item['date']
                $('#productWrapper').append( 
                    '<div class="col-lg-4 col-md-4 col-sm-6">' +
                        '<!-- single-product-wrap start -->' +
                        '<div class="single-product-wrap">' +
                            '<div class="product-image">' +
                                '<a href="product-details.html?id=' + id + '"><img src=' + pic_url + '></a>' + 
                            '</div>' +
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html">'+ title +'</a></h3>' + 
                                '<u>'+ date +'</u>' + 
                                '<div class="price-box">' + 
                                    '<span class="new-price"> $' + price+ ' </span>' + 
                                '</div>' + 
                            '</div>' + 
                        '</div>' + 
                        '<!-- single-product-wrap end -->' + 
                    '</div>'
                );    
            }
            
        },
        error: function (data) {
            alert("Please wait for some time!")
            console.log(data);
        }

    });
}