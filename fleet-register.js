
// fleet-registry.js - VELITELSKÝ MOST (Jediný soubor, který upravuješ)
const FLEET_CONFIG = {
    version: "0.0.0.0.0.14", // ← Zvýšil jsem o 1 (nový modul přidán)
    codename: "Prometheus-Class",
    
    // SEZNAM VŠECH MODULŮ (Tady spravuješ odkazy)
    modules: [
        //HLAVNÍ KOSTRA STAR TREK HUDEBNÍHO PŘEHRAVAČE
        './index.html',
        // --- CSS MODULY (POUZE AKTIVNÍ) ---
        './style.css',
        // ---HLAVNÍ CSS PRO MINI-PŘEHRAVAČ
        './miniPlayer.css',
         // ---HLAVNÍ CSS ČASOVAČ DEAKTIVOVÁNÍ HRAJÍCÍ HUDBY
        './casovac.css',
         // ---HLAVNÍ CSS PRO UKAZATEL CO JE TO ZA PROHLÍŽEČ
        './browser-status.css',
        // ---HLAVNÍ CSS PRO BOČNÍ POSUVNÍK OKNA PROHLÍŽEČE
        './scrollbar.css',
        // ---HLAVNÍ CSS VÁNOČNÍ EDICE STAR TREK HUDEBNÍHO PŘEHRAVAČE
        './christmas.css',
        // ---HLAVNÍ CSS NOVÍ PANEL HLASITOST ZE SPRÁVCE ROZHRANÍ .JS
        './zobrazit-panel-hlasitosti.css',

         // --- NULTÉ POŘADÍ V POŘADÍ ---
        './fleet-register.js',
        // --- Musí se načíst PŘED všemi Firebase moduly ---
      'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js',  
       // --- Musí být PŘED Firebase moduly, aby mohly logovat ---  
           './DebugManager.js',
    // --- Inicializuje window.tracks, window.favorites, audio element ---
            './script.js',
    './audioFirebaseFunctions.js',
      './playlistSync.js',
         './pokrocila-sprava-playlistu.js',
       './buttonVisibilityFirebase.js',
        // --- DEVÁTÝ V POŘADÍ ---
        './playlist-height.js',
       // --- DESÁTÝ V POŘADÍ ---
           './myPlaylist.js',
        // --- JEDENÁČTÝ V POŘADÍ ---
            './backgroundManager.js',
        // --- DVANÁCTÝ V POŘADÍ ---
             './colorManager.js',
         // --- TŘINÁCTÝ V POŘADÍ ---
             './notificationFix.js',
         // --- TŘTNÁCTÝ V POŘADÍ ---
            './playlistSettings.js',
         //Správa viditelnosti tlačítek
             './buttonVisibilityManager.js',
         //Automatické přechody mezi skladbami
              './autoFade.js',
            //Časovač
            './timer-module.js',
          //Vyhledávač skladeb
              './vyhledavac-skladeb.js',
            //Mini přehrávač (plovoucí okno)
                './miniPlayer.js',
        //Monitorovací nástroje - nejnižší priorita
           './universalni-perfomens-monitor.js',
              './bluetoothDisconnectMonitor.js',
        //Finální úpravy UI - musí být po všech feature modulech
                 './sprava-rozhrani.js',
                 './scrollbar.js',
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
