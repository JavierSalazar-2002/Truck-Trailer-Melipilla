// Base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "Filtro de Aceite Volvo",
        descripcion: "Filtro de aceite original para motores Volvo D12 y D13",
        precio: 45000,
        categoria: "filtros",
        imagen: "img/filtro-aceite.jpg"
    },
    {
        id: 2,
        nombre: "Pastillas de Freno Meritor",
        descripcion: "Pastillas de freno de alta calidad para ejes Meritor",
        precio: 125000,
        categoria: "frenos",
        imagen: "img/pastillas-freno.jpg"
    },
    {
        id: 3,
        nombre: "Amortiguador Trasero Scania",
        descripcion: "Amortiguador trasero para Scania Serie R y Serie G",
        precio: 185000,
        categoria: "suspension",
        imagen: "img/amortiguador.jpg"
    },
    {
        id: 4,
        nombre: "Bomba de Agua Detroit",
        descripcion: "Bomba de agua para motores Detroit Diesel Serie 60",
        precio: 320000,
        categoria: "motor",
        imagen: "img/bomba-agua.jpg"
    },
    {
        id: 5,
        nombre: "Neumático Bridgestone 295/80R22.5",
        descripcion: "Neumático para camión y remolque, excelente durabilidad",
        precio: 450000,
        categoria: "neumaticos",
        imagen: "img/neumatico.jpg"
    },
    {
        id: 6,
        nombre: "Alternador Bosch 24V",
        descripcion: "Alternador de 24 voltios, 150 amperios para camiones pesados",
        precio: 285000,
        categoria: "electrico",
        imagen: "img/alternador.jpg"
    },
    {
        id: 7,
        nombre: "Disco de Freno Brembo",
        descripcion: "Disco de freno ventilado para ejes delanteros",
        precio: 95000,
        categoria: "frenos",
        imagen: "img/disco-freno.jpg"
    },
    {
        id: 8,
        nombre: "Filtro de Aire K&N",
        descripcion: "Filtro de aire de alto flujo, lavable y reutilizable",
        precio: 75000,
        categoria: "filtros",
        imagen: "img/filtro-aire.jpg"
    },
    {
        id: 9,
        nombre: "Correa de Distribución Gates",
        descripcion: "Correa de distribución para motores diésel pesados",
        precio: 85000,
        categoria: "motor",
        imagen: "img/correa-distribucion.jpg"
    },
    {
        id: 10,
        nombre: "Sensor ABS Knorr-Bremse",
        descripcion: "Sensor de velocidad para sistema ABS en ejes traseros",
        precio: 65000,
        categoria: "electrico",
        imagen: "img/sensor-abs.jpg"
    },
    {
        id: 11,
        nombre: "Muelle de Suspensión",
        descripcion: "Muelle parabólico para suspensión trasera de camiones",
        precio: 220000,
        categoria: "suspension",
        imagen: "img/muelle-suspension.jpg"
    },
    {
        id: 12,
        nombre: "Neumático Michelin 315/70R22.5",
        descripcion: "Neumático direccional para ejes delanteros",
        precio: 520000,
        categoria: "neumaticos",
        imagen: "img/neumatico-michelin.jpg"
    }
];

// Variables globales
let productosMostrados = [...productos];
let carrito = [];

// Formatear precio
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CL');
}

// Mostrar productos
function mostrarProductos(lista) {
    const grid = document.getElementById('productos-grid');
    
    grid.innerHTML = lista.map(producto => `
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

    // Actualizar contador
    document.getElementById('total-productos').innerHTML = 
        `Mostrando <strong>${lista.length}</strong> productos`;
}

// Aplicar filtros
function aplicarFiltros() {
    let resultado = [...productos];

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

    productosMostrados = resultado;
    mostrarProductos(productosMostrados);
}

// Limpiar filtros
function limpiarFiltros() {
    document.querySelectorAll('input[name="categoria"]').forEach(cb => cb.checked = false);
    document.getElementById('precio-min').value = '';
    document.getElementById('precio-max').value = '';
    document.getElementById('ordenar').value = 'relevancia';
    aplicarFiltros();
}

// Agregar al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    alert(producto.nombre + ' agregado al carrito');
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar todos los productos
    mostrarProductos(productos);

    // Event listeners para filtros
    document.querySelectorAll('input[name="categoria"]').forEach(cb => {
        cb.addEventListener('change', aplicarFiltros);
    });

    document.getElementById('aplicar-precio').addEventListener('click', aplicarFiltros);
    document.getElementById('ordenar').addEventListener('change', aplicarFiltros);
    document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros);
});