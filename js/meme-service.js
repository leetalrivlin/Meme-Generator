'use strict';
var gKeywords = { happy: 12, 'funny puk': 1 };
var gImgs = [
  { id: 1, url: 'img/gallery-imgs/1.jpg', keywords: ['funny', 'man'] },
  { id: 2, url: 'img/gallery-imgs/2.jpg', keywords: ['cute', 'puppy', 'animal'] },
  { id: 3, url: 'img/gallery-imgs/3.jpg', keywords: ['cute', 'puppy', 'animal', 'baby'] },
  { id: 4, url: 'img/gallery-imgs/4.jpg', keywords: ['cute', 'animal'] },
  { id: 5, url: 'img/gallery-imgs/5.jpg', keywords: ['funny', 'great', 'baby'] },
  { id: 6, url: 'img/gallery-imgs/6.jpg', keywords: ['funny', 'man'] },
  { id: 7, url: 'img/gallery-imgs/7.jpg', keywords: ['funny', 'baby'] },
  { id: 8, url: 'img/gallery-imgs/8.jpg', keywords: ['funny', 'man'] },
  { id: 9, url: 'img/gallery-imgs/9.jpg', keywords: ['funny', 'baby'] },
];
var gMeme;

function createMeme(imgId) {
  var gMeme = {
    selectedImgId: imgId,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'I love Falafel',
        size: 40,
        align: 'center',
        color: 'red',
        x: (gElCanvas.width / 2 ),
        y: 50,
      },
      {
        txt: 'Second line',
        size: 40,
        align: 'center',
        color: 'white',
        x: (gElCanvas.width / 2 ),
        y: (gElCanvas.height - 50),
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

// function createLineMeme(txt) {
//   return {
//     txt: txt,
//     size: 20,
//     align: 'center',
//     color: 'white',
//     x: (gElCanvas.width / 2 ),
//     y: (gElCanvas.height - 50),
//   }
// }


// function addMemeLine(addedLine) {
//   gMeme.lines.push(addedLine);
//   return gMeme;
// }
