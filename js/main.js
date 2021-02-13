'use strict';
var gElCanvas;
var gCtx;

var gTextBoxInterval;

function onInit() {
  renderGallery();
  renderKeyList();
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
}

function onSetFilter() {
  var elFilterBy = document.querySelector('input[name=filterBy]');
    var filterBy = elFilterBy.value;
    console.log('Filtering by', filterBy);
    setFilter(filterBy);
    renderGallery();
}

function renderKeyList() {
  let keyWords = getKeyWords();
  keyWords.unshift('all');

  let strHTMLs = keyWords.map(keyWord => {
    return `<option value="${keyWord}">`
  }).join('');
  document.querySelector('.keywords-list').innerHTML = strHTMLs;
}

function renderGallery() {
  let imgs = getImgByFilters();
  var strHtml = imgs
    .map((img) => {
      return `<img src="${img.url}" class="gallery-item item-${img.id}" onclick="onClickedImg(${img.id})"/>`;
    })
    .join('');
  document.querySelector('.img-gallery').innerHTML = strHtml;
}

function onClickedImg(imgId) {
  hideGallery();
  showEditor();

  gMeme = createMeme(imgId);
  renderImg(imgId, callRenderText);
}

// DISPLAY / HIDE SECTIONS:

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
}

function onShowGallery() {
  showGallery();
  hideEditor();
  hideMemesPage();
}

function showGallery() {
  let elGallery = document.querySelector('.img-gallery-container');
  elGallery.style.display = 'block';
}

function toggleMenu(elBtn) {
  document.body.classList.toggle('menu-open');
  elBtn.innerText = document.body.classList.contains('menu-open') ? 'X' : '☰';
}

function toggleShareMenu() {
  document.body.classList.toggle('btn-menu-open');
}

function closeShareMenu() {
  document.body.classList.remove('btn-menu-open');
}

function onInitMemes() {
  let savedMemes = loadMemesFromStorage();

  if (!savedMemes || !savedMemes.length) {
    document.querySelector('.no-memes').style.display = 'block';
    return;
  } else {
    document.querySelector('.no-memes').style.display = 'none';
  }

  let strHtml = savedMemes
    .map((savedImg) => {
      return `<img 
                class="my-meme-img meme-${savedImg.id}" 
                src="${savedImg.dataURL}" />`;
    }).join('');

  document.querySelector('.memes-grid').innerHTML = strHtml;
}

function showMemesPage() {
  onInitMemes();
  hideGallery();
  hideEditor()
  closeShareMenu();
  
  document.querySelector('.memes-container').style.display = 'block';
}

function hideMemesPage() {
  document.querySelector('.memes-container').style.display = 'none';
}

// CANVAS OPERATIONS:

function callRenderText() {
  let lines = gMeme.lines;
  if (!lines || !lines.length) return;
  if (lines.length === 1) {
    let line = getLineFromId();
    renderText(line);
  }
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
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    myCallBack();
  };
}

function renderText(line) {
  gCtx.lineWidth = 1;
  gCtx.strokeStyle = line.stroke;
  gCtx.fillStyle = line.color;
  gCtx.font = `${line.size}px ${line.fontFamily}`;
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
  let nextIdxLine = idxLine + 1;

  if (nextIdxLine === gMeme.lines.length) {
    nextIdxLine = 0;
  }
  gMeme.selectedLineIdx = nextIdxLine;

  gTextBoxInterval = setTimeout(renderTextBox, 100);

  let elInput = document.querySelector('.txt-input');
  let line = getLineFromId();
  elInput.value = line.txt;
}

function renderTextBox() {
  let line = getLineFromId();
  if (!line.textWidth) return;

  let rectWidth = gElCanvas.width - 5;
  let rectHight = line.size + 3;
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

function onAddLine() {
  let newLine = createnewLine();
  addMemeLine(newLine);

  gMeme.selectedLineIdx = gMeme.lines.length - 1;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function onDeleteLine() {
  let lineIdx = gMeme.selectedLineIdx;

  deleteLine(lineIdx);

  gMeme.selectedLineIdx = lineIdx + 1;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

document.querySelector('.stroke').addEventListener('click', function () {
  let strokeInput = document.querySelector('.stroke-color-btn');
  strokeInput.focus();
  strokeInput.click();
});

function changeStrokeColor() {
  let strokeInput = document.querySelector('.stroke-color-btn');
  let line = getLineFromId();
  let strokeColor = strokeInput.value;

  line.stroke = strokeColor;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

document.querySelector('.fill').addEventListener('click', function () {
  let fillColor = document.querySelector('.fill-color-btn');
  fillColor.focus();
  fillColor.click();
});

function changeFillColor() {
  let line = getLineFromId();
  let fillColor = document.querySelector('.fill-color-btn').value;

  line.color = fillColor;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
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

function changeFontFamily(elSelect) {
  let line = getLineFromId();
  let fontFamily = elSelect.value;

  line.fontFamily = fontFamily;

  let imgId = gMeme.selectedImgId;
  renderImg(imgId, callRenderText);
}

function onAddToMemes() {
  addToMemes();
  closeShareMenu();
  let isGoToMemes = confirm('Your Meme was saved! Want to see it?');
  if (isGoToMemes) showMemesPage();
}

function onDownloadMeme(elLink) {
  var imgContent = gElCanvas.toDataURL('image/jpeg');
  elLink.href = imgContent;
  closeShareMenu();
}
