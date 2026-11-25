// Dashboard Financiero Personal - Mateo Labour

// 1. Selección de elementos del HTML
const btnConsultar = document.getElementById('btn-consultar');
const estado = document.getElementById('estado');
const contenedor = document.getElementById('cotizaciones');
const tipoDolar = document.getElementById('tipo-dolar');
const detalleTipo = document.getElementById('detalle-tipo');
const sentido = document.getElementById('sentido');
const etiquetaMonto = document.getElementById('etiqueta-monto');
const monto = document.getElementById('monto');
const resultado = document.getElementById('resultado');

// 2. Endpoint público (devuelve un Array con todas las cotizaciones)
const API_URL = 'https://dolarapi.com/v1/dolares';
const CLAVE = 'cotizaciones';

let cotizaciones = [];

const formatoPesos = n => n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Evita que texto externo rompa el HTML
function esc(texto) {
    return String(texto).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
}

function formatoFecha(iso) {
    return new Date(iso).toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// localStorage puede estar bloqueado: nunca debe romper la app
function guardar(datos) {
    try {
        localStorage.setItem(CLAVE, JSON.stringify({ datos, guardado: new Date().toISOString() }));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage', e);
    }
}

function leerGuardado() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE));
    } catch (e) {
        return null;
    }
}

// Dibuja una tarjeta por cada tipo de dólar
function mostrarTarjetas() {
    contenedor.innerHTML = cotizaciones.map(c => `
        <div class="tarjeta">
            <h3>${esc(c.nombre)}</h3>
            <p>Compra <strong>$ ${formatoPesos(c.compra)}</strong></p>
            <p>Venta <strong>$ ${formatoPesos(c.venta)}</strong></p>
            <p class="detalle">Diferencia: $ ${formatoPesos(c.venta - c.compra)}</p>
            <p class="detalle">${formatoFecha(c.fechaActualizacion)}</p>
        </div>
    `).join('');
}

// Llena el selector del conversor, conservando la opción elegida
function llenarSelector() {
    const elegido = tipoDolar.value;
    tipoDolar.innerHTML = cotizaciones
        .map(c => `<option value="${esc(c.casa)}">${esc(c.nombre)}</option>`)
        .join('');
    if (elegido) tipoDolar.value = elegido;
}

function convertir() {
    const c = cotizaciones.find(x => x.casa === tipoDolar.value);
    if (!c) {
        resultado.innerText = '--';
        detalleTipo.innerText = '';
        return;
    }

    detalleTipo.innerText = `Compra $ ${formatoPesos(c.compra)} · Venta $ ${formatoPesos(c.venta)}`;

    const valor = parseFloat(monto.value);
    if (isNaN(valor) || valor < 0) {
        resultado.innerText = '--';
        return;
    }

    // Pesos a dólares: se compra dólar al precio de venta. Dólares a pesos: se vende al de compra.
    if (sentido.value === 'ars-usd') {
        resultado.innerText = `US$ ${formatoPesos(valor / c.venta)}`;
    } else {
        resultado.innerText = `$ ${formatoPesos(valor * c.compra)}`;
    }
}

function actualizarEtiqueta() {
    etiquetaMonto.innerText = sentido.value === 'ars-usd'
        ? 'Monto en pesos (ARS)'
        : 'Monto en dólares (USD)';
    convertir();
}

function mostrarDatos(datos) {
    cotizaciones = datos;
    mostrarTarjetas();
    llenarSelector();
    convertir();
}

async function obtenerCotizaciones() {
    try {
        // A. Estado de carga y botón deshabilitado
        estado.innerText = 'Consultando a la API...';
        btnConsultar.disabled = true;
        btnConsultar.innerText = 'Cargando...';

        // B. Petición y conversión de datos
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error('No se pudo obtener la respuesta del servidor (' + respuesta.status + ').');
        }
        const datos = await respuesta.json();
        console.log(datos);

        if (!Array.isArray(datos)) {
            throw new Error('La API devolvió un formato inesperado.');
        }

        // C. Mostrar y guardar para el modo offline
        mostrarDatos(datos);
        guardar(datos);
        estado.innerText = 'Actualizado: ' + formatoFecha(new Date());
        estado.className = '';

    } catch (error) {
        // D. Error: mostrar mensaje y usar la última cotización guardada
        console.error('Detalle del error:', error);
        const guardado = leerGuardado();
        if (guardado && Array.isArray(guardado.datos)) {
            mostrarDatos(guardado.datos);
            estado.innerText = 'Sin conexión. Mostrando datos guardados el ' + formatoFecha(guardado.guardado) + '.';
        } else {
            estado.innerText = 'Error al consultar las cotizaciones y no hay datos guardados. Revisá tu conexión.';
        }
        estado.className = 'error';

    } finally {
        // E. Rehabilitar el botón siempre
        btnConsultar.disabled = false;
        btnConsultar.innerText = 'Actualizar';
    }
}

btnConsultar.addEventListener('click', obtenerCotizaciones);
tipoDolar.addEventListener('change', convertir);
sentido.addEventListener('change', actualizarEtiqueta);
monto.addEventListener('input', convertir);

// Al abrir: mostrar lo guardado de inmediato y luego consultar la API
const inicial = leerGuardado();
if (inicial && Array.isArray(inicial.datos)) {
    mostrarDatos(inicial.datos);
}
obtenerCotizaciones();
