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
    window.alert("UWAGA! Jesteś w wersji testowej. Sprawozdanie nie zostanie przesłane.")
    document.getElementById("projectReviewName").innerHTML = eventsdb[eID].name
    document.getElementById("pr-3").value = ""
    document.getElementById("pr-4").value = ""
    window.open('#projectreviewapp', '_self')
}

function sendReview() {
    let answersData = []
    const answers = document.querySelectorAll("#projectReviewForm input")
    answers.forEach((elem) => {
        answersData.push(elem.value)
    })
    console.log(answersData)
    history.back()
    window.alert("Wysyłanie sprawozdań jest aktualnie niedostępne!")
    return false;
}