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

var position = {};

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        };
        console.log(pos);
        position = pos;
    })
}

console.log(position);