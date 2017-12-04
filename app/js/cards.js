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

var devModule = (function(){
  var showAllCards = function() {
      var cards = document.querySelectorAll(".cardboard .card");
      [].map.call(cards, function(elem) {elem.classList.add("card--flipped")});
  };
  var hideAllCards = function() {
      var cards = document.querySelectorAll(".cardboard .card");
      [].map.call(cards, function(elem) {elem.classList.remove("card--flipped")});
  };
  return {showAllCards, hideAllCards};
})();

var appData = (function(){
  var htmlCode = {
    cardHtml: '<div class="card"> <div class="flipper"> <div class="flipper__front"> <img src="img/cardbg.png" alt="alt"> </div><div class="flipper__back"> <img src="" alt="alt"> </div></div></div>'
  }
  return {htmlCode};
})();

var helpers = (function(){
  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var shuffle = function (o) {
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  };

  var insertMultipleChildren = function(parentId, childrenAmount, childHtml) {
    var container = document.getElementById(parentId);
    for ( var counter = 0; counter < childrenAmount; counter++ ) {
      var div = document.createElement("div");
      container.appendChild(div);
      div.outerHTML = childHtml;
    }
  };

  var duplicateChildNodes = function (parentId){
    var parent = document.getElementById(parentId);
    NodeList.prototype.forEach = Array.prototype.forEach;
    var children = parent.childNodes;
    children.forEach(function(item){
      var cln = item.cloneNode(true);
      parent.appendChild(cln);
    });
  };

  var shuffleChildNodes = function (parentId){
    var parent = document.getElementById(parentId);
    for (var i = parent.children.length; i >= 0; i--) {
      parent.appendChild(parent.children[Math.random() * i | 0]);
    }
  }

  return {getRandomInt, shuffle, insertMultipleChildren, duplicateChildNodes, shuffleChildNodes};
})();


var fieldGenerationModule = (function(){

  function generateField (fieldSize){
    var fieldSize = domVariables.fieldSelect.value;
    while (domVariables.cardboard.hasChildNodes()) {
      domVariables.cardboard.removeChild(domVariables.cardboard.lastChild);
    }
    var cardsToInit = fieldSize * fieldSize / 2;
    var fieldWidth = 130 * fieldSize;
    domVariables.app.style.width = fieldWidth + "px"
    initField(cardsToInit);
    initCards(cardsToInit);
    helpers.duplicateChildNodes('cardboard');
    helpers.shuffleChildNodes('cardboard');
    setCardsId();
    cardClickListener();
  }

  var initCards = function(cardsAmount){
    var cards = document.querySelectorAll('.cardboard .card .flipper .flipper__back img');
    var existingImgArr = [];
    for (var i = 0; i < cardsAmount; i++) {
      existingImgArr.push(i);
    }
    helpers.shuffle(existingImgArr);
    for (var i = 0; i < cards.length; i++) {
      cards[i].src = `img/img${existingImgArr[i]}.png`;
    }
  }

  function setCardsId(){
    var cards = document.querySelectorAll('.card')
    for (var i = 0; i < cards.length; i++) {
      cards[i].id = `card-${i}`;
    }
  }

  var initField = function (fieldSize) {
    helpers.insertMultipleChildren('cardboard', fieldSize, appData.htmlCode.cardHtml);
  }

  var clickedCardsArr = [];

  function cardClickListener(){

    var attempts = 0;

    domVariables.cardboard.addEventListener('click', cardClickCallback);

    function cardClickCallback(event){
      event.stopPropagation();
      var currentCard = event.target.parentElement.parentElement.parentElement;

      if (clickedCardsArr.length === 2) {
        return
      };

      if (clickedCardsArr.length === 1 && currentCard.id === clickedCardsArr[0].id) {
        return;
      }

      if (clickedCardsArr.length < 3 && currentCard.classList.contains('card')) {
        currentCard.classList.add('card--flipped');
        clickedCardsArr.push(currentCard);
        detectMatch();
      }
    }

    function detectMatch(thisCard){
      setTimeout(function(){
        if (clickedCardsArr.length !== 2) return;
        if (clickedCardsArr[0].innerHTML === clickedCardsArr[1].innerHTML) {
          domVariables.matchLog.innerHTML = "match!";
          removeCards();
          attempts += 1;
          domVariables.attemptsLog.innerHTML = attempts;
          clickedCardsArr = [];
        } else {
          domVariables.matchLog.innerHTML = "no match!";
          resetCards();
          attempts += 1;
          domVariables.attemptsLog.innerHTML = attempts;
          clickedCardsArr = [];
        }
      }, 500)
    }

    function resetCards(){
      var selectedCards = document.querySelectorAll('.card--flipped');
      [].map.call(selectedCards, function(elem) {
        elem.classList.remove('card--flipped');
      });
    }

    function removeCards(){
      var selectedCards = document.querySelectorAll('.card--flipped');
      [].map.call(selectedCards, function(elem) {
        elem.classList.add('card--hidden');
      });

      endGame();

    }

    function endGame(){

      var removedCards = document.querySelectorAll('.card--hidden').length;
      var totalCards = document.querySelectorAll('.card').length;

      if (removedCards === totalCards) {
        stopwatch.stop();
        stopwatch.reset();

        domVariables.matchLog.innerHTML = `Last game was completed in ${domVariables.stopwatchLog.innerHTML} with ${attempts + 1} attempts.`

        setTimeout(function() {
          attempts = 0;
          domVariables.stopwatchLog.innerHTML = '00:00:00';
          domVariables.attemptsLog.innerHTML = '0';
        }, 1000)
      }

    }


  }

  return {generateField}
})();

function mainLoop(){
  domVariables.startBtn.addEventListener("click", startGame);
  domVariables.pauseBtn.addEventListener('click', pauseGame);
  domVariables.fieldSelect.addEventListener('click', pauseGame);

  function startGame(){
    fieldGenerationModule.generateField();
    devModule.showAllCards();
    setTimeout(function() {
      devModule.hideAllCards();
      domVariables.cardboard.classList.remove('click-disabled');
    }, 2000)
    stopwatch.start();
  }

  function pauseGame(){
    domVariables.cardboard.classList.add('click-disabled');
    stopwatch.stop();
  }
}

window.onload = function() {
  mainLoop();
}
