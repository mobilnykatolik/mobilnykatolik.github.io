var nextEvent = ["", 4, "", false]
const miesiace = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
var todayDate;
var selectedDay = "";
var selectedDate; //"rok-miesiac-dzien"
var actualEventId;
var upcomingEvents = [];
var calendarSmartNote = "";
var allEvents = events;
var categories = 
{
    "school": {
        "color": "#d50000",
        "name": "Szkolne",
        "locked": true,
        "hidden": true
    },
    "su": {
        "color": "#33b679",
        "name": "SU",
        "locked": true,
        "hidden": true
    },
    "my": {
        "color": "#039be5",
        "name": "Moje wydarzenia"
    },
    "tests": {
        "color": "#f4511e",
        "name": "Sprawdziany",
        "locked": true
    },
    "shorttests": {
        "color": "#f6bf26",
        "name": "Kartkówki",
        "locked": true
    }
}

var myEvents = {};

for (let event in events) {
    if (events[event].for.includes(userclass) || events[event].for == "all") {
        myEvents[event] = events[event]
    }
}


if (userrank != "ADMIN") {
    events = myEvents;
}



function generateCalendar(month, year) {
    document.getElementById("calendar-month").innerHTML = `${miesiace[month]} ${year}`
    var privateEvents = localStorage.getItem("myevents");
    if (privateEvents == null) {
        privateEvents = "{}";
    }
    privateEvents = JSON.parse(privateEvents);
    for (let event in privateEvents) {
        if (categories[privateEvents[event].category] == undefined) {
            privateEvents[event].category = "my"
        }
        events[event] = privateEvents[event]
    }
    privateEvents = JSON.stringify(privateEvents);
    localStorage.setItem("myevents", privateEvents);

    document.getElementById("tag-list").innerHTML = "";
    document.getElementById("event-creator-category").innerHTML = "";

    var opt = document.createElement('option');
    opt.value = "";
    opt.innerHTML = "Wybierz kategorię";
    opt.selected = "selected"
    opt.disabled = "disabled"
    opt.hidden = "hidden"
    document.getElementById("event-creator-category").appendChild(opt);

    for (let tag in categories) {
        document.getElementById("tag-list").innerHTML += `
        <div class="tag" id="tag-${tag}" onClick="showTagEvents('${tag}')">
            <div style="background-color: ${categories[tag].color}"></div>
            <span>${categories[tag].name}</span>
        </div>`
        if (categories[tag].hidden != true) {
            var opt = document.createElement('option');
            opt.value = tag;
            opt.innerHTML = categories[tag].name;
            document.getElementById("event-creator-category").appendChild(opt);
        }
    }

    selectedDay = "";
    selectedDate = "";
    //Układanie kalendarza (dni tygodnia, dni)

    //"Pas wydarzeń"
    var eventsIndicators = "";

    var date = new Date();
    
    //Wyznaczanie dnia dzisiejszego
    todayDate = [];
    if (date.getDate() < 10) {
        todayDate[0] = "0"+String(date.getDate())
    } else {
        todayDate[0] = String(date.getDate())
    }
    if (date.getMonth()+1 < 10) {
        todayDate[1] = "0"+String(date.getMonth()+1)
    } else {
        todayDate[1] = String(date.getMonth()+1)
    }
    todayDate[2] = String(date.getFullYear())
    todayDate = todayDate.join(".");


    var calGen = [1, 1, 1] //Dzień tygodnia, wiersz, data (dzień)
    var calTable = '<table class="calendar"><tr><th>P</th><th>W</th><th>Ś</th><th>C</th><th>P</th><th>S</th><th>N</th></tr><tr class="calendar-days">'
    date = new Date(year, month, 1);
    var startDay = date.getDay();
    startDay = parseInt(String(startDay).replace("0", "7"));
    if (startDay != 1) {
        for (let i = 1; i < startDay; i++) {
            calTable += '<td class="no-day"></td>'
            eventsIndicators += '<td></td>'
        }
    }
    date = new Date(year, month, calGen[2]);
    var miesiac = date.getMonth();
    while (miesiac == month) {
        date = new Date(year, month, calGen[2]);

        //Formatowanie nazwy dla znaczników wydarzeń
        dateFormatted = [];
        if (date.getDate() < 10) {
            dateFormatted[0] = "0"+String(date.getDate())
        } else {
            dateFormatted[0] = String(date.getDate())
        }
        if (date.getMonth()+1 < 10) {
            dateFormatted[1] = "0"+String(date.getMonth()+1)
        } else {
            dateFormatted[1] = String(date.getMonth()+1)
        }
        dateFormatted[2] = String(date.getFullYear())
        dateFormatted = dateFormatted.join(".");

        calGen[0] = date.getDay();
        if (calGen[0] == 1 && date.getMonth() == month && date.getDate() != 1) {
            calTable += `</tr><tr class="events-indicators">${eventsIndicators}</tr>`
            calTable += '<tr class="calendar-days">'
            eventsIndicators = "";
        }
        if (date.getMonth() == month) {
            if (dateFormatted == todayDate) {
                calTable += `<td onClick='showDay("${dateFormatted}")' class="today-day" id="day${dateFormatted}">${date.getDate()}</td>`
            } else {
                calTable += `<td onClick='showDay("${dateFormatted}")' id="day${dateFormatted}">${date.getDate()}</td>`
            }
            eventsIndicators += `<td id="${dateFormatted}"></td>`
        }
        calGen[2] = calGen[2] + 1
        date = new Date(year, month, calGen[2]);
        miesiac = date.getMonth();

    }
    calTable += `</tr><tr class="events-indicators">${eventsIndicators}</tr>`
    document.getElementById("calendar").innerHTML = calTable;
    //document.getElementById("calendar-month-year").innerHTML = `${miesiace[month]} ${year}`

    for (let event in events) {
        if (categories[events[event].category] == undefined) {
            events[event].category = "my"
        }
        if (document.getElementById(events[event].date) != null) {
            document.getElementById(events[event].date).innerHTML += `<div class="ei" style="background-color: ${categories[events[event].category].color};"></div>`
            /*if (events[event].category == undefined) {
                document.getElementById(events[event].date).innerHTML += `<div class="ei" style="background-color: #ff0000;"></div>`
            }
            
            if (events[event].category == "beta") {
                document.getElementById(events[event].date).innerHTML += `<div class="ei" style="background-color: #0000ff;"></div>`
            }*/

        }
    }

    document.getElementById("events-list").innerHTML = "";
    document.getElementById("selected-day").innerHTML = "";
    document.getElementById("event-creator-date").value = "";




}

function showDay(date) {
    if (selectedDay != "") {
        document.getElementById(selectedDay).classList.remove("selected-day");
    }
    selectedDay = `day${date}`
    selectedDate = date.split(".");
    selectedDate = `${selectedDate[2]}-${selectedDate[1]}-${selectedDate[0]}`
    document.getElementById("event-creator-date").value = selectedDate;
    document.getElementById(selectedDay).classList.add("selected-day");
    document.getElementById("selected-day").innerHTML = date;
    var eventList = "";
    for (let event in events) {
        if (events[event].date == date) {
            eventList += `<tr onClick='showEvent("${event}")'><td>${events[event].title}</td></tr>`
        }
    }

    if (eventList != "") {
        document.getElementById("events-list").innerHTML = `<table class="events-list">${eventList}</table>`
    } else {
        document.getElementById("events-list").innerHTML = `<h4>Brak wydarzeń tego dnia!</h4>`
    }
}


function showEvent(eventid) {
    actualEventId = eventid;
    if (eventid.startsWith("pv")) {
        document.getElementById("modify-event-box").style.display = "block";
    } else {
        document.getElementById("modify-event-box").style.display = "none";
    }
    eventData = "";
    eventInfo = events;
    eventInfo = eventInfo[eventid];

    eventData += `<h2>${eventInfo.title}</h2><h3>Data</h3><h4>${eventInfo.date}</h4>`
    
    if (eventInfo.time != "") {
        eventData += `<h3>Godzina</h3><h4>${eventInfo.time}</h4>`
    }
    if (eventInfo.special_suit == true) {
        eventData += `<h3>Ważne</h3><h4>Wymagany strój galowy</h4>`
    } 
    if (eventInfo.desc != "") {
        eventData += `<h3>Dodatkowe informacje</h3><h4>${eventInfo.desc}</h4>`
    }
    eventData += `
    <br>
    <div class="tag">
        <div style="background-color: ${categories[eventInfo.category].color}"></div>
        <span>${categories[eventInfo.category].name}</span>
    </div>`
    
    document.getElementById("event-info").innerHTML = eventData;
    openModule('event');
}

function showTagEvents(tag) {
    var privateEvents = localStorage.getItem("myevents");
    if (privateEvents == null) {
        privateEvents = "{}";
    }
    privateEvents = JSON.parse(privateEvents);
    for (let event in privateEvents) {
        events[event] = privateEvents[event]
    }

    var eventList = "";
    for (let event in events) {
        if (events[event].category == tag) {
            eventList += `<tr onClick='showEvent("${event}")'><td>${events[event].date}</td><td style="width: 100%;">${events[event].title}</td></tr>`
        }
    }

    if (eventList != "") {
        document.getElementById("tag-events-list").innerHTML = `<table class="events-list">${eventList}</table>`
    } else {
        document.getElementById("tag-events-list").innerHTML = `<center><h4>Brak wydarzeń z wybranym tagiem</h4></center>`
    }

    document.getElementById("tag-display").innerHTML = `
        <div style="background-color: ${categories[tag].color}"></div>
        <span>${categories[tag].name}</span>
    `

    openModule("tag-events");
}


function loadToday() {
    //GENEROWANIE KALENDARZA -> później wykorzystać do przełączania między miesiącami
    date = new Date();
    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();
    generateCalendar(month, year);

    if (month+1 < 10) {
        month = "0"+String(month+1);
    } else {
        month = String(month+1);
    }

    if (day < 10) {
        day = "0"+String(day);
    } else {
        day = String(day);
    }

    monthFormatted = String(date.getFullYear())+"-"+month;
    document.getElementById("calendar-month-select").value = monthFormatted;

    //Formatowanie nazwy dla znaczników wydarzeń
    var dateFormatted;
    dateFormatted = `${day}.${month}.${String(year)}`
    showDay(dateFormatted);

    //#############################################
}

loadToday();


function changeMonth() {
    var ym = document.getElementById("calendar-month-select").value;
    if (ym == "") {
        date = new Date();
        if (date.getMonth()+1 < 10) {
            monthFormatted = String(date.getFullYear())+"-0"+String(date.getMonth()+1);
        } else {
            monthFormatted = String(date.getFullYear())+"-"+String(date.getMonth()+1);
        }
        ym = monthFormatted;
        document.getElementById("calendar-month-select").value = ym;
    }
    ym = ym.split("-");
    ym[0] = parseInt(ym[0]);
    ym[1] = parseInt(ym[1])-1;
    generateCalendar(ym[1], ym[0]);
}

function createEvent() {
    document.getElementById("event-creator-id").value = "";
    document.getElementById("event-creator-submit").value = "Dodaj do kalendarza";
    return false;
}


function addEvent() {
    var month,
        year;
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789",
        retVal = "pv-";
    for (var i = 0, n = charset.length; i < 8; ++i) {retVal += charset.charAt(Math.floor(Math.random() * n));}

    var eventData = []
    eventData.push(document.getElementById("event-creator-title").value);
    eventData.push(document.getElementById("event-creator-date").value);
    eventData.push(document.getElementById("event-creator-starttime").value);
    eventData.push(document.getElementById("event-creator-endtime").value);
    eventData.push(document.getElementById("event-creator-desc").value.replaceAll("\n", "<br>"));
    eventData.push(document.getElementById("event-creator-category").value);
    eventData.push(document.getElementById("event-creator-id").value);

    if (eventData[6] == "") {
        eventData[6] = retVal;
    }
    
    eventData[1] = eventData[1].split("-");
    month = parseInt(eventData[1][1])-1;
    year = parseInt(eventData[1][0]);
    eventData[1] = `${eventData[1][2]}.${eventData[1][1]}.${eventData[1][0]}`
    if (eventData[2] != "" && eventData[3] != "") {
        eventData[2] = `${eventData[2]}-${eventData[3]}`
    }
    if (eventData[2] != "" && eventData[3] == "") {
        eventData[2] = `od ${eventData[2]}`
    }
    if (eventData[2] == "" && eventData[3] != "") {
        eventData[2] = `do ${eventData[3]}`
    }

    var privateEvents = localStorage.getItem("myevents");
    if (privateEvents == null) {
        privateEvents = "{}";
    }
    privateEvents = JSON.parse(privateEvents);
    privateEvents[eventData[6]] = 
    {
        "date": eventData[1],
        "time": eventData[2],
        "title": eventData[0],
        "desc": eventData[4],
        "category": eventData[5]
    }
    privateEvents = JSON.stringify(privateEvents);
    localStorage.setItem("myevents", privateEvents);
    generateCalendar(month, year);
    showDay(eventData[1]);
    closeModule();
    if (document.getElementById("event-creator-id").value != "") {
        closeModule();
    }
    if (openedModule[openedModule.length-1] == "tag-events") {
        closeModule();
    }
    if (month+1 < 10) {
        month = "0"+String(month+1)
    } else {
        month = String(month+1)
    }
    document.getElementById("calendar-month-select").value = `${String(year)}-${month}`;
    document.getElementById("event-creator-title").value = "";
    document.getElementById("event-creator-date").value = "";
    document.getElementById("event-creator-starttime").value = "";
    document.getElementById("event-creator-endtime").value = "";
    document.getElementById("event-creator-desc").value = "";
    document.getElementById("event-creator-category").value = "";
    document.getElementById("event-creator-id").value = "";
    getUpcomingEvents()
    return false;
}

function removeEvent() {
    if (window.confirm(`Czy na pewno chcesz usunąć wydarzenie "${events[actualEventId].title}"?`)) {
        var privateEvents = localStorage.getItem("myevents");
        if (privateEvents == null) {
            privateEvents = "{}";
        }
        privateEvents = JSON.parse(privateEvents);
        delete privateEvents[actualEventId];
        delete events[actualEventId];
        privateEvents = JSON.stringify(privateEvents);
        localStorage.setItem("myevents", privateEvents);
        var x = selectedDate.split("-")
        generateCalendar(parseInt(x[1])-1, parseInt(x[0]));
        showDay(`${x[2]}.${x[1]}.${x[0]}`);
        closeModule();
        if (openedModule[openedModule.length-1] == "tag-events") {
            closeModule();
        }
        getUpcomingEvents();
    }
}

function editEvent() {
    openModule('create-event');
    eid = actualEventId;
    var eventData = [events[eid].title, events[eid].date, events[eid].time, events[eid].desc, events[eid].category]
    eventData[1] = eventData[1].split(".")
    eventData[1] = `${eventData[1][2]}-${eventData[1][1]}-${eventData[1][0]}`
    if (eventData[2].includes("od")) {
        eventData[2] = eventData[2].slice(3);
        eventData[2] = [eventData[2], ""]
    } else if (eventData[2].includes("do")) {
        eventData[2] = eventData[2].slice(3);
        eventData[2] = ["", eventData[2]]
    } else if (eventData[2].includes("-")) {
        eventData[2] = eventData[2].split("-")
    }
    document.getElementById("event-creator-submit").value = "Edytuj wydarzenie";
    document.getElementById("event-creator-title").value = eventData[0];
    document.getElementById("event-creator-date").value = eventData[1];
    document.getElementById("event-creator-starttime").value = eventData[2][0];
    document.getElementById("event-creator-endtime").value = eventData[2][1];
    document.getElementById("event-creator-desc").value = eventData[3];
    document.getElementById("event-creator-category").value = eventData[4];
    document.getElementById("event-creator-id").value = eid;
}


let touchstartX = 0;
let touchendX = 0;

const gestureZone = document.getElementById('calendar');

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    handleGesture();
}, false); 

function handleGesture() {
    let touchDiff = touchstartX-touchendX
    if (touchDiff >= 25) {
        nextMonth();
    }
    
    if (touchDiff <= -25) {
        prevMonth();
    }

}

function nextMonth() {
    var date = document.getElementById("calendar-month-select").value;
    date = date.split("-")
    date[0] = parseInt(date[0])
    date[1] = parseInt(date[1])
    if (date[0] == 2023 && date[1] == 8) {
        return false;
    }
    if (date[1] == 12) {
        date[0] += 1
        date[1] = 1
    } else {
        date[1] += 1
    }
    if (date[1] < 10) {
        date[1] = "0"+String(date[1])
    }
    date = `${date[0]}-${date[1]}`
    document.getElementById("calendar-month-select").value = date;
    changeMonth();
}

function prevMonth() {
    var date = document.getElementById("calendar-month-select").value;
    date = date.split("-")
    date[0] = parseInt(date[0])
    date[1] = parseInt(date[1])
    if (date[0] == 2022 && date[1] == 9) {
        return false;
    }
    if (date[1] == 1) {
        date[0] -= 1
        date[1] = 12
    } else {
        date[1] -= 1
    }
    if (date[1] < 10) {
        date[1] = "0"+String(date[1])
    }
    date = `${date[0]}-${date[1]}`
    document.getElementById("calendar-month-select").value = date;
    changeMonth();
}

function getUpcomingEvents() {
    upcomingEvents = [];
    var date = new Date();
    let day = date.getDate();
    let year = date.getFullYear();
    let month = date.getMonth();
    var date1 = new Date(year, month, day);
    var maxDiff = 0;
    for (let event in events) {
        var date2 = events[event].date.split(".");
        date2 = new Date(parseInt(date2[2]), parseInt(date2[1])-1, parseInt(date2[0]));
        var diffDays = date2 - date1;
        diffDays = Math.ceil(diffDays / (1000 * 60 * 60 * 24)); 
        if (diffDays > maxDiff) {
            maxDiff = diffDays;
        }
    }

    for(var i = 0; i < maxDiff; i++){
        for (let event in events) {
            var date2 = events[event].date.split(".");
            date2 = new Date(parseInt(date2[2]), parseInt(date2[1])-1, parseInt(date2[0]));
            var diffDays = date2 - date1;
            diffDays = Math.ceil(diffDays / (1000 * 60 * 60 * 24));
            if (diffDays == i) {
                upcomingEvents.push(JSON.parse(`{"id": "${event}", "in": ${parseInt(i)}}`));
            }
        }
    }

    var minIn = upcomingEvents[0].in;
    var upcomingEventsId = []
    for (let event in upcomingEvents) {
        if (upcomingEvents[event].in == minIn) {
            upcomingEventsId.push(upcomingEvents[event].id);
        }
    }
    var specialSuit = false;
    for (let i in upcomingEventsId) {
        if (events[upcomingEventsId[i]].special_suit == true) {
            specialSuit = true;
        }
        upcomingEventsId[i] = events[upcomingEventsId[i]].title;
    }
    
    calendarSmartNote = "";
    if (upcomingEvents[0].in == 0) {
        calendarSmartNote = `🗓️ Dziś: ${upcomingEventsId.join(", ")}`;
    } else if (upcomingEvents[0].in == 1) {
        calendarSmartNote = `🗓️ Jutro: ${upcomingEventsId.join(", ")}`;
    } else if (upcomingEvents[0].in <= 3) {
        calendarSmartNote = `🗓️ Za ${upcomingEvents[0].in} dni: ${upcomingEventsId.join(", ")}`;
    }

    if (events[upcomingEvents[0].id].special_suit == true) {
        calendarSmartNote += "<br>Pamiętaj o stroju galowym 👔";
    }
    updateSmartNote();
}

getUpcomingEvents();



/*
for (let event in events) {
    var date = new Date();
    let hour = date.getHours();
    let day = date.getDate();
    let year = date.getFullYear();
    let month = date.getMonth();
    var date1 = new Date(year, month, day);

    var date2 = events[event].date.split(".");
    date2 = new Date(parseInt(date2[2]), parseInt(date2[1])-1, parseInt(date2[0]));

    var diffDays = date2 - date1;
    diffDays = Math.ceil(diffDays / (1000 * 60 * 60 * 24)); 
    if (diffDays >= 0) {
        eventsTable += `<tr onClick='showEvent("${event}");'><td>${events[event].date}</td><td>${events[event].title}</td></tr>`
    }

    //Smart-note
    if (diffDays <= 3 && diffDays >= 0) {
        if (diffDays == 0 && hour >= 14) {
            //Wydarzenie dzisiejsze jest pomijane
        } else if (diffDays < nextEvent[1]) {
            nextEvent[0] = events[event].title;
            nextEvent[1] = diffDays;
            nextEvent[2] = event;
            nextEvent[3] = events[event]["special_suit"];
        } else if (diffDays == nextEvent[1]) {
            nextEvent[0] = nextEvent[0]+", "+events[event].title;
            nextEvent[1] = diffDays;
            nextEvent[2] = event;
            if (!nextEvent[3]) {
                nextEvent[3] = events[event]["special_suit"];
            }
        }
    }

}
*/