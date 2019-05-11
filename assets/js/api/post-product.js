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
    $("#search-btn").show();
}

// Get the latitude and longitude and translate to readable address 
getAddress()
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
            console.log("clicked")
            var category = $("#category").val();
            var  title = $("#title").val();
            var price =  $("#price").val();
            var address = $("#address").val();
            var product_name = $("#product_name").val();
            var description = $("#description").val();
            var file = $('#img_input2')[0].files[0];
            var file_url = "https://s3.amazonaws.com/itemphotos/" + file["name"];
            var info = {
                "seller_id" : "11111",
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
                data: info,
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
                },
                error: function (data) {
                    alert("Upload error!")
                    console.log(data);
                }
            })  
            // resolve();
        });
    }
    else{
        console.log("Please fill all blanks")
    }

}