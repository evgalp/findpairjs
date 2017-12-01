var model = (function(){

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

  return {flipAll}
})();

function mainLoop(){
  controller.flipAll();
}

function initCards(){
  var cards = document.querySelectorAll('.cardboard .card .flipper .flipper__back img');
  console.log(cards);
}

window.onload = function() {
  mainLoop();
}
