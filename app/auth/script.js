var pages = ["login", "register", "loading", "code", "success", "redirect-error"]
var heightData = []
var widthData = ["23rem", "30rem", "23rem", "23rem", "23rem", "23rem"]

var switchingPage = false

let ignoreRedirectError = false;

function onLoad() {
    document.querySelector(".splash").style.opacity = "0"
    for (page in pages) {
        heightData.push(`${document.getElementById(pages[page]).offsetHeight}px`)
        document.getElementById(pages[page]).style.display = "none"
        document.getElementById(pages[page]).style.visibility = "visible"
    }
    if (window.opener == null && ignoreRedirectError == false) {
        document.getElementById("mainbox").style.width = widthData[5];
        document.getElementById("mainbox").style.height = heightData[5];
        document.getElementById("redirect-error").style.display = "flex"
        document.getElementById("redirect-error").classList.add("show")
        document.getElementById("mainbox").style.opacity = "1"
    } else {
        document.getElementById("mainbox").style.width = widthData[0];
        document.getElementById("mainbox").style.height = heightData[0];
        document.getElementById("login").style.display = "flex"
        document.getElementById("login").classList.add("show")
        document.getElementById("mainbox").style.opacity = "1"
    }
}

function switchPage(newPage) {
    if (switchingPage) { return false; }
    //if (window.opener == null) { return false; }
    switchingPage = true
    const oldPage = document.querySelector('#mainbox .show').id;
    let pageIndex = pages.indexOf(newPage)

    document.getElementById(oldPage).style.opacity = "0"
    document.getElementById(newPage).style.opacity = "0"
    document.getElementById(oldPage).classList.remove("show")
    setTimeout(function() {
        //Ponowny pomiar
        document.getElementById(newPage).style.display = "flex"
        document.getElementById(newPage).style.visibility = "hidden"
        heightData[pageIndex] = `${document.getElementById(newPage).offsetHeight}px`
        //Rejestracja na urządzeniach mobilnych
        if (document.querySelector("body").offsetWidth <= 576) {
            heightData[1] = "calc(100vh - 80px)"
            if (newPage == "register") { document.getElementById("mainbox").classList.add("fullwidth") } else { document.getElementById("mainbox").classList.remove("fullwidth") }
        }
        document.getElementById("mainbox").style.height = heightData[pageIndex]
        document.getElementById("mainbox").style.width = widthData[pageIndex]
        document.getElementById(newPage).style.display = "none"
        document.getElementById(newPage).style.visibility = "visible"
        document.querySelector(".splash").style.display = "none"
    }, 500)
    setTimeout(function() {
        document.getElementById(oldPage).style.display = "none"
        document.getElementById(newPage).style.display = "flex"
        document.getElementById(newPage).classList.add("show")
        setTimeout(() => {
            document.getElementById(newPage).style.opacity = "1"
            switchingPage = false
        }, 200); 
    }, 800)
}

//Pobieranie listy klas
function getClasses() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            if (req.status == 200) {
                var classes = req.responseText.split(";")
                console.log(classes);
                document.getElementById("signup-class").innerHTML = `<option value="" style="color: #a9a9a9;" selected disabled>Wybierz klasę</option>`
                for (x in classes) {
                    document.getElementById("signup-class").innerHTML += `
                    <option value="${classes[x]}">${classes[x].toUpperCase()}</option>
                    `
                }
                document.getElementById("signup-class").innerHTML += `<option value="n">Nauczyciel</option>`
                console.log(req.responseText)
            } else {
                document.getElementById("signup-class").innerHTML = `<option value="" style="color: #a9a9a9;" selected hidden>Wystąpił błąd! Odśwież aplikację.</option>`
            }
        }
    };

    req.open("GET", `https://api.mobilnykatolik.pl/getclasses`, true);
    req.send();
}
getClasses();

var email;
var code;

//Logowanie
function login() {
    document.getElementById("login-notification").innerHTML = " "
    email = document.getElementById("login-email").value
    switchPage("loading")
    setTimeout(function() {
        sendSignInCode()
    }, 1500);
    return false;
}

//Rejestracja
function signup() {
    document.getElementById("signup-notification").innerHTML = " "
    email = document.getElementById("signup-email").value
    switchPage("loading")
    setTimeout(function() {
        sendSignUpCode()
    }, 1500);
    return false;
}

function sendSignUpCode() {
    var data = {
        "firstname": document.getElementById("signup-firstname").value.toUpperCase().replaceAll(" ", ""),
        "lastname": document.getElementById("signup-lastname").value.toUpperCase().replaceAll(" ", ""),
        "class": document.getElementById("signup-class").value,
        "email": email
    }
    var url = "https://api.mobilnykatolik.pl/register";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                document.getElementById("code-instruction").innerHTML = response.message
                document.getElementById("fullname").innerHTML = response.fullname
                document.getElementById("profilepic").src = `https://api.mobilnykatolik.pl/profilepic/get/${response.userid}`
                switchPage("code")
            } else if (xhr.status == 403) {
                switchPage("register")
                document.getElementById("signup-notification").innerHTML = "Istnieje już konto z podanym adresem e-mail!"
            } else if (xhr.status == 406) {
                switchPage("register")
                document.getElementById("signup-notification").innerHTML = "Konto na podane dane osobowe zostało już zarejestrowane!"
            } else if (xhr.status == 404) {
                switchPage("register")
                document.getElementById("signup-notification").innerHTML = "Nie znaleziono na liście uczniów. Sprawdź poprawność danych.<br>Jeśli uważasz, że to błąd, napisz do nas: mobilnykatolik@gmail.com."
            } else {
                switchPage("register")
                document.getElementById("signup-notification").innerHTML = "Wystąpił problem komunikacji z API. Spróbuj ponownie!"
            }
        }
    };

    xhr.send(JSON.stringify(data));
}

function sendSignInCode() {
    var url = `https://api.mobilnykatolik.pl/login/${email}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            document.getElementById("code-instruction").innerHTML = response.message
            document.getElementById("fullname").innerHTML = response.fullname
            document.getElementById("profilepic").src = `https://api.mobilnykatolik.pl/profilepic/get/${response.userid}`
            switchPage("code")
        } else if (xhr.status == 400) {
            switchPage("login")
            document.getElementById("login-notification").innerHTML = "Konto nie istnieje!"
        } else {
            switchPage("login")
            document.getElementById("login-notification").innerHTML = "Wystąpił problem komunikacji z API. Spróbuj ponownie!"
        }
    };

    xhr.send();
}

function checkCode() {
    document.getElementById("code-notification").innerHTML = " "
    switchPage("loading")
    code = document.getElementById("code-input").value.replaceAll(" ", "")
    var url = `https://api.mobilnykatolik.pl/code/${email}/${code}`;	
    var xhr = new XMLHttpRequest();	
    xhr.open("GET", url);	
    xhr.onreadystatechange = function() {	
      if (xhr.status == 200) {		
        console.log(xhr.responseText);
        window.opener.postMessage(`${xhr.responseText}`, "*");
      } else if (xhr.status == 406) { //Invalid code	
        switchPage("code")
        document.getElementById("code-notification").innerHTML = "Kod nieprawidłowy!"	
      } else if (xhr.status == 410) { //Code has expired	
        switchPage("code")
        document.getElementById("code-notification").innerHTML = "Kod wygasł. Zaloguj się ponownie!"	
      } else {	
        switchPage("code")
        document.getElementById("code-notification").innerHTML = "Wystąpił problem komunikacji z API. Spróbuj ponownie!"	
      }	
    };
    setTimeout(function() {
        xhr.send();	
    }, 1500)
    return false;
}