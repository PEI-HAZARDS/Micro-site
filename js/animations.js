/* Animação Menu Mobile */
let btnMenu = document.getElementById("btn-menu");
let menuMobile = document.getElementById("btn-mobile");
let overlay = document.getElementById("overlay-mobile");

btnMenu.addEventListener("click", function () {
  menuMobile.classList.add("menu-mobile-ativo");
  btnMenu.classList.add("btn-menu-desligado");
  overlay.classList.add("overlay-ativo");
});

menuMobile.addEventListener("click", function () {
    menuMobile.classList.remove("menu-mobile-ativo");
    btnMenu.classList.remove("btn-menu-desligado");
    overlay.classList.remove("overlay-ativo");
});

/* Forms Envio-Erro */
let form = document.getElementById("form");
let submitButton = document.getElementById("btn-envio-form");
let formInputs = Array.from(document.querySelectorAll("input, textarea"));
let msgErro = document.getElementById("msg-erro");
let msgSucces = document.getElementById("msg-succes");

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (!form.checkValidity()) {
    formInputs.forEach((input) => {
      if (input.type !== "submit") {
        form.classList.add("shake");
        msgErro.classList.add("active");
        if (input.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            input.classList.add("por-preencher");
            input.classList.remove("preenchido");
          } else {
            input.classList.remove("por-preencher");
            input.classList.add("preenchido");
          }
        } else {
          if (!input.checkValidity()) {
            input.classList.add("por-preencher");
            input.classList.remove("preenchido");
          } else {
            input.classList.remove("por-preencher");
            input.classList.add("preenchido");
          }
        }
      }
    });
    setTimeout(() => {
      form.classList.remove("shake");
    }, 500);
  } else {
    msgErro.classList.remove("active");
    formInputs.forEach((input) => {
      input.classList.remove("por-preencher");
      input.classList.remove("preenchido");
    });
    const load = document.getElementById("load-envio");
    const loadIcon = load.querySelector("i");
    if (loadIcon) {
      loadIcon.classList.add("active-load");
    }
    
    // Adicionar um pequeno atraso antes de enviar o formulário
    setTimeout(() => {
        msgSucces.classList.add("active");
        loadIcon.classList.remove("active-load")
      form.submit();
    }, 2000);
  }
});

/* Validação */
formInputs.forEach((input) => {
    if (input.type !== "submit") {
        input.addEventListener("input", () => {
          if (input.type === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
              input.classList.add("por-preencher");
              input.classList.remove("preenchido");
            } else {
              input.classList.remove("por-preencher");
              input.classList.add("preenchido");
            }
          } else {
            if (!input.checkValidity()) {
              input.classList.add("por-preencher");
              input.classList.remove("preenchido");
            } else {
              input.classList.remove("por-preencher");
              input.classList.add("preenchido");
            }
          }
        });
    }
});
