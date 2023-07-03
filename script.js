// Import FFmpeg.js library
importScripts('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg/dist/ffmpeg.min.js');

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

async function splitVideo(videoURL) {
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });

  await ffmpeg.load();

  const inputFilename = 'input.mp4';
  const outputFilenamePattern = 'vid%03d.mp4';
  const outputFiles = [];

  ffmpeg.FS('writeFile', inputFilename, await fetchFile(videoURL));

  await ffmpeg.run('-i', inputFilename, '-c', 'copy', '-f', 'segment', '-segment_time', '29', '-reset_timestamps', '1', outputFilenamePattern);

  const files = ffmpeg.FS('readdir', '.');
  files.filter(file => file.name.startsWith('vid')).forEach(file => {
    const outputData = ffmpeg.FS('readFile', file.name);
    const outputBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
    const outputURL = URL.createObjectURL(outputBlob);

    outputFiles.push({
      url: outputURL,
      name: file.name
    });
  });

  var resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  outputFiles.forEach(outputFile => {
    var video = document.createElement('video');
    video.src = outputFile.url;
    video.controls = true;

    var link = document.createElement('a');
    link.href = outputFile.url;
    link.download = outputFile.name;
    link.textContent = outputFile.name;

    var segmentDiv = document.createElement('div');
    segmentDiv.appendChild(video);
    segmentDiv.appendChild(link);

    resultDiv.appendChild(segmentDiv);
  });

  ffmpeg.FS('unlink', inputFilename);
  outputFiles.forEach(outputFile => {
    URL.revokeObjectURL(outputFile.url);
    ffmpeg.FS('unlink', outputFile.name);
  });
}
