// Función principal para manejar el envío del formulario
document.getElementById('pedido-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const nombreReceptor = document.getElementById('nombre-receptor').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const codigoPostal = document.getElementById('codigo-postal').value.trim();
    const referencias = document.getElementById('referencias').value.trim();
    const observaciones = document.getElementById('observaciones').value.trim();
    
    // Validación básica
    if (!nombreReceptor || !telefono || !direccion || !ciudad) {
        mostrarError('Por favor, complete todos los campos obligatorios (*)');
        return;
    }
    
    // Validación del teléfono
    if (!validarTelefono(telefono)) {
        mostrarError('Por favor, ingrese un número de teléfono válido');
        return;
    }
    
    // Validación del email (si se proporciona)
    if (email && !validarEmail(email)) {
        mostrarError('Por favor, ingrese un email válido');
        return;
    }
    
    // Procesar el pedido
    procesarPedido({
        nombreReceptor,
        telefono,
        email,
        direccion,
        ciudad,
        codigoPostal,
        referencias,
        observaciones
    });
});

// Función para validar teléfono chileno
function validarTelefono(telefono) {
    // Acepta formatos: +56912345678, +56 9 12345678, 912345678
    const regex = /^(\+56\s?)?[9]\d{8}$/;
    const numeroLimpio = telefono.replace(/\s+/g, '').replace('+56', '');
    return regex.test('+56' + numeroLimpio) || /^[9]\d{8}$/.test(numeroLimpio);
}

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para mostrar errores
function mostrarError(mensaje) {
    alert('❌ Error: ' + mensaje);
}

// Función para procesar el pedido
function procesarPedido(datos) {
    const button = document.querySelector('.btn-pedido');
    const originalText = button.textContent;
    
    // Cambiar estado del botón a "procesando"
    button.textContent = 'PROCESANDO...';
    button.disabled = true;
    button.style.background = 'linear-gradient(135deg, #999, #777)';
    button.style.cursor = 'not-allowed';
    
    // Simular procesamiento (en una aplicación real, aquí iría la llamada al servidor)
    setTimeout(() => {
        // Mostrar confirmación
        const mensajeConfirmacion = `
✅ ¡PEDIDO CONFIRMADO!

📋 DETALLES DEL PEDIDO:
👤 Receptor: ${datos.nombreReceptor}
📍 Dirección: ${datos.direccion}, ${datos.ciudad}
📱 Teléfono: ${datos.telefono}
${datos.email ? '📧 Email: ' + datos.email : ''}
${datos.codigoPostal ? '📮 Código Postal: ' + datos.codigoPostal : ''}

${datos.referencias ? '🗺️ Referencias: ' + datos.referencias : ''}
${datos.observaciones ? '📝 Observaciones: ' + datos.observaciones : ''}

🚚 Nos contactaremos pronto para confirmar la entrega.
⏰ Tiempo estimado: 24-48 horas hábiles.
        `.trim();
        
        alert(mensajeConfirmacion);
        
        // Restaurar botón
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = 'linear-gradient(135deg, #5a8756, #00bd65)';
        button.style.cursor = 'pointer';
        
        // Limpiar formulario
        limpiarFormulario();
        
        // Mostrar mensaje de éxito adicional
        mostrarMensajeExito();
        
    }, 2000);
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('pedido-form').reset();
    // Mantener Melipilla como ciudad por defecto
    document.getElementById('ciudad').value = 'Melipilla';
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito() {
    // Crear elemento de éxito temporal
    const exitoDiv = document.createElement('div');
    exitoDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #5a8756, #00bd65);
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            font-family: 'Oswald', sans-serif;
            font-weight: bold;
            max-width: 300px;
        ">
            ✅ Pedido enviado exitosamente
        </div>
    `;
    
    document.body.appendChild(exitoDiv);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        exitoDiv.remove();
    }, 3000);
}

// Auto-formato para el teléfono chileno
document.getElementById('telefono').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    
    if (value.length > 0) {
        // Si ya tiene el código de país
        if (value.startsWith('56')) {
            if (value.length > 2 && value.charAt(2) === '9') {
                // Formato: +56 9 XXXXXXXX
                value = '+56 9 ' + value.substring(3);
            } else if (value.length > 2) {
                value = '+56 ' + value.substring(2);
            } else {
                value = '+' + value;
            }
        } 
        // Si empieza con 9 (típico celular chileno)
        else if (value.startsWith('9') && value.length <= 9) {
            value = '+56 ' + value;
        }
        // Si no tiene código de país, agregarlo
        else if (!value.startsWith('56')) {
            if (value.length > 0) {
                value = '+56 9 ' + value;
            }
        }
    }
    
    e.target.value = value;
});

// Función para capitalizar nombres
document.getElementById('nombre-receptor').addEventListener('input', function(e) {
    e.target.value = capitalizarNombre(e.target.value);
});

function capitalizarNombre(nombre) {
    return nombre.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Validación en tiempo real para campos requeridos
const camposRequeridos = ['nombre-receptor', 'telefono', 'direccion', 'ciudad'];

camposRequeridos.forEach(campo => {
    const elemento = document.getElementById(campo);
    
    elemento.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#e74c3c';
            this.style.backgroundColor = '#ffeaea';
        } else {
            this.style.borderColor = '#5a8756';
            this.style.backgroundColor = '#f0f8f0';
        }
    });
    
    elemento.addEventListener('focus', function() {
        this.style.borderColor = '#5a8756';
        this.style.backgroundColor = 'white';
    });
});

// Función para formatear código postal
document.getElementById('codigo-postal').addEventListener('input', function(e) {
    // Solo números, máximo 7 dígitos para códigos postales chilenos
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 7) {
        value = value.substring(0, 7);
    }
    e.target.value = value;
});

// Función para contar caracteres en textarea
function agregarContadorCaracteres(textareaId, limite = 500) {
    const textarea = document.getElementById(textareaId);
    const contador = document.createElement('div');
    contador.style.cssText = `
        text-align: right;
        font-size: 0.9rem;
        color: #666;
        margin-top: 5px;
        font-family: 'Roboto', sans-serif;
    `;
    
    function actualizarContador() {
        const longitud = textarea.value.length;
        contador.textContent = `${longitud}/${limite} caracteres`;
        
        if (longitud > limite * 0.9) {
            contador.style.color = '#e74c3c';
        } else if (longitud > limite * 0.7) {
            contador.style.color = '#f39c12';
        } else {
            contador.style.color = '#666';
        }
        
        // Limitar caracteres
        if (longitud > limite) {
            textarea.value = textarea.value.substring(0, limite);
            actualizarContador();
        }
    }
    
    textarea.parentNode.insertBefore(contador, textarea.nextSibling);
    textarea.addEventListener('input', actualizarContador);
    actualizarContador(); // Inicializar contador
}

// Agregar contadores a los textareas
document.addEventListener('DOMContentLoaded', function() {
    agregarContadorCaracteres('referencias', 300);
    agregarContadorCaracteres('observaciones', 500);
});

// Función para guardar borrador en localStorage (opcional)
function guardarBorrador() {
    const formData = {
        nombreReceptor: document.getElementById('nombre-receptor').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        ciudad: document.getElementById('ciudad').value,
        codigoPostal: document.getElementById('codigo-postal').value,
        referencias: document.getElementById('referencias').value,
        observaciones: document.getElementById('observaciones').value,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('pedido_borrador', JSON.stringify(formData));
}

// Función para cargar borrador
function cargarBorrador() {
    const borrador = localStorage.getItem('pedido_borrador');
    if (borrador) {
        try {
            const data = JSON.parse(borrador);
            // Solo cargar si el borrador es reciente (menos de 24 horas)
            const tiempoBorrador = new Date(data.timestamp);
            const ahora = new Date();
            const diferenciaHoras = (ahora - tiempoBorrador) / (1000 * 60 * 60);
            
            if (diferenciaHoras < 24) {
                if (confirm('Se encontró un borrador guardado. ¿Desea cargarlo?')) {
                    document.getElementById('nombre-receptor').value = data.nombreReceptor || '';
                    document.getElementById('telefono').value = data.telefono || '';
                    document.getElementById('email').value = data.email || '';
                    document.getElementById('direccion').value = data.direccion || '';
                    document.getElementById('ciudad').value = data.ciudad || 'Melipilla';
                    document.getElementById('codigo-postal').value = data.codigoPostal || '';
                    document.getElementById('referencias').value = data.referencias || '';
                    document.getElementById('observaciones').value = data.observaciones || '';
                }
            } else {
                // Borrar borrador antiguo
                localStorage.removeItem('pedido_borrador');
            }
        } catch (error) {
            console.error('Error al cargar borrador:', error);
            localStorage.removeItem('pedido_borrador');
        }
    }
}

// Guardar borrador cada 30 segundos si hay cambios
let formularioModificado = false;
document.getElementById('pedido-form').addEventListener('input', function() {
    formularioModificado = true;
});

setInterval(function() {
    if (formularioModificado) {
        guardarBorrador();
        formularioModificado = false;
    }
}, 30000);

// Cargar borrador al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarBorrador();
});

// Limpiar borrador cuando el pedido se envía exitosamente
function limpiarBorrador() {
    localStorage.removeItem('pedido_borrador');
}

// Modificar la función procesarPedido para limpiar borrador
const procesarPedidoOriginal = procesarPedido;
procesarPedido = function(datos) {
    const button = document.querySelector('.btn-pedido');
    const originalText = button.textContent;
    
    // Cambiar estado del botón a "procesando"
    button.textContent = 'PROCESANDO...';
    button.disabled = true;
    button.style.background = 'linear-gradient(135deg, #999, #777)';
    button.style.cursor = 'not-allowed';
    
    // Simular procesamiento
    setTimeout(() => {
        // Mostrar confirmación
        const mensajeConfirmacion = `
✅ ¡PEDIDO CONFIRMADO!

📋 DETALLES DEL PEDIDO:
👤 Receptor: ${datos.nombreReceptor}
📍 Dirección: ${datos.direccion}, ${datos.ciudad}
📱 Teléfono: ${datos.telefono}
${datos.email ? '📧 Email: ' + datos.email : ''}
${datos.codigoPostal ? '📮 Código Postal: ' + datos.codigoPostal : ''}

${datos.referencias ? '🗺️ Referencias: ' + datos.referencias : ''}
${datos.observaciones ? '📝 Observaciones: ' + datos.observaciones : ''}

🚚 Nos contactaremos pronto para confirmar la entrega.
⏰ Tiempo estimado: 24-48 horas hábiles.
        `.trim();
        
        alert(mensajeConfirmacion);
        
        // Restaurar botón
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = 'linear-gradient(135deg, #5a8756, #00bd65)';
        button.style.cursor = 'pointer';
        
        // Limpiar formulario y borrador
        limpiarFormulario();
        limpiarBorrador();
        
        // Mostrar mensaje de éxito adicional
        mostrarMensajeExito();
        
    }, 2000);
};

// Prevenir pérdida de datos al salir de la página
window.addEventListener('beforeunload', function(e) {
    const formData = new FormData(document.getElementById('pedido-form'));
    let tieneContenido = false;
    
    for (let [key, value] of formData.entries()) {
        if (value.trim() !== '' && key !== 'ciudad') { // Ciudad siempre tiene "Melipilla"
            tieneContenido = true;
            break;
        }
    }
    
    if (tieneContenido) {
        guardarBorrador();
        const mensaje = 'Hay cambios sin guardar. ¿Está seguro de que desea salir?';
        e.returnValue = mensaje;
        return mensaje;
    }
});