// Estado de la orden
const orden = {
    elotes: {},
    fruta: {},
    hotcakes: {}
};

// Inicializar la app
document.addEventListener('DOMContentLoaded', () => {
    inicializarBotones();
});

// Inicializar listeners para todos los botones
function inicializarBotones() {
    const botones = document.querySelectorAll('.opcion-btn');
    
    botones.forEach(btn => {
        btn.addEventListener('click', () => manejarSeleccion(btn));
    });
}

// Manejar selección de opciones
function manejarSeleccion(btn) {
    const grupo = btn.parentElement;
    const categoria = grupo.getAttribute('data-categoria');
    const limite = parseInt(grupo.getAttribute('data-limite'));
    const valor = btn.getAttribute('data-valor');
    const barra = btn.closest('[data-barra]').getAttribute('data-barra');
    
    // Inicializar si no existe
    if (!orden[barra][categoria]) {
        orden[barra][categoria] = [];
    }
    
    const selecciones = orden[barra][categoria];
    
    // Toggle: si ya está seleccionado, deseleccionar
    if (selecciones.includes(valor)) {
        selecciones.splice(selecciones.indexOf(valor), 1);
        btn.classList.remove('activo');
    } else {
        // Si no hemos alcanzado el límite, seleccionar
        if (selecciones.length < limite) {
            selecciones.push(valor);
            btn.classList.add('activo');
        } else {
            // Si alcanzamos el límite, mostrar mensaje
            mostrarAlerta(`Máximo ${limite} opción(es) permitida(s) en ${categoria}`);
        }
    }
    
    actualizarContadores(grupo);
    actualizarResumenOrden();
}

// Actualizar contador de selecciones
function actualizarContadores(grupo) {
    const contador = grupo.parentElement.querySelector('.contador-seleccion');
    const botonesActivos = grupo.querySelectorAll('.opcion-btn.activo').length;
    const limite = parseInt(grupo.getAttribute('data-limite'));
    
    if (botonesActivos > 0) {
        if (limite !== 999) {
            contador.textContent = `Seleccionados: ${botonesActivos}/${limite}`;
        } else {
            contador.textContent = `Seleccionados: ${botonesActivos}`;
        }
    } else {
        contador.textContent = '';
    }
}

// Actualizar resumen de orden
function actualizarResumenOrden() {
    const ordenItems = document.getElementById('orden-items');
    const ordenVacia = document.getElementById('orden-vacia');
    const btnCopiar = document.getElementById('copiar-orden');
    
    ordenItems.innerHTML = '';
    let haySelecciones = false;
    
    const barras = {
        elotes: '🌽 Barra de Elotes',
        fruta: '🍉 Barra de Vasos de Fruta',
        hotcakes: '🥞 Barra de Mini Hot Cakes'
    };
    
    // Recorrer cada barra
    for (const [barraKey, barraNombre] of Object.entries(barras)) {
        const categoriasOrden = orden[barraKey];
        const tieneSelecciones = Object.values(categoriasOrden).some(arr => arr.length > 0);
        
        if (tieneSelecciones) {
            haySelecciones = true;
            const barraDiv = document.createElement('div');
            barraDiv.className = 'orden-barra';
            
            let contenido = `<div class="orden-barra-titulo">${barraNombre}</div>`;
            
            // Recorrer categorías de la barra
            for (const [categoria, items] of Object.entries(categoriasOrden)) {
                if (items.length > 0) {
                    contenido += `<div class="orden-categoria">
                        <span class="orden-categoria-nombre">• ${categoria}:</span>
                        <div class="orden-items-lista">${items.join(', ')}</div>
                    </div>`;
                }
            }
            
            barraDiv.innerHTML = contenido;
            ordenItems.appendChild(barraDiv);
        }
    }
    
    // Mostrar/ocultar elementos
    if (haySelecciones) {
        ordenVacia.style.display = 'none';
        btnCopiar.style.display = 'block';
    } else {
        ordenVacia.style.display = 'block';
        btnCopiar.style.display = 'none';
    }
    
    // Listener para copiar (agregarlo cada vez para evitar duplicados)
    btnCopiar.onclick = copiarOrden;
}

// Copiar orden al portapapeles
function copiarOrden() {
    let textoOrden = '📋 MI ORDEN DE SNACKS A&A\n\n';
    
    const barras = {
        elotes: '🌽 BARRA DE ELOTES',
        fruta: '🍉 BARRA DE VASOS DE FRUTA',
        hotcakes: '🥞 BARRA DE MINI HOT CAKES'
    };
    
    let tieneContenido = false;
    
    for (const [barraKey, barraNombre] of Object.entries(barras)) {
        const categoriasOrden = orden[barraKey];
        const tieneSelecciones = Object.values(categoriasOrden).some(arr => arr.length > 0);
        
        if (tieneSelecciones) {
            tieneContenido = true;
            textoOrden += `${barraNombre}\n`;
            
            for (const [categoria, items] of Object.entries(categoriasOrden)) {
                if (items.length > 0) {
                    textoOrden += `  • ${categoria}: ${items.join(', ')}\n`;
                }
            }
            
            textoOrden += '\n';
        }
    }
    
    if (tieneContenido) {
        navigator.clipboard.writeText(textoOrden.trim()).then(() => {
            // Mostrar mensaje de éxito
            const btnCopiar = document.getElementById('copiar-orden');
            const msgCopiado = document.getElementById('mensaje-copiado');
            
            btnCopiar.style.display = 'none';
            msgCopiado.style.display = 'block';
            
            // Volver al botón después de 2 segundos
            setTimeout(() => {
                btnCopiar.style.display = 'block';
                msgCopiado.style.display = 'none';
            }, 2000);
        }).catch(() => {
            alert('Error al copiar. Intenta de nuevo.');
        });
    }
}

// Función para mostrar alertas personalizadas (opcional)
function mostrarAlerta(mensaje) {
    // Crear alerta temporal
    const alerta = document.createElement('div');
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 215, 128, 0.9);
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    alerta.textContent = mensaje;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        alerta.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alerta.remove(), 300);
    }, 2000);
}

// Agregar animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
