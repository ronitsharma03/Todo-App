const contact = document.getElementById("contact");
const contact1 = document.getElementById("contact-1");
const animateIcon = (() => {
    document.getElementById("github").classList.add("fa-beat");
    document.getElementById("insta").classList.add("fa-beat");
    document.getElementById("twitter").classList.add("fa-beat");
    document.getElementById("linkedin").classList.add("fa-beat");
});
const removeAnimation = (() => {
    document.getElementById("github").classList.remove("fa-beat");
    document.getElementById("insta").classList.remove("fa-beat");
    document.getElementById("twitter").classList.remove("fa-beat");
    document.getElementById("linkedin").classList.remove("fa-beat");
});
contact.addEventListener('click', () => {
    animateIcon();
});
contact1.addEventListener('click', () => {
    animateIcon();
});
setTimeout(() => {
    removeAnimation();
}, 7000);

document.getElementById("about").addEventListener("click", function () {
    window.location.href = "https://ronitkhajuria.vercel.app";
});
document.getElementById("about-1").addEventListener("click", function () {
    window.location.href = "https://ronitkhajuria.vercel.app";
});

document.getElementById("home").addEventListener("click", function () {
    window.location.href = "/";
});
document.getElementById("home-1").addEventListener("click", function () {
    window.location.href = "/";
});

const menu_btn = document.querySelector('.hamburger');
const mob_nav = document.querySelector('.mobile-nav');
menu_btn.addEventListener('click', function () {
    menu_btn.classList.toggle('is-active');
    mob_nav.classList.toggle('is-active');
});


