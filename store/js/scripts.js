/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

var productsDB = {}

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
        //runPage() //USUNAC TA LINIJKE
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