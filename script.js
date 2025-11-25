/**
 * NUBE CATATUMBO - JavaScript
 * Biblioteca virtual offline para la región del Catatumbo
 */

// Variable global para almacenar el recurso actual
let currentResource = '';

/**
 * Navegar entre pantallas
 * @param {string} screenId - ID de la pantalla destino
 */
function navigateTo(screenId) {
    // Ocultar todas las pantallas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.scrollTop = 0; // Scroll al inicio
    }
}

/**
 * Iniciar descarga de un recurso
 * @param {string} title - Título del recurso
 * @param {string} size - Tamaño del archivo
 */
function startDownload(title, size) {
    currentResource = title;
    
    // Actualizar información en la pantalla de descarga
    document.getElementById('downloadTitle').textContent = title;
    document.getElementById('downloadSize').textContent = size;
    
    // Cambiar a pantalla de descarga
    navigateTo('downloading');
    
    // Simular progreso de descarga
    simulateDownload();
}

/**
 * Simular progreso de descarga
 */
function simulateDownload() {
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    const downloadInterval = setInterval(() => {
        progress += 10;
        
        // Actualizar barra de progreso
        progressFill.style.width = progress + '%';
        progressPercent.textContent = progress;
        
        // Cuando llega al 100%
        if (progress >= 100) {
            clearInterval(downloadInterval);
            
            // Esperar un momento antes de volver
            setTimeout(() => {
                // Resetear progreso
                progressFill.style.width = '0%';
                progressPercent.textContent = '0';
                
                // Volver a la biblioteca
                navigateTo('library');
                
                // Opcional: mostrar mensaje de éxito
                showSuccessMessage();
            }, 800);
        }
    }, 300); // Incrementar cada 300ms
}

/**
 * Ver un recurso descargado
 * @param {string} title - Título del recurso
 */
function viewResource(title) {
    // Actualizar título en el visor
    document.getElementById('viewerTitle').textContent = title;
    
    // Cambiar a pantalla de visualización
    navigateTo('viewer');
}

/**
 * Mostrar mensaje de éxito (opcional)
 */
function showSuccessMessage() {
    // Esta función puede expandirse para mostrar notificaciones
    console.log('✓ Descarga completada: ' + currentResource);
}

/**
 * Habilitar scroll suave en todos los contenidos
 */
function enableSmoothScroll() {
    const contents = document.querySelectorAll('.content, .viewer-content, .download-content');
    contents.forEach(content => {
        content.style.scrollBehavior = 'smooth';
    });
}

/**
 * Detectar conexión offline/online
 */
function checkConnectionStatus() {
    const statusIcon = document.querySelector('.status-icon');
    
    if (!navigator.onLine) {
        // Modo offline
        if (statusIcon) {
            statusIcon.innerHTML = `
                <svg class="icon" viewBox="0 0 24 24" style="color: var(--naranja-atardecer);">
                    <line x1="1" y1="1" x2="23" y2="23"/>
                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
                    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                    <circle cx="12" cy="20" r="1" fill="currentColor"/>
                </svg>
            `;
        }
    }
}

/**
 * Funciones para compartir por Bluetooth (simulación)
 */
function shareViaBluetooth(resourceTitle) {
    // Aquí iría la integración real con la API de Web Bluetooth
    console.log('Compartiendo: ' + resourceTitle);
    
    // Simulación de búsqueda de dispositivos
    setTimeout(() => {
        alert('Dispositivos cercanos encontrados. En la versión final, aquí aparecerá la lista de dispositivos disponibles.');
    }, 1000);
}

/**
 * Configurar botones de envío por Bluetooth
 */
function setupBluetoothButtons() {
    const sendButtons = document.querySelectorAll('.send-btn');
    sendButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const resourceCard = button.closest('.resource-card');
            const resourceTitle = resourceCard.querySelector('.resource-title').textContent;
            shareViaBluetooth(resourceTitle);
        });
    });
}

/**
 * Guardar progreso en almacenamiento local
 * (Para cuando la app funcione offline)
 */
function saveProgress(resourceId, progress) {
    if (typeof(Storage) !== "undefined") {
        const progressData = {
            resource: resourceId,
            progress: progress,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('catatumbo_' + resourceId, JSON.stringify(progressData));
    }
}

/**
 * Cargar progreso guardado
 */
function loadProgress(resourceId) {
    if (typeof(Storage) !== "undefined") {
        const saved = localStorage.getItem('catatumbo_' + resourceId);
        if (saved) {
            return JSON.parse(saved);
        }
    }
    return null;
}

/**
 * Manejar gestos táctiles para navegación
 */
function setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const phoneContainer = document.querySelector('.phone-container');
    
    if (phoneContainer) {
        phoneContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        phoneContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 100;
        const diff = touchStartX - touchEndX;
        
        // Swipe izquierda (siguiente) o derecha (atrás)
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe izquierda
                console.log('Swipe izquierda detectado');
            } else {
                // Swipe derecha - volver atrás
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen && activeScreen.id !== 'home') {
                    const backBtn = activeScreen.querySelector('.back-btn');
                    if (backBtn) {
                        backBtn.click();
                    }
                }
            }
        }
    }
}

/**
 * Optimizar rendimiento en dispositivos de baja potencia
 */
function optimizeForLowEndDevices() {
    // Detectar dispositivos de baja potencia
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 2;
    
    if (isMobile && cores <= 4) {
        // Reducir animaciones
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        
        // Desactivar efectos de hover en móviles
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .category-card:hover,
                .resource-card:hover,
                .action-btn:hover,
                .resource-btn:hover {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Inicializar accesibilidad
 */
function initAccessibility() {
    // Añadir atributos ARIA
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        
        // Permitir activación con Enter o Espacio
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Mejorar navegación por teclado
    const focusableElements = document.querySelectorAll('button, [role="button"]');
    focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
            el.style.outline = '3px solid var(--cielo-azul)';
        });
        el.addEventListener('blur', () => {
            el.style.outline = '';
        });
    });
}

/**
 * Configurar todos los event listeners
 */
function setupEventListeners() {
    // Botones de categorías - van a biblioteca
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => navigateTo('library'));
    });
    
    // Botones de acción principales
    const libraryBtn = document.querySelector('.action-btn:not(.share)');
    if (libraryBtn) {
        libraryBtn.addEventListener('click', () => navigateTo('library'));
    }
    
    const shareBtn = document.querySelector('.action-btn.share');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => navigateTo('share'));
    }
    
    // Botones de volver atrás
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const parentScreen = btn.closest('.screen');
            if (parentScreen) {
                if (parentScreen.id === 'library' || parentScreen.id === 'share') {
                    navigateTo('home');
                } else if (parentScreen.id === 'viewer') {
                    navigateTo('library');
                }
            }
        });
    });
    
    // Botones de reproducir recursos
    const playButtons = document.querySelectorAll('.resource-btn.play');
    playButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const resourceCard = btn.closest('.resource-card');
            const title = resourceCard.querySelector('.resource-title').textContent;
            viewResource(title);
        });
    });
    
    // Botones de descargar recursos
    const downloadButtons = document.querySelectorAll('.resource-btn.download');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const resourceCard = btn.closest('.resource-card');
            const title = resourceCard.querySelector('.resource-title').textContent;
            const size = resourceCard.querySelector('.resource-size').textContent.split(' · ')[0];
            startDownload(title, size);
        });
    });
}

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌩️ Nube Catatumbo inicializada');
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar funcionalidades
    enableSmoothScroll();
    checkConnectionStatus();
    setupBluetoothButtons();
    setupTouchGestures();
    optimizeForLowEndDevices();
    initAccessibility();
    
    // Escuchar cambios en el estado de conexión
    window.addEventListener('online', checkConnectionStatus);
    window.addEventListener('offline', checkConnectionStatus);
    
    // Prevenir zoom accidental en iOS
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    
    // Log para debug (remover en producción)
    console.log('📱 Dispositivo:', navigator.userAgent);
    console.log('🌐 Estado conexión:', navigator.onLine ? 'Online' : 'Offline');
    console.log('💾 LocalStorage disponible:', typeof(Storage) !== "undefined");
});

/**
 * Manejar errores globales
 */
window.addEventListener('error', (e) => {
    console.error('Error capturado:', e.message);
    // Aquí se puede implementar un sistema de reportes de errores
});

/**
 * Service Worker para funcionalidad offline (para implementación futura)
 */
if ('serviceWorker' in navigator) {
    // Descomentar cuando se tenga el service worker
    /*
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✓ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('✗ Error al registrar Service Worker:', error);
            });
    });
    */
}

// Exportar funciones para uso global
window.NubeCatatumbo = {
    navigateTo,
    startDownload,
    viewResource,
    shareViaBluetooth,
    saveProgress,
    loadProgress
};