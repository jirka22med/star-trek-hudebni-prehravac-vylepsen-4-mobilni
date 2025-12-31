// ════════════════════════════════════════════════════════════════════════════════
// 🛡️ STREAM STABILIZER - MIKROVÝPADKY POD KONTROLOU
// ════════════════════════════════════════════════════════════════════════════════
// Autor: Admirál Claude.AI | Architekt: Více Admirál Jiřík
// Účel: Eliminace přeskakování skladeb při krátkých výpadcích internetu
// Verze: 1.0 - QUANTUM SHIELD
// ════════════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚙️ KONFIGURACE STABILIZÁTORU
    // ═══════════════════════════════════════════════════════════════════════════
    const CONFIG = {
        // Jak dlouho čekáme, než prohlásíme výpadek za "mikrovýpadek"
        MICRO_OUTAGE_THRESHOLD: 2000,      // 2 sekundy
        
        // Maximum času pro recovery před vzdáním se
        MAX_RECOVERY_TIME: 12000,          // 12 sekund (4× pokus po 3s)
        
        // Prodleva mezi recovery pokusy
        RECOVERY_ATTEMPT_DELAY: 3000,      // 3 sekundy
        
        // Kolik pokusů o obnovu provedeme
        MAX_RECOVERY_ATTEMPTS: 4,          // 4 pokusy = 12s celkem
        
        // Buffer time - jak dlouho čekáme na stabilizaci bufferu
        BUFFER_GRACE_PERIOD: 1500,         // 1.5 sekundy
        
        // Debug mód (vypíše podrobné logy)
        DEBUG_MODE: true
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STAV STABILIZÁTORU
    // ═══════════════════════════════════════════════════════════════════════════
    const StabilizerState = {
        isStabilizing: false,           // TRUE = právě řešíme výpadek
        currentAttempt: 0,              // Počítadlo pokusů
        outageStartTime: 0,             // Kdy výpadek začal
        lastKnownPosition: 0,           // Pozice v skladbě před výpadkem
        lastKnownSrc: null,             // URL aktuální skladby
        recoveryTimer: null,            // Časovač pro pokusy
        bufferCheckTimer: null,         // Časovač pro buffer monitoring
        
        // Statistiky (pro Admirála)
        stats: {
            totalOutages: 0,            // Celkový počet výpadků
            successfulRecoveries: 0,    // Kolik jsme zachránili
            failedRecoveries: 0,        // Kolik jsme nezvládli
            averageRecoveryTime: 0      // Průměrný čas záchrany
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 HLAVNÍ API - VOLÁ SE ZE SCRIPT.JS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Registrace audio elementu pro monitoring
     * VOLAT Z script.js po DOMContentLoaded
     */
    window.StreamStabilizer_RegisterAudio = function(audioElement) {
        if (!audioElement) {
            console.error('🔴 STABILIZER: Nelze registrovat null audio element!');
            return;
        }

        log('✅ Audio element registrován. Monitoring aktivní.');
        attachEventListeners(audioElement);
    };

    /**
     * Ruční trigger recovery (pro StreamGuard ze script.js)
     * Vrací Promise - resolve při úspěchu, reject při selhání
     */
    window.StreamStabilizer_ForceRecovery = function(audioElement, errorCode) {
        return new Promise((resolve, reject) => {
            if (StabilizerState.isStabilizing) {
                log('⚠️ Recovery již běží, ignoruji duplicitní volání.');
                resolve(false);
                return;
            }

            log(`🚨 Manuální trigger recovery (Důvod: ${errorCode})`);
            initiateRecovery(audioElement, errorCode)
                .then(success => success ? resolve(true) : reject(false))
                .catch(() => reject(false));
        });
    };

    /**
     * Získání statistik (pro debug panel)
     */
    window.StreamStabilizer_GetStats = function() {
        return { ...StabilizerState.stats };
    };

    /**
     * Reset statistik
     */
    window.StreamStabilizer_ResetStats = function() {
        StabilizerState.stats = {
            totalOutages: 0,
            successfulRecoveries: 0,
            failedRecoveries: 0,
            averageRecoveryTime: 0
        };
        log('📊 Statistiky resetovány.');
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔊 EVENT LISTENERS (Detekce problémů)
    // ═══════════════════════════════════════════════════════════════════════════
    function attachEventListeners(audio) {
        // 1. WAITING - Stream čeká na data (běžné při seekování)
        audio.addEventListener('waiting', () => {
            if (!StabilizerState.isStabilizing && !audio.paused) {
                log('⏳ Buffer prázdný, spouštím grace period...');
                startBufferGracePeriod(audio);
            }
        });

        // 2. STALLED - Data přestala téct (vážnější problém)
        audio.addEventListener('stalled', () => {
            if (!audio.paused) {
                log('🚨 STALLED event - data zamrzla!');
                initiateRecovery(audio, 'STALLED');
            }
        });

        // 3. ERROR - Kritická chyba
        audio.addEventListener('error', (e) => {
            const errorCode = e.target.error?.code || 'UNKNOWN';
            log(`❌ ERROR event: ${errorCode}`);
            initiateRecovery(audio, `ERROR_${errorCode}`);
        });

        // 4. PLAYING - Úspěšné obnovení streamu
        audio.addEventListener('playing', () => {
            if (StabilizerState.isStabilizing) {
                log('✅ Stream obnoven! Zastavuji recovery.');
                completeRecovery(true);
            }
        });

        // 5. CANPLAY - Buffer naplněn
        audio.addEventListener('canplay', () => {
            if (StabilizerState.bufferCheckTimer) {
                clearTimeout(StabilizerState.bufferCheckTimer);
                StabilizerState.bufferCheckTimer = null;
                log('📦 Buffer OK - grace period ukončen.');
            }
        });

        log('🎧 Event listeners připojeny.');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ⏱️ BUFFER GRACE PERIOD (Čekáme na normální doplnění bufferu)
    // ═══════════════════════════════════════════════════════════════════════════
    function startBufferGracePeriod(audio) {
        // Pokud už grace period běží, restartujeme časovač
        if (StabilizerState.bufferCheckTimer) {
            clearTimeout(StabilizerState.bufferCheckTimer);
        }

        StabilizerState.bufferCheckTimer = setTimeout(() => {
            // Po grace period stále čekáme? To je problém!
            if (audio.readyState < 3 && !audio.paused) { // readyState 3 = HAVE_FUTURE_DATA
                log('⚠️ Buffer se nenaplnil v grace period. Zahajuji recovery.');
                initiateRecovery(audio, 'BUFFER_TIMEOUT');
            }
        }, CONFIG.BUFFER_GRACE_PERIOD);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 HLAVNÍ RECOVERY LOGIKA
    // ═══════════════════════════════════════════════════════════════════════════
    async function initiateRecovery(audio, reason) {
        // Pokud už recovery běží, nespouštíme další
        if (StabilizerState.isStabilizing) {
            log('⚠️ Recovery již aktivní, ignoruji nový trigger.');
            return Promise.resolve(false);
        }

        // Inicializace
        StabilizerState.isStabilizing = true;
        StabilizerState.currentAttempt = 0;
        StabilizerState.outageStartTime = Date.now();
        StabilizerState.lastKnownPosition = audio.currentTime || 0;
        StabilizerState.lastKnownSrc = audio.querySelector('source')?.src || audio.src;
        StabilizerState.stats.totalOutages++;

        log(`🛡️ RECOVERY INITIATED | Důvod: ${reason} | Pozice: ${StabilizerState.lastKnownPosition.toFixed(2)}s`);
        notifyUser('🔄 Stabilizuji spojení...', 'warn');

        // Spustíme recovery loop
        return attemptRecovery(audio);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔁 RECOVERY LOOP (Opakované pokusy)
    // ═══════════════════════════════════════════════════════════════════════════
    function attemptRecovery(audio) {
        return new Promise((resolve, reject) => {
            const runAttempt = async () => {
                StabilizerState.currentAttempt++;
                const elapsed = Date.now() - StabilizerState.outageStartTime;

                log(`🔧 Pokus ${StabilizerState.currentAttempt}/${CONFIG.MAX_RECOVERY_ATTEMPTS} (${(elapsed / 1000).toFixed(1)}s)`);

                // Kontrola limitu času
                if (elapsed > CONFIG.MAX_RECOVERY_TIME) {
                    log('⏰ Vypršel čas pro recovery. Vzdávám to.');
                    completeRecovery(false);
                    reject('TIMEOUT');
                    return;
                }

                // Kontrola limitu pokusů
                if (StabilizerState.currentAttempt > CONFIG.MAX_RECOVERY_ATTEMPTS) {
                    log('🔴 Vyčerpány všechny pokusy. Recovery selhal.');
                    completeRecovery(false);
                    reject('MAX_ATTEMPTS');
                    return;
                }

                // === RECOVERY PROCEDURA ===
                try {
                    // 1. Pause (zastavení pokusu o přehrávání)
                    audio.pause();

                    // 2. Vynucení nového network requestu (přidání timestamp)
                    const originalSrc = StabilizerState.lastKnownSrc;
                    const newSrc = originalSrc.includes('?') 
                        ? `${originalSrc}&_retry=${Date.now()}`
                        : `${originalSrc}?_retry=${Date.now()}`;

                    const sourceElement = audio.querySelector('source');
                    if (sourceElement) {
                        sourceElement.src = newSrc;
                    } else {
                        audio.src = newSrc;
                    }

                    // 3. Reload audio
                    audio.load();

                    // 4. Čekáme na načtení metadat
                    await waitForEvent(audio, 'loadedmetadata', 5000);

                    // 5. Nastavíme pozici
                    audio.currentTime = StabilizerState.lastKnownPosition;

                    // 6. Čekáme na stabilizaci bufferu
                    await waitForEvent(audio, 'canplay', 3000);

                    // 7. Pokus o přehrání
                    await audio.play();

                    log('✅ Recovery úspěšný!');
                    completeRecovery(true);
                    resolve(true);

                } catch (error) {
                    log(`❌ Pokus ${StabilizerState.currentAttempt} selhal: ${error.message || error}`);

                    // Pokud jsou další pokusy, naplánujeme další
                    if (StabilizerState.currentAttempt < CONFIG.MAX_RECOVERY_ATTEMPTS) {
                        StabilizerState.recoveryTimer = setTimeout(runAttempt, CONFIG.RECOVERY_ATTEMPT_DELAY);
                    } else {
                        completeRecovery(false);
                        reject('FAILED');
                    }
                }
            };

            // Spustíme první pokus
            runAttempt();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ✅ DOKONČENÍ RECOVERY
    // ═══════════════════════════════════════════════════════════════════════════
    function completeRecovery(success) {
        const recoveryTime = Date.now() - StabilizerState.outageStartTime;

        if (success) {
            StabilizerState.stats.successfulRecoveries++;
            // Aktualizace průměrného času
            const prevAvg = StabilizerState.stats.averageRecoveryTime;
            const count = StabilizerState.stats.successfulRecoveries;
            StabilizerState.stats.averageRecoveryTime = ((prevAvg * (count - 1)) + recoveryTime) / count;

            log(`✅ RECOVERY DOKONČEN | Čas: ${(recoveryTime / 1000).toFixed(2)}s`);
            notifyUser('✅ Spojení obnoveno!', 'success');
        } else {
            StabilizerState.stats.failedRecoveries++;
            log(`❌ RECOVERY SELHAL | Čas: ${(recoveryTime / 1000).toFixed(2)}s`);
            notifyUser('❌ Nelze obnovit stream. Přeskakuji...', 'error');

            // Informujeme script.js, že má přeskočit na další skladbu
            if (typeof window.playNextTrack === 'function') {
                setTimeout(() => window.playNextTrack(), 1000);
            }
        }

        // Reset stavu
        StabilizerState.isStabilizing = false;
        StabilizerState.currentAttempt = 0;
        if (StabilizerState.recoveryTimer) {
            clearTimeout(StabilizerState.recoveryTimer);
            StabilizerState.recoveryTimer = null;
        }
        if (StabilizerState.bufferCheckTimer) {
            clearTimeout(StabilizerState.bufferCheckTimer);
            StabilizerState.bufferCheckTimer = null;
        }

        // Logování statistik
        logStats();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ UTILITY FUNKCE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Čeká na konkrétní event s timeoutem
     */
    function waitForEvent(element, eventName, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                element.removeEventListener(eventName, handler);
                reject(`Timeout při čekání na ${eventName}`);
            }, timeout);

            const handler = () => {
                clearTimeout(timer);
                element.removeEventListener(eventName, handler);
                resolve();
            };

            element.addEventListener(eventName, handler, { once: true });
        });
    }

    /**
     * Debug logging
     */
    function log(message) {
        if (CONFIG.DEBUG_MODE) {
            console.log(`[STABILIZER] ${message}`);
        }
    }

    /**
     * Statistiky do konzole
     */
    function logStats() {
        if (CONFIG.DEBUG_MODE) {
            console.log('📊 === STREAM STABILIZER STATS ===');
            console.log(`   Celkem výpadků: ${StabilizerState.stats.totalOutages}`);
            console.log(`   Úspěšných záchran: ${StabilizerState.stats.successfulRecoveries}`);
            console.log(`   Neúspěšných: ${StabilizerState.stats.failedRecoveries}`);
            const successRate = StabilizerState.stats.totalOutages > 0
                ? (StabilizerState.stats.successfulRecoveries / StabilizerState.stats.totalOutages * 100).toFixed(1)
                : 0;
            console.log(`   Úspěšnost: ${successRate}%`);
            console.log(`   Průměrný čas záchrany: ${(StabilizerState.stats.averageRecoveryTime / 1000).toFixed(2)}s`);
            console.log('=====================================');
        }
    }

    /**
     * Notifikace pro uživatele
     */
    function notifyUser(message, type) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type, 3000);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INICIALIZACE
    // ═══════════════════════════════════════════════════════════════════════════
    console.log('🛡️ STREAM STABILIZER: Online | Mikrovýpadky pod kontrolou.');
    console.log(`⚙️ Config: ${CONFIG.MAX_RECOVERY_ATTEMPTS} pokusů × ${CONFIG.RECOVERY_ATTEMPT_DELAY / 1000}s = ${CONFIG.MAX_RECOVERY_TIME / 1000}s max`);

    // Export konfigurace (pro ladění Admirálem)
    window.StreamStabilizerConfig = CONFIG;

})();

// ════════════════════════════════════════════════════════════════════════════════
// ✅ KONEC MODULU
// ════════════════════════════════════════════════════════════════════════════════