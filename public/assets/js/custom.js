// Header handle btns
function headerHanlderBtns() {
    const mbtns = document.querySelector("#btnsHeader.btns-mobile");
    const dbtns = document.querySelector("#btnsHeader.btns-desktop");

    let mobile = window.innerWidth <= 992;
    window.addEventListener("resize", () => {
        mobile = window.innerWidth <= 992;
        controllerBtns();
    });
    window.addEventListener("load", () => {
        mobile = window.innerWidth <= 992;
        controllerBtns();
    });

    function controllerBtns() {
        if (mobile) {
            mbtns && (mbtns.style.display = "flex");
            dbtns && (dbtns.style.display = "none");
        } else {
            mbtns && (mbtns.style.display = "none");
            dbtns && (dbtns.style.display = "flex");
        }
    }
};

// Handler script to newsLetter
function handlerNewsLetter() {
    const btnSuscribe = document.querySelector(
        ".form-group .action-suscribe",
    );
    const pupupMessage = document.querySelector(
        ".subscribe-form .popup-message",
    );
    const inputEmail = document.querySelector(".subscribe-form input");

    if (!btnSuscribe || !inputEmail) return false;

    btnSuscribe.addEventListener("click", () => {
        if (
            inputEmail.value?.length <= 0 ||
            !inputEmail.value?.includes("@")
        )
            return false;
        pupupMessage.classList.add("show");

        setTimeout(() => {
            pupupMessage.classList.remove("show");
        }, 3000);
    });
}

// Handler Bg Header
function handlerBgHeader() {
    const header = document.querySelector("header");

    if (!header) return false;


    if (window.scrollY > 50) {
        header.classList.remove("top");
    } else {
        header.classList.add("top");
    }
}

// Hadler pikcker lang

function handlerPickerLang() {
    const pickers = document.querySelectorAll('#langSelector');

    if (!pickers) return false;

    pickers.forEach(picker => {

        const listItems = picker.querySelector('#langsItems');
        if (!listItems) return false;

        picker.addEventListener('click', () => {
            listItems.classList.toggle('show');
        })
    });
}

function handlerModalWhatsapp() {
    const container = document.querySelector('#whatsappWrapper .modal-bg');
    const content = document.querySelector('#whatsappWrapper .modal-content');
    const btnClose = document.querySelector('#whatsappWrapper .modal-header .close');
    const btnOpen = document.querySelector('#whatsappWrapper .btn-whatsapp-floating');

    if (!container || !content || !btnClose || !btnOpen) return false;

    btnOpen.addEventListener('click', () => {
        container.classList.add('show');
        content.classList.add('show');
    });

    btnClose.addEventListener('click', () => {
        container.classList.remove('show');
        content.classList.remove('show');
    });
}

window.addEventListener("DOMContentLoaded", () => {
    headerHanlderBtns();
    handlerNewsLetter();
    handlerBgHeader();
    handlerPickerLang();
    handlerModalWhatsapp();
});

window.addEventListener("scroll", () => {
    handlerBgHeader();
});