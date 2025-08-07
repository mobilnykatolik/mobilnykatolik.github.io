const steps = ["introduction", "signin", "signup", "processing", "code", "success"]
var step = 0;
var email;
var accountType = "mk";

function onLoad() {
    document.getElementById(steps[step]).title = "opened";
}

function changeStep(newStep) {
    document.getElementById(steps[step]).title = "closed";
    setTimeout(function() {
        if (step == 0 && newStep == 1) {
            document.getElementById("signin-email").value = "";
            document.getElementById("code-input").value = "";
        }
        if (step == 0 && newStep == 2) {
            document.getElementById("signup-firstname").value = "";
            document.getElementById("signup-lastname").value = "";
            document.getElementById("signup-email").value = "";
            document.getElementById("signup-email").style.display = "block";
            document.getElementById("signup-class").value = "";
            document.getElementById("signup-rodo").checked = "";
            document.getElementById("code-input").value = "";
        }
        if (accountType == "fb") {
            document.getElementById("signup-email").style.display = "none";
        }
        document.getElementById(steps[step]).title = "";
        step = newStep;
        document.getElementById(steps[step]).title = "opened";
    }, 500);

    setTimeout(function() {
        if (step == 1) {
            document.getElementById("signin-email").focus();
        }
        if (step == 2) {
            document.getElementById("signup-firstname").focus();
        }
    }, 1000);
}

function signIn() {
    document.getElementById("signin-notification").innerHTML = "";
    email = document.getElementById("signin-email").value.replaceAll(" ", "");
    if (!email.includes("@")) {
        document.getElementById("signin-notification").innerHTML = "ℹ Wprowadź prawidłowy adres e-mail!"
        document.getElementById("signin-email").focus();
        return false;
    }
    document.getElementById(steps[step]).title = "closed";
    setTimeout(function() {
        document.getElementById(steps[step]).title = "";
        step = 3;
        document.getElementById(steps[step]).title = "opened";
        document.getElementById("signin-notification").innerHTML = "";
        sendSignInCode();
    }, 500);
    return false;
}

function sendSignInCode() {
    var url = `https://api.mobilnykatolik.pl/login/${email}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
            try {
                var response = JSON.parse(xhr.responseText);
                document.getElementById("code-welcome").innerHTML = response.welcome;
                document.getElementById("code-message").innerHTML = response.message;
                changeStep(4);
            } catch (err) {}
        } else if (xhr.status == 400) {
            changeStep(1);
            document.getElementById("signin-notification").innerHTML = "ℹ Nie znaleziono konta przypisanego do podanego adresu e-mail!"
        } else {
            changeStep(1);
            document.getElementById("signin-notification").innerHTML = "ℹ Wystąpił problem komunikacji z API. Spróbuj ponownie!"
        }
    };

    xhr.send();
}

function signUp() {
    document.getElementById("signup-notification").innerHTML = "";
    //signup-firstname signup-lastname signup-email signup-class signup-rodo
    //kolejnosc weryfikacji: imie, nazwisko, email, klasa, zgoda
    var firstname = document.getElementById("signup-firstname").value.toUpperCase().replaceAll(" ", "");
    var lastname = document.getElementById("signup-lastname").value.toUpperCase().replaceAll(" ", "");
    email = document.getElementById("signup-email").value.replaceAll(" ", "");
    var userclass = document.getElementById("signup-class").value;
    var rodo = document.getElementById("signup-rodo").checked;

    if (firstname.length < 2) {
        document.getElementById("signup-notification").innerHTML = "ℹ Wprowadź prawidłowe imię!"
        document.getElementById("signup-firstname").focus();
        return false;
    }
    if (lastname.length < 2) {
        document.getElementById("signup-notification").innerHTML = "ℹ Wprowadź prawidłowe nazwisko!"
        document.getElementById("signup-lastname").focus();
        return false;
    }
    if (!email.includes("@") && accountType != "fb") {
        document.getElementById("signup-notification").innerHTML = "ℹ Wprowadź prawidłowy adres e-mail!"
        document.getElementById("signup-email").focus();
        return false;
    }
    if (userclass == "") {
        document.getElementById("signup-notification").innerHTML = "ℹ Wybierz klasę!"
        document.getElementById("signup-class").focus();
        return false;
    }
    if (rodo == "") {
        document.getElementById("signup-notification").innerHTML = "ℹ Zgoda na przetwarzanie danych osobowych jest wymagana!"
        return false;
    }

    document.getElementById(steps[step]).title = "closed";
    setTimeout(function() {
        document.getElementById(steps[step]).title = "";
        step = 3;
        document.getElementById(steps[step]).title = "opened";
        document.getElementById("signin-notification").innerHTML = "";
        if (accountType == "fb") {
            registerFbUser(firstname, lastname, userclass);
            return false;
        }
        sendSignUpCode(firstname, lastname, userclass);
    }, 500);
    return false;
}

function sendSignUpCode(firstname, lastname, userclass) {
    var url = "https://api.mobilnykatolik.pl/register";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    document.getElementById("code-welcome").innerHTML = response.welcome;
                    document.getElementById("code-message").innerHTML = response.message;
                    changeStep(4);
                } catch (err) {}
            } else if (xhr.status == 403) {
                changeStep(2);
                document.getElementById("signup-notification").innerHTML = "ℹ Podany adres e-mail jest już przypisany do innego konta! Spróbuj się zalogować."
            } else if (xhr.status == 406) {
                    changeStep(2);
                    document.getElementById("signup-notification").innerHTML = "ℹ Konto na podane dane osobowe zostało już zarejestrowane! Spróbuj się zalogować."
            } else if (xhr.status == 404) {
              changeStep(2);
                document.getElementById("signup-notification").innerHTML = "ℹ Nie znaleziono na liście uczniów szkoły. Sprawdź, czy dane osobowe są wpisane prawidłowo."
            } else {
                changeStep(2);
                document.getElementById("signup-notification").innerHTML = "ℹ Wystąpił problem komunikacji z API. Spróbuj ponownie!"
            }
        }
    };

    var data = `{"firstname": "${firstname}","lastname": "${lastname}","class": "${userclass}","email":"${email}"}`;
    xhr.send(data);
}



function checkCode() {
    document.getElementById("code-notification").innerHTML = "";
    var code = document.getElementById("code-input").value;
    if (code.length != 4) {
        document.getElementById("code-notification").innerHTML = "ℹ Wprowadź prawidłowy kod logowania!"
        document.getElementById("code-input").focus();
        return false;
    }
    document.getElementById(steps[step]).title = "closed";
    setTimeout(function() {
        document.getElementById(steps[step]).title = "";
        step = 3;
        document.getElementById(steps[step]).title = "opened";
        document.getElementById("code-notification").innerHTML = "";
        sendCodeToAPI(code);
    }, 500);
    return false;
}


function sendCodeToAPI(code) {	
    var url = `https://api.mobilnykatolik.pl/code/${email}/${code}`;	
    var xhr = new XMLHttpRequest();	
    xhr.open("GET", url);	
    xhr.onreadystatechange = function() {	
      if (xhr.status == 200) {		
        console.log(xhr.responseText);
        window.opener.postMessage(`${xhr.responseText}`, "*");
      } else if (xhr.status == 406) { //Invalid code	
        changeStep(4);	
        document.getElementById("code-notification").innerHTML = "ℹ Kod nieprawidłowy!"	
      } else if (xhr.status == 410) { //Code has expired	
        changeStep(4);	
        document.getElementById("code-notification").innerHTML = "ℹ Kod wygasł. Zaloguj się ponownie!"	
      } else {	
        changeStep(4);	
        document.getElementById("code-notification").innerHTML = "ℹ Wystąpił problem komunikacji z API. Spróbuj ponownie!"	
      }	
    };	
    xhr.send();	
}

//Pobieranie listy klas
function getClasses() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            if (req.status == 200) {
                var classes = req.responseText.split(";")
                console.log(classes);
                document.getElementById("signup-class").innerHTML = `<option value="" style="color: #a9a9a9;" selected hidden>Wybierz klasę</option>`
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