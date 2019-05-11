function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}

get()

function get() {
	var id = urlParam("id");
    console.log("Get start");
    $.ajax({
        url: 'https://48s8ko4xrd.execute-api.us-east-1.amazonaws.com/test?id=' + id,
        success: function (response) {
		    item = response[0]
	        console.log(item);
	        var title = item['title']
	        var price = item['price']
	        var pic_url = item['pic_url']
	        var description = item['description']
	        var sub_cat = item['sub_cat']
	        var category = item['category']
	        var create_time = item['create_time']

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
