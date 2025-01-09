/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

var productsDB = {
    "vdf01": {
        "name": "Czerwona róża",
        "collection": "VALENTINES",
        "badge": "",
        "price": 3.50,
        "img": "img/cc01.jpg",
        "options": {
            "ODBIORCA": []
        },
        "desc": "Podaruj swojej walentynce czerwoną różę!"
    },
    "vdf02": {
        "name": "Różowy tulipan",
        "collection": "VALENTINES",
        "badge": "",
        "price": 4,
        "img": "img/cc01.jpg",
        "options": {
            "ODBIORCA": []
        },
        "desc": "Różowy tulipan prosto dla Twojej walentynki!"
    },
    "vdb01": {
        "name": "Bukiet kwiatów",
        "collection": "VALENTINES",
        "badge": "",
        "price": 1.00,
        "img": "img/cc01.jpg",
        "carousel": ["img/cc01.jpg", "img/cc02.jpg", "img/cc03.jpg"],
        "options": {
            "ODBIORCA": [],
            "CZERWONE RÓŻE": [
                {"name": "0", "display": "0 sztuk"},
                {"name": "1", "display": "1 sztuka", "price": 2},
                {"name": "2", "display": "2 sztuki", "price": 4},
                {"name": "3", "display": "3 sztuki", "price": 6},
                {"name": "4", "display": "4 sztuki", "price": 8},
                {"name": "5", "display": "5 sztuk", "price": 10},
                {"name": "6", "display": "6 sztuk", "price": 12},
                {"name": "7", "display": "7 sztuk", "price": 14},
                {"name": "8", "display": "8 sztuk", "price": 16},
                {"name": "9", "display": "9 sztuk", "price": 18}
            ],
            "CZERWONE TULIPANY": [
                {"name": "0", "display": "0 sztuk"},
                {"name": "1", "display": "1 sztuka", "price": 3},
                {"name": "2", "display": "2 sztuki", "price": 6},
                {"name": "3", "display": "3 sztuki", "price": 9},
                {"name": "4", "display": "4 sztuki", "price": 12},
                {"name": "5", "display": "5 sztuk", "price": 15},
                {"name": "6", "display": "6 sztuk", "price": 18},
                {"name": "7", "display": "7 sztuk", "price": 21},
                {"name": "8", "display": "8 sztuk", "price": 24},
                {"name": "9", "display": "9 sztuk", "price": 27}
            ]
        },
        "desc": "Stwórz swoją własną kompozycję!<br>Do ceny doliczony jest koszt dekoracji i opakowania."
    }
}

fetch('products/data.json')
    .then(response => {
        // Sprawdzenie, czy odpowiedź jest OK
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Konwersja odpowiedzi na JSON
    })
    .then(data => {
        // Tutaj mamy dostęp do danych z pliku JSON
        //console.log(data);

        // Przypisanie danych do zmiennej
        productsDB = data;
        runPage();
    })
    .catch(error => {
        // Obsługa błędów
        console.error('There was a problem with the fetch operation:', error);
        runPage() //USUNAC TA LINIJKE
    });


var cart = localStorage.getItem("cart")
if (cart == null || cart == undefined) {
    cart = []
} else {
    cart = JSON.parse(cart)
}

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
    document.getElementById("cart-quantity").innerHTML = cart.length
}

updateCart()

function openModal(id) {
    const myModal = new bootstrap.Modal(document.getElementById(id));
    myModal.show();
    return false;
}