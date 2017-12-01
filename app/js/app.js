var helpers = (function(){
  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return {getRandomInt};
})();


var controller = (function(){

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

  var initCards = function(){
    var cards = document.querySelectorAll('.cardboard .card .flipper .flipper__back img');

    for (var i = 0; i < cards.length; i++) {
      cards[i].src = `img/img${helpers.getRandomInt(0, 18)}.jpg`
    }
  }

  return {flipAll, initCards}
})();

function mainLoop(){
  controller.flipAll();
  controller.initCards();
}



window.onload = function() {
  mainLoop();
}
