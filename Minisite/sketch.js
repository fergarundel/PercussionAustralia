// set variables for sketch

let audio0, audio1, audio2, audio3, audio4, audio5, audio6, audio7, audio8;
let amplitude;
let fft;
let currentInstance = 0;
let displayText;
let mic;

const easing = 0.3;
const easingFactor = 0.975;

function preload() {
  soundFormats('wav', 'mp3');
  audio0 = loadSound('assets/kick.wav');
  audio1 = loadSound('assets/tom.wav');
  audio2 = loadSound('assets/tom2.wav');
  audio4 = loadSound('assets/hithat2.wav');
  audio6 = loadSound('assets/triangle.wav');
  audio3 = loadSound('assets/Crash.wav');
  audio7 = loadSound('assets/cowbell.wav');
  audio5 = loadSound('assets/Snare.wav');
  audio8 = loadSound('assets/sticks.wav');
}2

function setup() {
  noCanvas();

  // mic = new p5.AudioIn();
  // mic.start();

  amplitude = new p5.Amplitude();
  fft = new p5.FFT(0.8, 128);

  displayText = createDiv('PERCUSSION AUSTRALIA');
  displayText.id('DisplayText') 
  displayText.parent('content');

  let letters = displayText.html().split('');
  displayText.html('');

  // create span elements for each letter and assign a unique class

  for (let i = 0; i < letters.length; i++) {
    let span = createSpan(letters[i]);
    span.parent(displayText);
    span.addClass('letter-' + i); 
  }

  
}

// maps the value of the FFT band from 0-255 to new values

function mapSpectrum(spectrum) {
  const newMin = 0;
  const newMax = 1000;

  const mappedSpectrum = spectrum.map(originalValue => {
    return map(originalValue, 0, 255, newMin, newMax);
  });

  return mappedSpectrum;
}

function draw() {

  console.log(mic);

  let spectrum = fft.analyze();
  let mappedSpectrum = mapSpectrum(spectrum);



  // let highestIndex = mappedSpectrum.indexOf(Math.max(...mappedSpectrum));

  // Find the index of the last occurrence with a value higher than 0
let highestIndex = -1; // Initialize to -1, indicating no valid index found yet
for (let i = mappedSpectrum.length - 1; i >= 0; i--) {
  if (mappedSpectrum[i] > 200) {
    highestIndex = i;
    break; // Exit the loop after finding the last occurrence
  }
}

// Check if a valid index with a value higher than 0 was found
if (highestIndex !== -1) {
  // Set values in mappedSpectrum to 0 with easing, except for the ones within a specified range
  for (let i = 0; i < mappedSpectrum.length; i++) {
    if (i < highestIndex - 60 || i > highestIndex) {
      mappedSpectrum[i] = lerp(mappedSpectrum[i], 0, easingFactor);
    }
  }
}

  // console.log(mappedSpectrum);

  let highestXValue = -Infinity;

  // Find the highest x-value for the array
  for (let i = 0; i < displayText.elt.children.length; i++) {
    let letterElement = displayText.elt.children[i];
    let rect = letterElement.getBoundingClientRect();
    if (rect.x > highestXValue) {
      highestXValue = rect.x;
    }
  }
  
  // Find the lowest x-value for the array
  let firstLetterElement = displayText.elt.children[0];
  let firstRect = firstLetterElement.getBoundingClientRect();
  let firstLetterX = firstRect.x;
  
  // Get the position of each letter and map them to a value between 0-64 (cut off higher frequency)
  let mappedXValues = [];
  
  for (let i = 0; i < displayText.elt.children.length; i++) {
    let letterElement = displayText.elt.children[i];
    let rect = letterElement.getBoundingClientRect();
    let mapX = map(rect.x, firstLetterX, highestXValue, 0, 128);
    mappedXValues.push(mapX);
  }
  
  for (let i = 0; i < mappedXValues.length; i++) {
    let currentMappedX = mappedXValues[i];

    // Determine the corresponding instance number based on the currentMappedX value
    let currentInstanceNumber = Math.floor(currentMappedX);

    // Set the --instance property based on the currentInstanceNumber
    document.documentElement.style.setProperty(`--instance${i}`, 
      lerp(mappedSpectrum[currentInstanceNumber], mappedSpectrum[currentInstanceNumber + 1], currentMappedX % 1).toFixed(2)
    );
  }
}

function keyPressed() {
  if (keyCode == 49){
    audio0.play();
  }
  if (keyCode == 50){
    audio1.play();
  }
  if (keyCode == 51){
    audio2.play();
  }
  if (keyCode == 52){
    audio3.play();
  }
  if (keyCode == 53){
    audio4.play();
  }
  if (keyCode == 54){
    audio5.play();
  }
  if (keyCode == 55){
    audio6.play();
  }
  if (keyCode == 56){
    audio7.play();
  }
  if (keyCode == 57){
    audio8.play();
  }
}

function windowResized(){1
  resizeCanvas(windowWidth,windowHeight);
}
