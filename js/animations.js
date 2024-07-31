/* Animação Menu Mobile */
let btnMenu = document.getElementById('btn-menu');
let menuMobile = document.getElementById('btn-mobile');
let overlay = document.getElementById("overlay-mobile");

btnMenu.addEventListener('click', function() {
    menuMobile.classList.add('menu-mobile-ativo');
    btnMenu.classList.add('btn-menu-desligado');
    overlay.classList.add('overlay-ativo');
});

menuMobile.addEventListener('click', function() {
    menuMobile.classList.remove('menu-mobile-ativo');
    btnMenu.classList.remove('btn-menu-desligado');
    overlay.classList.remove('overlay-ativo');
});
