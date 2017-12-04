var domVariables = {
  app: document.getElementById('app'),
  fieldSelect: document.getElementById("field_select"),
  cardboard: document.getElementById('cardboard'),
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById('pauseBtn')
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

  var initField = function (fieldSize) {
    helpers.insertMultipleChildren('cardboard', fieldSize, appData.htmlCode.cardHtml);
  }


  function cardClickListener(){
    console.log(domVariables.cardboard);

    var clickedCardsArr = [];
    var attempts = 0;

    domVariables.cardboard.addEventListener('click', cardClickCallback);

    function cardClickCallback(event){
      event.stopPropagation();
      var currentCard = event.target.parentElement.parentElement.parentElement;
      if (clickedCardsArr.length === 2) {
        return
      };

      if (clickedCardsArr.length < 2 && currentCard.classList.contains('card')) {
        console.log(clickedCardsArr.length);
        currentCard.classList.add('card--flipped');
        clickedCardsArr.push(currentCard);
        console.log(clickedCardsArr);
        detectMatch();
      }
    }

    function detectMatch(thisCard){
      if (clickedCardsArr.length !== 2) return;
      if (clickedCardsArr[0].innerHTML === clickedCardsArr[1].innerHTML) {
        document.getElementById('game_logs').innerHTML = "match!";
        removeCards();
        attempts += 1;
        document.getElementById('attempts').innerHTML = attempts;
        clickedCardsArr = [];
      } else {
        document.getElementById('game_logs').innerHTML = "no match!";
        resetCards(1000);
        attempts += 1;
        document.getElementById('attempts').innerHTML = attempts;
        clickedCardsArr = [];
      }
    }

    function resetCards(resetTime){
      setTimeout( function() {
        var selectedCards = document.querySelectorAll('.card--flipped');
        [].map.call(selectedCards, function(elem) {
          elem.classList.remove('card--flipped');
        });
      }, resetTime);
    }

    function removeCards(removeTime){
      setTimeout( function() {
        var selectedCards = document.querySelectorAll('.card--flipped');
        [].map.call(selectedCards, function(elem) {
          elem.remove();
        });

        if (document.getElementById("cardboard").querySelectorAll('.card').length ==0) {
          stopwatch.stop();
          setTimeout(function(){
            stopwatch.reset();
            document.getElementById('stopwatch').innerHTML = '00:00:00'
          }, 2000)
        }

      }, 1000)
    }


  }

  return {generateField}
})();

function mainLoop(){
  domVariables.startBtn.addEventListener("click", startGame);
  domVariables.pauseBtn.addEventListener('click', pauseGame);

  function startGame(){
    fieldGenerationModule.generateField();
    stopwatch.start();
  }

  function pauseGame(){
    stopwatch.stop();
  }
}

window.onload = function() {
  mainLoop();
}
