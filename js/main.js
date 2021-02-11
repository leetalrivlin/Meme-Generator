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
    RenderText(line);
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

function RenderText(line) {
  gCtx.lineWidth = 1;
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = line.color;
  gCtx.font = `${line.size}px Impact`;
  gCtx.textAlign = line.align;
  gCtx.fillText(line.txt, line.x, line.y);
  gCtx.strokeText(line.txt, line.x, line.y);
}

function onGetInputVal() {
  let elInput = document.querySelector('.txt-input').value;
  let lineIdx = gMeme.selectedLineIdx
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

function moveLineDown() {
  let line = getLineFromId();
  
  if (line.y >= gElCanvas.height) return;
  line.y += 5;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function moveLineUp() {
  let line = getLineFromId();
  
  if ((line.y - line.size) <= 0) return;
  line.y -= 5;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}
