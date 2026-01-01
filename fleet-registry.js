// fleet-registry.js - VELITELSKÝ MOST (Jediný soubor, který upravuješ)
const FLEET_CONFIG = {
    version: "599.999.250.6", // ← Zvýšil jsem o 1 (nový modul přidán)
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
        './buttonVisibilityFirebase.js', // 🆕 NOVĚ PŘIDÁNO
        './DebugManager.js',
        './script.js',
        './backgroundManager.js',
        './myPlaylist.js',
        './pwa-installer.js',
        './fleet-registry.js',
       // './stream_stabilizer.js',
        // --- FEATURE JS MODULY (POUZE AKTIVNÍ) ---
        './universalni-perfomens-monitor.js',
       // './jirkuv-hlidac.js',
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
// 📡 FLEET STATUS LOGGER
// ═══════════════════════════════════════════════════════════════════════════
console.log(
    `%c🖖 USS PROMETHEUS - Fleet Registry v${FLEET_CONFIG.version}`,
    'color: #00FF00; font-size: 16px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #00FF00;'
);
console.log(
    `%c   Kódové jméno: ${FLEET_CONFIG.codename}`,
    'color: #00CCFF; font-size: 12px;'
);
console.log(
    `%c   Registrované moduly: ${FLEET_CONFIG.modules.length}`,
    'color: #FFCC00; font-size: 12px;'
);
console.log(
    `%c   Status: Všechny systémy zelené! ✅`,
    'color: #00FF00; font-size: 12px; font-weight: bold;'
);
