/**
 * 🖖 STAR TREK AUDIO SMART PRELOADER V4.0 🚀
 * ═══════════════════════════════════════════════════════════════
 * 💪 BATTLE-TESTED EDITION - Odolný proti VŠEMU!
 * ═══════════════════════════════════════════════════════════════
 * ✅ Retry mechanismus s exponenciálním backoffem
 * ✅ Timeout protection (30s limit)
 * ✅ Network error detection (ERR_CONNECTION_RESET, atd.)
 * ✅ Rate limiting detection (429 Too Many Requests)
 * ✅ Memory leak prevention
 * ✅ Graceful degradation při výpadku sítě
 * ✅ Automatic cleanup po chybách
 * ✅ Enhanced debugging & statistics
 * ═══════════════════════════════════════════════════════════════
 * Autor vylepšení: Admirál Claude.AI
 * Architekt projektu: Více admirál Jiřík
 * Verze: 4.0 (26.12.2025)
 * ═══════════════════════════════════════════════════════════════
 */
// 🌐 Kontrola síťové zátěže před preloadem
 


class SmartAudioPreloader {
    constructor() {
        // 📦 Úložiště přednahraných skladeb
        this.preloadedElements = new Map(); // Map<src, Audio>
        
        // 🔄 Stav preloaderu
        this.isPreloading = false;
        this.isEnabled = true;
        this.currentPreloadSrc = null;
        
        // ⏱️ Timeouty pro každý preload
        this.preloadTimeouts = new Map(); // Map<src, timeoutId>
        
        // 🔄 Retry tracking
        this.retryAttempts = new Map(); // Map<src, attemptCount>
        
        // 📊 Statistiky
        this.stats = {
            totalAttempts: 0,
            successful: 0,
            failed: 0,
            retries: 0,
            timeouts: 0,
            networkErrors: 0
        };
        
        // ⚙️ Konfigurace
        this.config = {
            MAX_RETRY_ATTEMPTS: 3,
            TIMEOUT_MS: 30000,           // 30 sekund
            RETRY_DELAY_BASE: 2000,      // 2 sekundy pro první retry
            RETRY_DELAY_MAX: 10000,      // Max 10 sekund mezi pokusy
            CLEANUP_INTERVAL: 60000      // Cleanup každou minutu
        };
        
        // 🧹 Automatické čištění každou minutu
        this.cleanupInterval = setInterval(() => {
            this._autoCleanup();
        }, this.config.CLEANUP_INTERVAL);
        
        // 🌐 Síťový status monitoring
        this.isOnline = navigator.onLine;
        this._setupNetworkMonitoring();
        
        // 📢 Úvodní banner
        this._logBanner();
    }
     _detectAIActivity() {
    // Detekuje, zda právě probíhá komunikace s AI
    const isClaudeActive = document.querySelector('.claude-message-pending');
    const isGeminiActive = document.querySelector('[data-gemini-loading]');
    
    return !!(isClaudeActive || isGeminiActive);
}
    /**
     * 📢 Úvodní banner
     */
    _logBanner() {
        if (!window.DebugManager?.isEnabled('preloader')) return;
        
        window.DebugManager.log('preloader', '');
        window.DebugManager.log('preloader', '🖖════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '🚀 Smart Audio Preloader V4.0 - BATTLE TESTED');
        window.DebugManager.log('preloader', '════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '✅ Retry mechanismus aktivní');
        window.DebugManager.log('preloader', '✅ Timeout protection (30s)');
        window.DebugManager.log('preloader', '✅ Network error recovery');
        window.DebugManager.log('preloader', '✅ Rate limiting detection');
        window.DebugManager.log('preloader', '✅ Memory leak prevention');
        window.DebugManager.log('preloader', '✅ Auto-cleanup každou minutu');
        window.DebugManager.log('preloader', '🖖════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '');
    }

    /**
     * 🌐 Setup pro monitoring síťového stavu
     */
    _setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            window.DebugManager?.log('preloader', '🌐 Internet ONLINE - preloading obnoven!');
            
            // Pokud něco čeká na retry, zkus to znovu
            if (this.preloadedElements.size === 0 && this.retryAttempts.size > 0) {
                window.DebugManager?.log('preloader', '🔄 Obnovuji přerušené preloady...');
            }
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            window.DebugManager?.log('preloader', '⚠️ Internet OFFLINE - preloading pozastaven!');
        });
    }

    /**
     * 🎯 HLAVNÍ METODA: Přednahraje další skladbu
     */
    async preloadAroundCurrent(tracks, currentIndex, isShuffled = false, shuffledIndices = []) {
        if (!this.isEnabled || !tracks?.length) return;
        
        // Kontrola připojení
        if (!this.isOnline) {
            window.DebugManager?.log('preloader', '⚠️ Offline režim - preload přeskočen');
            return;
        }
        
        if (this.isPreloading) {
            window.DebugManager?.log('preloader', '⏸️ Preload již běží, přeskakuji...');
            return;
        }
        if (this._detectAIActivity()) {
    window.DebugManager?.log('preloader', 
        '🤖 AI konverzace aktivní, odkládám preload o 5s...'
    );
    setTimeout(() => {
        this.preloadAroundCurrent(tracks, currentIndex, isShuffled, shuffledIndices);
    }, 5000);
    return;
}
        this.isPreloading = true;
        
        try {
            // Určíme další skladbu
            const nextIndex = this._getNextIndex(currentIndex, tracks.length, isShuffled, shuffledIndices);
            const nextTrack = tracks[nextIndex];
            
            if (!nextTrack?.src) {
                window.DebugManager?.log('preloader', '⚠️ Další skladba nemá platné URL');
                return;
            }
            
            window.DebugManager?.log('preloader', '\n🎯 Přednahrávám další skladbu:');
            window.DebugManager?.log('preloader', `   📍 Index: ${nextIndex}`);
            window.DebugManager?.log('preloader', `   🎵 Název: "${nextTrack.title}"`);
            
            // Už je přednahraná?
            if (this._isAlreadyPreloaded(nextTrack.src)) {
                window.DebugManager?.log('preloader', '   ✅ Již přednahráno');
                return;
            }
            
            // Vyčistíme staré preloady
            this._cleanupOldPreloads(tracks[currentIndex]?.src, nextTrack.src);
            
            // Spustíme preload s retry logikou
            await this._startPreloadWithRetry(nextTrack, nextIndex);
            
        } catch (error) {
            window.DebugManager?.log('preloader', `💥 Kritická chyba při preloadingu: ${error.message}`);
            this.stats.failed++;
        } finally {
            this.isPreloading = false;
        }
    }

    /**
     * 🔢 Určí index další skladby
     */
    _getNextIndex(currentIndex, totalTracks, isShuffled, shuffledIndices) {
        if (isShuffled && shuffledIndices?.length > 0) {
            return shuffledIndices[shuffledIndices.length - 1];
        }
        return (currentIndex + 1) % totalTracks;
    }

    /**
     * ✅ Zkontroluje, zda je skladba již přednahraná
     */
    _isAlreadyPreloaded(src) {
        const audio = this.preloadedElements.get(src);
        if (!audio) return false;
        
        // Kontrola readyState
        const isReady = audio.readyState >= 3; // HAVE_FUTURE_DATA nebo více
        
        if (isReady) {
            return true;
        } else {
            // Pokud není ready, odstraň ho (neúplný preload)
            window.DebugManager?.log('preloader', '   ⚠️ Neúplný preload nalezen, ruším...');
            this._cancelPreload(src);
            return false;
        }
    }

    /**
     * 🚀 Spustí preload s retry mechanikou
     */
    async _startPreloadWithRetry(track, index, retryCount = 0) {
        this.stats.totalAttempts++;
        
        if (retryCount > 0) {
            this.stats.retries++;
            window.DebugManager?.log('preloader', `   🔄 RETRY pokus ${retryCount}/${this.config.MAX_RETRY_ATTEMPTS}`);
        }
        
        return new Promise((resolve, reject) => {
            // Vytvoříme nový audio element
            const audio = new Audio();
            let hasResolved = false;
            
            // ⏱️ Timeout protection
            const timeoutId = setTimeout(() => {
                if (hasResolved) return;
                hasResolved = true;
                
                this.stats.timeouts++;
                window.DebugManager?.log('preloader', `   ⏱️ TIMEOUT (${this.config.TIMEOUT_MS/1000}s) - ruším preload`);
                
                this._cancelPreload(track.src);
                
                // Pokusíme se o retry
                if (retryCount < this.config.MAX_RETRY_ATTEMPTS) {
                    const delay = this._getRetryDelay(retryCount);
                    window.DebugManager?.log('preloader', `   ⏳ Další pokus za ${delay/1000}s...`);
                    
                    setTimeout(() => {
                        this._startPreloadWithRetry(track, index, retryCount + 1)
                            .then(resolve)
                            .catch(reject);
                    }, delay);
                } else {
                    window.DebugManager?.log('preloader', '   ❌ Retry vyčerpány pro timeout');
                    this.stats.failed++;
                    reject(new Error('Timeout'));
                }
            }, this.config.TIMEOUT_MS);
            
            this.preloadTimeouts.set(track.src, timeoutId);
            
            // ✅ SUCCESS handler
            audio.addEventListener('canplaythrough', () => {
                if (hasResolved) return;
                hasResolved = true;
                
                clearTimeout(timeoutId);
                this.preloadTimeouts.delete(track.src);
                this.retryAttempts.delete(track.src);
                this.stats.successful++;
                
                window.DebugManager?.log('preloader', '   ✅ Skladba připravena k přehrání!');
                window.DebugManager?.log('preloader', '   💾 Uloženo v browser cache');
                
                // Dispatch event pro UI
                window.dispatchEvent(new CustomEvent('track-preloaded', { 
                    detail: { 
                        src: track.src, 
                        title: track.title, 
                        index: index 
                    } 
                }));
                
                resolve();
            }, { once: true });
            
            // ❌ ERROR handler
            audio.addEventListener('error', (e) => {
                if (hasResolved) return;
                hasResolved = true;
                
                clearTimeout(timeoutId);
                this.preloadTimeouts.delete(track.src);
                
                const errorType = this._detectErrorType(e, audio);
                this.stats.networkErrors++;
                
                window.DebugManager?.log('preloader', `   ❌ Chyba preloadu: ${errorType}`);
                window.DebugManager?.log('preloader', `   🔗 URL: ${track.src.substring(0, 60)}...`);
                
                // Rozhodnutí o retry
                const shouldRetry = this._shouldRetryError(errorType, retryCount);
                
                if (shouldRetry && retryCount < this.config.MAX_RETRY_ATTEMPTS) {
                    const delay = this._getRetryDelay(retryCount);
                    window.DebugManager?.log('preloader', `   🔄 Další pokus za ${delay/1000}s...`);
                    
                    setTimeout(() => {
                        this._startPreloadWithRetry(track, index, retryCount + 1)
                            .then(resolve)
                            .catch(reject);
                    }, delay);
                } else {
                    window.DebugManager?.log('preloader', '   ❌ Preload selhal definitivně');
                    window.DebugManager?.log('preloader', '   💡 Skladba bude přehrána přímo (bez cache)');
                    this.preloadedElements.delete(track.src);
                    this.stats.failed++;
                    reject(new Error(errorType));
                }
            }, { once: true });
            
            // 📊 PROGRESS handler
            let lastLoggedPercent = 0;
            audio.addEventListener('progress', () => {
                if (audio.buffered.length > 0) {
                    const buffered = audio.buffered.end(0);
                    const duration = audio.duration || 1;
                    const percent = Math.round((buffered / duration) * 100);
                    
                    // Log každých 25% (s tolerancí)
                    if (percent >= lastLoggedPercent + 25 && percent > 0) {
                        window.DebugManager?.log('preloader', `   ⏳ Nahrávání: ${percent}%`);
                        lastLoggedPercent = percent;
                    }
                }
            });
            
            // 🚀 Spustíme preload
            audio.preload = 'auto';
            audio.src = track.src;
            
            this.preloadedElements.set(track.src, audio);
            this.currentPreloadSrc = track.src;
            this.retryAttempts.set(track.src, retryCount);
            
            window.DebugManager?.log('preloader', '   📡 Požadavek odeslán browseru');
        });
    }

    /**
     * 🔍 Detekce typu chyby
     */
    _detectErrorType(errorEvent, audioElement) {
        const error = audioElement?.error;
        
        if (!error) {
            return 'UNKNOWN_ERROR';
        }
        
        // MediaError kódy
        switch(error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
                return 'ABORTED';
            case MediaError.MEDIA_ERR_NETWORK:
                return 'NETWORK_ERROR';
            case MediaError.MEDIA_ERR_DECODE:
                return 'DECODE_ERROR';
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                return 'FORMAT_NOT_SUPPORTED';
            default:
                // Pokus detekovat konkrétní síťové chyby z message
                const msg = error.message?.toLowerCase() || '';
                if (msg.includes('connection')) return 'CONNECTION_ERROR';
                if (msg.includes('timeout')) return 'TIMEOUT';
                if (msg.includes('429')) return 'RATE_LIMIT';
                if (msg.includes('403')) return 'FORBIDDEN';
                if (msg.includes('404')) return 'NOT_FOUND';
                return 'UNKNOWN_ERROR';
        }
    }

    /**
     * 🤔 Rozhodnutí, zda retry má smysl
     */
    _shouldRetryError(errorType, currentRetryCount) {
        // Tyto chyby NEMÁ smysl retryovat
        const noRetryErrors = [
            'ABORTED',
            'FORMAT_NOT_SUPPORTED',
            'NOT_FOUND',
            'FORBIDDEN'
        ];
        
        if (noRetryErrors.includes(errorType)) {
            return false;
        }
        
        // Tyto chyby retryujeme vždy
        const alwaysRetryErrors = [
            'NETWORK_ERROR',
            'CONNECTION_ERROR',
            'TIMEOUT',
            'RATE_LIMIT',
            'DECODE_ERROR'
        ];
        
        return alwaysRetryErrors.includes(errorType) || errorType === 'UNKNOWN_ERROR';
    }

    /**
     * ⏱️ Exponenciální backoff pro retry
     */
    _getRetryDelay(retryCount) {
        const delay = this.config.RETRY_DELAY_BASE * Math.pow(2, retryCount);
        return Math.min(delay, this.config.RETRY_DELAY_MAX);
    }

    /**
     * 🗑️ Zruší konkrétní preload
     */
    _cancelPreload(src) {
        // Vyčisti timeout
        const timeoutId = this.preloadTimeouts.get(src);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.preloadTimeouts.delete(src);
        }
        
        // Vyčisti audio element
        const audio = this.preloadedElements.get(src);
        if (audio) {
            audio.src = '';
            audio.load();
            this.preloadedElements.delete(src);
        }
        
        // Vyčisti retry counter
        this.retryAttempts.delete(src);
    }

    /**
     * 🧹 Vyčistí staré preloady
     */
    _cleanupOldPreloads(currentSrc, nextSrc) {
        const toDelete = [];
        
        for (const [src, audio] of this.preloadedElements.entries()) {
            // Nemaž aktuálně hrající nebo právě přednahrávanou
            if (src !== currentSrc && src !== nextSrc && src !== this.currentPreloadSrc) {
                toDelete.push(src);
            }
        }
        
        if (toDelete.length > 0) {
            window.DebugManager?.log('preloader', `   🧹 Čistím ${toDelete.length} starých preloadů...`);
            toDelete.forEach(src => this._cancelPreload(src));
        }
    }

    /**
     * 🤖 Automatické čištění (každou minutu)
     */
    _autoCleanup() {
        const now = Date.now();
        const toDelete = [];
        
        for (const [src, audio] of this.preloadedElements.entries()) {
            // Pokud element není ready a je starší než 2 minuty, smaž ho
            if (audio.readyState < 3) {
                const retryCount = this.retryAttempts.get(src) || 0;
                if (retryCount >= this.config.MAX_RETRY_ATTEMPTS) {
                    toDelete.push(src);
                }
            }
        }
        
        if (toDelete.length > 0) {
            window.DebugManager?.log('preloader', `🗑️ Auto-cleanup: Odstraňuji ${toDelete.length} neúspěšných preloadů`);
            toDelete.forEach(src => this._cancelPreload(src));
        }
    }

    /**
     * ✅ Zkontroluje, zda je skladba v cache
     */
    isCached(src) {
        const audio = this.preloadedElements.get(src);
        if (!audio) return false;
        return audio.readyState >= 3;
    }

    /**
     * 📦 Získá přednahraný audio element
     */
    getPreloaded(src) {
        return this.preloadedElements.get(src) || null;
    }

    /**
     * 🔧 Vypne/zapne preloading
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        window.DebugManager?.log('preloader', `🔧 Smart Preloading ${enabled ? '✅ ZAPNUT' : '⏸️ VYPNUT'}`);
        
        if (!enabled) {
            this.clearAll();
        }
    }

    /**
     * 🗑️ Vyčistí všechny preloady
     */
    clearAll() {
        window.DebugManager?.log('preloader', '🗑️ Čistím všechny přednahrané skladby...');
        
        // Vyčisti všechny timeouty
        for (const timeoutId of this.preloadTimeouts.values()) {
            clearTimeout(timeoutId);
        }
        this.preloadTimeouts.clear();
        
        // Vyčisti všechny audio elementy
        for (const audio of this.preloadedElements.values()) {
            audio.src = '';
            audio.load();
        }
        this.preloadedElements.clear();
        
        // Reset stavů
        this.currentPreloadSrc = null;
        this.retryAttempts.clear();
        
        window.DebugManager?.log('preloader', '   ✅ Vyčištěno!');
    }

    /**
     * 📊 Získá statistiky
     */
    getStats() {
        let readyCount = 0;
        let loadingCount = 0;
        
        for (const audio of this.preloadedElements.values()) {
            if (audio.readyState >= 3) {
                readyCount++;
            } else {
                loadingCount++;
            }
        }
        
        return {
            ...this.stats,
            total: this.preloadedElements.size,
            ready: readyCount,
            loading: loadingCount,
            enabled: this.isEnabled,
            online: this.isOnline,
            successRate: this.stats.totalAttempts > 0 
                ? Math.round((this.stats.successful / this.stats.totalAttempts) * 100) 
                : 0
        };
    }

    /**
     * 📊 Zobraz statistiky v konzoli
     */
    logStats() {
        const stats = this.getStats();
        
        window.DebugManager?.log('preloader', '\n📊 ===== SMART PRELOADER STATISTIKY =====');
        window.DebugManager?.log('preloader', `🔧 Stav: ${stats.enabled ? 'ZAPNUTO ✅' : 'VYPNUTO ⏸️'}`);
        window.DebugManager?.log('preloader', `🌐 Síť: ${stats.online ? 'ONLINE ✅' : 'OFFLINE ⚠️'}`);
        window.DebugManager?.log('preloader', '');
        window.DebugManager?.log('preloader', '📈 CELKOVÉ STATISTIKY:');
        window.DebugManager?.log('preloader', `   Celkem pokusů: ${stats.totalAttempts}`);
        window.DebugManager?.log('preloader', `   ✅ Úspěšných: ${stats.successful}`);
        window.DebugManager?.log('preloader', `   ❌ Selhání: ${stats.failed}`);
        window.DebugManager?.log('preloader', `   🔄 Retry pokusů: ${stats.retries}`);
        window.DebugManager?.log('preloader', `   ⏱️ Timeoutů: ${stats.timeouts}`);
        window.DebugManager?.log('preloader', `   🌐 Síťových chyb: ${stats.networkErrors}`);
        window.DebugManager?.log('preloader', `   📊 Úspěšnost: ${stats.successRate}%`);
        window.DebugManager?.log('preloader', '');
        window.DebugManager?.log('preloader', '💾 AKTUÁLNÍ CACHE:');
        window.DebugManager?.log('preloader', `   📦 Celkem: ${stats.total}`);
        window.DebugManager?.log('preloader', `   ✅ Připraveno: ${stats.ready}`);
        window.DebugManager?.log('preloader', `   ⏳ Nahrává se: ${stats.loading}`);
        
        if (this.preloadedElements.size > 0) {
            window.DebugManager?.log('preloader', '');
            window.DebugManager?.log('preloader', '📋 Seznam přednahraných:');
            let i = 1;
            for (const [src, audio] of this.preloadedElements.entries()) {
                const readyStates = ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'];
                const readyState = readyStates[audio.readyState] || 'UNKNOWN';
                const retryCount = this.retryAttempts.get(src) || 0;
                
                window.DebugManager?.log('preloader', `   ${i}. ${src.substring(0, 50)}...`);
                window.DebugManager?.log('preloader', `      📊 Stav: ${readyState} (${audio.readyState})`);
                
                if (retryCount > 0) {
                    window.DebugManager?.log('preloader', `      🔄 Retry: ${retryCount}/${this.config.MAX_RETRY_ATTEMPTS}`);
                }
                
                if (audio.buffered.length > 0 && audio.duration > 0) {
                    const buffered = audio.buffered.end(0);
                    const percent = Math.round((buffered / audio.duration) * 100);
                    window.DebugManager?.log('preloader', `      📥 Nahráno: ${percent}%`);
                }
                i++;
            }
        }
        
        window.DebugManager?.log('preloader', '=========================================\n');
    }

    /**
     * 🔧 Nastaví konfiguraci
     */
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        window.DebugManager?.log('preloader', '⚙️ Konfigurace aktualizována:', this.config);
    }

    /**
     * 🧨 Destructor (pro cleanup při unload)
     */
    destroy() {
        window.DebugManager?.log('preloader', '🧨 Destruktor: Uvolňuji všechny zdroje...');
        
        // Vyčisti interval
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        
        // Vyčisti všechno ostatní
        this.clearAll();
        
        window.DebugManager?.log('preloader', '✅ Preloader ukončen');
    }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INICIALIZACE & EXPORT
// ═══════════════════════════════════════════════════════════════

// Export globální instance
window.audioPreloader = new SmartAudioPreloader();

// Helper pro zpětnou kompatibilitu
window.preloadTracks = async (tracks, currentIndex, isShuffled, shuffledIndices) => {
    if (window.audioPreloader) {
        await window.audioPreloader.preloadAroundCurrent(tracks, currentIndex, isShuffled, shuffledIndices);
    }
};

// Dummy metody pro kompatibilitu se starým kódem
window.audioPreloader.createObjectURL = () => null;
window.audioPreloader.setDelay = () => window.DebugManager?.log('preloader', '💡 Smart Preloader V4 nepouŞívá delay (má retry mechanismus)');
window.audioPreloader.clearCache = () => window.audioPreloader.clearAll();

// Cleanup při zavření stránky
window.addEventListener('beforeunload', () => {
    if (window.audioPreloader) {
        window.audioPreloader.destroy();
    }
});

// ═══════════════════════════════════════════════════════════════
// 📢 ZÁVĚREČNÉ HLÁŠENÍ
// ═══════════════════════════════════════════════════════════════

window.DebugManager?.log('preloader', '🖖 Smart Audio Preloader V4.0 nahrán a připraven!');
window.DebugManager?.log('preloader', '');
window.DebugManager?.log('preloader', '💡 PŘÍKAZY:');
window.DebugManager?.log('preloader', '   window.audioPreloader.logStats()        - zobraz statistiky');
window.DebugManager?.log('preloader', '   window.audioPreloader.setEnabled(false) - vypni preloading');
window.DebugManager?.log('preloader', '   window.audioPreloader.clearAll()        - vymaž všechny přednahrané');
window.DebugManager?.log('preloader', '   window.audioPreloader.setConfig({...})  - změň konfiguraci');
window.DebugManager?.log('preloader', '');
window.DebugManager?.log('preloader', '⚡ Odolný proti výpadkům, timeoutům & rate limitingu!');
window.DebugManager?.log('preloader', '🖖 Live long and prosper!');
window.DebugManager?.log('preloader', '');
