var domVariables = {
  app: document.getElementById('app'),
  fieldSelect: document.getElementById('fieldSelect'),
  cardboard: document.getElementById('cardboard'),
  startBtn: document.getElementById('startBtn'),
  pauseBtn: document.getElementById('pauseBtn'),
  attemptsLog: document.getElementById('attempts'),
  matchLog: document.getElementById('matchLog'),
  stopwatchLog: document.getElementById('stopwatch'),
  totalCardsAmount: document.querySelectorAll('.card'),
  switchThemeBtn: document.getElementById('switchThemeBtn'),
  themeComponents: {
    containers: document.querySelectorAll('.container'),
    buttons: document.querySelectorAll('.button'),
    selects: document.querySelectorAll('.select'),
    inputs: document.querySelectorAll('.input'),
    body: document.querySelector('body'),
    table: document.getElementById('bestTable')
  },
  bestTable: document.getElementById('bestTable'),
  playerNameInput: document.getElementById('playerNameInput'),
  showResultTableBtn: document.getElementById('showResultTableBtn')
}

var helpers = {
  getRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },

  shuffle: function (o) {
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }
}

var gameLogic = {

  getHalfFieldSize: function() {
    return parseInt(domVariables.fieldSelect.value);
  },

  getHalfCardsAmount: function(halfFieldSize) {
    return halfFieldSize * halfFieldSize / 2;
  },

  getCardsAmount: function () {
    return getHalfCardsAmount() * 2;
  },

  getCardsNumbers: function(cardsAmount) {
    let cardNumbersArr = new Array();
    for (let i = 0; i < cardsAmount; i++) {
      // TODO: get random numbers, not just first 0..N
      cardNumbersArr.push(i)
    }
    return cardNumbersArr;
  },

  setCardsId: function(){
    var cards = document.querySelectorAll('.card')
    for (let i = 0; i < cards.length; i++) {
      cards[i].id = `card-${i}`;
    }
  },

  generateCardHtml: function (cardId) {
    return `<div class="card"> <div class="flipper"> <div class="flipper__front"><img src="img/cardbg.png" alt="alt"></div><div class="flipper__back"> <img src="img/img${cardId}.png" alt="alt"> </div></div></div>`;
  },

  isSameCard: function (card) {
    try {
      let currentCardImageSrc = card.children[0].children[1].children[0].src;
      let bufferCardImageSrc = callbackFunctions.buffer.activeCards[0].children[0].children[1].children[0].src;
      if (currentCardImageSrc === bufferCardImageSrc) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  resetBuffer: function () {
    callbackFunctions.buffer.activeCards = [];
    callbackFunctions.buffer.attempts = 0;
    callbackFunctions.buffer.removedCardsAmount = 0;
    callbackFunctions.buffer.totalCardsAmount = parseInt(domVariables.fieldSelect.value) * parseInt(domVariables.fieldSelect.value);
    callbackFunctions.buffer.isPaused = false;
    callbackFunctions.buffer.playerName = '';
  },

  newGame: function () {
    gameLogic.resetGame();
    if (domVariables.playerNameInput.value == '') {
      alert('Please enter player name');
      return;
    }
    callbackFunctions.buffer.playerName = domVariables.playerNameInput.value;
    render.showAllCards();
    setTimeout(function () {
      render.hideAllCards();
      domVariables.cardboard.classList.remove('pointer-events-disabled');
      domVariables.pauseBtn.classList.remove('pointer-events-disabled');
      stopwatch.start();
    }, 2000)
  },

  resetGame: function () {
    gameLogic.resetBuffer();
    render.resetView();
    stopwatch.stop();
    stopwatch.reset();
  },

  pauseGame: function () {
    if (callbackFunctions.buffer.isPaused === false) {
      callbackFunctions.buffer.isPaused = true;
      domVariables.cardboard.classList.add('pointer-events-disabled');
      domVariables.startBtn.classList.add('pointer-events-disabled');
      stopwatch.stop();
      domVariables.pauseBtn.innerHTML = 'Resume';
    } else if (callbackFunctions.buffer.isPaused === true) {
      callbackFunctions.buffer.isPaused = false;
      domVariables.cardboard.classList.remove('pointer-events-disabled');
      domVariables.startBtn.classList.remove('pointer-events-disabled');
      stopwatch.start();
      domVariables.pauseBtn.innerHTML = 'Pause';
    }
  },

  endGame: function () {
    domVariables.pauseBtn.classList.add('pointer-events-disabled');
    stopwatch.stop();
    render.updateLastGameLogs();
    bestResults.saveScoresToLocalStorage();
    domVariables.playerNameInput.value = '';
  }

}

var render = {

  renderField: function () {
    let fieldSize = gameLogic.getHalfFieldSize();
    let cardsAmount = gameLogic.getHalfCardsAmount(fieldSize);
    let cardsNumbers = gameLogic.getCardsNumbers(cardsAmount);
    for (let i = 0; i < cardsNumbers.length; i++) {
      this.renderCard(cardsNumbers[i])
    }
    this.duplicateChildNodes(domVariables.cardboard);
    this.shuffleChildNodes(domVariables.cardboard);
    gameLogic.setCardsId();
    this.setWrapperSize();
  },

  renderCard: function (cardId) {
    let card = document.createElement('div');
    domVariables.cardboard.appendChild(card);
    card.outerHTML = gameLogic.generateCardHtml(cardId);
  },

  duplicateChildNodes: function (parentNode){
    NodeList.prototype.forEach = Array.prototype.forEach;
    parentNode.childNodes.forEach(function(item){
      var cln = item.cloneNode(true);
      parentNode.appendChild(cln);
    });
  },

  shuffleChildNodes: function (parentNode){
    for (let i = parentNode.children.length; i >= 0; i--) {
      parentNode.appendChild(parentNode.children[Math.random() * i | 0]);
    }
  },

  setWrapperSize: function(){
    let fieldSize = gameLogic.getHalfFieldSize();
    let cardWidth = document.querySelector('.card').offsetWidth;
    let wrapperWidth = `${fieldSize * cardWidth + 50}px`
    domVariables.app.style.setProperty('width', wrapperWidth)
  },

  showCard: function (card) {
    card.classList.add('card--flipped');
  },

  hideCard: function (card) {
    card.classList.remove('card--flipped');
  },

  hideGuessedPair: function () {
    for (let i = 0; i < callbackFunctions.buffer.activeCards.length; i++) {
      callbackFunctions.buffer.activeCards[i].classList.add('pointer-events-disabled');
      callbackFunctions.buffer.activeCards[i].classList.add('card--hidden');
    }
  },

  showAllCards: function() {
      let cards = document.querySelectorAll(".cardboard .card");
      [].map.call(cards, function(elem) {elem.classList.add("card--flipped")});
  },

  hideAllCards: function() {
      let cards = document.querySelectorAll(".cardboard .card");
      [].map.call(cards, function(elem) {elem.classList.remove("card--flipped")});
  },

  removeAllCards: function() {
    while (domVariables.cardboard.hasChildNodes()) {
      domVariables.cardboard.removeChild(domVariables.cardboard.lastChild);
    }
  },

  updateAttempts: function (value) {
    domVariables.attemptsLog.innerHTML = value;
  },

  updateStopwatch: function (value) {
    domVariables.stopwatchLog.innerHTML = value;
  },

  updateLastGameLogs: function () {
    domVariables.matchLog.innerHTML = `Last game was completed in ${domVariables.stopwatchLog.innerHTML} with ${callbackFunctions.buffer.attempts} attempts.`
  },

  resetView: function () {
    render.updateStopwatch("00:00:00");
    render.removeAllCards();
    render.renderField();
    render.updateAttempts(0);
    domVariables.cardboard.classList.add('pointer-events-disabled');
    domVariables.pauseBtn.classList.add('pointer-events-disabled');
    domVariables.pauseBtn.innerHTML = 'Pause';
    domVariables.startBtn.classList.remove('pointer-events-disabled');
  },

  switchColorTheme: function () {
    if (callbackFunctions.buffer.isLisghtTheme) {
      domVariables.themeComponents.body.classList.add('theme-dark');
      [].map.call(domVariables.themeComponents.containers, function(elem) {
        elem.classList.add('container--dark');
      });
      [].map.call(domVariables.themeComponents.buttons, function(elem) {
        elem.classList.add('button--dark');
      });
      [].map.call(domVariables.themeComponents.selects, function(elem) {
        elem.classList.add('select--dark');
      });
      [].map.call(domVariables.themeComponents.inputs, function(elem) {
        elem.classList.add('input--dark');
      });
      domVariables.themeComponents.table.classList.add('best-table--dark');
      callbackFunctions.buffer.isLisghtTheme = !callbackFunctions.buffer.isLisghtTheme;
    } else {
      domVariables.themeComponents.body.classList.remove('theme-dark');
      [].map.call(domVariables.themeComponents.containers, function(elem) {
        elem.classList.remove('container--dark');
      });
      [].map.call(domVariables.themeComponents.buttons, function(elem) {
        elem.classList.remove('button--dark');
      });
      [].map.call(domVariables.themeComponents.selects, function(elem) {
        elem.classList.remove('select--dark');
      });
      [].map.call(domVariables.themeComponents.inputs, function(elem) {
        elem.classList.remove('input--dark');
      });
      domVariables.themeComponents.table.classList.remove('best-table--dark');
      callbackFunctions.buffer.isLisghtTheme = !callbackFunctions.buffer.isLisghtTheme;
    }
  }
}

var callbackFunctions = {

  buffer: {
    activeCards: new Array(),
    attempts: 0,
    totalCardsAmount: 0,
    removedCardsAmount: 0,
    isPaused: true,
    isLisghtTheme: true,
    playerName: ''
  },

  cardClickCallback: function() {

    event.stopPropagation();
    let card = event.target.parentElement.parentElement.parentElement;

    // if clicked element is not a card - return
    if (!card.classList.contains('card')) {return};

    // if clicked card is the same card as previous card - return
    if (callbackFunctions.buffer.activeCards.length === 1 && callbackFunctions.buffer.activeCards[0].id === card.id) {return};

    callbackFunctions.buffer.activeCards.push(card);

    render.showCard(card);

    if (callbackFunctions.buffer.activeCards.length === 2) {
      if (callbackFunctions.buffer.activeCards[0].id !== card.id && gameLogic.isSameCard(card)) {
        domVariables.cardboard.classList.add('pointer-events-disabled');
        setTimeout(function() {
          render.hideGuessedPair();
          callbackFunctions.buffer.attempts += 1;
          render.updateAttempts(callbackFunctions.buffer.attempts);
          callbackFunctions.buffer.removedCardsAmount += 2;
          callbackFunctions.buffer.activeCards = [];
          if (callbackFunctions.buffer.removedCardsAmount === callbackFunctions.buffer.totalCardsAmount) {gameLogic.endGame()}
          setTimeout(function () {
            domVariables.cardboard.classList.remove('pointer-events-disabled');
          }, 600)
        }, 500)
      } else if (gameLogic.isSameCard(card) == false) {
        domVariables.cardboard.classList.add('pointer-events-disabled');
        setTimeout(function () {
          render.hideCard(callbackFunctions.buffer.activeCards[0]);
          render.hideCard(callbackFunctions.buffer.activeCards[1]);
          callbackFunctions.buffer.attempts += 1;
          callbackFunctions.buffer.activeCards = [];
          render.updateAttempts(callbackFunctions.buffer.attempts);
          setTimeout(function () {
            domVariables.cardboard.classList.remove('pointer-events-disabled');
          }, 600)
        }, 500)
      }
    }
  },

  fieldSelectCallback: function () {
    gameLogic.resetGame();
    domVariables.playerNameInput.value = '';
  },

  startBtnCallback: function () {
    gameLogic.newGame();
  },

  pauseBtnCallback: function () {
    gameLogic.pauseGame();
  },

  switchThemeBtnCallback: function () {
    render.switchColorTheme();
  },

  showResultTableBtnCallback: function () {
    renderResultTable.redrawTable();
  }
}

function attachEvents(){
  console.log('attachEvents call');
  domVariables.cardboard.addEventListener('click', callbackFunctions.cardClickCallback);
  domVariables.fieldSelect.addEventListener('change', callbackFunctions.fieldSelectCallback);
  domVariables.startBtn.addEventListener('click', callbackFunctions.startBtnCallback);
  domVariables.pauseBtn.addEventListener('click', callbackFunctions.pauseBtnCallback);
  domVariables.switchThemeBtn.addEventListener('click', callbackFunctions.switchThemeBtnCallback),
  domVariables.showResultTableBtn.addEventListener('click', callbackFunctions.showResultTableBtnCallback)
}

function mainLoop() {
  render.renderField();
  attachEvents();
}

window.onload = function() {
  mainLoop();
}
