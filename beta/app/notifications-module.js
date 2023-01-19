var readNotifications = localStorage.getItem("readnotify");
var openedNotification;
var isStartup = true;

//Jeśli w danych nie ma wpisanych nieprzeczytanych powiadomień
if (readNotifications == null) {
    readNotifications = [];
    for (let notification in notifications) {
        if (notifications[notification].id != "WELCOME") {
            readNotifications.push(notifications[notification].id);
        }
    }
    localStorage.setItem("readnotify", readNotifications.join(";"));
}

//Weryfikacja pustych powiadomień
readNotifications = localStorage.getItem("readnotify");
readNotifications = readNotifications.split(";")
for (let notification in readNotifications) {
    if (readNotifications[notification] == "") {
        var index = readNotifications.indexOf(readNotifications[notification]);
        readNotifications.splice(index, 1);
    }
}
localStorage.setItem("readnotify", readNotifications.join(";"));


var myNotifications = [];

for (let notification in notifications) {
    if (notifications[notification].for != undefined) {
        if (notifications[notification].for.includes(userclass) || notifications[notification].for.toUpperCase() == "ALL") {
            myNotifications[notification] = notifications[notification]
        }
    }
}

if (userrank != "ADMIN") {
    notifications = myNotifications;
}

/*if (readNotifications == null) {
    readNotifications = "";
    notifications.forEach(function(notify) {
      //to drugie notify.id to powiadomienie dot. sprzedazy bluz i toreb
        if (notify.id != "WELCOME" && notify.id != "U40$eUFM0ay!") {
            readNotifications += notify.id+";"
        }
    });
    localStorage.setItem("readnotify", readNotifications);
}*/


function loadNotifications() {
    readNotifications = localStorage.getItem("readnotify");
    readNotifications = readNotifications.split(";");
    var newNotifications = 0;
    var newNotificationsList = "";
    var viewedNotificationsList = "";
    var welcomeNotifyRead = false;
    var showOnStartupNotification;
    notifications.forEach(function generateNotifications(notificationData) {
        if (readNotifications.includes(notificationData.id)) {
            viewedNotificationsList = 
                `
                <div class="notification" id="notification-${notificationData.id}" onClick='openNotification("${notificationData.id}");'>
                    <p class="notification-title">${notificationData.title}</p>
                    <p class="notification-desc">${notificationData.desc.split("<br>")[0]}</p>
                    <p class="notification-date">${notificationData.date}</p>
                </div>
                ` + viewedNotificationsList
        } else {
            if (notificationData.id == "WELCOME") {
                welcomeNotifyRead = true;
            } else {
                if (notificationData.showonstartup == true) {
                    showOnStartupNotification = notificationData.id;
                }
                newNotificationsList = 
                    `
                    <div class="notification" id="notification-${notificationData.id}" onClick='openNotification("${notificationData.id}");'>
                        <b>
                        <p class="notification-title">${notificationData.title}</p>
                        <p class="notification-desc">${notificationData.desc.split("<br>")[0]}</p>
                        </b>
                        <p class="notification-date">${notificationData.date}</p>
                    </div>
                    ` + newNotificationsList
            }
            newNotifications += 1
        }
    });

    if (welcomeNotifyRead) {
        newNotificationsList = 
            `
            <div class="notification" id="notification-WELCOME" onClick='openNotification("WELCOME");'>
                <b>
                <p class="notification-title">${notifications[0].title}</p>
                <p class="notification-desc">${notifications[0].desc.split("<br>")[0]}</p>
                </b>
            </div>
            ` + newNotificationsList
    }
    
    if (newNotificationsList != "") {
        document.getElementById("notifications").innerHTML = newNotificationsList;
    } else {
        document.getElementById("notifications").innerHTML = "<h2>Brak nowych powiadomień</h2>";
    }
    
    document.getElementById("viewed-notifications").innerHTML = viewedNotificationsList;
    
    if (newNotifications > 0) {
        document.getElementById("notifications-btn").style.animationName = "pulse";
        document.getElementById("notifications-indicator").style.display = "block";
        document.getElementById("notifications-indicator").innerHTML = `${newNotifications}`;
        if (newNotifications > 9) {
            document.getElementById("notifications-indicator").innerHTML = "9+";
        }
    } else {
        document.getElementById("notifications-btn").style.animationName = "";
        document.getElementById("notifications-indicator").style.display = "none";
        document.getElementById("notifications-indicator").innerHTML = "";  
    }
    if (showOnStartupNotification != undefined && isStartup == true) {
        openNotification(showOnStartupNotification);
    }
    isStartup = false;
}

function openNotification(notificationID) {
    var notification;
    notifications.forEach(function(notify) {
        if (notify.id == notificationID) {
            notification = notify;
        }
    });
    document.getElementById("notification-title").innerHTML = notification.title;
    document.getElementById("notification-desc").innerHTML = notification.desc;
    document.getElementById("notification-img").src = notification.imgurl;
    openModule("notification");
    readNotifications = localStorage.getItem("readnotify");
    readNotifications = readNotifications.split(";");
    if (!readNotifications.includes(notificationID)) {
        readNotifications.push(notificationID)
        localStorage.setItem("readnotify", readNotifications.join(";"));
    }
    loadNotifications();
    openedNotification = notificationID;
}

function unreadNotification() {
    notificationID = openedNotification;
    readNotifications = localStorage.getItem("readnotify");
    readNotifications = readNotifications.split(";");
    if (!readNotifications.includes(notificationID)) {
        return false;
    }
    for (let notification in readNotifications) {
        if (readNotifications[notification] == notificationID) {
            var index = readNotifications.indexOf(readNotifications[notification]);
            readNotifications.splice(index, 1);
        }
    }
    localStorage.setItem("readnotify", readNotifications.join(";"));
    loadNotifications();
    closeModule();
}

function toggleOldNotifications() {
    if (document.getElementById("show-old-notifications").innerHTML == "Wyświetl starsze powiadomienia") {
        document.getElementById("show-old-notifications").innerHTML = "Ukryj starsze powiadomienia"
        document.getElementById("viewed-notifications").style.display = "block";
    } else {
        document.getElementById("show-old-notifications").innerHTML = "Wyświetl starsze powiadomienia"
        document.getElementById("viewed-notifications").style.display = "none";
    }
}

loadNotifications();