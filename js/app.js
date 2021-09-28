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
ImageCandidate.parentElement = document.getElementById('selection-container');

ImageCandidate.createImageHolders = function (numberOfImages) {
  for (let i = 0; i < numberOfImages; i++) {
    let imgEl = document.createElement('img');
    imgEl.className = 'candidate';
    ImageCandidate.parentElement.append(imgEl);
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
  }
  ImageCandidate.resetLastSeen();
  ImageCandidate.currentListToOldList();
};

ImageCandidate.handleCandidateClick = function (event) {
  event.preventDefault();
  let targetImageEl = event.target;
  console.log(targetImageEl.name);
  ImageCandidate.getNextGroup();
  ImageCandidate.renderCandidates();
  //ImageCandidate.increaseTotals();
  //ImageCandidate.drawAside();
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
