const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const empresa = document.getElementById("empresa");
const codigo = document.getElementById("codigo");
const clave1 = document.getElementById("password");
const clave2 = document.getElementById("confirmPassword");
const edad = document.getElementById("edad");
const form = document.getElementById('registroForm');

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

// Validaciones básicas
nombre.addEventListener('keyup', function () {
    if (nombre.value.trim() === "") {
        mostrarError(nombre, "El nombre es obligatorio");
    } else {
        mostrarError(nombre, null);
    }
});

apellido.addEventListener('keyup', function () {
    if (apellido.value.trim() === "") {
        mostrarError(apellido, "El apellido es obligatorio");
    } else {
        mostrarError(apellido, null);
    }
});

email.addEventListener('keyup', function () {
    if (email.value.trim() === "") {
        mostrarError(email, "El email es obligatorio");
    } else if (!email.value.includes("@")) {
        mostrarError(email, "Debe contener @");
    } else {
        mostrarError(email, null);
    }
});

telefono.addEventListener('keyup', function () {
    if (telefono.value.length === 0) {
        mostrarError(telefono, "El teléfono es obligatorio");
    } else if (telefono.value.length < 9) {
        mostrarError(telefono, "Ingrese un teléfono válido con más de 9 digitos");
    }
    else {
        mostrarError(telefono, null);
    }
});

clave1.addEventListener('keyup', function () {
    if (clave1.value === "") {
        mostrarError(clave1, "La contraseña es obligatoria");
    } else if (clave1.value.length < 8) {
        mostrarError(clave1, "Mínimo 8 caracteres");
    } else {
        mostrarError(clave1, null);
    }
    
    // Verificar confirmación si tiene contenido
    if (clave2.value !== "") {
        if (clave1.value !== clave2.value) {
            mostrarError(clave2, "Las contraseñas no coinciden");
        } else {
            mostrarError(clave2, null);
        }
    }
});

clave2.addEventListener('keyup', function () {
    if (clave2.value === "") {
        mostrarError(clave2, "Confirma tu contraseña");
    } else if (clave1.value !== clave2.value) {
        mostrarError(clave2, "Las contraseñas no coinciden");
    } else {
        mostrarError(clave2, null);
    }
});

edad.addEventListener('keyup', function () {
    if (edad.value === "") {
        mostrarError(edad, "La edad es obligatoria");
    } else if (edad.value < 18) {
        mostrarError(edad, "Edad mínima: 18 años");
    } else {
        mostrarError(edad, null);
    }
});

empresa.addEventListener('keyup', function () {
    // Solo validar si ya hay un código TTM10EMPRE ingresado
    if (codigo.value === "TTM10EMPRE") {
        if (empresa.value === "SOPROCAL") {
            // Empresa correcta, limpiar errores
            mostrarError(empresa, null);
            mostrarError(codigo, null);
        } else {
            // Código TTM10EMPRE requiere empresa SOPROCAL
            mostrarError(empresa, "Debe ingresar el nombre de su empresa para usar este código");
        }
    } else {
        // Si no hay código TTM10EMPRE, no mostrar error en empresa
        mostrarError(empresa, null);
    }
});

codigo.addEventListener('keyup', function () {
    if (codigo.value.trim() === "") {
        mostrarError(codigo, null);
        mostrarError(empresa, null); // Limpiar también el error de empresa
    } 
    else if (codigo.value === "FIEL40") {
        mostrarError(codigo, null);
        mostrarError(empresa, null); // Limpiar error de empresa para otros códigos válidos
    } 
    else if (codigo.value === "TTM10EMPRE") {
        if (empresa.value === "SOPROCAL") {
            mostrarError(codigo, null);
            mostrarError(empresa, null);
        } else {
            mostrarError(codigo, "Debe ingresar el nombre de su empresa para usar este código");
        }
    } 
    else {
        mostrarError(codigo, "Código inválido");
        mostrarError(empresa, null); // Limpiar error de empresa para códigos inválidos
    }
});

// Validación al enviar
form.addEventListener('submit', function (e) {
    let hayErrores = false;
    
    // Verificar cada campo
    if (document.querySelectorAll('.error').length > 0) {
        hayErrores = true;
    }
    
    if (hayErrores) {
        e.preventDefault();
        alert("Por favor corrige los errores antes de continuar");
    }
});