// ==========================================
// CONEXIÓN CON SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://isaqiccpchonggltggkc.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_DO00T8_uGL2TYIwVouQPYw_d7WnqfnA";


const supabaseCliente =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// ELEMENTOS DEL PANEL
// ==========================================

const loginAdmin =
    document.getElementById("login-admin");

const panelAdmin =
    document.getElementById("panel-admin");

const emailInput =
    document.getElementById("admin-email");

const passwordInput =
    document.getElementById("admin-password");

const botonLogin =
    document.getElementById("boton-login");

const botonCerrarSesion =
    document.getElementById(
        "boton-cerrar-sesion"
    );

const mensajeLogin =
    document.getElementById(
        "mensaje-login"
    );

const mensajePanel =
    document.getElementById(
        "mensaje-panel"
    );

const listaProductos =
    document.getElementById(
        "lista-productos"
    );

const listaPorciones =
    document.getElementById(
        "lista-porciones"
    );

    const adminBuscador =
    document.getElementById(
        "admin-buscador"
    );

const botonesFiltroAdmin =
    document.querySelectorAll(
        ".admin-filtro-btn"
    );

let filtroAdminActual =
    "todos";


// ==========================================
// FORMATEAR PRECIO
// ==========================================

function formatearPrecio(precio) {

    if (
        precio === null ||
        precio === undefined
    ) {
        return "";
    }

    return precio;

}


// ==========================================
// INICIAR SESIÓN
// ==========================================

botonLogin.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            mensajeLogin.textContent =
                "Completá email y contraseña.";

            return;

        }


        mensajeLogin.textContent =
            "Ingresando...";


        const {
            error
        } =
            await supabaseCliente
                .auth
                .signInWithPassword({

                    email: email,
                    password: password

                });


        if (error) {

            console.error(error);

            mensajeLogin.textContent =
                "Email o contraseña incorrectos.";

            return;

        }


        mensajeLogin.textContent = "";

        mostrarPanel();

    }
);


// ==========================================
// CERRAR SESIÓN
// ==========================================

botonCerrarSesion.addEventListener(
    "click",
    async function () {

        await supabaseCliente
            .auth
            .signOut();

        panelAdmin.style.display =
            "none";

        loginAdmin.style.display =
            "";

        passwordInput.value = "";

    }
);


// ==========================================
// MOSTRAR PANEL
// ==========================================

async function mostrarPanel() {

    loginAdmin.style.display =
        "none";

    panelAdmin.style.display =
        "";

    await cargarProductos();

}


// ==========================================
// CARGAR TODO DESDE SUPABASE
// ==========================================

async function cargarProductos() {

    mensajePanel.textContent =
        "Cargando productos...";

    listaProductos.innerHTML = "";

    listaPorciones.innerHTML = "";


    const {
        data: productos,
        error
    } =
        await supabaseCliente

            .from("productos")

            .select(
                "id, nombre, tipo, disponible, precio_chica, precio_mediana, precio_grande, precio_unico"
            )

            .order(
                "nombre",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(error);

        mensajePanel.textContent =
            "No se pudieron cargar los productos.";

        return;

    }


    mensajePanel.textContent = "";


    productos.forEach(
        function (producto) {

            if (
                producto.tipo === "porcion"
            ) {

                crearTarjetaPorcion(
                    producto
                );

            } else {

                crearTarjetaProducto(
                    producto
                );

            }

        }
    );

}


// ==========================================
// CREAR TARJETA PRODUCTO
// ==========================================

function crearTarjetaProducto(
    producto
) {

    const tarjeta =
        document.createElement(
            "section"
        );

    tarjeta.className =
        "admin-card";

        tarjeta.dataset.nombre =
    producto.nombre.toLowerCase();

tarjeta.dataset.tipo =
    "producto";

tarjeta.dataset.disponible =
    producto.disponible
        ? "true"
        : "false";


    tarjeta.innerHTML = `

        <h2>
            ${producto.nombre}
        </h2>


        <label>
            Precio chica
        </label>

        <input
            type="number"
            id="chica-${producto.id}"
            value="${formatearPrecio(producto.precio_chica)}"
            placeholder="Precio chica"
        >


        <label>
            Precio mediana
        </label>

        <input
            type="number"
            id="mediana-${producto.id}"
            value="${formatearPrecio(producto.precio_mediana)}"
            placeholder="Precio mediana"
        >


        <label>
            Precio grande
        </label>

        <input
            type="number"
            id="grande-${producto.id}"
            value="${formatearPrecio(producto.precio_grande)}"
            placeholder="Precio grande"
        >


        <label>
            Precio único
        </label>

        <input
            type="number"
            id="unico-${producto.id}"
            value="${formatearPrecio(producto.precio_unico)}"
            placeholder="Precio único"
        >


        <label class="disponibilidad">

            <input
                type="checkbox"
                id="disponible-${producto.id}"
                ${producto.disponible ? "checked" : ""}
            >

            Producto disponible

        </label>


        <button
            type="button"
            onclick="guardarProducto(${producto.id})"
        >
            Guardar cambios
        </button>


        <p
            id="mensaje-${producto.id}"
        ></p>

    `;


    listaProductos.appendChild(
        tarjeta
    );

}


// ==========================================
// CREAR TARJETA PORCIÓN
// ==========================================

function crearTarjetaPorcion(
    producto
) {

    const tarjeta =
        document.createElement(
            "section"
        );

    tarjeta.className =
        "admin-card admin-card-porcion";

        tarjeta.dataset.nombre =
    producto.nombre.toLowerCase();

tarjeta.dataset.tipo =
    "porcion";

tarjeta.dataset.disponible =
    producto.disponible
        ? "true"
        : "false";


    tarjeta.innerHTML = `

        <h3>
            ${producto.nombre}
        </h3>


        <label class="disponibilidad disponibilidad-porcion">

            <input
                type="checkbox"
                id="porcion-disponible-${producto.id}"
                ${producto.disponible ? "checked" : ""}
            >

            Disponible

        </label>


        <button
            type="button"
            onclick="guardarPorcion(${producto.id})"
        >
            Guardar
        </button>


        <p
            id="mensaje-porcion-${producto.id}"
        ></p>

    `;


    listaPorciones.appendChild(
        tarjeta
    );

}


// ==========================================
// GUARDAR PRODUCTO
// ==========================================

async function guardarProducto(
    idProducto
) {

    const inputChica =
        document.getElementById(
            `chica-${idProducto}`
        );

    const inputMediana =
        document.getElementById(
            `mediana-${idProducto}`
        );

    const inputGrande =
        document.getElementById(
            `grande-${idProducto}`
        );

    const inputUnico =
        document.getElementById(
            `unico-${idProducto}`
        );

    const inputDisponible =
        document.getElementById(
            `disponible-${idProducto}`
        );

    const mensaje =
        document.getElementById(
            `mensaje-${idProducto}`
        );


    const precioChica =
        inputChica.value
            ? Number(inputChica.value)
            : null;

    const precioMediana =
        inputMediana.value
            ? Number(inputMediana.value)
            : null;

    const precioGrande =
        inputGrande.value
            ? Number(inputGrande.value)
            : null;

    const precioUnico =
        inputUnico.value
            ? Number(inputUnico.value)
            : null;


    mensaje.textContent =
        "Guardando...";


    const {
        error
    } =
        await supabaseCliente

            .from("productos")

            .update({

                precio_chica:
                    precioChica,

                precio_mediana:
                    precioMediana,

                precio_grande:
                    precioGrande,

                precio_unico:
                    precioUnico,

                disponible:
                    inputDisponible.checked

            })

            .eq(
                "id",
                idProducto
            );


    if (error) {

        console.error(error);

        mensaje.textContent =
            "❌ No se pudieron guardar los cambios.";

        return;

    }


    mensaje.textContent =
        "✅ Cambios guardados";

        const tarjeta =
    inputDisponible.closest(".admin-card");

if (tarjeta) {

    tarjeta.dataset.disponible =
        inputDisponible.checked
            ? "true"
            : "false";
}

filtrarPanelAdmin();


    setTimeout(
        function () {

            mensaje.textContent = "";

        },
        3000
    );

}


// ==========================================
// GUARDAR DISPONIBILIDAD DE PORCIÓN
// ==========================================

async function guardarPorcion(
    idProducto
) {

    const inputDisponible =
        document.getElementById(
            `porcion-disponible-${idProducto}`
        );

    const mensaje =
        document.getElementById(
            `mensaje-porcion-${idProducto}`
        );


    mensaje.textContent =
        "Guardando...";


    const {
        error
    } =
        await supabaseCliente

            .from("productos")

            .update({

                disponible:
                    inputDisponible.checked

            })

            .eq(
                "id",
                idProducto
            );


    if (error) {

        console.error(error);

        mensaje.textContent =
            "❌ No se pudo guardar.";

        return;

    }


    mensaje.textContent =
        inputDisponible.checked
            ? "✅ Disponible"
            : "⛔ No disponible";

            const tarjeta =
    inputDisponible.closest(
        ".admin-card"
    );

if (tarjeta) {
    tarjeta.dataset.disponible =
        inputDisponible.checked
            ? "true"
            : "false";
}

filtrarPanelAdmin();sss

    setTimeout(
        function () {

            mensaje.textContent = "";

        },
        3000
    );

}


// ==========================================
// COMPROBAR SESIÓN
// ==========================================

async function comprobarSesion() {

    const {
        data
    } =
        await supabaseCliente
            .auth
            .getSession();


    if (data.session) {

        mostrarPanel();

    } else {

        loginAdmin.style.display =
            "";

        panelAdmin.style.display =
            "none";

    }

}

// ==========================================
// BUSCADOR Y FILTROS DEL PANEL
// ==========================================

function filtrarPanelAdmin() {

    const texto =
        adminBuscador
            ? adminBuscador.value
                .toLowerCase()
                .trim()
            : "";


    const tarjetas =
        document.querySelectorAll(
            "#lista-productos .admin-card, " +
            "#lista-porciones .admin-card"
        );


    tarjetas.forEach(
        function (tarjeta) {

            const nombre =
                tarjeta.dataset.nombre || "";

            const tipo =
                tarjeta.dataset.tipo || "";

            const disponible =
                tarjeta.dataset.disponible || "";


            const coincideTexto =
                nombre.includes(texto);


            let coincideFiltro =
                true;


            if (
                filtroAdminActual ===
                "producto"
            ) {

                coincideFiltro =
                    tipo === "producto";

            }


            if (
                filtroAdminActual ===
                "porcion"
            ) {

                coincideFiltro =
                    tipo === "porcion";

            }


            if (
                filtroAdminActual ===
                "disponible"
            ) {

                coincideFiltro =
                    disponible === "true";

            }


            if (
                filtroAdminActual ===
                "no-disponible"
            ) {

                coincideFiltro =
                    disponible === "false";

            }


            tarjeta.style.display =
                coincideTexto &&
                coincideFiltro
                    ? ""
                    : "none";

        }
    );

}


// BUSCADOR

if (adminBuscador) {

    adminBuscador.addEventListener(
        "input",
        filtrarPanelAdmin
    );

}


// BOTONES DE FILTRO

botonesFiltroAdmin.forEach(
    function (boton) {

        boton.addEventListener(
            "click",
            function () {

                botonesFiltroAdmin
                    .forEach(
                        function (btn) {

                            btn.classList.remove(
                                "activo"
                            );

                        }
                    );


                boton.classList.add(
                    "activo"
                );


                filtroAdminActual =
                    boton.dataset.filtro;


                filtrarPanelAdmin();

            }
        );

    }
);


comprobarSesion();