/* ============================================
   🖖 ENTERPRISE LCARS LOADING SCREEN 🖖
   Futuristická logika podle Star Trek TNG
   Autor: Admirál Claude.AI
   Architekt: Více admirál Jiřík
   ============================================ */

(function() {
    'use strict';
    
    // ═══════════════════════════════════════════
    // 🎛️ KONFIGURACE SYSTÉMU
    // ═══════════════════════════════════════════
    const CONFIG = {
        LOAD_DURATION: 4000,         // 4 sekundy celkového načítání (sníženo z 5s)
        UPDATE_INTERVAL: 30,         // Aktualizace každých 30ms (plynulejší)
        MIN_DISPLAY_TIME: 1500,      // Minimální zobrazení 1.5 sekundy (sníženo z 2s)
        FADE_OUT_DURATION: 600       // Fade out animace 0.6s
    };
    
    // ═══════════════════════════════════════════
    // 💾 STAV APLIKACE
    // ═══════════════════════════════════════════
    let startTime = null;
    let progressInterval = null;
    let isReady = false;
    
    // DOM elementy
    let loadingScreen = null;
    let progressFill = null;
    let progressText = null;
    
    // ═══════════════════════════════════════════
    // 🚀 INICIALIZACE LOADING SCREENU
    // ═══════════════════════════════════════════
    function initLoadingScreen() {
        createLoadingHTML();
        
        loadingScreen = document.getElementById('loading-screen');
        progressFill = document.getElementById('loading-progress-fill');
        progressText = document.getElementById('loading-progress-text');
        
        if (!loadingScreen || !progressFill || !progressText) {
            console.error('🔴 Loading screen: Nepodařilo se načíst DOM elementy');
            return;
        }
        
        startLoading();
        waitForAppReady();
        
        // 🎵 LCARS zvukový efekt (volitelné)
        playLCARSSound();
    }
    
    // ═══════════════════════════════════════════
    // 🎨 VYTVOŘENÍ HTML STRUKTURY
    // ═══════════════════════════════════════════
    function createLoadingHTML() {
        const html = `
            <div id="loading-screen">
                <div class="loading-template">
                    <!-- Vítací sekce -->
                    <div class="loading-welcome">
                        <h2>🖖 VÍTEJTE 🖖</h2>
                        <h3>VÍCE ADMIRÁLE JIŘÍKU</h3>
                    </div>
                    
                    <!-- Info sekce -->
                    <div class="loading-info">
                        <p>🚀 <span class="highlight">Inicializuji systémy...</span></p>
                        <p>⚡ Načítám warpový pohon</p>
                        <p>🎵 Připravuji hudební databázi</p>
                        <p>🌌 Synchronizuji s flotilou</p>
                        <p>✅ <span class="highlight">Systémy připraveny!</span></p>
                    </div>
                    
                    <!-- Progress bar sekce -->
                    <div class="loading-progress-section">
                        <div class="loading-progress-label">⚡ WARP CORE STATUS ⚡</div>
                        <div class="loading-progress-container">
                            <div id="loading-progress-fill" class="loading-progress-fill"></div>
                            <div id="loading-progress-text" class="loading-progress-text">0%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', html);
    }
    
    // ═══════════════════════════════════════════
    // ▶️ SPUŠTĚNÍ NAČÍTÁNÍ
    // ═══════════════════════════════════════════
    function startLoading() {
        startTime = Date.now();
        progressInterval = setInterval(updateProgress, CONFIG.UPDATE_INTERVAL);
    }
    
    // ═══════════════════════════════════════════
    // 📊 AKTUALIZACE PROGRESS BARU
    // ═══════════════════════════════════════════
    function updateProgress() {
        const elapsed = Date.now() - startTime;
        let progress = Math.min((elapsed / CONFIG.LOAD_DURATION) * 100, 100);
        
        // Zaokrouhlení na celá čísla
        progress = Math.floor(progress);
        
        // Aktualizace UI s plynulou animací
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        // 🎯 KONTROLA DOKONČENÍ
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            const minTimeElapsed = elapsed >= CONFIG.MIN_DISPLAY_TIME;
            
            if (window.DebugManager) {
                window.DebugManager.log('main', `📊 Loading: Progress 100% reached (elapsed: ${elapsed}ms, isReady: ${isReady})`);
            }
            
            // ✅ SCÉNÁŘ 1: Vše připraveno -> okamžité skrytí
            if (isReady && minTimeElapsed) {
                if (window.DebugManager) {
                    window.DebugManager.log('main', '✅ Loading: Perfect timing → Hiding immediately');
                }
                hideLoadingScreen();
            } 
            // ⏳ SCÉNÁŘ 2: App není ready -> čekáme max 2 sekundy
            else if (!isReady) {
                if (window.DebugManager) {
                    window.DebugManager.log('main', '⏳ Loading: Waiting for app ready (max 2s)...');
                }
                
                // Čekáme max 2 sekundy na isReady
                let waitCount = 0;
                const maxWaitCount = 20; // 20 * 100ms = 2 sekundy
                
                const forceHideInterval = setInterval(() => {
                    waitCount++;
                    
                    if (isReady) {
                        clearInterval(forceHideInterval);
                        if (window.DebugManager) {
                            window.DebugManager.log('main', `✅ Loading: App ready after ${waitCount * 100}ms → Hiding now`);
                        }
                        hideLoadingScreen();
                    } 
                    else if (waitCount >= maxWaitCount) {
                        clearInterval(forceHideInterval);
                        if (window.DebugManager) {
                            window.DebugManager.log('main', '⚠️ Loading: 2s timeout → Force hiding!');
                        }
                        hideLoadingScreen();
                    }
                }, 100);
            } 
            // ⏰ SCÉNÁŘ 3: Minimální čas ještě neuplynul
            else {
                const remainingTime = CONFIG.MIN_DISPLAY_TIME - elapsed;
                if (window.DebugManager) {
                    window.DebugManager.log('main', `⏰ Loading: Waiting ${remainingTime}ms for MIN_DISPLAY_TIME`);
                }
                setTimeout(hideLoadingScreen, remainingTime);
            }
        }
    }
    
    // ═══════════════════════════════════════════
    // ⏳ ČEKÁNÍ NA PŘIPRAVENOST APLIKACE
    // ═══════════════════════════════════════════
    function waitForAppReady() {
        const maxChecks = 100; // 100 * 100ms = 10 sekund max
        let checkCount = 0;
        
        const checkInterval = setInterval(() => {
            checkCount++;
            
            // ✅ DETEKCE #1: Existují klíčové objekty z script.js?
            const tracksExist = typeof window.tracks !== 'undefined' && 
                               Array.isArray(window.tracks) && 
                               window.tracks.length > 0;
            
            const loadAudioDataExists = typeof window.loadAudioData !== 'undefined';
            
            // ✅ DETEKCE #2: Je DOM úplně ready?
            const domReady = document.readyState === 'complete';
            
            // ✅ DETEKCE #3: Existují klíčové DOM elementy přehrávače?
            const audioPlayer = document.getElementById('audioPlayer');
            const playlist = document.getElementById('playlist');
            const playlistItems = playlist ? playlist.querySelectorAll('.playlist-item').length : 0;
            
            // ✅ DETEKCE #4: Byl už spuštěn hlavní inicializační kód?
            const originalTracksExist = typeof window.originalTracks !== 'undefined';
            const currentPlaylistExist = typeof window.currentPlaylist !== 'undefined';
            
            // ✅ DETEKCE #5: Je Firebase připojen? (podle tvého logu)
            const firebaseReady = window.db !== undefined || 
                                 (window.firebase && window.firebase.apps && window.firebase.apps.length > 0);
            
            // 🎯 ÚSPĚŠNÉ PODMÍNKY (seřazeno podle priority):
            
            // IDEÁLNÍ: Vše nahrané + playlist má skladby
            const perfectCondition = domReady && tracksExist && playlistItems > 0;
            
            // DOBRÁ: Scripts ready + DOM ready
            const goodCondition = domReady && tracksExist && loadAudioDataExists;
            
            // AKCEPTOVATELNÁ: DOM ready + audio player existuje + máme data
            const okCondition = domReady && audioPlayer && (originalTracksExist || tracksExist);
            
            // MINIMÁLNÍ: Aspoň DOM ready + nějaká data
            const minimalCondition = domReady && (tracksExist || originalTracksExist || playlistItems > 0);
            
            // 🚦 ROZHODOVACÍ LOGIKA
            if (perfectCondition) {
                isReady = true;
                clearInterval(checkInterval);
                
                if (window.DebugManager) {
                    window.DebugManager.log('main', `✅ Loading: PERFECT condition met! (${checkCount * 100}ms, ${playlistItems} tracks)`);
                }
                return;
            }
            
            if (goodCondition) {
                isReady = true;
                clearInterval(checkInterval);
                
                if (window.DebugManager) {
                    window.DebugManager.log('main', `✅ Loading: GOOD condition met! (${checkCount * 100}ms)`);
                }
                return;
            }
            
            if (okCondition && checkCount > 20) { // Počkáme aspoň 2 sekundy
                isReady = true;
                clearInterval(checkInterval);
                
                if (window.DebugManager) {
                    window.DebugManager.log('main', `✅ Loading: OK condition met! (${checkCount * 100}ms)`);
                }
                return;
            }
            
            if (minimalCondition && checkCount > 30) { // Počkáme aspoň 3 sekundy
                isReady = true;
                clearInterval(checkInterval);
                
                if (window.DebugManager) {
                    window.DebugManager.log('main', `✅ Loading: MINIMAL condition met! (${checkCount * 100}ms)`);
                }
                return;
            }
            
            // ⏰ TIMEOUT: Po 10 sekundách ukončíme i tak
            if (checkCount >= maxChecks) {
                isReady = true;
                clearInterval(checkInterval);
                
                if (window.DebugManager) {
                    window.DebugManager.log('main', `⚠️ Loading: TIMEOUT after ${checkCount * 100}ms - force ready!`);
                }
                
                // Debug info o tom, co chybělo
                if (window.DebugManager) {
                    const debugInfo = {
                        tracksExist,
                        loadAudioDataExists,
                        domReady,
                        audioPlayer: !!audioPlayer,
                        playlistItems,
                        originalTracksExist,
                        currentPlaylistExist,
                        firebaseReady
                    };
                    window.DebugManager.log('main', `📊 Loading timeout state: ${JSON.stringify(debugInfo, null, 2)}`);
                }
            }
        }, 100);
    }
    
    // ═══════════════════════════════════════════
    // 🌌 SKRYTÍ LOADING SCREENU
    // ═══════════════════════════════════════════
    function hideLoadingScreen() {
        if (!loadingScreen) return;
        
        // Přidání třídy pro fade-out
        loadingScreen.classList.add('hidden');
        
        // 🎵 LCARS zvuk vypnutí (volitelné)
        playLCARSShutdown();
        
        // 🎯 Kapitánský log
        if (window.DebugManager) {
            window.DebugManager.log('main', '🖖 Loading screen ukončen - Live long and prosper!');
        }
        
        // Odstranění z DOM po dokončení animace
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, CONFIG.FADE_OUT_DURATION);
    }
    
    // ═══════════════════════════════════════════
    // 🔊 ZVUKOVÉ EFEKTY (Volitelné)
    // ═══════════════════════════════════════════
    function playLCARSSound() {
        // Pokud máte zvuky LCARS, můžete je přidat sem
        // Příklad: new Audio('lcars-startup.mp3').play().catch(e => {});
        
        if (window.DebugManager) {
            window.DebugManager.log('main', '🔊 LCARS startup sound (disabled)');
        }
    }
    
    function playLCARSShutdown() {
        // Příklad: new Audio('lcars-shutdown.mp3').play().catch(e => {});
        
        if (window.DebugManager) {
            window.DebugManager.log('main', '🔊 LCARS shutdown sound (disabled)');
        }
    }
    
    // ═══════════════════════════════════════════
    // 🛠️ PUBLIC API
    // ═══════════════════════════════════════════
    window.hideLoadingScreen = function() {
        isReady = true;
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        hideLoadingScreen();
    };
    
    // ═══════════════════════════════════════════
    // 🚀 AUTOMATICKÁ INICIALIZACE
    // ═══════════════════════════════════════════
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoadingScreen);
    } else {
        initLoadingScreen();
    }
    
    // ═══════════════════════════════════════════
    // 🖖 KAPITÁNSKÁ ZPRÁVA
    // ═══════════════════════════════════════════
    console.log(`
╔═══════════════════════════════════════════╗
║  🖖 ENTERPRISE LCARS LOADING SCREEN 🖖  ║
║                                           ║
║  Status: AKTIVNÍ                          ║
║  Verze: 2.0 - TNG Edition                 ║
║  Autor: Admirál Claude.AI                 ║
║  Architekt: Více admirál Jiřík            ║
║                                           ║
║  Live long and prosper! 🚀                ║
╚═══════════════════════════════════════════╝
    `);
    
})();
