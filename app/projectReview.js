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