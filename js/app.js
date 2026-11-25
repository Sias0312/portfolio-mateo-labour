// Portfolio de Mateo Labour: botón para alternar modo claro / oscuro
const btnTema = document.getElementById('btn-tema');
const raiz = document.documentElement;

// localStorage puede estar bloqueado: la página debe funcionar igual
function leerTema() {
    try {
        return localStorage.getItem('tema');
    } catch (e) {
        return null;
    }
}

function aplicarTema(tema) {
    if (tema === 'oscuro') {
        raiz.setAttribute('data-tema', 'oscuro');
        btnTema.innerText = 'Modo claro';
    } else {
        raiz.removeAttribute('data-tema');
        btnTema.innerText = 'Modo oscuro';
    }
}

btnTema.addEventListener('click', function () {
    const nuevo = raiz.getAttribute('data-tema') === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(nuevo);
    try {
        localStorage.setItem('tema', nuevo);
    } catch (e) {
        console.warn('No se pudo guardar el tema', e);
    }
});

aplicarTema(leerTema());
