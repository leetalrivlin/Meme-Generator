'use strict';
var gElCanvas;
var gCtx;

function onInit() {
    // onRenderGallery();
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    drawImg();
}

function onRenderGallery() {
    let imgs = gImgs;
}

onCreateMeme(5);

function onCreateMeme(imgId) {
    createMeme(imgId);
}

function drawImg() {
    const elImg = document.querySelector('.item-1');
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

// drawImgFromlocal()
// function drawImgFromlocal() {
//     const img = new Image()
//     img.src = 'img/gallery-imgs/5.jpg';
//     img.onload = () => {
//         gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
//     }
// }
