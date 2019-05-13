var code = "";
var seller_info = []


$(document).ready(function(){
    if(window.location.href.indexOf("id_token") >= 0){
        var urlParams = new URLSearchParams(window.location.href.split("#")[1]);
        id_token = urlParams.get("id_token");
        console.log("11111");
        console.log(id_token);
        get()
    }
    else if(window.location.href.indexOf("code") >= 0){
        console.log("22222")
        var urlParams = new URLSearchParams(window.location.search);
        code = urlParams.get("code");
        get();
    }
    else{ // Not signed in
        console.log("33333")
        window.location.href = "https://fisher.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=5kbhnk2fusff1srn6fkg9jmmvj&redirect_uri=https://d2xcb4zq5w9bzj.cloudfront.net/";
    }
});

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}


function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}

// get()

function get() {
	var id = urlParam("id");
    console.log("Get start");
    // document.getElementById("post-product-div3").innerHTML = "";
    // document.getElementById("profile-div3").innerHTML = ""; 
    // $('#post-product-div3').append(
    //     '<a href="post-product.html?code='+code+'"><i class="icon ion-ios-cloud-upload"></i></a>'
    // ) 
    // $('#profile-div3').append(
    //    ' <a href="user.html?code='+code+'"><i class="icon ion-ios-contact"></i></a>'
    // )

    $('#hlink3').attr("href","index.html?code=" + code);
    $('#post-product-div3').attr("href","post-product.html?code=" + code);
    $('#profile-div3').attr("href","user.html?code=" + code);

    $.ajax({
        url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-search?id=' + id,
        success: function (response) {
		    item = response[0]
	        console.log(item);
	        var title = item['title']
	        var price = item['price']
	        var pic_url = item['pic_url']
	        var description = item['description']
	        var sub_cat = item['sub_cat']
	        var category = item['category']
	        var create_time = item['date']
            seller_info = {
                "seller_email" : item['seller_email'],
                "phone" : item['phone'],
                "nickname" : item['nickname']
            }
			document.getElementById("product_title").innerHTML = title;
			document.getElementById("product_description").innerHTML = description;
			document.getElementById("product_price").innerHTML = "$" + price;
            document.getElementById("pic_url").src = pic_url; 
            document.getElementById("create_time").innerHTML = "Posted On: " + create_time;
            document.getElementById("cate").innerHTML = category + " > " + sub_cat;
			
        },
        error: function (data) {
            alert("Please wait for some time!")
            console.log(data);
        }
    });

}

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}

function contactSeller(){
    var msg = "Nickname:"+seller_info['nickname']+"\n"+ "Phone:"+seller_info['phone']+"\n"+"Email:"+seller_info['seller_email']+"\n"   
            alert(msg);
            

    // $.ajax({
    //     url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-search?id='+id,
    //     success: function (response) {
    //         console.log(response)
    //         var msg = "Nickname:"+response[0]['nickname']+"\n"+ "Phone:"+response[0]['phone']+"\n"+"Email:"+response[0]['seller_email']+"\n"   
    //         alert(msg);
            
        
    //     },
    //     error: function (data) {
    //         alert("Please wait for some time!")
    //         console.log(data);
    //     }
    //   // dataType: 
    // });

}
