'use strict';

const imageFiles = [
  'bag.jpg',
  'banana.jpg',
  'bathroom.jpg',
  'boots.jpg',
  'breakfast.jpg',
  'bubblegum.jpg',
  'chair.jpg',
  'cthulhu.jpg',
  'dog-duck.jpg',
  'dragon.jpg',
  'pen.jpg',
  'pet-sweep.jpg',
  'scissors.jpg',
  'shark.jpg',
  'tauntaun.jpg',
  'unicorn.jpg',
  'water-can.jpg',
  'wine-glass.jpg',
];

const totalNumberOfRounds = 25;
const candidatesPerScreen = 3;
const stats = ['Name', 'Clicks', 'Times Seen'];
let currentRound = 1;
let allImageCandidates = [];

// constuctor for image object
function ImageCandidate(name, fileName) {
  this.name = name;
  this.fileName = fileName;
  this.clickCount = 0;
  this.seenCount = 0;
  this.seenLast = false;
  allImageCandidates.push(this);
}

ImageCandidate.currentList = [];
ImageCandidate.oldList = [];
ImageCandidate.graphData = {
  label: [],
  numClicks: [],
  numSeen: [],
};

ImageCandidate.createImageHolders = function (numberOfImages) {
  let parentElement = document.getElementById('selection-container');
  for (let i = 0; i < numberOfImages; i++) {
    let imgEl = document.createElement('img');
    imgEl.className = 'candidate';
    parentElement.append(imgEl);
  }
};

ImageCandidate.recordClick = function (clickedElement) {
  for (let i = 0; i < allImageCandidates.length; i++) {
    if (allImageCandidates[i].name === clickedElement.name) {
      allImageCandidates[i].clickCount++;
    }
  }
};

ImageCandidate.createAllImageCandidates = function () {
  for (let i = 0; i < imageFiles.length; i++) {
    let currentFile = imageFiles[i];
    // assumes all images end '.jpg' so - 4 from the end
    let currentName = currentFile.slice(0, currentFile.length - 4);
    new ImageCandidate(currentName, currentFile);
  }
};

// function to generate a valid index
ImageCandidate.getRandomAvaliableIndex = function () {
  let randomIndex = null;
  while (randomIndex === null || allImageCandidates[randomIndex].seenLast === true) {
    randomIndex = Math.floor(Math.random() * allImageCandidates.length);
  }
  return randomIndex;
};

// function to render members of currentSet
ImageCandidate.renderCandidates = function () {
  let imageArray = document.querySelectorAll('.candidate');
  for (let i = 0; i < ImageCandidate.currentList.length; i++) {
    let imgEl = imageArray[i];
    imgEl.name = allImageCandidates[ImageCandidate.currentList[i]].name;
    imgEl.src = `./img/${allImageCandidates[ImageCandidate.currentList[i]].fileName}`;
  }
};

ImageCandidate.resetLastSeen = function () {
  for (let i = 0; i < ImageCandidate.oldList.length; i++) {
    allImageCandidates[ImageCandidate.oldList[i]].seenLast = false;
  }
};

ImageCandidate.currentListToOldList = function () {
  for (let i = 0; i < candidatesPerScreen; i++) {
    ImageCandidate.oldList[i] = ImageCandidate.currentList[i];
  }
};

ImageCandidate.getNextGroup = function () {
  for (let i = 0; i < candidatesPerScreen; i++) {
    ImageCandidate.currentList[i] = ImageCandidate.getRandomAvaliableIndex();
    allImageCandidates[ImageCandidate.currentList[i]].seenLast = true;
    allImageCandidates[ImageCandidate.currentList[i]].seenCount++;
  }
  ImageCandidate.resetLastSeen();
  ImageCandidate.currentListToOldList();
};

ImageCandidate.drawRound = function () {
  let roundCountEl = document.getElementById('round-count');
  roundCountEl.innerText = `Round ${currentRound} of ${totalNumberOfRounds}`;
};


ImageCandidate.drawStats = function () {
  let statTableEl = document.getElementById('stats-table');
  let tableHeader = document.createElement('tr');
  for (let i = 0; i < stats.length; i++) {
    let dataEl = document.createElement('td');
    dataEl.innerText = stats[i];
    tableHeader.append(dataEl);
  }

  statTableEl.append(tableHeader);
  for (let i = 0; i < allImageCandidates.length; i++) {
    let rowEl = document.createElement('tr');
    let candidate = allImageCandidates[i];
    for (let j = 0; j < stats.length; j++) {
      let dataEl = document.createElement('td');
      switch (j) {
      case 0:
        dataEl.innerText = candidate.name;
        rowEl.appendChild(dataEl);
        ImageCandidate.graphData.label[i] = candidate.name;
        break;
      case 1:
        dataEl.innerText = candidate.clickCount;
        rowEl.appendChild(dataEl);
        ImageCandidate.graphData.numClicks[i] = candidate.clickCount;
        break;
      case 2:
        dataEl.innerText = candidate.seenCount;
        rowEl.appendChild(dataEl);
        ImageCandidate.graphData.numSeen[i] = candidate.seenCount;
        break;
      default:
        dataEl.innerText = '???';
      }
      statTableEl.appendChild(rowEl);
    }
  }
};

ImageCandidate.handleChartClick = function (event) {
  event.target.innerText = '';

};

ImageCandidate.handleBtnClick = function (event) {
  event.target.remove();
  ImageCandidate.drawStats();
  ImageCandidate.drawChart();
  let chartDiv = document.getElementById('instructional-text');
  chartDiv.addEventListener('click', ImageCandidate.handleChartClick);
};


ImageCandidate.drawButton = function () {
  let parentEl = document.getElementById('btn-here');
  let btnEl = document.createElement('button');
  btnEl.innerText = 'View Results';
  parentEl.appendChild(btnEl);
  btnEl.addEventListener('click', this.handleBtnClick);
};

// gradient info found on the chart.js github issues: https://github.com/chartjs/Chart.js/issues/562
ImageCandidate.drawChart = function () {
  let chartEl = document.getElementById('instructional-text');
  let canvas = document.createElement('canvas');
  chartEl.innerText = '';
  chartEl.appendChild(canvas);
  let ctx = canvas.getContext('2d');
  let clicksGradient = ctx.createLinearGradient(500, 0, 100, 0);
  let seenGradient = ctx.createLinearGradient(500, 0, 100, 0);
  clicksGradient.addColorStop(0, 'grey');
  clicksGradient.addColorStop(1, 'darkgrey');
  seenGradient.addColorStop(0, 'pink');
  seenGradient.addColorStop(1, 'salmon');
  //This is defined in the imported CDN chart.js
  new Chart(ctx, { //eslint-disable-line
    type: 'bar',
    data: {
      labels: ImageCandidate.graphData.label,
      datasets: [{
        label: 'Number of Clicks',
        data: ImageCandidate.graphData.numClicks,
        backgroundColor: clicksGradient,
      }, {
        label: 'Times Seen',
        data: ImageCandidate.graphData.numSeen,
        backgroundColor: seenGradient,
      }],
    }
  });

};

ImageCandidate.handleCandidateClick = function (event) {
  event.preventDefault();
  if (currentRound >= totalNumberOfRounds) {
    ImageCandidate.drawRound();
    ImageCandidate.removeImageListeners();
    ImageCandidate.drawButton();
  } else {
    let targetImageEl = event.target;
    ImageCandidate.recordClick(targetImageEl);
    ImageCandidate.getNextGroup();
    ImageCandidate.renderCandidates();
    currentRound++;
    ImageCandidate.drawRound();
  }
};

ImageCandidate.removeImageListeners = function () {
  let imageArray = document.querySelectorAll('.candidate');
  for (let i = 0; i < imageArray.length; i++) {
    imageArray[i].removeEventListener('click', ImageCandidate.handleCandidateClick);
  }
};

// event listeners to images
ImageCandidate.addImageListeners = function () {
  let imageArray = document.querySelectorAll('.candidate');
  for (let i = 0; i < imageArray.length; i++) {
    imageArray[i].addEventListener('click', ImageCandidate.handleCandidateClick);
  }
};


// Main
// Create number of img tags based off candidatesPerScreen
ImageCandidate.createImageHolders(candidatesPerScreen);
// Loop through image files array to create ImageCandidate instances
// which push themselves into the allImageCandidates array.
ImageCandidate.createAllImageCandidates();
// Gets the next set of candidates taking care not to grab one that was seen last time.
// these are placed in the currentSet array and their 'seenLast' is toggled to true.
// The previous set's 'seenLast' is toggled back to false.
ImageCandidate.getNextGroup();
// Add click listeners on all the images.
// The ImageCandidate.handleCandidateClick() takes over
ImageCandidate.addImageListeners();

// Renders all indexes in currentSet
// for this first batch (the ImageCandidate.handleCandidateClick() takes over the rest.)
ImageCandidate.renderCandidates();
ImageCandidate.drawRound();
