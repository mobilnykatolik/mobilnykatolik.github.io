var exDB = {}
var waitingReviews = []

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
            waitingReviews = icsu.waitingReviews
            exDB = icsu.exemptions

            //Oczekujące sprawozdania
            if (waitingReviews.length > 0) {
                document.getElementById("icsu-indicator-warning").style.display = "block"
            } else {
                document.getElementById("icsu-indicator-success").style.display = "block"
            }

            //Zakończone projekty
            var projectsCount = 0
            for (e in eventsdb) {
                if (!eventsdb[e].my) {continue}
                if (waitingReviews.includes(e)) {continue}
                projectsCount += 1
                document.getElementById("icsu-past-events").innerHTML = `
                <div type="ind">
                    <span>
                        ${eventsdb[e].name}
                        <br><i>${eventsdb[e].date.split("<br>")[0]}</i>
                    </span>
                </div>` + document.getElementById("icsu-past-events").innerHTML
            }
            if (projectsCount > 0) {
                document.getElementById("icsu-past-events").style.display = "block"
                document.getElementById("icsu-no-projects").style.display = "none"
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
}
