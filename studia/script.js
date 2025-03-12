var polskiPP = 0
var matmaPP = 0
var matmaPR = 0
var angielskiPR = 0
var informatykaPR = 0

function getScores() {
    polskiPP = parseInt(document.getElementById("exam1").value)
    if (isNaN(polskiPP)) {
        polskiPP = 0
    }

    matmaPP = parseInt(document.getElementById("exam2").value)
    if (isNaN(matmaPP)) {
        matmaPP = 0
    }

    matmaPR = parseInt(document.getElementById("exam3").value)
    if (isNaN(matmaPR)) {
        matmaPR = 0
    }

    angielskiPR = parseInt(document.getElementById("exam4").value)
    if (isNaN(angielskiPR)) {
        angielskiPR = 0
    }

    informatykaPR = parseInt(document.getElementById("exam5").value)
    if (isNaN(informatykaPR)) {
        informatykaPR = 0
    }

}

function cpointsUAM() {
    let points = 0.8*matmaPR + 0.2*informatykaPR
    points = Math.floor(points * 100) / 100
    return points;
}

function cpointsUW() {
    let wyzszy;
    if (informatykaPR > matmaPR) {
        wyzszy = informatykaPR
    } else {
        wyzszy = matmaPR
    }
    let points = 0.6*0.05*polskiPP + 0.15*matmaPR + 0.1*angielskiPR + 0.5*wyzszy + 0.2*wyzszy
    points = Math.floor(points * 100) / 100
    return points;
}

function cpointsPW() {
    let points = matmaPR + informatykaPR + 0.25*angielskiPR
    points = Math.floor(points * 100) / 100
    return points;
    //informatyka min 191, informatyka i sys inf 199
}

function showScores() {
    getScores()
    let pointsUW = cpointsUW()
    let pointsPW = cpointsPW()
    let pointsUAM = cpointsUAM()

    document.getElementById("uwpoints").innerHTML = pointsUW
    document.getElementById("pw1points").innerHTML = pointsPW
    document.getElementById("pw2points").innerHTML = pointsPW
    document.getElementById("uampoints").innerHTML = pointsUAM


    if (pointsUW >= 92) {
        document.getElementById("uwdesc").classList.add("text-success")
        document.getElementById("uwdesc").classList.remove("text-danger")
    } else {
        document.getElementById("uwdesc").classList.remove("text-success")
        document.getElementById("uwdesc").classList.add("text-danger")
    }

    if (pointsPW >= 191) {
        document.getElementById("pw1desc").classList.add("text-success")
        document.getElementById("pw1desc").classList.remove("text-danger")
    } else {
        document.getElementById("pw1desc").classList.remove("text-success")
        document.getElementById("pw1desc").classList.add("text-danger")
    }

    if (pointsPW >= 199) {
        document.getElementById("pw2desc").classList.add("text-success")
        document.getElementById("uwdesc").classList.remove("text-danger")
    } else {
        document.getElementById("pw2desc").classList.remove("text-success")
        document.getElementById("pw2desc").classList.add("text-danger")
    }

    if (pointsUAM >= 60) {
        document.getElementById("uamdesc").classList.add("text-success")
        document.getElementById("uamdesc").classList.remove("text-danger")
    } else {
        document.getElementById("uamdesc").classList.remove("text-success")
        document.getElementById("uamdesc").classList.add("text-danger")
    }
}

showScores()