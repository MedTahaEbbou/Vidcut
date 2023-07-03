document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var videoFile = document.getElementById('videoFile').files[0];

  if (!videoFile) {
    alert('Please select a video file.');
    return;
  }

  var videoURL = URL.createObjectURL(videoFile);
  splitVideo(videoURL);
});

function splitVideo(videoURL) {
  var videoElement = document.createElement('video');
  videoElement.src = videoURL;
  videoElement.addEventListener('onloadeddata', function() {
    var duration = videoElement.duration;
    var numSegments = Math.ceil(duration / 29);

    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    for (var i = 0; i < numSegments; i++) {
      var segmentStart = i * 29;
      var segmentEnd = Math.min((i + 1) * 29, duration);

      var video = document.createElement('video');
      video.src = createSegmentURL(videoURL, segmentStart, segmentEnd);
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

function createSegmentURL(videoURL, start, end) {
  var startIndex = videoURL.indexOf(':') + 1;
  var endIndex = videoURL.indexOf(';');
  var mimeType = videoURL.substring(startIndex, endIndex);
  var segmentURL = videoURL.replace(mimeType, mimeType + '#t=' + start + ',' + end);
  return segmentURL;
}
