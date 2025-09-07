const nombreReceptor = document.getElementById("nombre-receptor");
const telefono = document.getElementById("telefono");
const email = document.getElementById("email");
const direccion = document.getElementById("direccion");
const ciudad = document.getElementById("ciudad");
const codigoPostal = document.getElementById("codigo-postal");
const referencias = document.getElementById("referencias");
const observaciones = document.getElementById("observaciones");
const form = document.getElementById('pedido-form');

// Función simple para mostrar error al lado del campo
function mostrarError(campo, mensaje) {
    // Quitar error anterior si existe
    const errorAnterior = campo.parentNode.querySelector('.error-text');
    if (errorAnterior) {
        errorAnterior.remove();
    }
    
    if (mensaje) {
        // Agregar clase error al campo
        campo.classList.add("error");
        
        // Crear y mostrar mensaje
        const errorDiv = document.createElement('small');
        errorDiv.className = 'error-text';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.9rem;
            display: block;
            margin-top: 5px;
            font-weight: 500;
        `;
        errorDiv.textContent = mensaje;
        campo.parentNode.appendChild(errorDiv);
    } else {
        // Quitar error
        campo.classList.remove("error");
    }
}

// Función para mostrar mensaje de éxito/error general
function mostrarMensajeGeneral(texto, tipo) {
    // Remover mensaje anterior si existe
    const mensajeAnterior = document.getElementById('mensaje-estado');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    // Crear nuevo mensaje
    const mensaje = document.createElement('div');
    mensaje.id = 'mensaje-estado';
    mensaje.style.cssText = `
        margin-top: 15px;
        padding: 15px;
        border-radius: 10px;
        font-family: 'Roboto', sans-serif;
        font-weight: 600;
        text-align: center;
        transition: all 0.3s ease;
    `;
    
    if (tipo === 'error') {
        mensaje.style.cssText += `
            background-color: #fee;
            color: #c33;
            border: 2px solid #fcc;
        `;
        mensaje.textContent = '❌ ' + texto;
    } else {
        mensaje.style.cssText += `
            background-color: #efe;
            color: #393;
            border: 2px solid #cfc;
        `;
        mensaje.textContent = '✅ ' + texto;
    }
    
    // Insertar mensaje después del botón
    const boton = document.querySelector('.btn-pedido');
    boton.parentNode.insertBefore(mensaje, boton.nextSibling);
}

// Validaciones en tiempo real
nombreReceptor.addEventListener('keyup', function () {
    if (nombreReceptor.value.trim() === "") {
        mostrarError(nombreReceptor, "El nombre del receptor es obligatorio");
    } else if (nombreReceptor.value.trim().length < 2) {
        mostrarError(nombreReceptor, "Ingrese un nombre válido");
    } else {
        mostrarError(nombreReceptor, null);
    }
});

telefono.addEventListener('keyup', function () {
    if (telefono.value.trim() === "") {
        mostrarError(telefono, "El teléfono es obligatorio");
    } else if (!validarTelefono(telefono.value)) {
        mostrarError(telefono, "Ingrese un teléfono chileno válido");
    } else {
        mostrarError(telefono, null);
    }
});

email.addEventListener('keyup', function () {
    // Email es opcional, solo validar si tiene contenido
    if (email.value.trim() !== "" && !validarEmail(email.value)) {
        mostrarError(email, "Ingrese un email válido");
    } else {
        mostrarError(email, null);
    }
});

direccion.addEventListener('keyup', function () {
    if (direccion.value.trim() === "") {
        mostrarError(direccion, "La dirección de entrega es obligatoria");
    } else if (direccion.value.trim().length < 5) {
        mostrarError(direccion, "Ingrese una dirección más específica");
    } else {
        mostrarError(direccion, null);
    }
});

ciudad.addEventListener('keyup', function () {
    if (ciudad.value.trim() === "") {
        mostrarError(ciudad, "La ciudad es obligatoria");
    } else {
        mostrarError(ciudad, null);
    }
});

codigoPostal.addEventListener('keyup', function () {
    // Código postal es opcional, solo validar si tiene contenido
    if (codigoPostal.value.trim() !== "" && (codigoPostal.value.length < 7 || !/^\d+$/.test(codigoPostal.value))) {
        mostrarError(codigoPostal, "Ingrese un código postal válido (7 dígitos)");
    } else {
        mostrarError(codigoPostal, null);
    }
});

// Función para validar teléfono chileno
function validarTelefono(telefono) {
    const numeroLimpio = telefono.replace(/\s+/g, '').replace('+56', '');
    return /^[9]\d{8}$/.test(numeroLimpio);
}

// Función para validar email
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Auto-formato para el teléfono chileno
telefono.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    
    if (value.length > 0) {
        // Si empieza con 56 (código de país)
        if (value.startsWith('56')) {
            if (value.length > 2 && value.charAt(2) === '9') {
                value = '+56 9 ' + value.substring(3);
            }
        } 
        // Si empieza con 9 (típico celular chileno)
        else if (value.startsWith('9') && value.length <= 9) {
            value = '+56 ' + value;
        }
        // Si no tiene código de país, agregarlo
        else if (value.length > 0) {
            value = '+56 9 ' + value;
        }
    }
    
    e.target.value = value;
});

// Capitalizar nombres
nombreReceptor.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
});

// Formatear código postal (solo números, máximo 7 dígitos)
codigoPostal.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 7) {
        value = value.substring(0, 7);
    }
    e.target.value = value;
});

// Validación visual en tiempo real para campos requeridos
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

// Validación al enviar el formulario
form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    let hayErrores = false;
    
    // Verificar si hay errores visuales en los campos
    if (document.querySelectorAll('.error').length > 0) {
        hayErrores = true;
    }
    
    // Verificar campos obligatorios vacíos
    if (!nombreReceptor.value.trim() || !telefono.value.trim() || 
        !direccion.value.trim() || !ciudad.value.trim()) {
        hayErrores = true;
    }
    
    if (hayErrores) {
        mostrarMensajeGeneral("Por favor, rellene los campos necesarios (*)", "error");
        return;
    }
    
    // Si no hay errores, procesar pedido
    procesarPedido();
});

// Función para procesar el pedido
function procesarPedido() {
    const button = document.querySelector('.btn-pedido');
    const originalText = button.textContent;
    
    // Cambiar estado del botón a "procesando"
    button.textContent = 'PROCESANDO...';
    button.disabled = true;
    button.style.background = 'linear-gradient(135deg, #999, #777)';
    button.style.cursor = 'not-allowed';
    
    // Simular procesamiento
    setTimeout(() => {
        // Mostrar mensaje de éxito
        mostrarMensajeGeneral('Pedido aceptado', 'exito');
        
        // Restaurar botón
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = 'linear-gradient(135deg, #5a8756, #00bd65)';
        button.style.cursor = 'pointer';
        
        // Limpiar formulario y errores
        form.reset();
        // Mantener Melipilla como ciudad por defecto
        ciudad.value = 'Melipilla';
        
        // Limpiar todos los errores visuales
        document.querySelectorAll('.error-text').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(campo => campo.classList.remove('error'));
        
        // Restaurar estilos de campos
        camposRequeridos.forEach(campo => {
            const elemento = document.getElementById(campo);
            elemento.style.borderColor = '#e0e0e0';
            elemento.style.backgroundColor = '#f9f9f9';
        });
        
    }, 2000);
}