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
    var strHtml = imgs.map((img) => {
        return `<img src="${img.url}" class="gallery-item item-${img.id}" onclick="onImgClicked(${img.id})"/>`
}).join('');
document.querySelector('.img-gallery').innerHTML = strHtml;
}

function onImgClicked(imgId) {
    drawImg(imgId);
    createMeme(imgId);
}

function drawImg(imgId) {
    const img = new Image();
    img.src = `img/gallery-imgs/${imgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
    }
}