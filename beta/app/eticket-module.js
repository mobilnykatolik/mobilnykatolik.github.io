var ticketData = {};

function loadTickets() {

//Ładowanie biletów dostępnych do kupienia
for (let event in eticketEvents) {
    var eventBanner = `
    <div class="eticket-event-banner" id="eticket-${event}" style="background-color: ${eticketEvents[event].background_color};">
        <img src="${eticketEvents[event].thumbnail_url}">
        <div class="eticket-event-desc">
            <h1>${eticketEvents[event].title}</h1>
            <h2>${eticketEvents[event].date}</h2>
            <button class="eticket-buy-btn" onClick="openStore('${event}');">${eticketEvents[event].cost} zł</button>
        </div>
    </div>
    `
    var show = true;
    if (!eticketEvents[event].for.includes(userclass)) {
        show = false;
    }
    if (userrank == "ADMIN") {
        show = true;
    }
    if (Math.floor(Date.now() / 1000) > eticketEvents[event].store_deadline) {
        show = false;
    }
    if (show) {
        document.getElementById("etickets-buy-section").innerHTML += eventBanner;
    }
}

//Ładowanie biletów użytkownika
for (let eTicket in eTickets) {
    if (eTickets[eTicket].ownerid == undefined) {
        continue;
    }
    var eTicketId = eTicket;
    eTicket = eTickets[eTicket];
    var eventId = eTicket.eventid;
    if (userid != eTicket.ownerid) {
        continue;
    }
    var ticketState = [];
    if (eTicket.paid == eticketEvents[eventId].cost) {
        ticketState = ["BILET OPŁACONY", "#00ff00"]
        if (eTicket.consent == false) {
            ticketState = ["ZGODA NIEDOSTARCZONA", "#ff0000"]
        }
    } else {
        ticketState = ["BILET NIEOPŁACONY", "#ff0000"]
    }
    var eventBanner = `
        <div class="eticket-event-banner" id="eticket-${eTicketId}" style="background-color: ${eticketEvents[eventId].background_color};" onClick="showTicket('${eTicketId}');">
            <img src="${eticketEvents[eventId].thumbnail_url}">
            <div class="eticket-event-desc">
                <h1>${eticketEvents[eventId].title}</h1>
                <h2>${eticketEvents[eventId].date}</h2>
                <br>
                <h2 style="color: ${ticketState[1]}">${ticketState[0]}</h2>
            </div>
        </div>`
    var show = true;
    if (Math.floor(Date.now() / 1000) > eticketEvents[eventId].expires) {
        show = false;
    }
    if (show) {
        document.getElementById("etickets-my-section").innerHTML += eventBanner;
    }
}

}

function showTicket(ticketId) {
    window.alert(`Bilet nr ${ticketId} będzie widoczny 3 dni przed rozpoczęciem wydarzenia.`)
    //TU ZROBIĆ WYŚWIETLANIE BILETU
    return false;
}