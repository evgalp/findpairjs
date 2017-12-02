function mainLoop(){

  var startBtn = document.getElementById("start_stop_btn");
  var cardboard = document.getElementById('cardboard');
  startBtn.addEventListener("click", startGame)

  function startGame(){
    fieldGenerationModule.generateField();
    stopwatch.start();
  }

  setInterval(function(){
    if (!cardboard.hasChildNodes()) {
      stopwatch.stop();
    }
  }, 1000)
}


window.onload = function() {
  mainLoop();
}
