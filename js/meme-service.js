'use strict';

var gFilterBy = 'all';
var gKeywords;
var gImgs = [
  { id: 1, url: 'img/gallery-imgs/1.jpg', keywords: ['funny', 'man', 'politics'] },
  { id: 2, url: 'img/gallery-imgs/2.jpg', keywords: ['cute', 'puppy', 'animal'] },
  { id: 3, url: 'img/gallery-imgs/3.jpg', keywords: ['cute', 'puppy', 'animal', 'baby'] },
  { id: 4, url: 'img/gallery-imgs/4.jpg', keywords: ['cute', 'animal'] },
  { id: 5, url: 'img/gallery-imgs/5.jpg', keywords: ['funny', 'great', 'baby'] },
  { id: 6, url: 'img/gallery-imgs/6.jpg', keywords: ['funny', 'man'] },
  { id: 7, url: 'img/gallery-imgs/7.jpg', keywords: ['funny', 'baby'] },
  { id: 8, url: 'img/gallery-imgs/8.jpg', keywords: ['funny', 'man'] },
  { id: 9, url: 'img/gallery-imgs/9.jpg', keywords: ['funny', 'baby'] },
  { id: 10, url: 'img/gallery-imgs/10.jpg', keywords: ['funny', 'man', 'politics'] },
  { id: 11, url: 'img/gallery-imgs/11.jpg', keywords: ['man', 'sports'] },
  { id: 12, url: 'img/gallery-imgs/12.jpg', keywords: ['man'] },
];
var gMeme;
var gSavedMemes;
const SAVED_KEY = 'saved-memes';

function createKeyWords() {
  let words = [];

  for (let i = 0; i < gImgs.length; i++) {
    let currKeyWords = gImgs[i].keywords;
    for (let j = 0; j < currKeyWords.length; j++) {
      if (!words.includes(currKeyWords[j])) {
        words.push(currKeyWords[j]);
      }
    }
  }

  let keyWords = words.map((keyWord) => {
    return { word: keyWord, counted: getRandomIntInclusive(8, 28) };
  });
  keyWords.unshift({ word: 'all', counted: 25 });

  gKeywords = keyWords;
  return gKeywords;
}

function getKeyWords() {
  return gKeywords;
}

function getCurrMeme() {
  return gMeme;
}

function getCurrLine() {
  let lineId = gMeme.selectedLineIdx;
  let line = gMeme.lines[lineId];
  return line;
}

function getImgById(imgId) {
  return gImgs.find( img => {
    return img.id === imgId;
  });
}

function setFilter(filterBy) {
  gFilterBy = filterBy;
}

function getImgByFilters() {
  if (gFilterBy === 'all' || gFilterBy === '') return gImgs;
  return gImgs.filter((img) => img.keywords.includes(gFilterBy))
}

function createMeme(imgId) {
  gMeme = {
    memeId: getRandomId(),
    selectedImgId: imgId,
    selectedLineIdx: 0,
    dataURL: '',
    lines: [
      {
        txt: 'Change me!',
        size: 40,
        fontFamily: 'Impact',
        align: 'center',
        color: 'red',
        stroke: 'black',
        x: gElCanvas.width / 2,
        y: 60,
        textWidth: 0,
      },
      {
        txt: 'Hey! Change me too',
        size: 40,
        fontFamily: 'Impact',
        align: 'center',
        color: 'white',
        stroke: 'black',
        x: gElCanvas.width / 2,
        y: gElCanvas.height - 40,
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
  gMeme.selectedLineIdx = gMeme.lines.length - 1;
  return gMeme;
}

function updateMeme(meme) {
  gMeme = meme;
  return gMeme;
}
// function addToMemes() {
//   let savedMemes = loadMemesFromStorage();
//   if (!savedMemes || !savedMemes.length) {
//     savedMemes = [];
//   }
//   let memeDataUrl = gElCanvas.toDataURL();

//   let savedMeme = {
//     id: savedMemes.length + 1,
//     dataURL: memeDataUrl,
//   };

//   savedMemes.push(savedMeme);
//   gSavedMemes = savedMemes;
//   saveMemesToStorage();
// }

function addToMemes() {
  let savedMemes = loadMemesFromStorage();
  if (!savedMemes || !savedMemes.length) {
    savedMemes = [];
  }
  let memeDataUrl = gElCanvas.toDataURL();
  const currMeme = gMeme;
  currMeme.dataURL = memeDataUrl;

  savedMemes.push(currMeme);
  gSavedMemes = savedMemes;
  saveMemesToStorage();
}

function updateSavedMemes(savedMemes) {
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
