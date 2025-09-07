document.addEventListener('DOMContentLoaded', function() {
    // Selectores
    const botonesCantidad = document.querySelectorAll('.btn-cantidad');
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    const checkoutButton = document.querySelector('.checkout-button');
    
    // Elementos del resumen
    const subtotalElement = document.getElementById('subtotal');
    const envioElement = document.getElementById('envio');
    const totalElement = document.getElementById('total');
    const descuentoElement = document.getElementById('descuento');
    const descuentoLinea = document.getElementById('descuento-linea');
    
    // Elementos del código de descuento
    const codigoInput = document.getElementById('codigo-input');
    const aplicarCodigoBtn = document.getElementById('aplicar-codigo');
    const mensajeCodigo = document.getElementById('mensaje-codigo');
    
    // Variables de estado
    const PRECIO_ENVIO = 5990;
    
    // Códigos de descuento disponibles
    const CODIGOS_DESCUENTO = {
        'FIEL40': { descuento: 15, descripcion: 'Descuento del 15%' },
        'TTM10EMPRE': { descuento: 40, descripcion: 'Descuento de empresa SOPROCAL 40%' }
    };
    
    let codigoAplicado = false;
    let codigoActual = null;
    let porcentajeDescuento = 0;
    let montoDescuento = 0;
    
    // Función para formatear números en formato CLP
    function formatearPrecio(precio) {
        return '$' + precio.toLocaleString('es-CL');
    }
    
    // Función para calcular y actualizar los totales
    function actualizarResumen() {
        let subtotal = 0;
        
        // Calcular subtotal sumando todos los productos
        document.querySelectorAll('.carrito-item').forEach(item => {
            const precio = parseInt(item.getAttribute('data-precio'));
            const cantidad = parseInt(item.querySelector('.cantidad-numero').textContent);
            subtotal += precio * cantidad;
            
            // Actualizar el precio del item si es necesario
            const precioElement = item.querySelector('.item-precio');
            precioElement.textContent = formatearPrecio(precio * cantidad);
        });
        
        // Calcular envío (gratis para compras superiores a $100.000)
        let envio = PRECIO_ENVIO;
        if (subtotal >= 100000) {
            envio = 0;
        }
        
        // Calcular descuento si hay código aplicado
        if (codigoAplicado && codigoActual) {
            montoDescuento = Math.round((subtotal + envio) * (porcentajeDescuento / 100));
        } else {
            montoDescuento = 0;
        }
        
        // Calcular total
        const total = subtotal + envio - montoDescuento;
        
        // Actualizar el DOM
        subtotalElement.textContent = formatearPrecio(subtotal);
        envioElement.textContent = envio === 0 ? 'GRATIS' : formatearPrecio(envio);
        totalElement.textContent = formatearPrecio(total);
        
        // Mostrar/ocultar línea de descuento
        if (codigoAplicado && montoDescuento > 0) {
            descuentoElement.textContent = '-' + formatearPrecio(montoDescuento);
            descuentoLinea.style.display = 'flex';
        } else {
            descuentoLinea.style.display = 'none';
        }
        
        // Cambiar color del envío si es gratis
        if (envio === 0) {
            envioElement.style.color = '#4caf50';
            envioElement.style.fontWeight = 'bold';
        } else {
            envioElement.style.color = '';
            envioElement.style.fontWeight = '';
        }
    }
    
    // Función para aplicar código de descuento
    function aplicarCodigoDescuento() {
        const codigo = codigoInput.value.trim().toUpperCase();
        
        if (codigo === '') {
            mostrarMensajeCodigo('Por favor ingresa un código', 'error');
            return;
        }
        
        if (CODIGOS_DESCUENTO[codigo]) {
            if (codigoAplicado) {
                mostrarMensajeCodigo('¡El código ya está aplicado!', 'info');
            } else {
                codigoAplicado = true;
                codigoActual = codigo;
                porcentajeDescuento = CODIGOS_DESCUENTO[codigo].descuento;
                
                aplicarCodigoBtn.textContent = 'Aplicado ✓';
                aplicarCodigoBtn.style.backgroundColor = '#4caf50';
                aplicarCodigoBtn.disabled = true;
                codigoInput.disabled = true;
                codigoInput.style.backgroundColor = '#f0f0f0';
                
                mostrarMensajeCodigo(
                    `¡Código aplicado! ${CODIGOS_DESCUENTO[codigo].descripcion}`, 
                    'exito'
                );
                actualizarResumen();
            }
        } else {
            mostrarMensajeCodigo('Código inválido. Intenta con otro código.', 'error');
        }
    }
    
    // Función para mostrar mensajes del código
    function mostrarMensajeCodigo(mensaje, tipo) {
        mensajeCodigo.textContent = mensaje;
        mensajeCodigo.className = 'mensaje-codigo ' + tipo;
        mensajeCodigo.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos si es de éxito
        if (tipo === 'exito') {
            setTimeout(() => {
                mensajeCodigo.style.display = 'none';
            }, 5000);
        }
    }
    
    // Función para quitar código de descuento
    function quitarCodigoDescuento() {
        codigoAplicado = false;
        codigoActual = null;
        porcentajeDescuento = 0;
        montoDescuento = 0;
        aplicarCodigoBtn.textContent = 'Aplicar';
        aplicarCodigoBtn.style.backgroundColor = '#5a8756';
        aplicarCodigoBtn.disabled = false;
        codigoInput.disabled = false;
        codigoInput.style.backgroundColor = '';
        codigoInput.value = '';
        mensajeCodigo.style.display = 'none';
        actualizarResumen();
    }
    
    // Event Listeners
    
    // Funcionalidad de botones de cantidad
    botonesCantidad.forEach(boton => {
        boton.addEventListener('click', function() {
            const operacion = this.textContent;
            const cantidadElement = this.parentElement.querySelector('.cantidad-numero');
            let cantidad = parseInt(cantidadElement.textContent);
            
            if (operacion === '+') {
                cantidad++;
            } else if (operacion === '-' && cantidad > 1) {
                cantidad--;
            }
            
            cantidadElement.textContent = cantidad;
            actualizarResumen();
        });
    });
    
    // Funcionalidad de botones de eliminar
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', function() {
            const item = this.closest('.carrito-item');
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.remove();
                actualizarResumen();
                
                // Si no quedan items, mostrar carrito vacío
                if (document.querySelectorAll('.carrito-item').length === 0) {
                    mostrarCarritoVacio();
                }
            }, 300);
        });
    });
    
    // Funcionalidad del código de descuento
    aplicarCodigoBtn.addEventListener('click', aplicarCodigoDescuento);
    
    codigoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            aplicarCodigoDescuento();
        }
    });
    
    // Permitir quitar código haciendo doble clic en el botón cuando está aplicado
    aplicarCodigoBtn.addEventListener('dblclick', function() {
        if (codigoAplicado) {
            quitarCodigoDescuento();
        }
    });
    
    // Funcionalidad del botón de pago
    checkoutButton.addEventListener('click', function() {
        const totalFinal = totalElement.textContent;
        let mensaje = `¡Gracias por su compra! Total a pagar: ${totalFinal}`;
        
        if (codigoAplicado) {
            mensaje += `\n¡Felicidades! Has ahorrado ${formatearPrecio(montoDescuento)} con el código de descuento.`;
        }
        
        alert(mensaje + '\nSerá redirigido a la página de pago.');
    });
    
    // Función para mostrar carrito vacío
    function mostrarCarritoVacio() {
        const carritoItems = document.querySelector('.carrito-items');
        carritoItems.innerHTML = `
            <div class="carrito-vacio">
                <div class="carrito-vacio-icon">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p>¡Explora nuestro catálogo y encuentra las mejores refacciones para tu vehículo!</p>
                <p><a href="catalogo.html">Ver Catálogo</a></p>
            </div>
        `;
        
        document.querySelector('.resumen-pedido').style.display = 'none';
    }
    
    // Inicializar los totales
    actualizarResumen();
});