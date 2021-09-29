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
  'sweep.png',
  'tauntaun.jpg',
  'unicorn.jpg',
  'water-can.jpg',
  'wine-glass.jpg',
];

const totalNumberOfRounds = 25;
const candidatesPerScreen = 3;
const stats = ['Name', 'Clicks', 'Times Seen'];
let currentRound = 1;


// constuctor for image object
function ImageCandidate(name, fileName) {
  this.name = name;
  this.fileName = fileName;
  this.clickCount = 0;
  this.seenCount = 0;
  this.isCurrent = false;
  ImageCandidate.all.push(this);
}

ImageCandidate.all = [];
ImageCandidate.graphData = {
  label: [],
  numClicks: [],
  numSeen: [],
};

ImageCandidate.saveToLocalStorage = function (data) {
  localStorage.setItem('savedData', JSON.stringify(data));
};

ImageCandidate.getFromLocalStorage = function () {
  if (localStorage.length > 0) {
    return JSON.parse(localStorage.getItem('savedData'));
  }
};

ImageCandidate.addStorageTotalsToCurrent = function () {
  if (localStorage.length > 0) {
    let storedTotals = ImageCandidate.getFromLocalStorage();
    for (let i = 0; i < ImageCandidate.all.length; i++) {
      ImageCandidate.graphData.numSeen[i] += storedTotals.numSeen[i];
      ImageCandidate.graphData.numClicks[i] += storedTotals.numClicks[i];
    }
  }
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
  for (let i = 0; i < ImageCandidate.all.length; i++) {
    if (ImageCandidate.all[i].name === clickedElement.name) {
      ImageCandidate.all[i].clickCount++;
    }
  }
};

ImageCandidate.createAllImageCandidates = function () {
  for (let i = 0; i < imageFiles.length; i++) {
    let currentFile = imageFiles[i];
    // assumes all images end '.jpg' or '.png' so - 4 from the end
    let currentName = currentFile.slice(0, currentFile.length - 4);
    new ImageCandidate(currentName, currentFile);
  }
};

// function to generate a valid index
ImageCandidate.getRandomAvaliableIndex = function () {
  let randomIndex = Math.floor(Math.random() * ImageCandidate.all.length);
  while (ImageCandidate.all[randomIndex].isCurrent === true) {
    randomIndex = Math.floor(Math.random() * ImageCandidate.all.length);
  }
  return randomIndex;
};

ImageCandidate.resetIsCurrent = function () {
  for (let i = 0; i < ImageCandidate.all.length; i++) {
    ImageCandidate.all[i].isCurrent = false;
  }
};

ImageCandidate.findCandidateByName = function (searchName) {
  for (let i = 0; i < ImageCandidate.all.length; i++) {
    let currentCandidate = ImageCandidate.all[i];
    if (currentCandidate.name === searchName) {
      return currentCandidate;
    }
  }
};

ImageCandidate.markCurrentTrue = function (elementArray) {
  if (currentRound > 1) {
    for (let i = 0; i < elementArray.length; i++) {
      ImageCandidate.findCandidateByName(elementArray[i].name).isCurrent = true;
    }
  }
};

// function to render next group and increment the seenCount
ImageCandidate.renderNextGroup = function () {
  let currentImageElements = ImageCandidate.getCurrentlyRendered();
  ImageCandidate.markCurrentTrue(currentImageElements);
  for (let i = 0; i < currentImageElements.length; i++) {
    let randomIndex = ImageCandidate.getRandomAvaliableIndex();
    let nextObject = ImageCandidate.all[randomIndex];
    nextObject.isCurrent = true;
    let imgEl = currentImageElements[i];
    imgEl.name = nextObject.name;
    imgEl.src = `./img/${nextObject.fileName}`;
    nextObject.seenCount++;
  }
  //sets all the ImageCandidates.current back to false
  ImageCandidate.resetIsCurrent();
};

ImageCandidate.getCurrentlyRendered = function () {
  return document.querySelectorAll('.candidate');
};

ImageCandidate.prototype.isCurrentlyRendered = function () {
  // if this is currently rendered return true else false
  let currentImageElements = ImageCandidate.getCurrentlyRendered();
  for (let i = 0; i < currentImageElements.length; i++) {
    if (this.name === currentImageElements[i].name) {
      return true;
    }
  }
  return false;
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
  for (let i = 0; i < ImageCandidate.all.length; i++) {
    let rowEl = document.createElement('tr');
    let candidate = ImageCandidate.all[i];
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
  ImageCandidate.addStorageTotalsToCurrent();
  ImageCandidate.saveToLocalStorage(ImageCandidate.graphData);
};

ImageCandidate.handleBtnClick = function (event) {
  event.target.remove();
  ImageCandidate.drawStats();
  ImageCandidate.drawChart();
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
    },
    options: {
      responsive: true,
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
    ImageCandidate.renderNextGroup();
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



ImageCandidate.createImageHolders(candidatesPerScreen);
ImageCandidate.createAllImageCandidates();
ImageCandidate.renderNextGroup();
ImageCandidate.addImageListeners();
//draw the first round
ImageCandidate.drawRound();

