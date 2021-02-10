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
  let txt = gMeme.lines[0].txt; 
  let size = gMeme.lines[0].size;
  let align = gMeme.lines[0].align;
  let color = gMeme.lines[0].color;

  drawImg(img, drawTxt, txt, size, align, color);
  // drawTxt(txt, size, align, color);
}

function drawImg(imgId, myCallBack, txt, size, align, color) {
  let imgFromDb = gImgs.find(imgDb => {
    return imgDb.id === imgId;
  })
  const img = new Image();
  img.src = imgFromDb.url;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
    myCallBack(txt, size, align, color);
  };
}

function drawTxt(txt, size, align, color) {
  gCtx.lineWidth = 1;
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = color;
  gCtx.font = `${size}px Impact`;
  gCtx.textAlign = align;
  gCtx.fillText(txt, 100, 100);
  gCtx.strokeText(txt, 100, 100);
}
