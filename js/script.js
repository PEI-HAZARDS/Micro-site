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
      msgErro.classList.remove("active");
    }, 1500);
  } else {
    formInputs.forEach((input) => {
      input.classList.remove("por-preencher");
      input.classList.remove("preenchido");
    });

    const load = document.getElementById("load-envio");
    const loadIcon = load.querySelector("i");
    
    if (loadIcon) {
      loadIcon.classList.add("active-load");
    }
    
    /* Delay */
    setTimeout(() => {
        msgSucces.classList.add("active");
        loadIcon.classList.remove("active-load");

        /* Envio de dados */
        fetch("https://api.sheetmonkey.io/form/BuwLjT1wcaLkFiqDt1gnu", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nome: formInputs[0].value,
            Email: formInputs[1].value,
            Assunto: formInputs[2].value,
          }),
        });
    }, 2000);
    
    setTimeout(() => {
        msgSucces.classList.remove("active");
        form.reset();
    }, 3000);
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

/* Animação Scroll */
let sections = document.querySelectorAll("section");
let links = document.querySelectorAll("nav a");
let header = document.querySelector("header nav");
let scrollPosition = window.scrollY;
let scrollLinks = Array.from(links);

window.addEventListener("scroll", function () {
  scrollPosition = window.scrollY;
  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop - header.offsetHeight) {
      links.forEach((link) => {
        link.classList.remove("active-inline");
      });
      scrollLinks = Array.from(links);
      scrollLinks
      .find((link) => link.getAttribute("href") === `#${section.id}`)
      .classList.add("active-inline");
    }
  });
});

/* Scroll Suave */
let linksclick = document.querySelectorAll("section");
let linksClick = Array.from(linksclick);

linksClick.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    let target = document.querySelector(link.getAttribute("href"));
    let topSite = document.querySelector("topo-site");
    let header = document.querySelector("header nav");
    if (target) {
      window.scrollTo({
        top:
          target.offsetTop -
          (topSite ? topSite.offsetHeight : header.offsetHeight),
        behavior: "smooth",
      });
    }
    let buttonContact = document.querySelector("#btn-contacto-Click");

    if (buttonContact) {
      buttonContact.addEventListener("click", function (event) {
        event.preventDefault();
        let target = document.querySelector("#section5");
        if (target) {
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth",
          });
        }
      });
    }
  });
});

/* Hiper Link Especialidades*/
document.querySelectorAll(".btn-social a").forEach((link) => {
  console.log("Adding click event listener to link:", link);
  link.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Link clicked:", this.href);
    window.open(this.href);
  });
});

document.querySelectorAll(".especialidades-box").forEach((box) => {
  box.addEventListener("click", function () {
    const link = this.querySelector("a");
    if (link) {
      window.open(link.href, "_blank");
    }
  });
});