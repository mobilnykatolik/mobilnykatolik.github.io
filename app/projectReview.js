var reviewEventID = ""

const stars1 = document.querySelectorAll("#starRating1 i")

stars1.forEach((star, index1) => {
    star.addEventListener("click", () => {
        let rate = parseInt(index1)+1
        stars1.forEach((star, index2) => {
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active")
        })
        document.getElementById("pr-1").value = rate
    })
})

const stars2 = document.querySelectorAll("#starRating2 i")

stars2.forEach((star, index1) => {
    star.addEventListener("click", () => {
        let rate = parseInt(index1)+1
        stars2.forEach((star, index2) => {
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active")
        })
        document.getElementById("pr-2").value = rate
    })
})

function makeReview(eID) {
    document.getElementById("projectReviewName").innerHTML = eventsdb[eID].name
    document.getElementById("pr-3").value = ""
    document.getElementById("pr-4").value = ""
    reviewEventID = eID
    window.open('#projectreviewapp', '_self')
}

function openReview(eID) {
    reviewEventID = eID
    for (event in pastEvents) {
        if (pastEvents[event].eventID != eID) { continue }
        let answers = pastEvents[event].answers
        document.getElementById("projectReviewName").innerHTML = eventsdb[eID].name
        document.getElementById("pr-3").value = answers[2]
        document.getElementById("pr-4").value = answers[3]

        stars1.forEach((star, index1) => {
            if (index1 < parseInt(answers[0])) {
                star.classList.add("active")
            } else {
                star.classList.remove("active")
            }
        })
        document.getElementById("pr-1").value = parseInt(answers[0])

        stars2.forEach((star, index1) => {
            if (index1 < parseInt(answers[1])) {
                star.classList.add("active")
            } else {
                star.classList.remove("active")
            }
        })
        document.getElementById("pr-2").value = parseInt(answers[1])

        window.open('#projectreviewapp', '_self')
    }
}

function sendReview() {
    let answersData = []
    const answers = document.querySelectorAll("#projectReviewForm input")
    answers.forEach((elem) => {
        answersData.push(elem.value)
    })
    console.log(answersData)
    var data = {
        "eventID": reviewEventID,
        "answers": answersData
    }
    console.log(data);
    var url = `https://api.mobilnykatolik.pl/pmk/reviews/new/${userID}/${loginID}`;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                history.back()
                return false;
            } else {
                window.alert("Wystąpił błąd. Spróbuj ponownie!");
                return false;
            }
        }
    };
    xhr.send(JSON.stringify(data));
    return false;
}