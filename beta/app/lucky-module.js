var today = new Date();
var tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

hour = today.getHours();
dd = String(today.getDate()).padStart(2, '0');
mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
yyyy = today.getFullYear();
today = dd + '.' + mm + '.' + yyyy;
todayShort = dd + '.' + mm

dd = String(tomorrow.getDate()).padStart(2, '0');
mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
yyyy = tomorrow.getFullYear();
tomorrow = dd + '.' + mm + '.' + yyyy;
tomorrowShort = dd + '.' + mm


if (localStorage.getItem("lndata") != null) {

    luckynumbers = JSON.parse(localStorage.getItem("lndata"));

    if (luckynumbers[today] != undefined) {
        ln = luckynumbers[today]
        lnToday = "<h2>Dziś ("+todayShort+")</h2> <table> <tr> <td>7A</td> <td>"+ln["7a"]+"</td> </tr> <tr> <td>8A</td> <td>"+ln["8a"]+"</td> </tr> <tr> <td>8B</td> <td>"+ln["8b"]+"</td> </tr> <tr> <td>1 LO</td> <td>"+ln["1lo"]+"</td> </tr> <tr> <td>2 LO</td> <td>"+ln["2lo"]+"</td> </tr> <tr> <td>3 LO</td> <td>"+ln["3lo"]+"</td> </tr> <tr> <td>4 LO</td> <td>"+ln["4lo"]+"</td> </tr> </table>"
        if (userclass != "nauczyciel") {
            if (ln[userclass].includes(usersname+" "+userfname)) {
                luckyToday = true;
            }
        }
    } else {
        lnToday = "<h2><center>Dzisiaj nie ma szczęśliwych numerków!</center></h2>"
    }
    
    if (luckynumbers[tomorrow] != undefined && hour >= 15) {
        ln = luckynumbers[tomorrow]
        lnTomorrow = "<h2>Jutro ("+tomorrowShort+")</h2> <table> <tr> <td>7A</td> <td>"+ln["7a"]+"</td> </tr> <tr> <td>8A</td> <td>"+ln["8a"]+"</td> </tr> <tr> <td>8B</td> <td>"+ln["8b"]+"</td> </tr> <tr> <td>1 LO</td> <td>"+ln["1lo"]+"</td> </tr> <tr> <td>2 LO</td> <td>"+ln["2lo"]+"</td> </tr> <tr> <td>3 LO</td> <td>"+ln["3lo"]+"</td> </tr> <tr> <td>4 LO</td> <td>"+ln["4lo"]+"</td> </tr> </table>"
        if (userclass != "nauczyciel") {
            if (ln[userclass].includes(usersname+" "+userfname)) {
                luckyTomorrow = true;
            }
        }
        document.getElementById("tomorrowsln").innerHTML = "";
    } else if (luckynumbers[tomorrow] != undefined) {
        document.getElementById("tomorrowsln").innerHTML = "Szczęśliwe numerki na następny dzień<br>po godz. 15:00";
        lnTomorrow = ""
    } else {
        lnTomorrow = ""
        document.getElementById("tomorrowsln").innerHTML = "";
    }
    
    if (luckynumbers[today] == undefined && luckynumbers[tomorrow] == undefined) {
        lnToday = "<h2><center>Dziś i jutro nie ma szczęśliwego numerka!</center></h2>"
        lnTomorrow = ""
        document.getElementById("tomorrowsln").innerHTML = "";
    }
    
    document.getElementById("lnToday").innerHTML = lnToday;
    document.getElementById("lnTomorrow").innerHTML = lnTomorrow;
}


//console.log(`Aktualna wersja: ${lnActualVersion}\nZainstalowana wersja: ${lnInstalledVersion}`)
if (lnActualVersion != lnInstalledVersion) {
    lnkey = localStorage.getItem("lnkey").split("");
    lnkey = `${lnkey[0]}${lnkey[1]}7${lnkey[1]}b${lnkey[3]}142b${lnkey[1]}499${lnkey[1]}2${lnkey[1]}b00a${lnkey[2]}94`;

    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status == 200) {
            localStorage.setItem("lndata", req.responseText);
            var lnData = JSON.parse(localStorage.getItem("lndata"));
            var lnDataVersion = lnData.version;
            localStorage.setItem("lnversion", lnDataVersion);
            window.alert("Pomyślnie zaktualizowano bazę danych szczęśliwego numerka, uruchamiam aplikację ponownie...");
            window.location.reload();
        }
    }
    };

    req.open("GET", `https://api.jsonbin.io/v3/b/${lnkey}/latest`, true);
    req.setRequestHeader("X-Master-Key", "$2b$10$3x/3VAsD1CbEfvPX2dZfEOtqcbbrVoml.mzGNwmzyjMaQfXJGmVF6");
    req.setRequestHeader("X-Bin-Meta", "false");
    req.send();
}