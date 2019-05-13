var code = "";
var LAT = -34.397 ;
var LNG = 150.644;
$(document).ready(function(){
    if(window.location.href.indexOf("id_token") >= 0){
        var urlParams = new URLSearchParams(window.location.href.split("#")[1]);
        id_token = urlParams.get("id_token");
        console.log("11111");
        console.log(id_token);
        getPage();
    }
    else if(window.location.href.indexOf("code") >= 0){
        console.log("22222")
        var urlParams = new URLSearchParams(window.location.search);
        code = urlParams.get("code");
        getPage();
        requestbody = "grant_type=authorization_code&client_id=5kbhnk2fusff1srn6fkg9jmmvj&code=" + code + "&redirect_uri=https://d2xcb4zq5w9bzj.cloudfront.net/";
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
                var decoded = jwt_decode(id_token);
                email = decoded['email'];
                console.log(decoded);  
            }
        });

    }
    else{ // Not signed in
        console.log("33333")
        window.location.href = "https://fisher.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=5kbhnk2fusff1srn6fkg9jmmvj&redirect_uri=https://d2xcb4zq5w9bzj.cloudfront.net/";
    }
});



const uploadicon = $("#upload-btn");
const submitBtn = $("#submitBtn");
var isUpload = false;
var Gposition = "test";

submitBtn.on("click", (e) => {
    postItem();
})

uploadicon.on("click", (e) => {
    uploadImage();
})

// $("#submitBtn").on("change", function(){
//     if($(this).val() != "" && $("textarea").val() != "" && $("input[name='category']").is(":checked") == true){
//         $("input[type='submit']").removeAttr("disabled");
//     } else {
//         $("input[type='submit']").attr("disabled", "disabled");
//     }
// });


function getPage(){
    // document.getElementById("post-product-div2").innerHTML = "";
    // document.getElementById("profile-div2").innerHTML = ""; 
    // $('#post-product-div2').append(
    //     '<a href="post-product.html?code='+code+'"><i class="icon ion-ios-cloud-upload"></i></a>'
    // ) 
    // $('#profile-div2').append(
    //    ' <a href="user.html?code='+code+'"><i class="icon ion-ios-contact"></i></a>'
    // )
    $('#hlink4').attr("href","index.html?code=" + code);
    $('#post-product-div2').attr("href","post-product.html?code=" + code);
    $('#profile-div2').attr("href","user.html?code=" + code);
}

function imgPreview(fileDom) {
    //check if support FileReader
    if(window.FileReader) {
        var reader = new FileReader();
    } else {
        alert("Your device does not support image preview, please upgrade！");
    }
    //get file
    var file = fileDom.files[0];
    var imageType = /^image\//;
    //check if is image
    if(!imageType.test(file.type)) {
        alert("Please select an image！");
        return;
    }
    //finish reading
    reader.onload = function(e) {
        //get image dom
        var img = document.getElementById("preview");
        //set source to the loaded image
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    // $("#search-btn").show();
    // $("#upload-btn").disabled = false;
}

// Get the latitude and longitude and translate to readable address 
// getAddress()
function getAddress() {
    console.log("Start get address")
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };
            console.log(pos);
            position = pos;
            Gposition = position['lat'] + ',' + position['lng'];
            LAT = position['lat'];
            LNG = position['lng'];
            // To get real address of user
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+position['lat']+','+position['lng']+'&key=AIzaSyDUpZI_rtzDZ8TYqOEJEezVrWo9QoG1ozM&language=en'
    ,
                  // data: ,
                // crossDomain: true,
                success: function (response) {
                    address = response['results'][0]['formatted_address']
                    console.log(address)
                    $('#address').val(address)
                    initMap(position['lat'], position['lng'])

                
                },
                error: function (data) {
                    alert("Please wait for some time!")
                    console.log(data);
                }
              // dataType: 
            });
            // End Ajax
        })
    }
}


// Function upload an image to S3
function uploadImage() {
    if($('#img_input2').val() != ""){
        return new Promise((resolve) => {
            console.log("enter");
            var formData = new FormData(); 
            var file = $('#img_input2')[0].files[0];
            formData.append('file', file);
            
            console.log(file);
            $.ajax({
                url: 'https://jcdr9yli24.execute-api.us-east-1.amazonaws.com/alpha/itemphotos/'+ file['name'] ,
                type: 'PUT',
                cache: false, //no cache
                data: file,
                crossDomain: true,
                processData: false, 
                // headers : {
                //     // 'X-Api-Key' : 'A3GinRuZUS8NhyJ5uiqN75WjWEaCUX077WTpQi8B'
                // },
                contentType: file['type'],
                success: function (response) {
                    console.log(response);
                },
                error: function (data) {
                    alert("Upload success!");
                    isUpload = true;
                    console.log(data);
                }
            })  
            resolve();
        });
    }

}


// Function upload an image to S3
function postItem() {
    console.log(isUpload)
    if($("#title").val()!="" && $("#price").val()!="" && $("#address").val()!="" && $("category").val() != "" && $("product_name").val()!="" && $("description").val() != "" && isUpload==true){
        return new Promise((resolve) => {
            var price =  $("#price").val();
            if(0 < Number(price)){
                var category = $("#category").val();
                var  title = $("#title").val();
                var address = $("#address").val();
                var product_name = $("#product_name").val();
                var description = $("#description").val();
                var file = $('#img_input2')[0].files[0];
                var file_url = "https://s3.amazonaws.com/itemphotos/" + file["name"];
                var info = {
                    "seller_email" : sessionStorage.getItem('email'),
                    "title" : title,
                    "price" : price,
                    "address" : address,
                    "location" : Gposition,
                    "sub_cat" : product_name,
                    "description": description,
                    "pic_url" : file_url,
                    "category" : category,
                }


                $.ajax({
                    url: 'https://tofr8vq8y5.execute-api.us-east-1.amazonaws.com/beta/es-create' ,
                    type: 'POST',
                    cache: false, //no cache
                    crossDomain: true,
                    processData: false, 
                    headers : {
                        // 'X-Api-Key' : 'A3GinRuZUS8NhyJ5uiqN75WjWEaCUX077WTpQi8B'
                    },
                    data: JSON.stringify(info),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                        window.location.href="index.html?code=" + code;
                    },
                    error: function (data) {
                        alert("Upload error!")
                        console.log(data);
                    }
                })   
            }
            else{
                alert("Price must is positive");
            }

            // resolve();
        });
    }
    else{
        console.log("Please fill all blanks")
    }

}

var map;
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: LAT, lng: LNG},
  zoom: 15
});
}