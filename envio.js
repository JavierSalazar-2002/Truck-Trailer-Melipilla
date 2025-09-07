const numeroPedido = document.getElementById("numero-pedido");
const emailTracking = document.getElementById("email-tracking");
const form = document.querySelector('.search-form');

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
        errorDiv.textContent = mensaje;
        campo.parentNode.appendChild(errorDiv);
    } else {
        // Quitar error
        campo.classList.remove("error");
    }
}

// Validación para número de pedido
numeroPedido.addEventListener('keyup', function () {
    const patron = /^TT-\d{4}-\d{6}$/;
    
    if (numeroPedido.value.trim() === "") {
        mostrarError(numeroPedido, "El número de pedido es obligatorio");
    } else if (!patron.test(numeroPedido.value.trim())) {
        mostrarError(numeroPedido, "Formato inválido. Use: TT-YYYY-NNNNNN");
    } else {
        mostrarError(numeroPedido, null);
    }
});

// Validación para email
emailTracking.addEventListener('keyup', function () {
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailTracking.value.trim() === "") {
        mostrarError(emailTracking, "El email es obligatorio");
    } else if (!patronEmail.test(emailTracking.value.trim())) {
        mostrarError(emailTracking, "Formato de email inválido");
    } else {
        mostrarError(emailTracking, null);
    }
});

// Función para buscar pedido
function buscarPedido() {
    let hayErrores = false;
    
    // Verificar si hay campos con errores
    if (document.querySelectorAll('.error').length > 0) {
        hayErrores = true;
    }
    
    // Verificar campos vacíos
    if (numeroPedido.value.trim() === "" || emailTracking.value.trim() === "") {
        hayErrores = true;
        
        if (numeroPedido.value.trim() === "") {
            mostrarError(numeroPedido, "El número de pedido es obligatorio");
        }
        if (emailTracking.value.trim() === "") {
            mostrarError(emailTracking, "El email es obligatorio");
        }
    }
    
    if (hayErrores) {
        alert("Por favor corrige los errores antes de buscar el pedido");
        return;
    }
    
    // Si no hay errores, mostrar resultados
    const trackingResults = document.getElementById('tracking-results');
    trackingResults.style.display = 'block';
    
    // Scroll suave hacia los resultados
    trackingResults.scrollIntoView({ behavior: 'smooth' });
    
    alert("Pedido encontrado. Mostrando información de seguimiento...");
}