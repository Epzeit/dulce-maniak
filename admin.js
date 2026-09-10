// ==========================================
// CONEXIÓN CON SUPABASE
// ==========================================

// PEGAR ACÁ LOS DATOS DE TU PROYECTO

const SUPABASE_URL = "https://isaqiccpchonggltggkc.supabase.co";

const SUPABASE_KEY = "sb_publishable_DO00T8_uGL2TYIwVouQPYw_d7WnqfnA";


// Crear conexión

const supabaseCliente = window.supabase.createClient(
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
    document.getElementById("boton-cerrar-sesion");

const mensajeLogin =
    document.getElementById("mensaje-login");

const mensajePanel =
    document.getElementById("mensaje-panel");

const listaProductos =
    document.getElementById("lista-productos");


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
            data,
            error
        } =
            await supabaseCliente.auth.signInWithPassword({

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

        await supabaseCliente.auth.signOut();

        panelAdmin.style.display = "none";

        loginAdmin.style.display = "";

        passwordInput.value = "";

    }
);


// ==========================================
// MOSTRAR PANEL
// ==========================================

async function mostrarPanel() {

    loginAdmin.style.display = "none";

    panelAdmin.style.display = "";

    await cargarProductos();

}


// ==========================================
// CARGAR PRODUCTOS DESDE SUPABASE
// ==========================================

async function cargarProductos() {

    mensajePanel.textContent =
        "Cargando productos...";

    listaProductos.innerHTML = "";


    const {
        data: productos,
        error
    } =
        await supabaseCliente

            .from("productos")

            .select(
    "id, nombre, disponible, precio_chica, precio_mediana, precio_grande, precio_unico"
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


    productos.forEach(function (producto) {

        crearTarjetaProducto(producto);

    });

}


// ==========================================
// CREAR TARJETA DEL PRODUCTO
// ==========================================

function crearTarjetaProducto(producto) {

    const tarjeta =
        document.createElement("section");

    tarjeta.className =
        "admin-card";


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


    listaProductos.appendChild(tarjeta);

}


// ==========================================
// GUARDAR PRODUCTO
// ==========================================

async function guardarProducto(idProducto) {

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
        "✅ Cambios guardados correctamente";


    setTimeout(function () {

        mensaje.textContent = "";

    }, 3000);

}


// ==========================================
// COMPROBAR SESIÓN AL ABRIR ADMIN
// ==========================================

async function comprobarSesion() {

    const {
        data
    } =
        await supabaseCliente.auth.getSession();


    if (data.session) {

        mostrarPanel();

    } else {

        loginAdmin.style.display = "";

        panelAdmin.style.display = "none";

    }

}


comprobarSesion();