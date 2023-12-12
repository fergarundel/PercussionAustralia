let sting1, amplitude;
let currentInstance = 0;
const easing = 0.05;

function preload() {
  soundFormats('wav', 'mp3');
  sting1 = loadSound('assets/Sting1.wav');
}

function setup() {
  noCanvas();
  amplitude = new p5.Amplitude();
  fft = new p5.FFT();
}

function draw() {
  amplitude.setInput(sting1);
  let level = amplitude.getLevel();
  let targetInstance = map(level, 0, 0.2, 10, 200);
  // let targetInstance = map(level, 0, 0.1, 0, 1000);
  currentInstance = lerp(currentInstance, targetInstance, easing);
  document.documentElement.style.setProperty(
    '--instance',
    currentInstance.toFixed(2)
  );

  let spectrum = fft.analyze();

  let sumLow = 0;
  let sumMid = 0;
  let sumHigh = 0;

  for (let i = 0; i < 341; i++) {
    sumLow += spectrum[i];
  }

  for (let i = 342; i < 683; i++) {
    sumMid += spectrum[i];
  }

  for (let i = 684; i < 1024; i++) {
    sumHigh += spectrum[i];
  }

  // Calculate the average amplitudes
  let avgLow = sumLow / (341 - 0);
  let avgMid = sumMid / (683 - 342);
  let avgHigh = sumHigh / (1024 - 684);

  console.log('Low:' + avgLow, 'Mid:' + avgMid, 'High:' + avgHigh );

}

function keyPressed() {
  sting1.play();
}

let recorder;

      function startRecording() {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then((stream) => {
            recorder = RecordRTC(stream, {
              type: 'video',
              mimeType: 'video/webm',
              bitsPerSecond: 128000,
            });

            recorder.startRecording();

            // Stop recording after 5 seconds (adjust as needed)
            setTimeout(stopRecording, 500000);
          })
          .catch((error) => console.error('Error capturing screen:', error));
      }

      function stopRecording() {
        if (recorder) {
          recorder.stopRecording(() => {
            let blob = recorder.getBlob();
            let url = URL.createObjectURL(blob);

            // Create a download link
            let a = document.createElement('a');
            a.href = url;
            a.download = 'screenRecording.webm';
            a.textContent = 'Download Recording';

            // Append the link to the body (you can place it elsewhere)
            document.body.appendChild(a);

            // Trigger a click on the link to start the download
            a.click();

            // Remove the link from the DOM
            document.body.removeChild(a);

            // Release the blob URL
            URL.revokeObjectURL(url);
          });
        }
      }
