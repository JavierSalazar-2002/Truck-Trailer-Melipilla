 document.addEventListener('DOMContentLoaded', function() {
            // Selectores
            const botonesCantidad = document.querySelectorAll('.btn-cantidad');
            const botonesEliminar = document.querySelectorAll('.btn-eliminar');
            const checkoutButton = document.querySelector('.checkout-button');
            
            // Elementos del resumen
            const subtotalElement = document.getElementById('subtotal');
            const envioElement = document.getElementById('envio');
            const totalElement = document.getElementById('total');
            
            // Precio de envío fijo
            const PRECIO_ENVIO = 5990;
            
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
                
                // Calcular total
                const total = subtotal + envio;
                
                // Actualizar el DOM
                subtotalElement.textContent = formatearPrecio(subtotal);
                envioElement.textContent = envio === 0 ? 'GRATIS' : formatearPrecio(envio);
                totalElement.textContent = formatearPrecio(total);
                
                // Cambiar color del envío si es gratis
                if (envio === 0) {
                    envioElement.style.color = '#4caf50';
                    envioElement.style.fontWeight = 'bold';
                } else {
                    envioElement.style.color = '';
                    envioElement.style.fontWeight = '';
                }
            }
            
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
            
            // Funcionalidad del botón de pago
            checkoutButton.addEventListener('click', function() {
                alert('¡Gracias por su compra! Será redirigido a la página de pago.');
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