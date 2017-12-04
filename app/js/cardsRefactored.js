var domVariables = {
  app: document.getElementById('app'),
  fieldSelect: document.getElementById("fieldSelect"),
  cardboard: document.getElementById('cardboard'),
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById('pauseBtn'),
  attemptsLog: document.getElementById('attempts'),
  matchLog: document.getElementById('matchLog'),
  stopwatchLog: document.getElementById('stopwatch'),
  totalCardsAmount: document.querySelectorAll('.card')
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

  newGame: function () {
    callbackFunctions.buffer.activeCards = [];
    callbackFunctions.buffer.attempts = 0;
    callbackFunctions.buffer.removedCardsAmount = 0;
    callbackFunctions.buffer.totalCardsAmount = parseInt(domVariables.fieldSelect.value) * parseInt(domVariables.fieldSelect.value);
    render.removeAllCards();
    render.renderField();
    domVariables.cardboard.classList.remove('pointer-events-disabled')
    render.updateAttempts(0);
    render.updateStopwatch('00:00:00');
    stopwatch.reset();
    stopwatch.start();
  },

  endGame: function () {
    stopwatch.stop();
    render.updateLastGameLogs();
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
      // TODO: 'pointer-events-disabled' not working (but class was added)
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
  }
}

var callbackFunctions = {

  buffer: {
    activeCards: new Array(),
    attempts: 0,
    totalCardsAmount: 0,
    removedCardsAmount: 0
  },

  cardClickCallback: function() {
    console.log('callbackFunctions.buffer.activeCards is : ', callbackFunctions.buffer.activeCards);

    event.stopPropagation();
    let card = event.target.parentElement.parentElement.parentElement;

    if (callbackFunctions.buffer.activeCards.length === 1 && callbackFunctions.buffer.activeCards[0].id === card.id) {
      console.log("JNJKJKLJKLJKLJKL:SSF");
      return;
    };

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
    render.removeAllCards();
    render.renderField();
  },

  startBtnCallback: function () {
    gameLogic.newGame();
  }
}

function attachEvents(){
  console.log('attachEvents call');
  domVariables.cardboard.addEventListener('click', callbackFunctions.cardClickCallback);
  domVariables.fieldSelect.addEventListener('change', callbackFunctions.fieldSelectCallback);
  domVariables.startBtn.addEventListener('click', callbackFunctions.startBtnCallback);
}

function mainLoop() {
  render.renderField();
  attachEvents();
}

window.onload = function() {
  mainLoop();
}
