// === SISTEMA DE CARRITO COMPLETO CON CÓDIGOS DE DESCUENTO ===

// Productos ficticios para demostración
const PRODUCTOS_FICTICIOS = [
    {
        id: 1,
        nombre: "Aceite Motor 15W-40",
        descripcion: "Aceite mineral para motores diésel pesados",
        precio: 25990,
        imagen: "img/aceite-motor.jpg",
        categoria: "lubricantes"
    },
    {
        id: 2,
        nombre: "Filtro de Aire Scania",
        descripcion: "Filtro de aire original para camiones Scania",
        precio: 45500,
        imagen: "img/filtro-aire.jpg",
        categoria: "filtros"
    },
    {
        id: 3,
        nombre: "Pastillas de Freno Volvo",
        descripcion: "Pastillas de freno cerámicas para camiones Volvo",
        precio: 89900,
        imagen: "img/pastillas-freno.jpg",
        categoria: "frenos"
    },
    {
        id: 4,
        nombre: "Batería 12V 200Ah",
        descripcion: "Batería de arranque para vehículos pesados",
        precio: 185000,
        imagen: "img/bateria.jpg",
        categoria: "electrico"
    },
    {
        id: 5,
        nombre: "Llanta 295/80R22.5",
        descripcion: "Llanta radial para camiones y trailers",
        precio: 245000,
        imagen: "img/llanta.jpg",
        categoria: "neumaticos"
    }
];

// Códigos de descuento válidos
const CODIGOS_DESCUENTO = {
    'BIENVENIDO10': {
        tipo: 'porcentaje',
        valor: 10,
        descripcion: '10% de descuento',
        minimo: 0
    },
    'TRUCK15': {
        tipo: 'porcentaje',
        valor: 15,
        descripcion: '15% de descuento',
        minimo: 50000
    },
    'ENVIOGRATIS': {
        tipo: 'envio',
        valor: 0,
        descripcion: 'Envío gratuito',
        minimo: 0
    },
    'SAVE5000': {
        tipo: 'fijo',
        valor: 5000,
        descripcion: '$5,000 de descuento',
        minimo: 20000
    }
};

// Clase para manejar el carrito con descuentos
class CarritoManager {
    constructor() {
        this.carrito = this.cargarCarrito();
        this.descuentoAplicado = null;
        this.costoEnvio = 5990;
        this.envioGratisMinimo = 100000;
        this.init();
    }

    init() {
        // Cargar carrito ficticio si está vacío (solo para demostración)
        if (this.carrito.length === 0) {
            this.cargarCarritoFicticio();
        }
        
        this.renderizarCarrito();
        this.actualizarResumen();
        this.configurarEventos();
    }

    // Cargar carrito ficticio para demostración
    cargarCarritoFicticio() {
        this.agregarProducto(PRODUCTOS_FICTICIOS[0], 2);
        this.agregarProducto(PRODUCTOS_FICTICIOS[2], 1);
        this.agregarProducto(PRODUCTOS_FICTICIOS[4], 2);
        this.guardarCarrito();
    }

    // Cargar carrito desde localStorage
    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito-truck-trailer');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carrito-truck-trailer', JSON.stringify(this.carrito));
    }

    // Agregar producto al carrito
    agregarProducto(producto, cantidad = 1) {
        const itemExistente = this.carrito.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.carrito.push({
                ...producto,
                cantidad: cantidad
            });
        }
        
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarResumen();
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarResumen();
        this.mostrarNotificacion('Producto eliminado del carrito', 'info');
    }

    // Actualizar cantidad de un producto
    actualizarCantidad(id, nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            this.eliminarProducto(id);
            return;
        }

        const item = this.carrito.find(item => item.id === id);
        if (item) {
            item.cantidad = nuevaCantidad;
            this.guardarCarrito();
            this.renderizarCarrito();
            this.actualizarResumen();
        }
    }

    // Vaciar carrito completo
    vaciarCarrito() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('El carrito ya está vacío', 'info');
            return;
        }

        if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
            this.carrito = [];
            this.descuentoAplicado = null;
            this.limpiarDescuento();
            this.guardarCarrito();
            this.renderizarCarrito();
            this.actualizarResumen();
            this.mostrarNotificacion('Carrito vaciado exitosamente', 'success');
        }
    }

    // Calcular subtotal del carrito
    calcularSubtotal() {
        return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    // Calcular descuento
    calcularDescuento(subtotal) {
        if (!this.descuentoAplicado) return 0;

        const codigo = CODIGOS_DESCUENTO[this.descuentoAplicado];
        if (!codigo) return 0;

        // Verificar monto mínimo
        if (subtotal < codigo.minimo) return 0;

        switch (codigo.tipo) {
            case 'porcentaje':
                return Math.round(subtotal * (codigo.valor / 100));
            case 'fijo':
                return Math.min(codigo.valor, subtotal);
            case 'envio':
                return 0; // El descuento en envío se maneja separadamente
            default:
                return 0;
        }
    }

    // Calcular costo de envío
    calcularEnvio(subtotal) {
        // Envío gratis si hay un código de envío gratis aplicado
        if (this.descuentoAplicado && CODIGOS_DESCUENTO[this.descuentoAplicado].tipo === 'envio') {
            return 0;
        }
        
        // Envío gratis para compras superiores al mínimo
        if (subtotal >= this.envioGratisMinimo) {
            return 0;
        }
        
        return this.costoEnvio;
    }

    // Formatear precio en pesos chilenos
    formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(precio);
    }

    // Renderizar carrito en el DOM
    renderizarCarrito() {
        const container = document.querySelector('.carrito-container');
        
        if (this.carrito.length === 0) {
            container.innerHTML = this.generarCarritoVacio();
            return;
        }

        const carritoHTML = `
            <div class="carrito-header">
                <h2>Tu Carrito (${this.carrito.length} producto${this.carrito.length !== 1 ? 's' : ''})</h2>
                <button class="btn-vaciar-carrito" onclick="carritoManager.vaciarCarrito()">
                    🗑️ Vaciar Carrito
                </button>
            </div>
            <div class="carrito-items">
                ${this.carrito.map(item => this.generarItemCarrito(item)).join('')}
            </div>
        `;
        
        container.innerHTML = carritoHTML;
    }

    // Generar HTML para carrito vacío
    generarCarritoVacio() {
        return `
            <div class="carrito-vacio">
                <div class="carrito-vacio-icon">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p>¡Explora nuestro catálogo y encuentra las mejores refacciones para tu vehículo!</p>
                <p><a href="catalogo.html">Ver Catálogo</a></p>
            </div>
        `;
    }

    // Generar HTML para un item del carrito
    generarItemCarrito(item) {
        return `
            <div class="carrito-item" data-id="${item.id}">
                <div class="item-imagen">
                    <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='img/producto-default.jpg'">
                </div>
                <div class="item-info">
                    <h3 class="item-nombre">${item.nombre}</h3>
                    <p class="item-descripcion">${item.descripcion}</p>
                    <p class="item-precio">Precio unitario: ${this.formatearPrecio(item.precio)}</p>
                </div>
                <div class="item-cantidad">
                    <button class="btn-cantidad" onclick="carritoManager.actualizarCantidad(${item.id}, ${item.cantidad - 1})">−</button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="carritoManager.actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                </div>
                <div class="item-subtotal">
                    ${this.formatearPrecio(item.precio * item.cantidad)}
                </div>
                <button class="btn-eliminar" onclick="carritoManager.eliminarProducto(${item.id})" title="Eliminar producto">
                    ×
                </button>
            </div>
        `;
    }

    // Actualizar resumen del pedido
    actualizarResumen() {
        const subtotal = this.calcularSubtotal();
        const descuento = this.calcularDescuento(subtotal);
        const envio = this.calcularEnvio(subtotal);
        const total = subtotal - descuento + envio;

        // Actualizar elementos del DOM
        const subtotalElement = document.getElementById('subtotal-amount');
        const discountElement = document.getElementById('discount-amount');
        const discountLine = document.getElementById('discount-line');
        const shippingElement = document.getElementById('shipping-amount');
        const totalElement = document.getElementById('total-amount');
        const checkoutButton = document.getElementById('checkout-btn');

        if (subtotalElement) subtotalElement.textContent = this.formatearPrecio(subtotal);
        if (shippingElement) {
            if (envio === 0) {
                shippingElement.textContent = 'GRATIS';
                shippingElement.style.color = '#51cf66';
                shippingElement.style.fontWeight = 'bold';
            } else {
                shippingElement.textContent = this.formatearPrecio(envio);
                shippingElement.style.color = 'inherit';
                shippingElement.style.fontWeight = 'normal';
            }
        }
        if (totalElement) totalElement.textContent = this.formatearPrecio(total);

        // Mostrar/ocultar línea de descuento
        if (discountLine && discountElement) {
            if (descuento > 0) {
                discountElement.textContent = `-${this.formatearPrecio(descuento)}`;
                discountLine.style.display = 'flex';
            } else {
                discountLine.style.display = 'none';
            }
        }

        // Actualizar botón de checkout
        if (checkoutButton) {
            if (this.carrito.length === 0) {
                checkoutButton.textContent = 'CARRITO VACÍO';
                checkoutButton.disabled = true;
            } else {
                checkoutButton.textContent = `PROCEDER AL PAGO (${this.formatearPrecio(total)})`;
                checkoutButton.disabled = false;
            }
        }
    }

    // Aplicar código de descuento
    aplicarDescuento(codigo) {
        const codigoUpper = codigo.trim().toUpperCase();
        const descuento = CODIGOS_DESCUENTO[codigoUpper];

        if (!descuento) {
            this.mostrarMensajeDescuento('❌ Código de descuento inválido', 'error');
            return false;
        }

        const subtotal = this.calcularSubtotal();
        if (subtotal < descuento.minimo) {
            this.mostrarMensajeDescuento(
                `❌ Monto mínimo requerido: ${this.formatearPrecio(descuento.minimo)}`, 
                'error'
            );
            return false;
        }

        this.descuentoAplicado = codigoUpper;
        this.mostrarMensajeDescuento(`✅ ${descuento.descripcion} aplicado`, 'success');
        this.actualizarResumen();
        this.mostrarNotificacion(`Descuento aplicado: ${descuento.descripcion}`, 'success');
        
        // Limpiar campo de entrada
        const input = document.getElementById('discount-code-input');
        if (input) input.value = '';

        return true;
    }

    // Mostrar mensaje de descuento
    mostrarMensajeDescuento(mensaje, tipo) {
        const messageElement = document.getElementById('discount-message');
        if (messageElement) {
            messageElement.textContent = mensaje;
            messageElement.className = tipo;
            messageElement.style.display = 'block';

            if (tipo === 'error') {
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 3000);
            }
        }
    }

    // Limpiar descuento aplicado
    limpiarDescuento() {
        this.descuentoAplicado = null;
        const messageElement = document.getElementById('discount-message');
        if (messageElement) {
            messageElement.style.display = 'none';
        }
    }

    // Configurar eventos
    configurarEventos() {
        const checkoutButton = document.getElementById('checkout-btn');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.procesarCompra());
        }

        // Event listener para aplicar descuento con Enter
        const discountInput = document.getElementById('discount-code-input');
        if (discountInput) {
            discountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    aplicarDescuento();
                }
            });
        }
    }

    // Procesar compra ficticia
    procesarCompra() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('No hay productos en el carrito', 'error');
            return;
        }

        const subtotal = this.calcularSubtotal();
        const descuento = this.calcularDescuento(subtotal);
        const envio = this.calcularEnvio(subtotal);
        const total = subtotal - descuento + envio;
        const resumen = this.generarResumenCompra();
        
        if (confirm(`¿Confirmar compra por ${this.formatearPrecio(total)}?\n\n${resumen}`)) {
            this.mostrarCargando();
            
            setTimeout(() => {
                const numeroOrden = this.generarNumeroOrden();
                this.mostrarConfirmacionCompra(numeroOrden, total);
                this.vaciarCarritoSilencioso();
            }, 2000);
        }
    }

    // Generar resumen de compra
    generarResumenCompra() {
        let resumen = this.carrito.map(item => 
            `• ${item.nombre} (x${item.cantidad}) - ${this.formatearPrecio(item.precio * item.cantidad)}`
        ).join('\n');

        const subtotal = this.calcularSubtotal();
        const descuento = this.calcularDescuento(subtotal);
        const envio = this.calcularEnvio(subtotal);

        resumen += `\n\nSubtotal: ${this.formatearPrecio(subtotal)}`;
        if (descuento > 0) {
            resumen += `\nDescuento: -${this.formatearPrecio(descuento)}`;
        }
        resumen += `\nEnvío: ${envio === 0 ? 'GRATIS' : this.formatearPrecio(envio)}`;

        return resumen;
    }

    // Generar número de orden ficticio
    generarNumeroOrden() {
        return 'TT' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    // Vaciar carrito sin confirmación
    vaciarCarritoSilencioso() {
        this.carrito = [];
        this.descuentoAplicado = null;
        this.limpiarDescuento();
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarResumen();
    }

    // Mostrar loading durante compra
    mostrarCargando() {
        const checkoutButton = document.getElementById('checkout-btn');
        if (checkoutButton) {
            checkoutButton.textContent = 'PROCESANDO COMPRA...';
            checkoutButton.disabled = true;
            checkoutButton.style.opacity = '0.7';
        }
    }

    // Mostrar confirmación de compra
    mostrarConfirmacionCompra(numeroOrden, total) {
        const mensaje = `
            🎉 ¡Compra realizada exitosamente!
            
            Número de orden: ${numeroOrden}
            Total pagado: ${this.formatearPrecio(total)}
            
            Recibirás un email de confirmación con los detalles de tu compra.
            Tiempo estimado de entrega: 2-3 días hábiles.
            
            ¡Gracias por confiar en Truck & Trailer Melipilla!
        `;
        
        alert(mensaje);
    }

    // Mostrar notificaciones
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <span>${mensaje}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#d4edda' : tipo === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${tipo === 'success' ? '#155724' : tipo === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
        }, 4000);
    }

    // Obtener información del carrito (para uso externo)
    obtenerInfo() {
        const subtotal = this.calcularSubtotal();
        const descuento = this.calcularDescuento(subtotal);
        const envio = this.calcularEnvio(subtotal);
        
        return {
            items: this.carrito,
            cantidad: this.carrito.reduce((sum, item) => sum + item.cantidad, 0),
            subtotal: subtotal,
            descuento: descuento,
            envio: envio,
            total: subtotal - descuento + envio,
            codigoDescuento: this.descuentoAplicado
        };
    }
}

// Agregar estilos CSS para las notificaciones
const estilosNotificacion = document.createElement('style');
estilosNotificacion.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .carrito-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #e0e0e0;
    }
    
    .carrito-header h2 {
        margin: 0;
        color: #333;
        font-family: "Oswald", sans-serif;
    }
    
    .btn-vaciar-carrito {
        background: #dc3545;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-vaciar-carrito:hover {
        background: #c82333;
        transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
        .carrito-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }
        
        .btn-vaciar-carrito {
            width: 100%;
        }
    }
`;
document.head.appendChild(estilosNotificacion);

// Inicializar carrito cuando se carga la página
let carritoManager;

document.addEventListener('DOMContentLoaded', function() {
    carritoManager = new CarritoManager();
});

// Función global para aplicar descuento (llamada desde el HTML)
function aplicarDescuento() {
    const input = document.getElementById('discount-code-input');
    const codigo = input ? input.value.trim() : '';
    
    if (!codigo) {
        carritoManager.mostrarMensajeDescuento('Por favor ingresa un código', 'error');
        return;
    }
    
    carritoManager.aplicarDescuento(codigo);
}

// Función global para agregar productos (puede ser llamada desde otras páginas)
function agregarAlCarrito(producto, cantidad = 1) {
    if (typeof carritoManager !== 'undefined') {
        carritoManager.agregarProducto(producto, cantidad);
        carritoManager.mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
    } else {
        // Si no está en la página del carrito, guardar en localStorage directamente
        const carrito = JSON.parse(localStorage.getItem('carrito-truck-trailer') || '[]');
        const itemExistente = carrito.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        
        localStorage.setItem('carrito-truck-trailer', JSON.stringify(carrito));
        alert(`${producto.nombre} agregado al carrito`);
    }
}

// Función para obtener cantidad de items en carrito (para mostrar en navbar)
function obtenerCantidadCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito-truck-trailer') || '[]');
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}