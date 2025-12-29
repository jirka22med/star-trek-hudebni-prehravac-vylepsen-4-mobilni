// fleet-registry.js - VELITELSKÝ MOST (Jediný soubor, který upravuješ)
const FLEET_CONFIG = {
    version: "6.5.2",
    codename: "Prometheus-Class",
    
    // SEZNAM VŠECH MODULŮ (Tady spravuješ odkazy)
    modules: [
        './index.html',
  './manifest.json',
  
  // --- CSS MODULY (POUZE AKTIVNÍ) ---
  './style.css',
  './miniPlayer.css',
  './loadingScreen.css',
  './casovac.css',
  './tone-meter-star-trek-hudebni-prehravac.css',
  './browser-status.css',
  './scrollbar.css',
  './christmas.css',
  './zobrazit-panel-hlasitosti.css',
  
  // --- KRITICKÉ JS MODULY (VŽDY AKTIVNÍ) ---
  './audioFirebaseFunctions.js',
  './DebugManager.js',
  './script.js',
  './backgroundManager.js',
  './myPlaylist.js',
  './pwa-installer.js',
  './fleet-registry.js',  //toto v cach
  // --- FEATURE JS MODULY (POUZE AKTIVNÍ) ---
  './universalni-perfomens-monitor.js',
//  './jirkuv-hlidac.js',
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
  // './audio-upravovac.js', // ❌ DEAKTIVOVÁN V HTML
  
  // --- FIREBASE SDK (absolutní URL) ---
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js'
  
  // ❌ TYTO MODULY JSOU DEAKTIVOVÁNY V index.html:
  // - voiceControl.js
  // - pocitac.js
  // - pomocnik-hlasoveho-ovladani-pro-mobil.js
  // - loadingScreen.js
  // - audio-upravovac.js
        // Sem jen připíšeš nový řádek, když přidáš modul
    ]
};
