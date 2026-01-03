// ════════════════════════════════════════════════════════════ 
// 🛸 USS PROMETHEUS - FLEET REGISTER
// ════════════════════════════════════════════════════════════

// 1. TADY ZMĚNÍŠ ČÍSLO A AKTUALIZUJE SE CELÁ LOĎ:
var VERZE_FLOTILY = "0.0.0.1"; 


// 2. TADY JEN HÁZÍŠ NÁZVY SOUBORŮ (NIC VÍC):
var moduly = [
    
    // --- JÁDRO ---
    "./DebugManager.js",

    // --- HLAVNÍ SKRIPTY ---
    "./script.js",
    "./audioFirebaseFunctions.js",
    "./playlistSync.js",
    "./pokrocila-sprava-playlistu.js",
    "./buttonVisibilityFirebase.js",

    // --- DATA ---
    "./myPlaylist.js", 

    // --- UI A ZBYTEK ---
    "./backgroundManager.js",
    "./colorManager.js",
    "./playlistSettings.js",
    "./buttonVisibilityManager.js",
    "./autoFade.js",
    "./timer-module.js",
    "./vyhledavac-skladeb.js",
    "./miniPlayer.js",
    "./playlist-height.js",
    "./notificationFix.js",
    "./universalni-perfomens-monitor.js",
    "./bluetoothDisconnectMonitor.js",
    "./sprava-rozhrani.js",
    "./scrollbar.js"
];


// ════════════════════════════════════════════════════════════
// ⚙️ MOTOR (Tohle neřeš, to jenlepí tu verzi k souborům)
// ════════════════════════════════════════════════════════════
(function() {
    console.log("🛸 [USS PROMETHEUS] Načítám flotilu verze: " + VERZE_FLOTILY);
    
    moduly.forEach(function(cesta) {
        var s = document.createElement('script');
        s.src = cesta + "?v=" + VERZE_FLOTILY; // Tady se to samo spojí
        s.defer = true; 
        document.body.appendChild(s);
    });
})();
