// --- Device Detection a UI Adjustments ---
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// 🚀 ADAPTIVNÍ VÝŠKA PLAYLISTU - FINÁLNÍ VERZE 🚀
// Škálovací matice pro všechny lodní systémy
// Autor: Admirál claude.ai
// Architek projektu: Více admirál Jiřík
// Datum: 01.01.2026
// Čas:   14:15:00
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
const __playlistHeightJS_START = performance.now();
 
// 🚨 ANTI-DUPLICATE SHIELD
if (window.playlistHeightLoaded) {
    console.warn('⚠️ playlist-height.js již byl načten! Skript ukončen.');
    throw new Error('Duplicate load prevented');
}
window.playlistHeightLoaded = true;


// Na začátek souboru (před function detectDeviceType())
function waitForDOM(callback, maxAttempts = 100) {
    let attempts = 0;
    const check = setInterval(() => {
        if (window.DOM && window.DOM.playlist) {
            clearInterval(check);
            callback();
        } else if (++attempts > maxAttempts) {
            clearInterval(check);
            console.error('⚠️ DOM objekt se nenačetl!');
        }
    }, 50);
}
document.addEventListener('fullscreenchange', () => {
    waitForDOM(() => adjustPlaylistHeight(document.fullscreenElement !== null));
});

/**
 * Detekce typu zařízení - Opravené senzory
 */
function detectDeviceType() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // 🎯 KRITICKÁ DETEKCE
    const isWindowsDesktop = (
        userAgent.includes('windows') && 
        !userAgent.includes('mobile') && 
        !userAgent.includes('android')
    );
    
    const isAndroidMobile = (
        userAgent.includes('android') && 
        userAgent.includes('mobile')
    );
    
    const deviceInfo = {
        // 💻 LENOVO NOTEBOOK - Detekce podle Windows + rozlišení
        isLenovoNotebook: (
            isWindowsDesktop && 
            window.screen.width >= 1366 &&  // ⬅️ SNÍŽENÝ LIMIT pro laptopy
            window.screen.width <= 1920
        ),
        
        // 📱 INFINIX NOTE 30 - Tvůj mobil
        isInfinixNote30: (
            isAndroidMobile &&
            screenWidth <= 420 && 
            screenHeight >= 800
        ),
        
        // 📱 OBECNÉ MOBILNÍ ZAŘÍZENÍ
        isMobile: (
            isAndroidMobile || 
            (screenWidth <= 768 && userAgent.includes('mobile'))
        ),
        
        // 🖥️ VELKÉ DESKTOPOVÉ MONITORY
        isLargeDesktop: (
            isWindowsDesktop && 
            window.screen.width > 1920
        ),
        
        // 📊 Debug info
        windowWidth: screenWidth,
        windowHeight: screenHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        userAgent: userAgent,
        isWindowsDesktop: isWindowsDesktop,
        isAndroidMobile: isAndroidMobile
    };
    
    return deviceInfo;
}

/**
 * Nastavení výšky playlistu podle zařízení
 */
function adjustPlaylistHeight(isFullscreen = false) {
    // Oprava: Použití window.DOM pro prevenci ReferenceError
    if (!window.DOM || !window.DOM.playlist) return;
    
    const device = detectDeviceType();
    let newHeight = '150px';
    let deviceName = '❓ Neznámé zařízení';
    let expectedTracks = 0;
    
    // ═══════════════════════════════════════════════════════════════════════
    // 🎯 PRIORITA #1: LENOVO NOTEBOOK (1366-1920px Windows)
    // ═══════════════════════════════════════════════════════════════════════
    if (device.isLenovoNotebook) {
        if (isFullscreen) {
            newHeight = '320px';  // 7 skladeb × 65px
            expectedTracks = 8;
        } else {
            newHeight = '200px';  // 5 skladeb × 65px
            expectedTracks = 5;
        }
        deviceName = '💻 Lenovo Notebook';
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // 📱 PRIORITA #2: INFINIX NOTE 30
    // ═══════════════════════════════════════════════════════════════════════
    else if (device.isInfinixNote30) {
        newHeight = '50px';  // 4 skladby
        expectedTracks = 4;
        deviceName = '📱 Mobilní zařízení'; //📱 Infinix Note 30
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // 📱 PRIORITA #3: OSTATNÍ MOBILNÍ ZAŘÍZENÍ
    // ═══════════════════════════════════════════════════════════════════════
    else if (device.isMobile) {
        if (isFullscreen) {
            newHeight = '296px';  // 6 skladeb
            expectedTracks = 6;
        } else {
            newHeight = '184px';  // 4 skladby
            expectedTracks = 5;
        }
        deviceName = '📱 Infinix Note 30'; //📱 Mobilní zařízení
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // 🖥️ PRIORITA #4: VELKÉ DESKTOPY (>1920px)
    // ═══════════════════════════════════════════════════════════════════════
    else if (device.isLargeDesktop) {
        if (isFullscreen) {
            newHeight = '420px';  // 8 skladeb
            expectedTracks = 7;
        } else {
            newHeight = '390px';  // 6 skladeb
            expectedTracks = 6;
        }
        deviceName = '🖥️ Velký desktop (>1920px)';
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // ⚠️ FALLBACK: Pokud nic nesedí
    // ═══════════════════════════════════════════════════════════════════════
    else {
        if (device.isWindowsDesktop) {
            // Windows, ale neznámé rozlišení → odhad podle šířky
            if (isFullscreen) {
                newHeight = '390px';  // 6 skladeb
                expectedTracks = 6;
            } else {
                newHeight = '260px';  // 4 skladby
                expectedTracks = 4;
            }
            deviceName = '💻 Windows desktop (fallback)';
        } else {
            // Úplně neznámé zařízení
            newHeight = '260px';
            expectedTracks = 4;
            deviceName = '❓ Neidentifikované zařízení';
        }
    }
    
    // 🎨 Aplikace výšky
    // Oprava: Použití window.DOM
    window.DOM.playlist.style.maxHeight = newHeight;
    
    // 📡 Detailní debug log (PŮVODNÍ OD ADMIRÁLA CLAUDA)
    const logMessage = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 📏 VÝŠKA PLAYLISTU UPRAVENA
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 🖥️  Zařízení: ${deviceName}
┃ 📐 Okno: ${device.windowWidth}×${device.windowHeight}px
┃ 📺 Monitor: ${device.screenWidth}×${device.screenHeight}px
┃ 🎬 Fullscreen: ${isFullscreen ? 'ANO ✅' : 'NE ❌'}
┃ 📏 Výška: ${newHeight}
┃ 🎵 Viditelné skladby: ~${expectedTracks}
┃ 🪟 Windows Desktop: ${device.isWindowsDesktop ? 'ANO' : 'NE'}
┃ 🤖 Android Mobile: ${device.isAndroidMobile ? 'ANO' : 'NE'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
     
    
    // 🚀 AKTIVACE SPECIÁLNÍHO LOGOVÁNÍ PRO 'playlist01'
    if (window.DebugManager) {
        window.DebugManager.log('playlist01', logMessage.trim());
    }
}

/**
 * Inicializace při načtení
 */
function restorePreviousSettings() {
    // Zde už není potřeba varování, protože tuto funkci voláme přes waitForDOM
    if (!window.DOM || !window.DOM.playlist) {
        return;
    }
    
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    adjustPlaylistHeight(isCurrentlyFullscreen);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎧 EVENT LISTENERY
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('fullscreenchange', () => {
    adjustPlaylistHeight(document.fullscreenElement !== null);
});

document.addEventListener('webkitfullscreenchange', () => {
    adjustPlaylistHeight(document.webkitFullscreenElement !== null);
});

document.addEventListener('mozfullscreenchange', () => {
    adjustPlaylistHeight(document.mozFullScreenElement !== null);
});

// Při změně velikosti okna (s debounce)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        adjustPlaylistHeight(document.fullscreenElement !== null);
    }, 250);
});

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 AUTOMATICKÁ INICIALIZACE (S ČASOVAČEM)
// ═══════════════════════════════════════════════════════════════════════════
// Oprava: Voláme restorePreviousSettings přes waitForDOM, aby se počkalo na načtení DOM objektu
function initSafe() {
    waitForDOM(restorePreviousSettings);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSafe);
} else {
    initSafe();
}
// ═══════════════════════════════════════════════════════════════════════════
// 🚀 TADY KONČÍ NASTAVENÍ PLALISTU
console.log(`%c🚀 [playlistHeightJS] Načteno za ${(performance.now() - __playlistHeightJS_START).toFixed(2)} ms`, 'background: #000; color: #00ff00; font-weight: bold; padding: 2px;');
// ═══════════════════════════════════════════════════════════════════════════
