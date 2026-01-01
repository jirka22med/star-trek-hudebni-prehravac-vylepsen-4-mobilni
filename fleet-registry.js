// fleet-registry.js - VELITELSKÝ MOST (Jediný soubor, který upravuješ)
const FLEET_CONFIG = {
    version: "599.999.250.9",
    codename: "Prometheus-Class",
    
    // SEZNAM VŠECH MODULŮ (Tady spravuješ odkazy)
    modules: [
        './index.html',
        './manifest.json',
        
        // --- CSS MODULY (POUZE AKTIVNÍ) ---
        './style.css',
        './miniPlayer.css',
        './casovac.css',
        './browser-status.css',
        './scrollbar.css',
        './christmas.css',
        './zobrazit-panel-hlasitosti.css',
        
        // --- KRITICKÉ JS MODULY (VŽDY AKTIVNÍ) ---
        './audioFirebaseFunctions.js',
        './buttonVisibilityFirebase.js',
        './DebugManager.js',
        './script.js',
        './backgroundManager.js',
        './myPlaylist.js',
        './pwa-installer.js',
        './fleet-registry.js',
        
        // --- FEATURE JS MODULY (POUZE AKTIVNÍ) ---
        './universalni-perfomens-monitor.js',
        './notificationFix.js',
        './autoFade.js',
        './playlistSettings.js',
        './playlistSync.js',
        './pokrocila-sprava-playlistu.js',
        './bluetoothDisconnectMonitor.js',
        './buttonVisibilityManager.js',
        './vyhledavac-skladeb.js',
        './sprava-rozhrani.js',
        './miniPlayer.js',
        './scrollbar.js',
        './colorManager.js',
        './timer-module.js',
        './playlist-height.js',
        
        // --- FIREBASE SDK (absolutní URL) ---
        'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 🖖 EXPORT PRO SERVICE WORKER A MANIFEST
// ═══════════════════════════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FLEET_CONFIG;
}

if (typeof window !== 'undefined') {
    window.FLEET_CONFIG = FLEET_CONFIG;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📡 FLEET STATUS LOGGER (ČEKÁ NA DEBUGMANAGER)
// ═══════════════════════════════════════════════════════════════════════════

function initFleetLogger() {
    // Kontrola, zda DebugManager existuje a je připravený
    if (!window.DebugManager || !window.DebugManager.isReady()) {
        console.log('%c🖖 Fleet Registry: Čekám na DebugManager...', 'color: #FFCC00');
        setTimeout(initFleetLogger, 100); // Zkusíme znovu za 100ms
        return;
    }

    const log = window.DebugManager.log;

    // ✅ LOGOVÁNÍ (SPRÁVNÁ SYNTAXE BEZ %c)
    log('fleet-registry', '🖖 ═══════════════════════════════════════════════════');
    log('fleet-registry', `🚀 USS PROMETHEUS - Fleet Registry v${FLEET_CONFIG.version}`);
    log('fleet-registry', `   Kódové jméno: ${FLEET_CONFIG.codename}`);
    log('fleet-registry', `   Registrované moduly: ${FLEET_CONFIG.modules.length}`);
    log('fleet-registry', '   Status: Všechny systémy zelené! ✅');
    log('fleet-registry', '═══════════════════════════════════════════════════');
}

// Spustíme logger až po načtení stránky
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFleetLogger);
} else {
    initFleetLogger();
}
