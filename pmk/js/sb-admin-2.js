(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

})(jQuery); // End of use strict



var userID = sessionStorage.getItem("userid");
var userLoginID = sessionStorage.getItem("loginid");
var userFirstName = sessionStorage.getItem("userfname");
var userlastName = sessionStorage.getItem("userlname");
var userAccess = parseInt(sessionStorage.getItem("useraccess"));
var usersCount = sessionStorage.getItem("userscount");

  
if (userID == undefined) {
    window.location = "auth.html";
}
if (userLoginID == undefined) {
    window.location = "auth.html";
}

document.getElementById("profile-fullname").innerHTML = `${sessionStorage.userfname} ${sessionStorage.userlname}`;
document.getElementById("profileModalFullname").innerHTML = `${sessionStorage.userfname} ${sessionStorage.userlname}`;
document.getElementById("profileModalAccess").innerHTML = sessionStorage.useraccess;
document.getElementById("img-profile").src = `https://api.mobilnykatolik.pl/profilepic/get/${userID}`

var imgProfile = document.getElementById("img-profile")

imgProfile.onload = function() {
  this.setAttribute('loading', 'lazy'); // Dodaj lazy loading dla lepszego ładowania obrazków
  this.setAttribute('decoding', 'async'); // Dekodowanie asynchroniczne dla szybszego renderowania
  this.setAttribute('crossorigin', 'anonymous'); // Ustaw crossorigin na anonymous, jeśli obrazek jest hostowany na innym serwerze
  this.setAttribute('loading', 'lazy'); // Lazy loading dla obrazka
};

var userFullName = userFirstName.toUpperCase()+" "+userlastName.toUpperCase()
document.getElementById("welcome-text").innerHTML = `Cześć, ${userFirstName[0].toUpperCase()}${userFirstName.slice(1, userFirstName.length).toLowerCase()}!`