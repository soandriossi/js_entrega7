let ingreso = false
const tragosMaximos = 2
const pedidos = []

class Trago {
    constructor(id, nombre, precio, stock){
        this.id=id
        this.nombre=nombre
        this.precio=precio
        this.stock=stock
    }
    vender(cantidad) {
        this.stock = this.stock - cantidad
    }
    hayStock() {
        return this.stock > 0
    }
}

const margarita= new Trago ("T-006", "Margarita", 1000, 5)
const fernet= new Trago ("T-001", "Fernet", 1200, 7)
const mojito= new Trago("T-002", "Mojito", 900, 4)
const ginTonic= new Trago( "T-004", "Gin Tonic", 1400,8)
const caipirinha= new Trago ("T-005", "Caipirinha", 1500, 6)
const cubaLibre= new Trago ("T-007", "Cuba Libre", 1000, 7)
const daiquiri= new Trago ("T-008", "Daiquiri", 1300, 3)
const negroni= new Trago ("T-009","Negroni", 1200, 4 )
const aperol= new Trago ("T-010", "Aperol Spritz", 1000, 8)
const tragosStock = [margarita, fernet, mojito, ginTonic, caipirinha, cubaLibre]

const inputNombre = document.getElementById("inputNombre")
const inputPrecio = document.getElementById("inputPrecio")
const inputStock = document.getElementById("inputStock")
const botonAgregar = document.getElementById("botonAgregar")
const contenedorItems = document.querySelector("#contenedor-items")
const inputBuscar = document.getElementById("inputBuscar")
const formIngreso = document.getElementById("formIngreso")
const inputEdad = document.getElementById("inputEdad")
const botonIngresar = document.getElementById("botonIngresar")
const mensajeIngreso = document.getElementById("mensajeIngreso")
const contenedorPedidos = document.getElementById("contenedor-pedidos")
const contenedorCuenta = document.getElementById("contenedor-cuenta")
const mensajeAdmin = document.getElementById("mensajeAdmin")

function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto
    elemento.className = `mensaje ${tipo}`
}

let proximoId = 11

function renderizarTragos() {
    const texto = inputBuscar.value.trim().toLowerCase()
    const tragosFiltrados = tragosStock.filter((trago) => trago.nombre.toLowerCase().includes(texto))

    contenedorItems.innerHTML = ""
    for (const trago of tragosFiltrados) {
        contenedorItems.innerHTML += `
            <div class="item">
                <h3>${trago.nombre}</h3>
                <p>Precio: $${trago.precio} - Stock: ${trago.stock}</p>
            </div>
        `
    }
}

function agregarTrago() {
    const nombre = inputNombre.value.trim()
    const precio = Number(inputPrecio.value)
    const stock = Number(inputStock.value)

    if (nombre === "" || inputPrecio.value === "" || inputStock.value === "") {
        mostrarMensaje(mensajeAdmin, "Completá nombre, precio y stock", "error")
        return
    }

    if (precio <= 0 || stock < 0) {
        mostrarMensaje(mensajeAdmin, "El precio tiene que ser mayor a 0 y el stock no puede ser negativo", "error")
        return
    }

    const nuevoTrago = new Trago(`T-${String(proximoId).padStart(3, "0")}`, nombre, precio, stock)
    proximoId++
    tragosStock.push(nuevoTrago)

    inputNombre.value = ""
    inputPrecio.value = ""
    inputStock.value = ""

    mostrarMensaje(mensajeAdmin, `Se agregó ${nuevoTrago.nombre} a la carta`, "exito")
    renderizarTragos()
    renderizarMenu()
}

botonAgregar.addEventListener("click", agregarTrago)
inputBuscar.addEventListener("keyup", renderizarTragos)


const obtenerDisponibles = () => tragosStock.filter((trago) => trago.hayStock())

const calcularTotal = (lista) => lista.reduce((acumulado, pedido) => acumulado + pedido.precio, 0)

function esMayorDeEdad (edad){
    if (edad >= 18){
        ingreso = true
    }
}

function renderizarMenu() {
    if (!ingreso) return

    const disponibles = obtenerDisponibles()
    contenedorPedidos.innerHTML = ""

    if (!disponibles.some((trago) => trago.hayStock())) {
        contenedorPedidos.innerHTML = `<p>No quedan tragos disponibles</p>`
        return
    }

    for (const trago of disponibles) {
        contenedorPedidos.innerHTML += `
            <div class="item">
                <h3>${trago.nombre}</h3>
                <p>Precio: $${trago.precio}</p>
                <button class="botonPedir" data-id="${trago.id}" ${pedidos.length >= tragosMaximos ? "disabled" : ""}>Pedir</button>
            </div>
        `
    }
}

function renderizarCuenta() {
    const detalle = pedidos.map((pedido) => `<li>${pedido.nombre}: $${pedido.precio}</li>`).join("")
    contenedorCuenta.innerHTML = `
        <h3>Tu cuenta</h3>
        <ul>${detalle}</ul>
        <p>Total: $${calcularTotal(pedidos)}</p>
    `
}

function pedirTrago(evento) {
    if (!evento.target.classList.contains("botonPedir")) return
    if (pedidos.length >= tragosMaximos) return

    const tragoElegido = tragosStock.find((trago) => trago.id === evento.target.dataset.id)
    tragoElegido.vender(1)
    pedidos.push({ nombre: tragoElegido.nombre, precio: tragoElegido.precio })

    const restantes = tragosMaximos - pedidos.length
    if (restantes > 0) {
        mostrarMensaje(mensajeIngreso, `Pediste ${tragoElegido.nombre} por $${tragoElegido.precio}. Te quedan ${restantes} tragos`, "exito")
    } else {
        mostrarMensaje(mensajeIngreso, `Pediste ${tragoElegido.nombre} por $${tragoElegido.precio}. Ya pediste tus ${tragosMaximos} tragos`, "exito")
    }

    renderizarTragos()
    renderizarMenu()
    renderizarCuenta()
}

function administrarBar() {
    tragosStock.push(daiquiri)
    tragosStock.unshift(negroni)

    const indiceCubaLibre = tragosStock.indexOf(cubaLibre)
    tragosStock.splice(indiceCubaLibre, 1, aperol)

    renderizarTragos()
}

function ingresarAlBar() {
    if (inputEdad.value === "") {
        mostrarMensaje(mensajeIngreso, "Completá tu edad", "error")
        return
    }

    esMayorDeEdad(Number(inputEdad.value))

    if (!ingreso) {
        mostrarMensaje(mensajeIngreso, "Acceso denegado", "error")
        return
    }

    mostrarMensaje(mensajeIngreso, `Podés ingresar, tenés ${tragosMaximos} tragos.`, "exito")

    formIngreso.style.display = "none"
    renderizarTragos()
    renderizarMenu()
}

botonIngresar.addEventListener("click", ingresarAlBar)
contenedorPedidos.addEventListener("click", pedirTrago)

administrarBar()
