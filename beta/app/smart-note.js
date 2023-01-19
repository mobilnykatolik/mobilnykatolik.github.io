var defaultSmartNote = "Miłego dnia🌻"


function updateSmartNote() {
  document.getElementById("smart-note").innerHTML = defaultSmartNote;
  if (additionalOptions["showSmartNote"] == false) {
    //Użytkownik nie chce otrzymywać SmartNote
    return false;
  }
  var smartNote = "";

  if (luckyToday) {
    smartNote = "Masz dzisiaj szczęśliwy numerek 🏅"
  }

  if (luckyTomorrow) {
    smartNote = "Masz jutro szczęśliwy numerek 🏅"
  }

  if (calendarSmartNote != "") {
    if (smartNote == "") {
      smartNote = calendarSmartNote;
    } else {
      smartNote += "<br>" + calendarSmartNote;
    }

  }

  if (smartNote == "") {
    smartNote = defaultSmartNote;
  }

  document.getElementById("smart-note").innerHTML = smartNote;
}

updateSmartNote();

function loadScannerEvents() {
  //
}