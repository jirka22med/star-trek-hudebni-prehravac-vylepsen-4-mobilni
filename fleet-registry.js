// fleet-registry.js - VELITELSKÝ MOST (Jediný soubor, který upravuješ)
const FLEET_CONFIG = {
    version: "6.5.0",
    codename: "Prometheus-Class",
    
    // SEZNAM VŠECH MODULŮ (Tady spravuješ odkazy)
    modules: [
        './style.css',
        './script.js',
        './DebugManager.js',
        './backgroundManager.js',
        './myPlaylist.js',
        './pwa-installer.js',
        './playlistSettings.js',
        './playlistSync.js',
        './pokrocila-sprava-playlistu.js',
        './prednacitani-pisnicek.js',
        './colorManager.js'
        // Sem jen připíšeš nový řádek, když přidáš modul
    ]
};
