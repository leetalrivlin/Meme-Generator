'use strict';

var gFilterBy = 'all';
var gKeywords = [
  { word: 'all', counted: 5 },
  { word: 'funny', counted: 25 },
  { word: 'animal', counted: 7 },
  { word: 'man', counted: 15 },
  { word: 'puppy', counted: 10 },
];
var gImgs = [
  { id: 1, url: 'img/gallery-imgs/1.jpg', keywords: ['funny', 'man'] },
  {
    id: 2,
    url: 'img/gallery-imgs/2.jpg',
    keywords: ['cute', 'puppy', 'animal'],
  },
  {
    id: 3,
    url: 'img/gallery-imgs/3.jpg',
    keywords: ['cute', 'puppy', 'animal', 'baby'],
  },
  { id: 4, url: 'img/gallery-imgs/4.jpg', keywords: ['cute', 'animal'] },
  {
    id: 5,
    url: 'img/gallery-imgs/5.jpg',
    keywords: ['funny', 'great', 'baby'],
  },
  { id: 6, url: 'img/gallery-imgs/6.jpg', keywords: ['funny', 'man'] },
  { id: 7, url: 'img/gallery-imgs/7.jpg', keywords: ['funny', 'baby'] },
  { id: 8, url: 'img/gallery-imgs/8.jpg', keywords: ['funny', 'man'] },
  { id: 9, url: 'img/gallery-imgs/9.jpg', keywords: ['funny', 'baby'] },
];
var gMeme;
var gSavedMemes;
const SAVED_KEY = 'saved-memes';


// function createKeyWords() {

// }

function getKeyWords() {
  return gKeywords;
}

function setFilter(filterBy) {
  gFilterBy = filterBy;
}

function getImgByFilters() {
  // let keyWords = getKeyWords();
  if (gFilterBy === 'all' || gFilterBy === '') return gImgs;

  let filteredImgs = gImgs.filter((img) => {
    return (
      (gFilterBy === 'funny' && img.keywords.includes('funny')) ||
      (gFilterBy === 'animal' && img.keywords.includes('animal')) ||
      (gFilterBy === 'cute' && img.keywords.includes('cute')) ||
      (gFilterBy === 'puppy' && img.keywords.includes('puppy')) ||
      (gFilterBy === 'man' && img.keywords.includes('man'))
    );
  });
  return filteredImgs;
}

function createMeme(imgId) {
  var gMeme = {
    selectedImgId: imgId,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'I love Falafel',
        size: 40,
        fontFamily: 'Impact',
        align: 'center',
        color: 'red',
        stroke: 'black',
        x: gElCanvas.width / 2,
        y: 50,
        textWidth: 0,
      },
      {
        txt: 'Second line',
        size: 40,
        fontFamily: 'Impact',
        align: 'center',
        color: 'white',
        stroke: 'black',
        x: gElCanvas.width / 2,
        y: gElCanvas.height - 50,
        textWidth: 0,
      },
    ],
  };
  return gMeme;
}

function updateMemeLineTxt(txt, lineIdx) {
  gMeme.lines[lineIdx].txt = txt;
  return gMeme;
}

function getLineFromId() {
  let lineId = gMeme.selectedLineIdx;
  let line = gMeme.lines[lineId];

  return line;
}

function deleteLine(lineId) {
  gMeme.lines.splice(lineId, 1);

  return gMeme;
}

function createnewLine() {
  return {
    txt: 'Change text',
    size: 40,
    fontFamily: 'Impact',
    align: 'center',
    color: 'white',
    stroke: 'black',
    x: gElCanvas.width / 2,
    y: gElCanvas.height / 2,
  };
}

function addMemeLine(addedLine) {
  gMeme.lines.push(addedLine);
  return gMeme;
}

function addToMemes() {
  let savedMemes = loadMemesFromStorage();
  if (!savedMemes || !savedMemes.length) {
    savedMemes = [];
  }
  let memeDataUrl = gElCanvas.toDataURL();

  let savedMeme = {
    id: savedMemes.length + 1,
    dataURL: memeDataUrl,
  };

  savedMemes.push(savedMeme);
  gSavedMemes = savedMemes;
  saveMemesToStorage();
}

function saveMemesToStorage() {
  saveToStorage(SAVED_KEY, gSavedMemes);
}

function loadMemesFromStorage() {
  let savedMemes = loadFromStorage(SAVED_KEY);
  return savedMemes;
}
