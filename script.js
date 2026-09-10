// ===============================
// ELEMENTOS PRINCIPALES
// ===============================

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const linksMenu = document.querySelectorAll(".menu a");

const header = document.querySelector(".header");
const barraProgreso = document.getElementById("barra-progreso");

const portada = document.querySelector(".portada");
const videoPortada = document.querySelector(".imagen-portada video");

const reduceMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// ===============================
// MENÚ DEL CELULAR
// ===============================

if (menuToggle && menu) {

    menuToggle.addEventListener("click", function () {

        const menuAbierto = menu.classList.toggle("activo");

        menuToggle.textContent = menuAbierto ? "✕" : "☰";
        menuToggle.setAttribute("aria-expanded", menuAbierto);
        menuToggle.setAttribute(
            "aria-label",
            menuAbierto ? "Cerrar menú" : "Abrir menú"
        );

    });

}


// Cerrar el menú al tocar una opción

linksMenu.forEach(function (link) {

    link.addEventListener("click", function () {

        menu.classList.remove("activo");

        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");

    });

});


// ===============================
// MENSAJES DE WHATSAPP
// ===============================

const numeroWhatsApp = "5491133293726";
const botonesProductos = document.querySelectorAll("[data-producto]");

botonesProductos.forEach(function (boton) {

    const producto = boton.dataset.producto;

    const mensaje =
        "Hola Dulce Maniak, quería consultar por " + producto;

    boton.href =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(mensaje);

});


// ===============================
// ANIMACIONES AL HACER SCROLL
// ===============================

const elementosAnimados = document.querySelectorAll(
    ".producto, .catalogo h2, .porciones h2, " +
    ".texto-porciones, .pedidos-contenido"
);

elementosAnimados.forEach(function (elemento, posicion) {

    elemento.classList.add("animar-scroll");

    elemento.style.transitionDelay =
        `${(posicion % 3) * 100}ms`;

});


if ("IntersectionObserver" in window && !reduceMovimiento) {

    const observador = new IntersectionObserver(

        function (entradas) {

            entradas.forEach(function (entrada) {

                if (entrada.isIntersecting) {

    const elemento = entrada.target;

    elemento.classList.add("visible");
    observador.unobserve(elemento);

    setTimeout(function () {
        elemento.classList.remove("animar-scroll", "visible");
        elemento.style.transitionDelay = "";
    }, 1000);

}

            });

        },

        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }

    );

    elementosAnimados.forEach(function (elemento) {
        observador.observe(elemento);
    });

} else {

    elementosAnimados.forEach(function (elemento) {
        elemento.classList.add("visible");
    });

}


// ===============================
// SCROLL, HEADER Y PROFUNDIDAD
// ===============================

let animacionPendiente = false;

function actualizarPagina() {

    const desplazamiento = window.scrollY;

    // Header transparente

    if (header) {
        header.classList.toggle(
            "scrolled",
            desplazamiento > 40
        );
    }


    // Barra de progreso

    if (barraProgreso) {

        const recorrido =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const porcentaje =
            recorrido > 0
                ? (desplazamiento / recorrido) * 100
                : 0;

        barraProgreso.style.width =
            Math.min(porcentaje, 100) + "%";

    }


    // Movimiento suave del video de portada

    if (videoPortada && portada && !reduceMovimiento) {

        const limiteMovimiento = Math.min(
            desplazamiento,
            portada.offsetHeight
        );

        const movimiento = limiteMovimiento * 0.08;

        videoPortada.style.transform =
            `scale(1.08) translateY(${movimiento}px)`;

    }

    animacionPendiente = false;

}


window.addEventListener(
    "scroll",
    function () {

        if (!animacionPendiente) {

            window.requestAnimationFrame(actualizarPagina);
            animacionPendiente = true;

        }

    },
    { passive: true }
);


// Ejecutar una vez al cargar la página

actualizarPagina();

// ===============================
// VISOR DE TESTIMONIOS
// ===============================

const testimonios = document.querySelectorAll(".testimonio");
const visorTestimonio = document.getElementById("visor-testimonio");
const imagenAmpliada = document.getElementById("imagen-ampliada");
const cerrarVisor = document.getElementById("cerrar-visor");

function abrirTestimonio(rutaImagen) {

    imagenAmpliada.src = rutaImagen;
    visorTestimonio.classList.add("activo");
    visorTestimonio.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}

function cerrarTestimonio() {

    visorTestimonio.classList.remove("activo");
    visorTestimonio.setAttribute("aria-hidden", "true");

    imagenAmpliada.src = "";
    document.body.style.overflow = "";

}

testimonios.forEach(function (testimonio) {

    testimonio.addEventListener("click", function () {
        abrirTestimonio(testimonio.dataset.imagen);
    });

});

cerrarVisor.addEventListener("click", cerrarTestimonio);

visorTestimonio.addEventListener("click", function (evento) {

    if (evento.target === visorTestimonio) {
        cerrarTestimonio();
    }

});

document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {
        cerrarTestimonio();
    }

});

const botonesVerMas = document.querySelectorAll(".boton-ver-mas");

botonesVerMas.forEach((boton) => {

    boton.addEventListener("click", () => {

        const info = boton.nextElementSibling;

        info.classList.toggle("activa");

        if (info.classList.contains("activa")) {

            boton.innerHTML =
                'Ver menos <span class="dedito dedito-arriba">☝️</span>';

            setTimeout(() => {

                info.classList.remove("activa");

                boton.innerHTML =
                    'Ver más <span class="dedito">👇</span>';

            }, 15000);

        } else {

            boton.innerHTML =
                'Ver más <span class="dedito">👇</span>';
        }

    });

});
// ===============================
// FORZAR VIDEOS DE FONDO EN CELULAR
// ===============================

document.querySelectorAll(".zona-fondo-video").forEach((video) => {

    video.muted = true;
    video.playsInline = true;

    function reproducirVideo() {
        video.play().catch(() => {});
    }

    reproducirVideo();

    document.addEventListener(
        "touchstart",
        reproducirVideo,
        {
            once: true,
            passive: true
        }
    );

});

document.querySelectorAll("video").forEach((video) => {

    video.muted = true;
    video.playsInline = true;

    const reproducir = () => {
        video.play().catch(() => {});
    };

    reproducir();

    document.addEventListener("touchstart", reproducir, {
        once: true,
        passive: true
    });

});

// =========================
// GALERÍA DE PRODUCTOS
// =========================

document.querySelectorAll(".galeria-producto").forEach(galeria => {

    const fotos = galeria.querySelectorAll(".foto-producto");
    const izquierda = galeria.querySelector(".flecha-izquierda");
    const derecha = galeria.querySelector(".flecha-derecha");

    let actual = 0;

    function mostrarFoto(indice) {
        fotos.forEach(foto => {
            foto.classList.remove("activa");
        });

        fotos[indice].classList.add("activa");
    }

    derecha.addEventListener("click", () => {
        actual++;

        if (actual >= fotos.length) {
            actual = 0;
        }

        mostrarFoto(actual);
    });

    izquierda.addEventListener("click", () => {
        actual--;

        if (actual < 0) {
            actual = fotos.length - 1;
        }

        mostrarFoto(actual);
    });

});

// ==========================================
// PRECIOS DESDE SUPABASE
// ==========================================

// Usamos los mismos datos que en admin.js

const SUPABASE_URL_PUBLICA =
    "https://isaqiccpchonggltggkc.supabase.co";

const SUPABASE_KEY_PUBLICA =
    "sb_publishable_DO00T8_uGL2TYIwVouQPYw_d7WnqfnA";


// Crear conexión para la página pública

const supabasePublico =
    window.supabase.createClient(
        SUPABASE_URL_PUBLICA,
        SUPABASE_KEY_PUBLICA
    );


// ==========================================
// FORMATEAR PRECIO ARGENTINO
// ==========================================

function formatearPrecioWeb(precio) {

    if (
        precio === null ||
        precio === undefined
    ) {
        return "";
    }

    return "$" +
        new Intl.NumberFormat("es-AR")
            .format(precio);
}


// ==========================================
// CARGAR PRECIOS DESDE SUPABASE
// ==========================================

async function cargarPreciosProductos() {

    const {
        data: productos,
        error
    } =
        await supabasePublico
            .from("productos")
            .select(
                "nombre, disponible, precio_chica, precio_mediana, precio_grande, precio_unico"
            );


    if (error) {

        console.error(
            "Error cargando precios:",
            error
        );

        return;
    }


    const tarjetas =
        document.querySelectorAll(".producto");


    productos.forEach(function (productoSupabase) {

        tarjetas.forEach(function (tarjeta) {

            const titulo =
                tarjeta.querySelector("h3");

            if (!titulo) {
                return;
            }


            const nombreHTML =
                titulo.textContent
                    .trim()
                    .toLowerCase();

            const nombreSupabase =
                productoSupabase.nombre
                    .trim()
                    .toLowerCase();


            if (nombreHTML !== nombreSupabase) {
                return;
            }


            const parrafos =
                tarjeta.querySelectorAll(
                    ".info-producto p"
                );


            parrafos.forEach(function (parrafo) {

                const texto =
                    parrafo.textContent
                        .toLowerCase();

                const precio =
                    parrafo.querySelector(
                        ".precio"
                    );


                if (!precio) {
                    return;
                }


                // GRANDE

                if (
                    texto.includes("grande") &&
                    productoSupabase.precio_grande !== null
                ) {

                    precio.textContent =
                        formatearPrecioWeb(
                            productoSupabase.precio_grande
                        );

                }


                // MEDIANA

                if (
                    texto.includes("mediana") &&
                    productoSupabase.precio_mediana !== null
                ) {

                    precio.textContent =
                        formatearPrecioWeb(
                            productoSupabase.precio_mediana
                        );

                }


                                // CHICA

                if (
                    texto.includes("chica") &&
                    productoSupabase.precio_chica !== null
                ) {

                    precio.textContent =
                        formatearPrecioWeb(
                            productoSupabase.precio_chica
                        );

                }

            });


            // ==========================================
// PRECIO ÚNICO
// ==========================================

if (productoSupabase.precio_unico !== null) {

    const precioUnico =
        tarjeta.querySelector(
            ".info-producto .detalle-tamano .precio"
        );

    if (precioUnico) {

        precioUnico.textContent =
            formatearPrecioWeb(
                productoSupabase.precio_unico
            );

    }

}
        });

    });

}


// Ejecutar al abrir la página

cargarPreciosProductos();