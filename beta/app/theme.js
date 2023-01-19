var betatesters = ["xt3dh8q7c2dct9ys", "kjn47gozi0gn1vgh", "ndglsv3u34wiz0sh", "e5ysqhl1yhoftqis", "xm6mi648fcg3awqj", "nrmjrdt5a5xjv54f"]

function loadTheme() {
    document.getElementById("stylesheet").href = `themes/${usertheme}/style.css`
    document.getElementById("manifest").href = `themes/${usertheme}/manifest.webmanifest`
    document.getElementById(`select-${usertheme}`).title = "selected"
    if (betatesters.includes(userid) || userrank == "ADMIN") {
        document.getElementById("theme-section").style.display = "block";
    }
    if (betatesters.includes(userid)) {
        document.getElementById("userrank").innerHTML = "Status konta: bestie 😎🫶"
        closedModules = [];
    }
}

function changeTheme(selectedTheme) {
    document.getElementById("select-a80c2f").title = ""
    document.getElementById("select-072657").title = ""
    document.getElementById("select-6247aa").title = ""
    document.getElementById("select-52796f").title = ""
    document.getElementById("select-feb1c6").title = ""
    document.getElementById(`select-${selectedTheme}`).title = "selected"
    localStorage.setItem("theme", selectedTheme);
    if (selectedTheme == usertheme) {
        return false;
    }
    if (confirm("Aby zastosować zmianę motywu, aplikacja musi zostać zrestartowana. Czy chcesz to zrobić teraz?")) {
        reload();
    }
}