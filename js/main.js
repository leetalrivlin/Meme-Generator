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
  
  drawImg(imgId, callDrawTxt);
}

function callDrawTxt() {
  let lines = gMeme.lines;
  lines.forEach((line) => {
    drawTxt(line);
  });
}

function drawImg(imgId, myCallBack) {
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

function drawTxt(line) {
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
  gMeme = updateMemeLineTxt(elInput);
  let imgId = gMeme.selectedImgId;

  drawImg(imgId, callDrawTxt);
}
