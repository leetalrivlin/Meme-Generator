'use strict';

var gElCanvas;
var gCtx;
var gTextBoxInterval;
var gsavedInterval;

function onInit() {
  createKeyWords();
  renderGallery();
  renderKeyList();
  renderKeyWords();
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
}

// RENDER SECTION:

function renderKeyList() {
  let keyWords = getKeyWords();
  let strHTML = keyWords.map(({ word }) => {
      return `<option value="${word}">`;
    }).join('');
  document.querySelector('#keywords-list-options').innerHTML = strHTML;
}

function renderKeyWords() {
  let keyWords = getKeyWords();

  let strHTML = keyWords
    .map((keyWord) => {
      return `<li 
              class="word-item" 
              style="font-size:${keyWord.counted + 10}px;"
              onclick="onSetFilterByWord(this)"
              data-word="${keyWord.word}"
              >${keyWord.word}</li>`;
    })
    .join('');
  document.querySelector('.keywords-words').innerHTML = strHTML;
}

function onSetFilterByList() {
  var elFilterBy = document.querySelector('.keywords-list');
  var filterBy = elFilterBy.value;
  onSetFilter(filterBy);
}

function onSetFilterByWord(elFilterBy) {
  var filterBy = elFilterBy.dataset.word;
  onSetFilter(filterBy);
}

function onSetFilter(filterBy) {
  let keyWords = getKeyWords();
  let keyword = keyWords.find((keyWord) => {
    return keyWord.word === filterBy;
  });
  if (keyword.counted < 30) {
    keyword.counted += 3;
  }
  renderKeyWords();
  setFilter(filterBy);
  renderGallery();
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
  createMeme(imgId);
  renderImg(imgId, callRenderLine);
}

// DISPLAY / HIDE SECTION:

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

function showGallery() {
  let elGallery = document.querySelector('.img-gallery-container');
  elGallery.style.display = 'block';
}

function onShowGallery() {
  onInit();
  showGallery();
  hideEditor();
  hideMemesPage();
}

function onNavItemClick(elNavItem) {
  if (document.body.classList.contains('menu-open')) toggleMenu();
  if (elNavItem.dataset.item === 'gallery') onShowGallery();
  if (elNavItem.dataset.item === 'memes') showMemesPage(); 
}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
  const elBtn = document.querySelector('.hamburger-btn')
  elBtn.innerText = document.body.classList.contains('menu-open') ? 'X' : '☰';
}

function toggleShareMenu() {
  document.body.classList.toggle('btn-menu-open');
}

function closeShareMenu() {
  document.body.classList.remove('btn-menu-open');
}

function onRenderMemes() {
  let savedMemes = loadMemesFromStorage();

  if (!savedMemes || !savedMemes.length) {
    document.querySelector('.no-memes').style.display = 'block';
    document.querySelector('.memes-grid').style.display = 'none';
    return;
  } else {
    document.querySelector('.no-memes').style.display = 'none';
    document.querySelector('.memes-grid').style.display = 'grid';
  }

  renderMemes(savedMemes);
}

function renderMemes(savedMemes) {
  let strHtml = savedMemes
  .map((savedImg) => {
    return `<div>
              <img 
                class="my-meme-img" 
                src="${savedImg.dataURL}" />
              <button class="img-btn clean-button" onclick="onDeleteMeme('${savedImg.memeId}')">
                <img src="../img/icons/trash.png" class="img-btn-icon"/>
              </button>
              <button class="img-btn clean-button" onclick="onEditMeme('${savedImg.memeId}')">
                <img src="../img/icons/edit.png" class="img-btn-icon"/>
              </button>
            </div>`;
  })
  .join('');

document.querySelector('.memes-grid').innerHTML = strHtml;
}

function showMemesPage() {
  onRenderMemes();
  hideGallery();
  hideEditor();
  closeShareMenu();

  document.querySelector('.memes-container').style.display = 'block';
}

function hideMemesPage() {
  document.querySelector('.memes-container').style.display = 'none';
}

function onDeleteMeme(currId) {
  console.log('Im deleting');
  let savedMemes = loadMemesFromStorage();
  let idx = savedMemes.findIndex(meme => {
    return currId === meme.memeId;
  });
  let isDelete = confirm('Are you sure you want to delete?');
  if (!isDelete) return;
  savedMemes.splice(idx, 1);
  updateSavedMemes(savedMemes);
  onRenderMemes();
}

function onEditMeme(currId) {
  console.log('Im editing');
  hideMemesPage();
  showEditor();
  let savedMemes = loadMemesFromStorage();
  let meme = savedMemes.find(meme => {
    return currId === meme.memeId;
  });
  updateMeme(meme);
  let imgId = meme.selectedImgId;
  renderImg(imgId, callRenderLine);
}

// CANVAS OPERATIONS:

function renderImg(imgId, myCallBack) {
  let imgFromDb = getImgById(imgId);
  const img = new Image();
  img.src = imgFromDb.url;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    myCallBack();
  };
}

function callRenderLine() {
  let {lines} = getCurrMeme();
  if (!lines || !lines.length) return;
  if (lines.length === 1) {
    let line = getCurrLine();
    renderLine(line);
  }
  lines.forEach((line) => {
    renderLine(line);
  });
}

function renderLine(line) {
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
  const meme = getCurrMeme();
  let imgId = meme.selectedImgId;
  renderImg(imgId, callRenderLine);

  var idxLine = meme.selectedLineIdx;
  let nextIdxLine = idxLine + 1;

  if (nextIdxLine === meme.lines.length) {
    nextIdxLine = 0;
  }
  meme.selectedLineIdx = nextIdxLine;

  gTextBoxInterval = setTimeout(renderLineFocus, 100);

  let elInput = document.querySelector('.txt-input');
  let line = getCurrLine();
  elInput.value = line.txt;
}

function renderLineFocus() {
  let line = getCurrLine();
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
  const elInput = document.querySelector('.txt-input').value;
  let meme = getCurrMeme();
  const lineIdx = meme.selectedLineIdx;
  meme = updateMemeLineTxt(elInput, lineIdx);

  let imgId = meme.selectedImgId;
  renderImg(imgId, callRenderLine);

  clearTimeout(gTextBoxInterval);
}

function increaseFont() {
  let line = getCurrLine();

  if (line.size > 60) return;
  line.size += 5;

  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

function decreaseFont() {
  let line = getCurrLine();

  if (line.size < 20) return;
  line.size -= 5;

  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

function onMoveLine(diff) {
  const line = getCurrLine();
  if (line.y >= gElCanvas.height || line.y - line.size <= 0) return;
  line.y += diff;

  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

function onAddLine() {
  let newLine = createnewLine();
  addMemeLine(newLine);
  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

function onDeleteLine() {
  const meme = getCurrMeme();
  let lineIdx = meme.selectedLineIdx;
  deleteLine(lineIdx);
  meme.selectedLineIdx = lineIdx + 1;
  if (meme.selectedLineIdx >= meme.lines.length) {
    meme.selectedLineIdx = 0;
  }
  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

document.querySelector('.stroke').addEventListener('click', function () {
  let strokeInput = document.querySelector('.stroke-color-btn');
  strokeInput.focus();
  strokeInput.click();
});

function changeStrokeColor() {
  let strokeInput = document.querySelector('.stroke-color-btn');
  let line = getCurrLine();
  let strokeColor = strokeInput.value;

  line.stroke = strokeColor;

  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

document.querySelector('.fill').addEventListener('click', function () {
  let fillColor = document.querySelector('.fill-color-btn');
  fillColor.focus();
  fillColor.click();
});

function changeFillColor() {
  let fillInput = document.querySelector('.fill-color-btn');
  let line = getCurrLine();
  let fillColor = fillInput.value;

  line.color = fillColor;

  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

function alignText(elBtn) {
  let line = getCurrLine();
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
  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

function changeFontFamily(elSelect) {
  let line = getCurrLine();
  let fontFamily = elSelect.value;
  line.fontFamily = fontFamily;
  let {selectedImgId} = getCurrMeme();
  renderImg(selectedImgId, callRenderLine);
}

function onAddToMemes() {
  addToMemes();
  gsavedInterval = setTimeout(closeShareMenu, 500); 
}

function onDownloadMeme(elLink) {
  var imgContent = gElCanvas.toDataURL('image/jpeg');
  elLink.href = imgContent;
  closeShareMenu();
}

function openMoreWords(elBtn) {
  document.body.classList.toggle('words-close');
  elBtn.innerText = document.body.classList.contains('words-close')
    ? 'more...'
    : 'close...';
}
