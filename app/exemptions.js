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
    document.getElementById("exemption-heading").innerHTML = `Zwolnienie dla ${exDB[exID].for}`
    document.getElementById("exemption-status").innerHTML = `${exStatus[exDB[exID].status]}`
    if (eventsdb[exDB[exID].event] != undefined) {
        document.getElementById("exemption-project").innerHTML = eventsdb[exDB[exID].event].name
    } else {
        document.getElementById("exemption-project").innerHTML = exDB[exID].event
    }
    if (exDB[exID].status == 1) {
        document.getElementById("exemption-large-status").classList.add("success")
        document.getElementById("exemption-large-status").classList.remove("danger")
        document.getElementById("exemption-large-status").innerHTML = `ZWOLNIENIE AKTYWNE<text id="exemption-current-date">-</text>`
        document.getElementById("exemption-by").innerHTML = `<i class="fa-solid fa-user-shield verified"></i> ${exDB[exID].by}`
        document.getElementById("exemption-by-visibility").style.display = "block"
        document.getElementById("exemption-approval").innerHTML = `Zwolnienie zostało autoryzowane przez ${exDB[exID].by} (${exDB[exID].time})`
    } else if (exDB[exID].status == 2) {
        document.getElementById("exemption-approval").innerHTML = `Zwolnienie zostało odrzucone przez ${exDB[exID].by}.`
        document.getElementById("exemption-large-status").classList.remove("success")
        document.getElementById("exemption-large-status").classList.add("danger")
        document.getElementById("exemption-large-status").innerHTML = `ZWOLNIENIE NIEWAŻNE<text id="exemption-current-date">-</text>`
        document.getElementById("exemption-by-visibility").style.display = "none"
    } else {
        document.getElementById("exemption-approval").innerHTML = `Zwolnienie wygenerowane w aplikacji Mobilny Katolik.`
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
    //console.log(currentDate)
    document.getElementById("exemption-current-date").innerHTML = currentDate
}, 1000)

function loadWaitingExemptions() {
    var url = `https://api.mobilnykatolik.pl/pmk/exemptions/list/${userID}/${loginID}/`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            exDB = JSON.parse(xhr.responseText)
            console.log(exDB)

            if (true) {
                document.getElementById("waiting-exemptions").style.display = "block"
            }

            document.getElementById("waiting-exemptions").innerHTML = ""
            document.getElementById("accepted-exemptions").innerHTML = ""
            document.getElementById("rejected-exemptions").innerHTML = ""

            for (ex in exDB) {
                if (eventsdb[exDB[ex].event] != undefined) {
                    exDB[ex].event = eventsdb[exDB[ex].event].name
                }
                if (exDB[ex].status == 0) {
                    document.getElementById("waiting-exemptions").innerHTML += `
                        <div style="font-size: 15px; width: 100%; border-radius: 10px; background-color: var(--additional);">
                            <div style="padding: 10px; display: flex; flex-direction: column;">
                                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                                    <span>
                                        ${exDB[ex].for}
                                        <br>
                                        <small>
                                            ${exDB[ex].date}
                                            <br>${exDB[ex].event}
                                        </small>
                                    </span>
                                    <container class="status ${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                                </div>
                                <div style="display: flex; justify-content: space-evenly; margin-top: 10px;">
                                    <button type="button" style="margin: 0; background-color: #e74a3b;" onClick="exemptionApproval('${ex}', false)">Odrzuć</button>
                                    <button type="button" style="margin: 0; background-color: #1cc88a;" onClick="exemptionApproval('${ex}', true)">Zatwierdź</button>
                                </div>
                            </div>
                        </div>`
                }
                if (exDB[ex].status == 1) {
                    document.getElementById("accepted-exemptions").innerHTML += `
                        <div type="ind" onClick="openExemption('${ex}')">
                            <span>
                                ${exDB[ex].for}
                                <br><i>${exDB[ex].date}</i>
                                <container class="${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                            </span>
                        </div>`
                }
                if (exDB[ex].status == 2) {
                    document.getElementById("rejected-exemptions").innerHTML += `
                        <div type="ind" onClick="openExemption('${ex}')">
                            <span>
                                ${exDB[ex].for}
                                <br><i>${exDB[ex].date}</i>
                                <container class="${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                            </span>
                        </div>`
                }
            }
        }
    };
    xhr.send();
}

function exemptionApproval(exID, approval) {
    if (approval == true) {
        if (!window.confirm("Czy na pewno chcesz zatwierdzić zwolnienie?")) {
            return false;
        }
    } else if (approval == false) {
        if (!window.confirm("Czy na pewno chcesz odrzucić zwolnienie?")) {
            return false;
        }
    }
    if (approval == undefined) { return false; }
    
    var data = {
        "exid": exID,
        "accept": approval
    }
    console.log(data);
    var url = `https://api.mobilnykatolik.pl/pmk/exemptions/manage/${userID}/${loginID}`;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                window.alert("Pomyślnie wprowadzono zmiany!")
                loadWaitingExemptions()
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