var exDB = {}
var waitingReviews = []
var pastEvents = []

const exStatus = ["OCZEKUJĄCE", "AKTYWNE", "ODRZUCONE", "ZARCHIWIZOWANE"]
const exColor = ["warning", "success", "danger", "secondary"]

function updateICSU() {
    resetDigest()
    var url = `https://api.mobilnykatolik.pl/icsu/${loginid}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let icsu = JSON.parse(xhr.responseText)
            console.log(icsu)
            waitingReviews = icsu.waitingReviews
            pastEvents = icsu.pastEvents
            exDB = icsu.exemptions

            //Oczekujące sprawozdania
            if (waitingReviews.length > 0) {
                document.getElementById("icsu-indicator-warning").style.display = "block"
                document.getElementById("icsu-waiting-reviews").style.display = "block"
                document.getElementById("icsu-no-projects").style.display = "none"
            } else {
                document.getElementById("icsu-indicator-success").style.display = "block"
                document.getElementById("icsu-waiting-reviews").style.display = "none"
            }

            for (wr in waitingReviews) {
                document.getElementById("icsu-waiting-reviews").innerHTML += `
                <div type="ind">
                    <aside><i class="fa-solid fa-circle-exclamation" style="color: #f6c23e"></i></aside>
                    <span>
                        ${waitingReviews[wr].name}
                        <br><i>Dodaj sprawozdanie</i>
                    </span>
                </div>`
            }

            //Zakończone projekty
            if (pastEvents.length > 0) {
                document.getElementById("icsu-past-events").style.display = "block"
                document.getElementById("icsu-no-projects").style.display = "none"
            }
            for (e in pastEvents) {
                document.getElementById("icsu-past-events").innerHTML = `
                <div type="ind">
                    <span>
                        ${pastEvents[e].name}
                        <br><i>${eventsdb[pastEvents[e].eventid].date.split("<br>")[0]}</i>
                    </span>
                </div>` + document.getElementById("icsu-past-events").innerHTML
            }

            //Zwolnienia
            var exCount = 0
            if (Object.keys(exDB).length > 0) {
                document.getElementById("icsu-no-exemptions").style.display = "none"
                document.getElementById("icsu-exemptions").style.display = "block"
            }
            for (ex in exDB) {
                exCount += 1
                if (exCount == 1 && Object.keys(exDB).length != 1) {
                    document.getElementById("icsu-exemptions").innerHTML += `
                    <div type="top" onClick="openExemption('${ex}')">
                        <span>
                            Zwolnienie
                            <br><i>${exDB[ex].date}</i>
                            <container class="${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                        </span>
                    </div>`
                } else if (exCount == Object.keys(exDB).length && Object.keys(exDB).length != 1) {
                    document.getElementById("icsu-exemptions").innerHTML += `
                    <div type="bottom" onClick="openExemption('${ex}')">
                        <span>
                            Zwolnienie
                            <br><i>${exDB[ex].date}</i>
                            <container class="${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                        </span>
                    </div>`
                } else if (Object.keys(exDB).length == 1) {
                    document.getElementById("icsu-exemptions").innerHTML += `
                    <div type="ind" onClick="openExemption('${ex}')">
                        <span>
                            Zwolnienie
                            <br><i>${exDB[ex].date}</i>
                            <container class="${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                        </span>
                    </div>`
                } else {
                    document.getElementById("icsu-exemptions").innerHTML += `
                    <div onClick="openExemption('${ex}')">
                        <span>
                            Zwolnienie
                            <br><i>${exDB[ex].date}</i>
                            <container class="${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                        </span>
                    </div>`
                }
            }
            document.getElementById("icsu").style.display = "block"
            document.getElementById("icsu-loading").style.display = "none"
        }
    };
    xhr.send();
}

function resetDigest() {
    document.getElementById("icsu-indicator-success").style.display = "none"
    document.getElementById("icsu-indicator-warning").style.display = "none"
    document.getElementById("icsu-no-projects").style.display = "block"
    document.getElementById("icsu-no-exemptions").style.display = "block"
    document.getElementById("icsu-exemptions").style.display = "none"
    document.getElementById("icsu-exemptions").innerHTML = ""
    document.getElementById("icsu").style.display = "none"
    document.getElementById("icsu-loading").style.display = "flex"

    //Zakończone projekty
    document.getElementById("icsu-past-events").innerHTML = ""
    document.getElementById("icsu-past-events").style.display = "none"

    //Oczekujące sprawozdania
    document.getElementById("icsu-waiting-reviews").style.display = "none"
    document.getElementById("icsu-waiting-reviews").innerHTML = ""
}
