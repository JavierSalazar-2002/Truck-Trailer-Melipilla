// Base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "Filtro de Aceite Volvo",
        descripcion: "Filtro de aceite original para motores Volvo D12 y D13",
        precio: 45000,
        categoria: "filtros",
        imagen: "img/filtro2.png"
    },
    {
        id: 2,
        nombre: "Pastillas de Freno Meritor",
        descripcion: "Pastillas de freno de alta calidad para ejes Meritor",
        precio: 125000,
        categoria: "frenos",
        imagen: "img/pastilla.png"
    },
    {
        id: 3,
        nombre: "Amortiguador Trasero Scania",
        descripcion: "Amortiguador trasero para Scania Serie R y Serie G",
        precio: 185000,
        categoria: "suspension",
        imagen: "img/amortiguador.png"
    },
    {
        id: 4,
        nombre: "Bomba de Agua Detroit",
        descripcion: "Bomba de agua para motores Detroit Diesel Serie 60",
        precio: 320000,
        categoria: "motor",
        imagen: "img/bombaagua.jpg"
    },
    {
        id: 5,
        nombre: "Neumático Bridgestone 295/80R22.5",
        descripcion: "Neumático para camión y remolque, excelente durabilidad",
        precio: 450000,
        categoria: "neumaticos",
        imagen: "img/neumatico2.png"
    },
    {
        id: 6,
        nombre: "Bateria wena",
        descripcion: "Alternador de 24 voltios, 150 amperios para camiones pesados",
        precio: 285000,
        categoria: "electrico",
        imagen: "img/bateria.png"
    },
    {
        id: 7,
        nombre: "Disco de Freno Brembo",
        descripcion: "Disco de freno ventilado para ejes delanteros",
        precio: 95000,
        categoria: "frenos",
        imagen: "img/Disco.jpg"
    },
    {
        id: 8,
        nombre: "Filtro de Aire K&N",
        descripcion: "Filtro de aire de alto flujo, lavable y reutilizable",
        precio: 75000,
        categoria: "filtros",
        imagen: "img/filtro.png"
    },
    {
        id: 9,
        nombre: "Correa de Distribución Gates",
        descripcion: "Correa de distribución para motores diésel pesados",
        precio: 85000,
        categoria: "motor",
        imagen: "img/correa.jpg"
    },
    {
        id: 10,
        nombre: "Sensor ABS Knorr-Bremse",
        descripcion: "Sensor de velocidad para sistema ABS en ejes traseros",
        precio: 65000,
        categoria: "electrico",
        imagen: "img/sensot.png"
    },
    {
        id: 11,
        nombre: "Muelle de Suspensión",
        descripcion: "Muelle parabólico para suspensión trasera de camiones",
        precio: 220000,
        categoria: "suspension",
        imagen: "img/muelle.png"
    },
    {
        id: 12,
        nombre: "Neumático Michelin 315/70R22.5",
        descripcion: "Neumático direccional para ejes delanteros",
        precio: 520000,
        categoria: "neumaticos",
        imagen: "img/michellin.jpg"
    },
    {
        id: 13,
        nombre: "Neumático Michelin 315/70R22.5",
        descripcion: "Neumático direccional para ejes delanteros",
        precio: 520000,
        categoria: "neumaticos",
        imagen: "img/michellin.jpg"
    },
    {
        id: 14,
        nombre: "Neumático Michelin 315/70R22.5",
        descripcion: "Neumático direccional para ejes delanteros",
        precio: 520000,
        categoria: "neumaticos",
        imagen: "img/michellin.jpg"
    },
    {
        id: 15,
        nombre: "Neumático Michelin 315/70R22.5",
        descripcion: "Neumático direccional para ejes delanteros",
        precio: 520000,
        categoria: "neumaticos",
        imagen: "img/michellin.jpg"
    },
    {
        id: 16,
        nombre: "Neumático Michelin 315/70R22.5",
        descripcion: "Neumático direccional para ejes delanteros",
        precio: 520000,
        categoria: "neumaticos",
        imagen: "img/michellin.jpg"
    },
    {
        id: 17,
        nombre: "Neumático Michelin 315/70R22.5",
        descripcion: "Neumático direccional para ejes delanteros",
        precio: 520000,
        categoria: "neumaticos",
        imagen: "img/michellin.jpg"
    }
];

// Variables globales
let productosFiltrados = [...productos];
let carrito = [];
let paginaActual = 1;
const productosPorPagina = 15;

// Formatear precio
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CL');
}

// Mostrar productos con paginación
function mostrarProductos() {
    const grid = document.getElementById('productos-grid');
    
    // Calcular productos para la página actual
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosActuales = productosFiltrados.slice(inicio, fin);
    
    // Generar HTML de productos
    grid.innerHTML = productosActuales.map(producto => `
        <div class="producto-card">
            <div class="producto-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-precio">${formatearPrecio(producto.precio)}</div>
                <div class="producto-acciones">
                    <button class="btn-carrito" onclick="agregarAlCarrito(${producto.id})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Actualizar contador de productos
    actualizarContadorProductos();
    
    // Actualizar paginación
    actualizarPaginacion();
}

// Actualizar contador de productos
function actualizarContadorProductos() {
    const inicio = (paginaActual - 1) * productosPorPagina + 1;
    const fin = Math.min(paginaActual * productosPorPagina, productosFiltrados.length);
    
    document.getElementById('total-productos').innerHTML = 
        `Mostrando <strong>${inicio}-${fin}</strong> de <strong>${productosFiltrados.length}</strong> productos`;
}

// Actualizar paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const contenedorPaginacion = document.querySelector('.numeros-pag');
    const btnAnterior = document.getElementById('prev-page');
    const btnSiguiente = document.getElementById('next-page');
    
    // Actualizar botones anterior/siguiente
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
    
    // Generar números de páginas
    let numerosPaginas = '';
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);
    
    // Ajustar inicio si estamos cerca del final
    if (fin - inicio < maxPaginasVisibles - 1) {
        inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
        numerosPaginas += `
            <button class="btn-pag ${i === paginaActual ? 'active' : ''}" onclick="irAPagina(${i})">
                ${i}
            </button>
        `;
    }
    
    contenedorPaginacion.innerHTML = numerosPaginas;
}

// Ir a página específica
function irAPagina(pagina) {
    paginaActual = pagina;
    mostrarProductos();
    // Scroll suave hacia arriba
    document.querySelector('.catalogo-content').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Página anterior
function paginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarProductos();
        document.querySelector('.catalogo-content').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Página siguiente
function paginaSiguiente() {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarProductos();
        document.querySelector('.catalogo-content').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Función de búsqueda
function buscarProductos() {
    const termino = document.getElementById('buscador').value.toLowerCase().trim();
    
    if (termino === '') {
        // Si no hay término de búsqueda, aplicar solo filtros
        aplicarFiltros();
        return;
    }
    
    // Filtrar productos por término de búsqueda
    let resultado = productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(termino) ||
               producto.descripcion.toLowerCase().includes(termino) ||
               producto.categoria.toLowerCase().includes(termino);
    });
    
    // Aplicar filtros adicionales al resultado de búsqueda
    resultado = aplicarFiltrosALista(resultado);
    
    productosFiltrados = resultado;
    paginaActual = 1; // Resetear a primera página
    mostrarProductos();
}

// Aplicar filtros a una lista específica
function aplicarFiltrosALista(lista) {
    let resultado = [...lista];
    
    // Filtrar por categorías
    const categorias = Array.from(document.querySelectorAll('input[name="categoria"]:checked'))
        .map(cb => cb.value);
    
    if (categorias.length > 0) {
        resultado = resultado.filter(p => categorias.includes(p.categoria));
    }

    // Filtrar por precio
    const min = parseInt(document.getElementById('precio-min').value) || 0;
    const max = parseInt(document.getElementById('precio-max').value) || Infinity;
    
    resultado = resultado.filter(p => p.precio >= min && p.precio <= max);

    // Ordenar
    const orden = document.getElementById('ordenar').value;
    if (orden === 'precio-asc') {
        resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio-desc') {
        resultado.sort((a, b) => b.precio - a.precio);
    } else if (orden === 'nombre-asc') {
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === 'nombre-desc') {
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }
    
    return resultado;
}

// Aplicar filtros (modificada para trabajar con búsqueda)
function aplicarFiltros() {
    const termino = document.getElementById('buscador').value.toLowerCase().trim();
    let lista = productos;
    
    // Si hay término de búsqueda, filtrar primero por búsqueda
    if (termino !== '') {
        lista = productos.filter(producto => {
            return producto.nombre.toLowerCase().includes(termino) ||
                   producto.descripcion.toLowerCase().includes(termino) ||
                   producto.categoria.toLowerCase().includes(termino);
        });
    }
    
    // Aplicar filtros adicionales
    productosFiltrados = aplicarFiltrosALista(lista);
    paginaActual = 1; // Resetear a primera página
    mostrarProductos();
}

// Limpiar filtros
function limpiarFiltros() {
    document.querySelectorAll('input[name="categoria"]').forEach(cb => cb.checked = false);
    document.getElementById('precio-min').value = '';
    document.getElementById('precio-max').value = '';
    document.getElementById('ordenar').value = 'relevancia';
    document.getElementById('buscador').value = '';
    
    productosFiltrados = [...productos];
    paginaActual = 1;
    mostrarProductos();
}

// Agregar al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    
    // Mensaje más elegante
    const mensaje = `✅ ${producto.nombre} agregado al carrito`;
    mostrarNotificacion(mensaje);
}

// Mostrar notificación personalizada
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #5a8756;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Mostrar notificación
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar todos los productos inicialmente
    productosFiltrados = [...productos];
    mostrarProductos();

    // Event listeners para filtros
    document.querySelectorAll('input[name="categoria"]').forEach(cb => {
        cb.addEventListener('change', aplicarFiltros);
    });

    document.getElementById('aplicar-precio').addEventListener('click', aplicarFiltros);
    document.getElementById('ordenar').addEventListener('change', aplicarFiltros);
    document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros);
    
    // Event listener para buscador
    const buscador = document.getElementById('buscador');
    buscador.addEventListener('input', buscarProductos);
    
    // Event listeners para paginación
    document.getElementById('prev-page').addEventListener('click', paginaAnterior);
    document.getElementById('next-page').addEventListener('click', paginaSiguiente);
});