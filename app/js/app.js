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

  return {getRandomInt, shuffle, insertMultipleChildren};
})();


var controller = (function(){

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
    helpers.insertMultipleChildren('cardboard', fieldSize, appData.htmlCode.cardHtml)
  }

  var initFlip = function () {
    var cards = document.querySelectorAll(".cardboard .card");

    var flipCard = function() {
        [].map.call(cards, function(elem) { elem.classList.remove("card--flipped") });
        this.classList.add("card--flipped");
        var that = this;
        // setTimeout(function(){
        //   that.classList.remove("card--flipped")
        // }, 1000)
    };

    var flipAll = function(){
      [].map.call(cards, function(elem) {
          elem.addEventListener("click", flipCard, false);
      });
    }

    flipAll();
  }

  return {initFlip, initCards, initField}
})();

var uiModule = (function(){
  var fieldSelect = document.getElementById("field_select");

  fieldSelect.addEventListener('change', fieldSelectionHandler, false);

  function fieldSelectionHandler(){

    var cardboard = document.getElementById('cardboard');

    while (cardboard.hasChildNodes()) {
      cardboard.removeChild(cardboard.lastChild);
    }
    var cardsToInit;
    console.log(field_select.value);
    if (field_select.value == 6) {
      cardsToInit = 6 * 6 / 2;
      // cardsToInit =2;
    } else if (field_select.value == 8) {
      cardsToInit = 8 * 8 / 2;
      // cardsToInit =4;

    } else if (field_select.value == 10) {
      cardsToInit = 10 * 10 / 2;
      // cardsToInit =6;

    } else if (field_select.value == 12) {
      cardsToInit = 12 * 12 / 2;
      // cardsToInit =8;

    }

    controller.initField(cardsToInit);
    controller.initCards(cardsToInit);
    controller.initFlip();

  }

  return {fieldSelectionHandler};
})();

function mainLoop(){
  // uiModule.fieldSelectionHandler();
}


window.onload = function() {
  mainLoop();
}
