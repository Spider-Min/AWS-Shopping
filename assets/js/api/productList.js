// //webkitURL is deprecated but nevertheless
// URL = window.URL || window.webkitURL;

// var gumStream;                      //stream from getUserMedia()
// var rec;                            //Recorder.js object
// var input;                          //MediaStreamAudioSourceNode we'll be recording

// // shim for AudioContext when it's not avb. 
// var AudioContext = window.AudioContext || window.webkitAudioContext;
// var audioContext //audio context to help us record
// var filename = "test";

// var recordButton = document.getElementById("recordButton");
// var stopButton = document.getElementById("stopButton");
// var pauseButton = document.getElementById("pauseButton");
// var getButton = document.getElementById("getTextButton");


// //add events to those 2 buttons
// recordButton.addEventListener("click", startRecording);
// stopButton.addEventListener("click", stopRecording);
// pauseButton.addEventListener("click", pauseRecording);
// getButton.addEventListener("click", getText);

get()

function get() {
    console.log("Get start");
    $.ajax({
        url: 'https://48s8ko4xrd.execute-api.us-east-1.amazonaws.com/test',
          // data: ,
        // crossDomain: true,
        success: function (response) {
            for(i = 0; i < response.length; i++){
                item = response[i]
                console.log(item);
                var id = item['id']
                var title = item['title']
                var price = item['price']
                var pic_url = item['pic_url']
                $('#productWrapper').append( 
                    '<div class="col-lg-12" id="product">' + 
                        '<!-- single-product-wrap start -->' + 
                        '<div class="single-product-wrap">' + 
                            '<div class="product-image">' + 
                                '<a href="product-details.html"><img src=' + pic_url + '></a>' + 
                            '</div>' + 
                            '<div class="product-content">' + 
                                '<h3><a href="product-details.html">'+ title +'</a></h3>' + 
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

// function startRecording() {
//     console.log("recordButton clicked");

//     /*
//         Simple constraints object, for more advanced audio features see
//         https://addpipe.com/blog/audio-constraints-getusermedia/
//     */
    
//     var constraints = { audio: true, video:false }

//     /*
//         Disable the record button until we get a success or fail from getUserMedia() 
//     */

//     recordButton.disabled = true;
//     stopButton.disabled = false;
//     pauseButton.disabled = false

//     /*
//         We're using the standard promise based getUserMedia() 
//         https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
//     */

//     navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
//         console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

//         /*
//             create an audio context after getUserMedia is called
//             sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
//             the sampleRate defaults to the one set in your OS for your playback device

//         */
//         audioContext = new AudioContext();

//         //update the format 
//         document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

//         /*  assign to gumStream for later use  */
//         gumStream = stream;
        
//         /* use the stream */
//         input = audioContext.createMediaStreamSource(stream);

//         /* 
//             Create the Recorder object and configure to record mono sound (1 channel)
//             Recording 2 channels  will double the file size
//         */
//         rec = new Recorder(input,{numChannels:1})

//         //start the recording process
//         rec.record()

//         console.log("Recording started");

//     }).catch(function(err) {
//         //enable the record button if getUserMedia() fails
//         recordButton.disabled = false;
//         stopButton.disabled = true;
//         pauseButton.disabled = true
//     });
// }

// function pauseRecording(){
//     console.log("pauseButton clicked rec.recording=",rec.recording );
//     if (rec.recording){
//         //pause
//         rec.stop();
//         pauseButton.innerHTML="Resume";
//     }else{
//         //resume
//         rec.record()
//         pauseButton.innerHTML="Pause";

//     }
// }

// function stopRecording() {
//     console.log("stopButton clicked");

//     //disable the stop button, enable the record too allow for new recordings
//     stopButton.disabled = true;
//     recordButton.disabled = false;
//     pauseButton.disabled = true;

//     //reset button just in case the recording is stopped while paused
//     pauseButton.innerHTML="Pause";
    
//     //tell the recorder to stop the recording
//     rec.stop();

//     //stop microphone access
//     gumStream.getAudioTracks()[0].stop();

//     //create the wav blob and pass it on to createDownloadLink
//     rec.exportWAV(createDownloadLink);
// }

// // Function that gets 10 images(prototype number) from API.
// function uploadAudio(audioFile, filename) {

//         // console.log("enter");
//         // var formData = new FormData(); 
//         // formData.append('file', $('#img_input2')[0].files[0]);
//         // var file = $('#img_input2')[0].files[0];
//         console.log(audioFile);

//         $.ajax({
//             url: 'https://flcweck6ec.execute-api.us-east-1.amazonaws.com/alpha/photos/voiceinputass3/'+ filename + ".wav" ,
//             type: 'PUT',
//             cache: false, //no cache
//             data: audioFile,
//             crossDomain: true,
//             processData: false, 
//             headers : {
//                 'X-Api-Key' : 'A3GinRuZUS8NhyJ5uiqN75WjWEaCUX077WTpQi8B'
//             },
//             contentType: "audio/wav",
//             success: function (response) {
//                 console.log(response);
//             },
//             error: function (data) {
//                 alert("Upload success!")
//                 console.log(data);
//             }
//         })  
// }

// function createDownloadLink(blob) {
    
//     var url = URL.createObjectURL(blob);
//     var au = document.createElement('audio');
//     var li = document.createElement('li');
//     var link = document.createElement('a');

//     //name of .wav file to use during upload and download (without extendion)
//     filename = $.now().toString();

//     //add controls to the <audio> element
//     au.controls = true;
//     au.src = url;

//     uploadAudio(blob, filename)



//     //save to disk link
//     link.href = url;
//     link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
//     link.innerHTML = "Save to disk";



//     // add the new audio element to li
//     // li.appendChild(au);
    
//     // //add the filename to the li
//     // li.appendChild(document.createTextNode(filename+".wav "))

//     // //add the save to disk link to li
//     // li.appendChild(link);
    
//     //upload link
//     var upload = document.createElement('a');
//     upload.href="#";
//     upload.innerHTML = "Upload";
//     upload.addEventListener("click", function(event){
//           var xhr=new XMLHttpRequest();
//           xhr.onload=function(e) {
//               if(this.readyState === 4) {
//                   console.log("Server returned: ",e.target.responseText);
//               }
//           };
//           var fd=new FormData();
//           fd.append("audio_data",blob, filename);
//           xhr.open("POST","upload.php",true);
//           xhr.send(fd);
//     })
//     // li.appendChild(document.createTextNode (" "))//add a space in between
//     // li.appendChild(upload)//add the upload link to li

//     //add the li element to the ol
//     // recordingsList.appendChild(li);
//     console.log("url is")
//     console.log(link.download)
// }