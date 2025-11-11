/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

var productsDB = {}
var storesDB = {}
var TEDB = {}

/*fetch('products/data.json')
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
        //runPage() //USUNAC TA LINIJKE
    });*/

function getTickets() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            if (req.status == 200) {
                //Sukces
                var data = JSON.parse(req.responseText)
                TEDB = data
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const TEID = urlParams.get('id');
                cart = []
                localStorage.removeItem("cart");
                if (TEDB[TEID] != undefined) {
                    TEDB[TEID].id = TEID;
                    cart.push(TEDB[TEID]);
                    document.getElementById("cart-section-3").classList.remove("d-none");
                    document.getElementById("summary-box").classList.remove("d-none");
                }
                runPage();
            } else {
                //Błąd
            }
        }
    };

    req.open("GET", `https://api.mobilnykatolik.pl/tickets/getall`, true);
    req.send();
}

function getStores() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            if (req.status == 200) {
                //Sukces
                var data = JSON.parse(req.responseText)
                storesDB = data
                for (store in data) {
                    for (prod in data[store].products) {
                        productsDB[prod] = data[store].products[prod]
                    }
                }
                //productsDB = data["MERCHANDISE2024-2"].products;
                updateCart();
                runPage();
                if (document.getElementById("store-carousel")) {
                    ifFirst = "active"
                    document.getElementById("store-carousel").innerHTML = ""
                    for (store in storesDB) {
                        if (!storesDB[store].active) { continue }
                        if (storesDB[store].banner == undefined || storesDB[store].banner == "") { continue }
                        document.getElementById("store-carousel").innerHTML += `
                        <div class="carousel-item ${ifFirst}">
                            <img src="${storesDB[store].banner}" class="d-block w-100" alt="...">
                        </div>
                        `
                        ifFirst = ""
                    }
                    if (ifFirst == "active") {
                        document.getElementById("store-carousel").innerHTML = `
                        <div class="carousel-item active">
                            <img src="assets/default-banner.png" class="d-block w-100" alt="...">
                        </div>
                        `
                    }
                }
            } else {
                //Błąd
            }
        }
    };

    req.open("GET", `https://api.mobilnykatolik.pl/store/getall`, true);
    req.send();
}


if (window.location.href.includes("tickets")) {
    getTickets()
} else {
    getStores();
}

var cart = localStorage.getItem("cart")
if (cart == null || cart == undefined) {
    cart = []
} else {
    cart = JSON.parse(cart)
}

function updateCart() {
    let newCart = []
    let selectedStore;
    if (cart.length != 0) {
        try {
            selectedStore = cart[cart.length - 1].store
        } catch (err) {
            cart = []
        } 
    }
    console.log(`Wybrany sklep: ${selectedStore}`)
    for (prod in cart) {
        if (cart[prod].store == undefined) {
            continue;
        }
        
        if (productsDB[cart[prod].id] == undefined) {
            continue;
        }

        //cart[prod].price = productsDB[cart[prod].id].price NIE MOZEMY BO WTEDY FINAL PRICE SIE NIE ZGADZA
        cart[prod].name = productsDB[cart[prod].id].name
        cart[prod].store = productsDB[cart[prod].id].store

        if (cart[prod].store != selectedStore) {
            continue;
        }

        newCart.push(cart[prod])
    }
    cart = newCart

    localStorage.setItem("cart", JSON.stringify(cart))
    document.getElementById("cart-quantity").innerHTML = cart.length
}

function openModal(id) {
    const myModal = new bootstrap.Modal(document.getElementById(id));
    myModal.show();
    return false;
}