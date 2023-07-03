document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var videoFile = document.getElementById('videoFile').files[0];
  
  if (!videoFile) {
    alert('رجاء اختر مقطعا لتتم تجزئته.');
    return;
  }
  
  var videoURL = URL.createObjectURL(videoFile);
  splitVideo(videoURL);
});

function splitVideo(videoURL) {
  var videoElement = document.createElement('video');
  videoElement.src = videoURL;
  videoElement.addEventListener('loadedmetadata', function() {
    var duration = videoElement.duration;
    var numSegments = Math.ceil(duration / 29);
    
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    for (var i = 0; i < numSegments; i++) {
      var segmentStart = i * 29;
      var segmentEnd = Math.min((i + 1) * 29, duration);
      
      var video = document.createElement('video');
      video.src = videoURL + '#t=' + segmentStart + ',' + segmentEnd;
      video.controls = true;
      
      var filename = 'vid' + (i + 1) + '.mp4';
      var link = document.createElement('a');
      link.href = video.src;
      link.download = filename;
      link.textContent = filename;
      
      var segmentDiv = document.createElement('div');
      segmentDiv.appendChild(video);
      segmentDiv.appendChild(link);
      
      resultDiv.appendChild(segmentDiv);
    }
  });
}
