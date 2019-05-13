let poolData = {
    UserPoolId:'us-east-1_sQiH1PZO3',
    ClientId:'5kbhnk2fusff1srn6fkg9jmmvj'
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
console.log(userPool)
var code = ""

function uploadUser(id_token){
    var decoded = jwt_decode(id_token);
    console.log(decoded);
    console.log(decoded['email']);
    var param = {
        "email" : decoded['email'],
        "phone" : decoded['phone_number'],
        "nickname" : decoded['nickname']
    }
    console.log("Param")
    console.log(param)
    sessionStorage.setItem('email', param['email'])
    sessionStorage.setItem('nickname', param['nickname'])
    sessionStorage.setItem('phone', param['phone'])
    console.log("This is the god = param")
    console.log(param)
    $.ajax({
        url:"https://e0ott4jhxk.execute-api.us-east-1.amazonaws.com/beta/user",
        type: 'POST',
        data: JSON.stringify(param),
        contentType: "application/json",
        dataType: "json",
        success:function(response){
            console.log(response)          
        }
    })
}

$(document).ready(function(){
    if(window.location.href.indexOf("id_token") >= 0){
        var urlParams = new URLSearchParams(window.location.href.split("#")[1]);
        id_token = urlParams.get("id_token");
        console.log("11111")
        console.log(id_token)
        getAll();
    }
    else if(window.location.href.indexOf("code") >= 0){
        console.log("22222")
        var urlParams = new URLSearchParams(window.location.search);
        code = urlParams.get("code");
        requestbody = "grant_type=authorization_code&client_id=5kbhnk2fusff1srn6fkg9jmmvj&code=" + code + "&redirect_uri=https://d2xcb4zq5w9bzj.cloudfront.net/";
        if (sessionStorage.getItem('email')==null){
            $.ajax({
                url:"https://fisher.auth.us-east-1.amazoncognito.com/oauth2/token",
                method:"POST",
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: requestbody,
                success:function(data){
                    console.log(data)
                    access_token = data['access_token'];
                    var id_token = data['id_token'];
                    refresh_token = data['refresh_token'];
                    console.log(id_token)
                    // var decoded1 = JSON.parse(atob(id_token.split('.')[1]));
                    
                    // console.log(decoded); 
                    uploadUser(id_token);
                }
            });
        }
         getAll(); 
    }
    else{ // Not signed in
        console.log("33333")
        window.location.href = "https://fisher.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=5kbhnk2fusff1srn6fkg9jmmvj&redirect_uri=https://d2xcb4zq5w9bzj.cloudfront.net/";
    }
});



var cate = "";
var Gposition = ""
// getAll()

function searchKeyword(keyword){
    console.log(keyword)

    $.ajax({
        url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-search?key_word='+keyword,
          // data: ,
        // crossDomain: true,
        success: function (response) {
            console.log(response)
            document.getElementById("productWrapper").innerHTML = "";
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


function getAll() {
    // document.getElementById("post-product-div").innerHTML = "";
    // document.getElementById("profile-div").innerHTML = ""; 
    // document.getElementById("chatbot-div").innerHTML = ""; 
    // $('#post-product-div').append(
    //     '<a href="post-product.html?code='+code+'"><i class="icon ion-ios-cloud-upload"></i></a>'
    // ) 
    // $('#profile-div').append(
    //    ' <a href="user.html?code='+code+'"><i class="icon ion-ios-contact"></i></a>'
    // )
    $('#chatbot-div').append("<a class='button' href='#popup1' onclick='chat(code)'>Chatbot</a>")

    $('#hlink2').attr("href","index.html?code=" + code);
    $('#post-product-div').attr("href","post-product.html?code=" + code);
    $('#profile-div').attr("href","user.html?code=" + code);

    console.log("Get start");
    var na = navigator.geolocation;
    if (na) {
            na.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                };
                
                Gposition = pos['lat'] + ',' + pos['lng'];
                console.log(Gposition);
        })
    }

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
                                '<a href="product-details.html?code=' + code + '&id=' + id + '"><img src=' + pic_url + '></a>' + 
                            '</div>' +
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html?code=' + code + '&id=' + id + '">'+ title +'</a></h3>' + 
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
                                '<a href="product-details.html?code=' + code + '&id=' + id + '"><img src=' + pic_url + '></a>' + 
                            '</div>' +
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html?code=' + code + '&id=' + id + '">'+ title +'</a></h3>' + 
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
    // var na = navigator.geolocation;
    // Get coor of user
    // var Gposition = ""
    // if (na) {
    //     na.getCurrentPosition(function(position) {
    //       var pos = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //         };
            
    //         Gposition = pos['lat'] + ',' + pos['lng'];
    //         console.log(Gposition);
    //     })
    // }

    if(mode == "low"){
        param = "sort_by=price&sort_order_asc=abc";
    }else if(mode == "high"){
        param = "sort_by=price";
    }else if(mode == "distance"){
        if(Gposition != ""){
            param = "sort_by=distance&coor="+Gposition;
        }
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
                var dis = Number(item['distance'])
                if (dis < 0.01){
                    dis = 0.01;
                }
                else{
                    dis = Math.floor(dis * 100) / 100
                }

                $('#productWrapper').append( 
                    '<div class="col-lg-4 col-md-4 col-sm-6">' +
                        '<!-- single-product-wrap start -->' +
                        '<div class="single-product-wrap">' +
                            '<div class="product-image">' +
                                '<a href="product-details.html?code=' + code + '&id=' + id + '"><img src=' + pic_url + '></a>' + 
                            '</div>' +
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html?code=' + code + '&id=' + id + '">'+ title +'</a></h3>' + 
                                '<u>'+ date +'</u>' + 
                                '<div class="price-box">' + 
                                    '<span class="new-price"> $' + price+ ' </span>' + 
                                '</div>' + 
                                '<p>' +'Distance: '+ dis + ' KM'+'</p>' +
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

function getSold(status) {
    // document.getElementById("post-product-div4").innerHTML = "";
    // document.getElementById("profile-div4").innerHTML = ""; 
    // $('#post-product-div4').append(
    //     '<a href="post-product.html?code='+code+'"><i class="icon ion-ios-cloud-upload"></i></a>'
    // ) 
    // $('#profile-div4').append(
    //    ' <a href="user.html?code='+code+'"><i class="icon ion-ios-contact"></i></a>'
    // )
    document.getElementById("username").innerHTML=sessionStorage.getItem('nickname');
    $('#hlink').attr("href","index.html?code=" + code);
    $('#post-product-div4').attr("href","post-product.html?code=" + code);
    $('#profile-div4').attr("href","user.html?code=" + code);
    console.log("Get start");
    document.getElementById("productWrapper").innerHTML = "";
    
    if(status == false){
        document.getElementById("cate").innerHTML = "Selling";
    }else{
        document.getElementById("cate").innerHTML = "Sold";
    }
    console.log("This is the god");
    console.log(sessionStorage.getItem('email'));

    $.ajax({
        // TODO filter the product that the user listed

        url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-search?seller_email='+sessionStorage.getItem('email'),
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
                var mark = "Mark Sold";
                if(!sold){
                    mark = "Mark Unsold";
                }
                if(sold == status){
                    $('#productWrapper').append( 
                    '<div class="col-lg-4 col-md-4 col-sm-6">' +
                        '<!-- single-product-wrap start -->' +
                        '<div class="single-product-wrap">' +
                            '<div class="product-image">' +
                                '<a href="product-details.html?code=' + code + '&id=' + id + '"><img src=' + pic_url + '></a>' + 
                            '</div>' +
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html?code=' + code + '&id=' + id + '">'+ title +'</a></h3>' + 
                                '<div class="price-box">' + 
                                    '<span class="new-price"> $' + price+ ' </span>' + 
                                '</div>' + 
                                '<p style="cursor:pointer;" id="mark_sold" onclick="mark_sold(' + id + ', ' + sold + ')"><u>'+ mark +'</u></p>'+
                            '</div>' + 
                        '</div>' + 
                        '<!-- single-product-wrap end -->' + 
                    '</div>'
                    );  
                }
            }
        },
        error: function (data) {
            console.log(data);
        }
    });

}

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

