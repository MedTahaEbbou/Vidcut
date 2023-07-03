function cutVideo() {
  const videoFile = document.getElementById("videoFile").files[0];
  const videoURL = URL.createObjectURL(videoFile);

  const video = document.createElement("video");
  video.src = videoURL;

  video.onloadedmetadata = function() {
    const duration = video.duration;
    const maxDuration = 29;
    const numCuts = Math.ceil(duration / maxDuration);

    for (let i = 0; i < numCuts; i++) {
      const start = i * maxDuration;
      const end = Math.min(start + maxDuration, duration);

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

      const blob = dataURItoBlob(canvas.toDataURL("video/mp4"));
      const videoBlob = new Blob([blob], { type: "video/mp4" });
      const videoURL = URL.createObjectURL(videoBlob);

      const link = document.createElement("a");
      link.href = videoURL;
      link.download = "vid" + (i + 1) + ".mp4";
      link.innerHTML = "Download vid" + (i + 1) + ".mp4";
      document.getElementById("preview").appendChild(link);
    }

    URL.revokeObjectURL(videoURL);
  };
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
