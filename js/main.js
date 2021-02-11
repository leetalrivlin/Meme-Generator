'use strict';
var gElCanvas;
var gCtx;

function onInit() {
  onRenderGallery();
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
}

function onRenderGallery() {
  let imgs = gImgs;
  var strHtml = imgs
    .map((img) => {
      return `<img src="${img.url}" class="gallery-item item-${img.id}" onclick="onRenderCanvas(${img.id})"/>`;
    })
    .join('');
  document.querySelector('.img-gallery').innerHTML = strHtml;
}

function onRenderCanvas(imgId) {
  gMeme = createMeme(imgId);

  renderImg(imgId, callRenderText);
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

  renderTextBox();
}

function renderTextBox() {
  let line = getLineFromId();
  if (!line.textWidth) return;

  let rectWidth = line.textWidth + 10;
  let rectHight = line.size + 3;
  let rectX = line.x - line.textWidth / 2 - 5;
  let rectY = line.y - rectHight + 5;

  gCtx.beginPath();
  gCtx.rect(rectX, rectY, rectWidth, rectHight);
  gCtx.strokeStyle = 'white';
  gCtx.stroke();

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function onGetInputVal() {
  let elInput = document.querySelector('.txt-input').value;
  let lineIdx = gMeme.selectedLineIdx;
  gMeme = updateMemeLineTxt(elInput, lineIdx);

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
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

function swichLine() {
  let line = getLineFromId();
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
