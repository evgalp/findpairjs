var appData = (function(){
  var htmlCode = {
    cardHtml: '<div class="card"> <div class="flipper"> <div class="flipper__front"> <img src="img/cardbg.jpg" alt="alt"> </div><div class="flipper__back"> <img src="" alt="alt"> </div></div></div>'
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
  }

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
      cards[i].src = `img/img${existingImgArr[i]}.jpg`;
    }

  }

  var initField = function (fieldSize) {
    helpers.insertMultipleChildren('cardboard', fieldSize, appData.htmlCode.cardHtml)
  }

  var initFlip = function () {
    var cards = document.querySelectorAll(".cardboard .card");

    var flipCard = function() {
        [].map.call(cards, function(elem) { elem.classList.remove("active") });
        this.classList.add("card--flipped");
        var that = this;
        setTimeout(function(){
          that.classList.remove("card--flipped")
        }, 1000)
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

function mainLoop(){
  var cardsToInit = 18;

  controller.initField(cardsToInit);
  controller.initCards(cardsToInit);

  controller.initFlip();

}


window.onload = function() {
  mainLoop();
}
