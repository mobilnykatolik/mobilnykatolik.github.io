function newExemption() {
    window.open('#newexemptionapp', '_self')
    document.getElementById("newExemption1").value = ""
    document.getElementById("newExemption2").value = ""
    document.getElementById("newExemption3").value = ""
    document.getElementById("newExemption4").value = ""
}

function sendExemptionAsk() {
    if (!window.confirm("Czy na pewno chcesz wysłać tę prośbę o zwolnienie?")) {
        return false;
    }
    var data = {
        "userid": userID,
        "eventID": document.getElementById("newExemption1").value,
        "date": document.getElementById("newExemption2").value,
        "start": document.getElementById("newExemption3").value,
        "end": document.getElementById("newExemption4").value,
    }
    console.log(data);
    var url = `https://api.mobilnykatolik.pl/pmk/exemptions/new`;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                history.back()
                window.alert("Wysłano prośbę do opiekuna SU!")
                return false;
            } else {
                window.alert("Wystąpił błąd. Spróbuj ponownie!");
                return false;
            }
        }
    };
    xhr.send(JSON.stringify(data));
    return false;
}

function openExemption(exID) {
    document.getElementById("exemption-heading").innerHTML = `Zwolnienie dla ${userFirstName} ${userSurname}`
    document.getElementById("exemption-status").innerHTML = `${exStatus[exDB[exID].status]}`
    if (eventsdb[exDB[exID].event] == undefined) {
        document.getElementById("exemption-project").innerHTML = "Inne"
    } else {
        document.getElementById("exemption-project").innerHTML = eventsdb[exDB[exID].event].name
    }
    if (exDB[exID].status == 1) {
        document.getElementById("exemption-large-status").classList.add("success")
        document.getElementById("exemption-large-status").classList.remove("danger")
        document.getElementById("exemption-large-status").innerHTML = `ZWOLNIENIE AKTYWNE<text id="exemption-current-date">-</text>`
        document.getElementById("exemption-by").innerHTML = `<i class="fa-solid fa-user-shield verified"></i> ${exDB[exID].by}`
        document.getElementById("exemption-by-visibility").style.display = "block"
        document.getElementById("exemption-approval").innerHTML = `Zwolnienie zostało autoryzowane przez ${exDB[exID].by} (${exDB[exID].time})`
    } else {
        document.getElementById("exemption-approval").innerHTML = ``
        document.getElementById("exemption-large-status").classList.remove("success")
        document.getElementById("exemption-large-status").classList.add("danger")
        document.getElementById("exemption-large-status").innerHTML = `ZWOLNIENIE NIEWAŻNE<text id="exemption-current-date">-</text>`
        document.getElementById("exemption-by-visibility").style.display = "none"
    }
    document.getElementById("exemption-date").innerHTML = exDB[exID].date
    

    window.open('#exemptionapp', '_self')
}

function getFormattedDate() {
  const now = new Date();

  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();

  const HH = String(now.getHours()).padStart(2, '0');
  const MM = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return `${dd}.${mm}.${yyyy} ${HH}:${MM}:${ss}`;
}

var timeUpdate = setInterval(function() {
    let currentDate = getFormattedDate()
    console.log(currentDate)
    document.getElementById("exemption-current-date").innerHTML = currentDate
}, 1000)