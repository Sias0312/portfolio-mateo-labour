console.log("Bienvenidos al catálogo");

const categorias = [
    "Sandbox",
    "Shooter",
    "Deportes",
    "Aventura",
    "RPG"
];

const plataformas = [
    "PC",
    "PS 1",
    "PS 2",
    "PS 3",
    "PS 4",
    "PS 5",
    "Xbox",
    "Switch"
];

// Seleccionar elementos
const nombreInput = document.querySelector("#nombre");
const categoriaInput = document.querySelector("#categoria");
const precioInput = document.querySelector("#precio");
const plataformaInput = document.querySelector("#plataforma");
const imagenInput = document.querySelector("#imagen");
const fechaInput = document.querySelector("#fecha");
const botonAgregar = document.querySelector("#agregar");
const catalogo = document.querySelector("#catalogo");

// Llenar los select con los arrays
categoriaInput.innerHTML = categorias.map(c => `<option>${c}</option>`).join("");
plataformaInput.innerHTML = plataformas.map(p => `<option>${p}</option>`).join("");

// Catálogo inicial
const videojuegos = [
    {
        nombre: "Minecraft",
        categoria: "Sandbox",
        precio: 15000,
        plataforma: "PC",
        imagen: "https://upload.wikimedia.org/wikipedia/en/b/b6/Minecraft_2024_cover_art.png",
        fecha: "2011-11-18"
    },
    {
        nombre: "Valorant",
        categoria: "Shooter",
        precio: 0,
        plataforma: "PC",
        imagen: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_pink_color_version.svg",
        fecha: "2020-06-02"
    },
    {
        nombre: "Rocket League",
        categoria: "Deportes",
        precio: 0,
        plataforma: "PC",
        imagen: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Rocket_League_coverart.jpg",
        fecha: "2015-07-07"
    }
];

// Evita que el texto del usuario rompa el HTML
function esc(texto) {
    return String(texto).replace(/[&<>"']/g, c => "&#" + c.charCodeAt(0) + ";");
}

function mostrarCatalogo() {

    let contenido = "";

    videojuegos.forEach(videojuego => {

        contenido += `
            <div class="juego">
                <img src="${esc(videojuego.imagen)}" alt="${esc(videojuego.nombre)}" onerror="this.style.visibility='hidden'">
                <h3>${esc(videojuego.nombre)}</h3>
                <p>Categoría: ${esc(videojuego.categoria)}</p>
                <p>Precio: $${esc(videojuego.precio)}</p>
                <p>Plataforma: ${esc(videojuego.plataforma)}</p>
                <p>Lanzamiento: ${esc(videojuego.fecha)}</p>
            </div>
        `;

    });

    catalogo.innerHTML = contenido;

}

mostrarCatalogo();

botonAgregar.addEventListener(
    "click",
    function() {

        const nombre = nombreInput.value.trim();
        console.log(nombre);

        if (nombre === "" || precioInput.value === "" || fechaInput.value === "") {
            return;
        }

        const nuevoVideojuego = {
            nombre: nombre,
            categoria: categoriaInput.value,
            precio: precioInput.value,
            plataforma: plataformaInput.value,
            imagen: imagenInput.value,
            fecha: fechaInput.value
        };

        videojuegos.push(nuevoVideojuego);

        mostrarCatalogo();

        nombreInput.value = "";
        precioInput.value = "";
        imagenInput.value = "";
        fechaInput.value = "";
    }
);
