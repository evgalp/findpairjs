var bestResults = {
  getScores: function() {
    let gameResults = {
      playerName: callbackFunctions.buffer.playerName,
      secondsTaken: `${stopwatch.times[0] * 60 + stopwatch.times[1]}`,
      attemptsTaken: `${callbackFunctions.buffer.attempts}`,
      fieldSize: `${Math.sqrt(callbackFunctions.buffer.totalCardsAmount)}x${Math.sqrt(callbackFunctions.buffer.totalCardsAmount)}`
    }
    return gameResults;
  },

  saveScoresToLocalStorage: function() {
    let scores = this.getScores();
    let name = scores.playerName;
    localStorage.setItem(name, JSON.stringify(scores));
  }
}

var renderResultTable = {
  renderTableHead: function () {
    let tr = document.createElement("tr");
    let dataValues = ['Player', 'Time taken, seconds', 'Attempts taken', 'Field size'];
    for (let i = 0; i < dataValues.length; i++) {
      let x = document.createElement("th");
      let y = document.createTextNode(dataValues[i]);
      x.appendChild(y);
      tr.appendChild(x);
    }
    domVariables.bestTable.appendChild(tr);
  },

  createTableRecord: function(table, record){
    let data = JSON.parse(record);
    let dataValues = [data.playerName, data.secondsTaken, data.attemptsTaken, data.fieldSize];
    let tr = document.createElement("tr");
    for (let i = 0; i < dataValues.length; i++) {
      let x = document.createElement("td");
      let y = document.createTextNode(dataValues[i]);
      x.appendChild(y);
      tr.appendChild(x);
    }
    table.appendChild(tr);
  },

  clearTable: function () {
    while (domVariables.bestTable.hasChildNodes()) {
      domVariables.bestTable.removeChild(domVariables.bestTable.lastChild);
    }
  },

  redrawTable: function () {
    this.clearTable();
    this.renderTableHead();
    for (var i = 0; i < localStorage.length; i++){
        this.createTableRecord(domVariables.bestTable, localStorage.getItem(localStorage.key(i)))
    }
  }
}
