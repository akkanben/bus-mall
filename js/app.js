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
let currentRound = 1;
let allImageCandidates = [];
let candidatesPerScreen = 3;
let stats = ['Name', 'Clicks', 'Times Seen'];

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
    for (let j = 0; j < stats.length; j++) {
      let dataEl = document.createElement('td');
      switch (j) {
      case 0:
        dataEl.innerText = allImageCandidates[i].name;
        rowEl.appendChild(dataEl);
        break;
      case 1:
        dataEl.innerText = allImageCandidates[i].clickCount;
        rowEl.appendChild(dataEl);
        break;
      case 2:
        dataEl.innerText = allImageCandidates[i].seenCount;
        rowEl.appendChild(dataEl);
        break;
      default:
        dataEl.innerText = '???';
      }
      statTableEl.appendChild(rowEl);
    }
  }
};

ImageCandidate.handleCandidateClick = function (event) {
  event.preventDefault();
  if (currentRound >= totalNumberOfRounds) {
    ImageCandidate.drawRound();
    ImageCandidate.removeImageListeners();
    ImageCandidate.drawStats();
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



// function to show report

// button to view results





ImageCandidate.createImageHolders(candidatesPerScreen);
ImageCandidate.createAllImageCandidates();
ImageCandidate.getNextGroup();
ImageCandidate.addImageListeners();
ImageCandidate.renderCandidates();
ImageCandidate.drawRound();
