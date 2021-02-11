'use strict';
var gElCanvas;
var gCtx;

var gTextBoxInterval;

function onInit() {
  onRenderGallery();
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
}

function onRenderGallery() {
  let imgs = gImgs;
  var strHtml = imgs
    .map((img) => {
      return `<img src="${img.url}" class="gallery-item item-${img.id}" onclick="onClickedImg(${img.id})"/>`;
    })
    .join('');
  document.querySelector('.img-gallery').innerHTML = strHtml;
}

function onClickedImg(imgId) {
  hideGallery();

  gMeme = createMeme(imgId);
  renderImg(imgId, callRenderText);
}

function hideEditor() {
  let elEditor = document.querySelector('.meme-editor-container');
  elEditor.style.display = 'none';
}

function showEditor() {
  let elEditor = document.querySelector('.meme-editor-container');
  elEditor.style.display = 'flex';
}

function hideGallery() {
  let elGallery = document.querySelector('.img-gallery-container');
  elGallery.style.display = 'none';
  showEditor();
}

function showGallery() {
  let elGallery = document.querySelector('.img-gallery-container');
  elGallery.style.display = 'block';
  hideEditor();
}

function callRenderText() {
  let lines = gMeme.lines;
  lines.forEach((line) => {
    renderText(line);
  });
}

function renderImg(imgId, myCallBack) {
  let imgFromDb = gImgs.find((imgDb) => {
    return imgDb.id === imgId;
  });
  const img = new Image();
  img.src = imgFromDb.url;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
    myCallBack();
  };
}

function renderText(line) {
  gCtx.lineWidth = 1;
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = line.color;
  gCtx.font = `${line.size}px Impact`;
  gCtx.textAlign = line.align;
  gCtx.fillText(line.txt, line.x, line.y);
  gCtx.strokeText(line.txt, line.x, line.y);

  let txtWidth = gCtx.measureText(line.txt, line.x, line.y);
  line.textWidth = txtWidth.width;
}

function swichLine() {
  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);

  var idxLine = gMeme.selectedLineIdx;
  console.log('the begining idx:', idxLine);
  let nextIdxLine = idxLine + 1;
  if (nextIdxLine === gMeme.lines.length) {
    nextIdxLine = 0;
  }
  gMeme.selectedLineIdx = nextIdxLine;
  console.log('the new line idx:', gMeme.selectedLineIdx);

  gTextBoxInterval = setTimeout(renderTextBox, 100);
}

function renderTextBox() {
  let line = getLineFromId();
  if (!line.textWidth) return;

  // let rectWidth = line.textWidth + 10;
  let rectWidth = gElCanvas.width - 5;
  let rectHight = line.size + 3;
  // let rectX = line.x - line.textWidth / 2 - 5;
  let rectX = 5;
  let rectY = line.y - rectHight + 5;

  gCtx.beginPath();
  gCtx.rect(rectX, rectY, rectWidth, rectHight);
  gCtx.strokeStyle = 'white';
  gCtx.stroke();
}

function onGetInputVal() {
  let elInput = document.querySelector('.txt-input').value;
  let lineIdx = gMeme.selectedLineIdx;
  gMeme = updateMemeLineTxt(elInput, lineIdx);

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);

  clearTimeout(gTextBoxInterval);
}

function increaseFont() {
  let line = getLineFromId();

  if (line.size > 60) return;
  line.size += 5;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function decreaseFont() {
  let line = getLineFromId();

  if (line.size < 20) return;
  line.size -= 5;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function moveLineDown() {
  let line = getLineFromId();

  if (line.y >= gElCanvas.height) return;
  line.y += 5;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function moveLineUp() {
  let line = getLineFromId();

  if (line.y - line.size <= 0) return;
  line.y -= 5;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function changeFillColor() {
  let line = getLineFromId();
  let fillColor = document.querySelector('.fill-color-btn').value;

  line.color = fillColor;
}

function alignText(elBtn) {
  let line = getLineFromId();
  let alignLeft = document.querySelector('.align-left-btn');
  let alignCenter = document.querySelector('.align-center-btn');
  let alignRight = document.querySelector('.align-right-btn');

  switch (elBtn) {
    case alignLeft:
      line.x = 20;
      line.align = 'left';
      break;
    case alignCenter:
      line.x = gElCanvas.width / 2;
      line.align = 'center';
      break;
    case alignRight:
      line.x = gElCanvas.width - 20;
      line.align = 'right';
      break;
  }

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function toggleMenu(elBtn) {
  document.body.classList.toggle('menu-open');
  elBtn.innerText = document.body.classList.contains('menu-open') ? 'X' : '☰';
}
