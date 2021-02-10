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
      return `<img src="${img.url}" class="gallery-item item-${img.id}" onclick="onImgClicked(${img.id})"/>`;
    })
    .join('');
  document.querySelector('.img-gallery').innerHTML = strHtml;
}

function onImgClicked(imgId) {
  gMeme = createMeme(imgId);
  let img = gMeme.selectedImgId;
  let lines = gMeme.lines;

  drawImg(img, callDrawTxt, lines);

  function callDrawTxt(lines) {
    lines.forEach((line) => {
      let txt = line.txt;
      let size = line.size;
      let align = line.align;
      let color = line.color;
      let x = line.x;
      let y = line.y;

      drawTxt(txt, size, align, color, x, y);
    });
  }
}

function drawImg(imgId, myCallBack, lines) {
  let imgFromDb = gImgs.find((imgDb) => {
    return imgDb.id === imgId;
  });
  const img = new Image();
  img.src = imgFromDb.url;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
    myCallBack(lines);
  };
}

function drawTxt(txt, size, align, color, x, y) {
  gCtx.lineWidth = 1;
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = color;
  gCtx.font = `${size}px Impact`;
  gCtx.textAlign = align;
  gCtx.fillText(txt, x, y);
  gCtx.strokeText(txt, x, y);
}
