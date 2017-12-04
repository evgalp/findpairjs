var domVariables = {
  app: document.getElementById('app'),
  fieldSelect: document.getElementById("fieldSelect"),
  cardboard: document.getElementById('cardboard'),
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById('pauseBtn'),
  attemptsLog: document.getElementById('attempts'),
  matchLog: document.getElementById('matchLog'),
  stopwatchLog: document.getElementById('stopwatch')
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

var buffer = {
  activeCards: new Array()
}

var gameLogic = {

  getFieldSize: function() {
    return parseInt(domVariables.fieldSelect.value);
  },

  getCardsAmount: function(fieldSize) {
    return fieldSize * fieldSize / 2;
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
    return `<div class="card" id="card${cardId}"> <div class="flipper"> <div class="flipper__front"><img src="img/cardbg.png" alt="alt"></div><div class="flipper__back"> <img src="img/img${cardId}.png" alt="alt"> </div></div></div>`;
  },

  cardClickCallback: function() {
    if (buffer.activeCards.length == 2) {return};
    event.stopPropagation();
    let card = event.target.parentElement.parentElement.parentElement;
    buffer.activeCards.push(card);

    render.showCard(card);

    let currentCardId = card.id;
    let bufferCardId = buffer.activeCards[0].id;

    if (bufferCardId !== currentCardId && gameLogic.isSameCard(card)) {
      setTimeout(function() {
        render.hideGuessedPair();
        buffer.activeCards = [];
      }, 1000)
    } else if (gameLogic.isSameCard(card) == false) {
      setTimeout(function () {
        render.hideCard(buffer.activeCards[0]);
        render.hideCard(buffer.activeCards[1]);
        buffer.activeCards = [];
      }, 1000)
    }
  },

  isSameCard: function (card) {
    if (buffer.activeCards.length === 0) {return}
    let currentCardImageSrc = card.children[0].children[1].children[0].src;
    let bufferCardImageSrc = buffer.activeCards[0].children[0].children[1].children[0].src;
    if (currentCardImageSrc === bufferCardImageSrc) {
      return true;
    } else {
      return false;
    }
  }

}

var render = {

  renderField: function () {
    let fieldSize = gameLogic.getFieldSize();
    let cardsAmount = gameLogic.getCardsAmount(fieldSize);
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
    let fieldSize = gameLogic.getFieldSize();
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
    for (let i = 0; i < buffer.activeCards.length; i++) {
      buffer.activeCards[i].classList.add('card--hidden')
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
  }
}

function attachEvents(){
  console.log('attachEvents call');
  domVariables.cardboard.addEventListener('click', gameLogic.cardClickCallback)
}

function mainLoop() {
  render.renderField();
  attachEvents();
}

window.onload = function() {
  mainLoop();
}
