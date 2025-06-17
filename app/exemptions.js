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
    window.alert("Moduł Zwolnienia jest wyłączony!")
    return false;
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
    window.alert("Funkcja jest aktualnie niedostępna!")
}