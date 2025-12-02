const handlerClasses = (els, classe, action) => {
    if (!els || !classe) return false;

    els.forEach((el) => {
        el.classList[ action ](classe);
    });
}

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
    const pupupMessage = document.querySelector(
        ".subscribe-form .popup-message",
    );

    if (!pupupMessage) return false;
    pupupMessage.classList.add("show");

    setTimeout(() => {
        pupupMessage.classList.remove("show");
    }, 3000);
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

    btnOpen.addEventListener('click', () => handlerClasses([ container, content ], "show", "add"));
    btnClose.addEventListener('click', () => handlerClasses([ container, content ], "show", "remove"));
}

function submitForm(id, callback) {
    const form = document.getElementById(id);
    const messageContainer = document?.querySelector(`#${id}Container #message`);
    const message = document?.querySelector(`#${id}Container #message .message`);
    const loading = document?.querySelector(`#${id}Container .loading`);
    const loader = document?.querySelector(`#${id}Container .loader`);
    if (!form || !message) return false;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        message.textContent = "Enviando...";
        handlerClasses([ messageContainer, loading, loader ], "show", "add");

        const formData = new FormData(form);

        try {
            const res = await fetch("/api/form/v1/submit", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                message.textContent = "Error: " + (data?.message || "No se pudo enviar.");
                messageContainer.classList.add("show");
                handlerClasses([ loader, loading ], "show", "remove");
                return;
            }

            message.textContent = data.message || "Enviado correctamente.";
            messageContainer.classList.add("show");
            form.style.display = "none";

            if (typeof callback === "function") {
                callback();
            }

            handlerClasses([ loader, loading ], "show", "remove");

            form.reset();

        } catch (error) {
            message.textContent = "Error de servidor, intenta de nuevo.";
            messageContainer.classList.add("show");
            handlerClasses([ loader, loading ], "show", "remove");
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    headerHanlderBtns();
    handlerBgHeader();
    handlerPickerLang();
    handlerModalWhatsapp();
    submitForm('contactForm');
    submitForm('newsletterForm', handlerNewsLetter);
    submitForm('bookFreeClassForm');
});

window.addEventListener("scroll", () => {
    handlerBgHeader();
});