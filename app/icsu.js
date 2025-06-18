var exDB = {}
var waitingReviews = []
var pastEvents = []
var myEvents = {}

const exStatus = ["OCZEKUJĄCE", "AKTYWNE", "ODRZUCONE", "ZARCHIWIZOWANE"]
const exColor = ["warning", "success", "danger", "secondary"]

function updateICSU() {
    resetDigest()
    var url = `https://api.mobilnykatolik.pl/icsu/${userID}/${loginID}/true`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let icsu = JSON.parse(xhr.responseText)
            console.log(icsu)
            waitingReviews = icsu.waitingReviews
            pastEvents = icsu.pastEvents
            exDB = icsu.exemptions
            myEvents = icsu.myEvents

            //Projekty do zwolnień
            document.getElementById("newExemption1").innerHTML = `<option value="Inne">Inne</option>`
            for (event in myEvents) {
                document.getElementById("newExemption1").innerHTML = `<option value="${event}">${myEvents[event].name}</option>` + document.getElementById("newExemption1").innerHTML
            }
            document.getElementById("newExemption1").innerHTML = `<option selected disabled value="">Wybierz projekt, którego dotyczy zwolnienie</option>` + document.getElementById("newExemption1").innerHTML

            //Oczekujące sprawozdania
            if (waitingReviews.length > 0) {
                //document.getElementById("icsu-indicator-warning").style.display = "block"
                document.getElementById("icsu-waiting-reviews").style.display = "block"
                document.getElementById("icsu-no-projects").style.display = "none"
            } else {
                document.getElementById("icsu-indicator-success").style.display = "block"
                document.getElementById("icsu-waiting-reviews").style.display = "none"
            }

            for (wr in waitingReviews) {
                document.getElementById("icsu-waiting-reviews").innerHTML += `
                <div type="ind" onClick="makeReview('${waitingReviews[wr].eventID}')">
                    <aside><i class="fa-solid fa-circle-exclamation" style="color: #f6c23e"></i></aside>
                    <span>
                        <h6>${waitingReviews[wr].name}</h6>
                        <i>Dodaj sprawozdanie</i>
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
                <div type="ind" onClick="openReview('${pastEvents[e].eventID}')">
                    <span>
                        <h6>${pastEvents[e].name}</h6>
                        <i>${eventsdb[pastEvents[e].eventID].date.split("<br>")[0]}</i>
                    </span>
                </div>` + document.getElementById("icsu-past-events").innerHTML
            }

            //Zwolnienia
            var exCount = 0
            var allExCount = 0

            for (ex in exDB) {
                if (exDB[ex].status == 3) { continue }
                allExCount += 1
            }

            if (allExCount > 0) {
                document.getElementById("icsu-no-exemptions").style.display = "none"
                document.getElementById("icsu-exemptions").style.display = "block"
            }
            for (ex in exDB) {
                if (exDB[ex].status == 3) { continue }
                exCount += 1
                if (exCount == 1 && allExCount != 1) {
                    document.getElementById("icsu-exemptions").innerHTML += `
                    <div type="top" onClick="openExemption('${ex}')">
                        <span>
                            Zwolnienie
                            <br><i>${exDB[ex].date}</i>
                            <container class="${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                        </span>
                    </div>`
                } else if (exCount == allExCount && allExCount != 1) {
                    document.getElementById("icsu-exemptions").innerHTML += `
                    <div type="bottom" onClick="openExemption('${ex}')">
                        <span>
                            Zwolnienie
                            <br><i>${exDB[ex].date}</i>
                            <container class="${exColor[exDB[ex].status]}">${exStatus[exDB[ex].status]}</container>
                        </span>
                    </div>`
                } else if (allExCount == 1) {
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
