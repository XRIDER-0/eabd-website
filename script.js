// =========================
// EABD WEBSITE JAVASCRIPT
// =========================


// =========================
// MOBILE MENU
// =========================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");


// Open and close mobile menu
menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// Close menu when a navigation link is clicked
const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});


// =========================
// SIMPLE SCROLL EFFECT
// =========================

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


// =========================
// EABD WEBSITE TEST
// =========================

console.log("EABD website is ready!");