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
  var fieldSelect = document.getElementById("field_select");
  fieldSelect.addEventListener('change', generateField, false);

  function generateField (fieldSize){
    var app = document.getElementById('app');
    var fieldSize = fieldSelect.value;
    var cardboard = document.getElementById('cardboard');
    while (cardboard.hasChildNodes()) {
      cardboard.removeChild(cardboard.lastChild);
    }
    var cardsToInit = fieldSize * fieldSize / 2;
    var fieldWidth = 130 * fieldSize;
    app.style.width = fieldWidth + "px"
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
    var clickedCardsArr = [];

    var cards = document.querySelectorAll(".cardboard .card");
    [].map.call(cards, function(elem) {
      elem.addEventListener('click', cardClickCallback)
    });

    function cardClickCallback(){
      if (clickedCardsArr.length === 2) return;
      if (clickedCardsArr.length === 2) return;
      if (this.classList.contains('card--flipped')) return;
      this.classList.add('card--flipped');
      clickedCardsArr.push(this.innerHTML);
      detectMatch();
    }

    function detectMatch(thisCard){
      if (clickedCardsArr.length !== 2) return;
      if (clickedCardsArr[0] === clickedCardsArr[1]) {
        console.log('match');
        resetCards(1000);
        clickedCardsArr = [];
      } else {
        console.log('no match');
        resetCards(1000);
        clickedCardsArr = [];
      }
    }

    function resetCards(resetTime, targetCard){
      setTimeout( function() {
        var selectedCards = document.querySelectorAll('.card--flipped');
        [].map.call(cards, function(elem) {
          elem.classList.remove('card--flipped');
        });
      }, resetTime);
    }

  }

  return {generateField}
})();

function mainLoop(){
  fieldGenerationModule.generateField();
}


window.onload = function() {
  mainLoop();
}
