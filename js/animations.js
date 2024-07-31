/* Animação Menu Mobile */
let btnMenu = document.getElementById('btn-menu');
let menuMobile = document.getElementById('btn-mobile');

btnMenu.addEventListener('click', function() {
    menuMobile.classList.add('menu-mobile-ativo');
    btnMenu.classList.add('btn-menu-desligado');
});