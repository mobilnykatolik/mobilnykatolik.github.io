//Moduł Moje akwarium
var userPoints = 0;
var userPointsHistory;
if (points[userid] != undefined) {
    userPointsHistory = points[userid].history;
}

if (userPointsHistory != undefined) {
    userPointsHistory = userPointsHistory.split(";")
    userPointsHistory.forEach(element => {
        element = element.split(":")
        userPoints += parseInt(element[1]);
        var color = "#999999";
        if (element[1] > 0) {
            element[1] = "+"+String(element[1])
            color = "#08cc08";
        } else if (element[1] < 0) {
            color = "#ba0909";
        }
        document.getElementById("points-history").innerHTML += `<tr style="color: ${color}"><td>${element[1]}</td><td>${allEvents[element[0]].title}</td></tr>`
    });
    document.getElementById("points-count").innerHTML = String(userPoints);
    document.getElementById("points-count-wdg").innerHTML = String(userPoints);
} else {
    document.getElementById("points-history").innerHTML = "<tr><td>Nie masz żadnych Wirtualnych Rybek!</td></tr>";
}