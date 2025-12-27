/**
 * 🖖 STAR TREK AUDIO SMART PRELOADER V5.0 🚀
 * ═══════════════════════════════════════════════════════════════
 * 💪 CONFLICT-FREE EDITION - Neblokuje hlavní audio requesty!
 * ═══════════════════════════════════════════════════════════════
 * ✅ Čeká 15 sekund před spuštěním
 * ✅ Detekuje kolize s hlavním načítáním
 * ✅ Okamžitě se zastaví při přepnutí skladby
 * ✅ Monitoruje AI aktivitu (Claude, Gemini)
 * ✅ Event-driven komunikace se script.js
 * ✅ Retry mechanismus s exponenciálním backoffem
 * ✅ Automatické čištění paměti
 * ✅ Graceful degradation při výpadku sítě
 * ═══════════════════════════════════════════════════════════════
 * Autor: Admirál Claude.AI
 * Architekt projektu: Více admirál Jiřík
 * Verze: 5.0 (27.12.2025)
 * ═══════════════════════════════════════════════════════════════
 */

class SmartAudioPreloaderV5 {
    constructor() {
        // 📦 Cache přednahraných skladeb
        this.cache = new Map(); // Map<src, Audio>
        
        // 🔄 Stav preloaderu
        this.state = 'STANDBY'; // STANDBY | WAITING | ACTIVE | PAUSED | STOPPED
        this.isEnabled = true;
        
        // ⏱️ Timeouty a intervaly
        this.waitTimeout = null;
        this.preloadTimeout = null;
        this.cleanupInterval = null;
        
        // 🔄 Retry tracking
        this.retryAttempts = new Map(); // Map<src, attemptCount>
        
        // 📊 Statistiky
        this.stats = {
            totalAttempts: 0,
            successful: 0,
            failed: 0,
            blocked: 0,
            interrupted: 0,
            retries: 0
        };
        
        // ⚙️ Konfigurace
        this.config = {
            WAIT_BEFORE_PRELOAD: 15000,  // 15 sekund čekání
            MAX_RETRY_ATTEMPTS: 3,
            TIMEOUT_MS: 30000,
            RETRY_DELAY_BASE: 2000,
            RETRY_DELAY_MAX: 10000,
            CLEANUP_INTERVAL: 60000
        };
        
        // 🌐 Síťový status
        this.isOnline = navigator.onLine;
        
        // 🎯 Aktuálně přednahrávaná skladba
        this.currentPreloadSrc = null;
        
        // 🚀 Inicializace
        this._init();
    }

    /**
     * 🚀 Inicializace preloaderu
     */
    _init() {
        this._setupNetworkMonitoring();
        this._setupEventListeners();
        this._startCleanupRoutine();
        this._logBanner();
    }

    /**
     * 📢 Úvodní banner
     */
    _logBanner() {
        if (!window.DebugManager?.isEnabled('preloader')) return;
        
        window.DebugManager.log('preloader', '');
        window.DebugManager.log('preloader', '🖖════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '🚀 Smart Audio Preloader V5.0 - CONFLICT FREE');
        window.DebugManager.log('preloader', '════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '✅ Čeká 15s před spuštěním');
        window.DebugManager.log('preloader', '✅ Detekuje kolize s hlavním načítáním');
        window.DebugManager.log('preloader', '✅ Okamžitě se zastaví při změně skladby');
        window.DebugManager.log('preloader', '✅ Monitoruje AI aktivitu');
        window.DebugManager.log('preloader', '✅ Event-driven komunikace');
        window.DebugManager.log('preloader', '🖖════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '');
    }

    /**
     * 🌐 Monitoring síťového stavu
     */
    _setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            window.DebugManager?.log('preloader', '🌐 Internet ONLINE');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.stopPreloading('Network offline');
            window.DebugManager?.log('preloader', '⚠️ Internet OFFLINE - preloading zastaveno');
        });
    }

    /**
     * 🎧 Event listenery pro komunikaci se script.js
     */
    _setupEventListeners() {
        // 🚨 KRITICKÁ UDÁLOST: Začíná se načítat aktuální skladba
        window.addEventListener('track-loading-start', () => {
            window.DebugManager?.log('preloader', '🚨 DETEKOVÁNO: Načítání aktuální skladby - ZASTAVUJI preload');
            this.stopPreloading('Main track loading');
        });
        
        // ✅ Aktuální skladba byla úspěšně načtena
        window.addEventListener('track-loaded-success', (e) => {
            window.DebugManager?.log('preloader', '✅ Aktuální skladba načtena - čekám 15s před preloadem');
        });
        
        // 🔄 Změna skladby (Play, Next, Prev)
        window.addEventListener('track-changed', (e) => {
            window.DebugManager?.log('preloader', '🔄 Změna skladby - RESETUJI preloader');
            this.stopPreloading('Track changed');
        });
        
        // ⏸️ Pauza
        window.addEventListener('player-paused', () => {
            window.DebugManager?.log('preloader', '⏸️ Pauza - POZASTAVUJI preload');
            this.pausePreloading();
        });
        
        // ▶️ Pokračování v přehrávání
        window.addEventListener('player-resumed', () => {
            window.DebugManager?.log('preloader', '▶️ Pokračování - OBNOVUJI preload');
            this.resumePreloading();
        });
    }

    /**
     * 🧹 Automatické čištění paměti
     */
    _startCleanupRoutine() {
        this.cleanupInterval = setInterval(() => {
            this._autoCleanup();
        }, this.config.CLEANUP_INTERVAL);
    }

    /**
     * 🎯 HLAVNÍ METODA: Požadavek na přednahrání
     */
    async preloadAroundCurrent(tracks, currentIndex, isShuffled = false, shuffledIndices = []) {
        // 🛡️ Základní kontroly
        if (!this.isEnabled) {
            window.DebugManager?.log('preloader', '⏸️ Preloader je vypnutý');
            return;
        }

        if (!this.isOnline) {
            window.DebugManager?.log('preloader', '⚠️ Offline režim - preload odložen');
            return;
        }

        if (!tracks?.length) {
            window.DebugManager?.log('preloader', '⚠️ Prázdný playlist');
            return;
        }

        // 🚨 KRITICKÁ KONTROLA: Běží načítání aktuální skladby?
        if (window.audioState?.isLoadingTrack === true) {
            window.DebugManager?.log('preloader', '🚨 BLOKOVÁNO: Právě se načítá aktuální skladba!');
            this.stats.blocked++;
            return;
        }

        // 🤖 Detekce AI aktivity
        if (this._detectAIActivity()) {
            window.DebugManager?.log('preloader', '🤖 AI konverzace aktivní - odklad preloadu');
            setTimeout(() => {
                this.preloadAroundCurrent(tracks, currentIndex, isShuffled, shuffledIndices);
            }, 5000);
            return;
        }

        // 🔄 Už běží preload?
        if (this.state === 'WAITING' || this.state === 'ACTIVE') {
            window.DebugManager?.log('preloader', '⏸️ Preload již běží, přeskakuji...');
            return;
        }

        // 🚀 Spustíme proces
        this._startPreloadProcess(tracks, currentIndex, isShuffled, shuffledIndices);
    }

    /**
     * 🚀 Spuštění procesu přednahrávání
     */
    async _startPreloadProcess(tracks, currentIndex, isShuffled, shuffledIndices) {
        this.state = 'WAITING';
        
        window.DebugManager?.log('preloader', '');
        window.DebugManager?.log('preloader', '🎯 ═══════════════════════════════════════');
        window.DebugManager?.log('preloader', '🎯 ZAHAJUJI PRELOAD PROCES');
        window.DebugManager?.log('preloader', '🎯 ═══════════════════════════════════════');
        window.DebugManager?.log('preloader', `⏰ Čekám 15 sekund před spuštěním...`);

        try {
            // ⏰ Čekání 15 sekund (lze přerušit)
            await this._waitSafely(this.config.WAIT_BEFORE_PRELOAD);

            // 🔍 ZNOVU zkontroluj před preloadem
            if (window.audioState?.isLoadingTrack === true) {
                throw new Error('Main track started loading during wait');
            }

            if (this.state === 'STOPPED') {
                throw new Error('Preload was stopped during wait');
            }

            // ✅ Vše OK, můžeme přednahrávat
            this.state = 'ACTIVE';
            window.DebugManager?.log('preloader', '✅ Čekání dokončeno - SPOUŠTÍM preload');

            // 🎯 Určíme další skladbu
            const nextIndex = this._getNextIndex(currentIndex, tracks.length, isShuffled, shuffledIndices);
            const nextTrack = tracks[nextIndex];

            if (!nextTrack?.src) {
                throw new Error('Next track has no valid source');
            }

            window.DebugManager?.log('preloader', `🎵 Přednahrávám: "${nextTrack.title}"`);
            window.DebugManager?.log('preloader', `📍 Index: ${nextIndex}`);

            // 🔍 Už je v cache?
            if (this._isAlreadyPreloaded(nextTrack.src)) {
                window.DebugManager?.log('preloader', '✅ Již v cache');
                this.state = 'STANDBY';
                return;
            }

            // 🧹 Vyčistíme staré preloady
            this._cleanupOldPreloads(tracks[currentIndex]?.src, nextTrack.src);

            // 🚀 Spustíme preload s retry
            await this._startPreloadWithRetry(nextTrack, nextIndex);

            this.state = 'STANDBY';
            window.DebugManager?.log('preloader', '🎯 Preload dokončen - návrat do STANDBY');

        } catch (error) {
            this.state = 'STANDBY';
            
            if (error.message === 'INTERRUPTED') {
                window.DebugManager?.log('preloader', '⚠️ Preload PŘERUŠEN (byla spuštěna nová skladba)');
                this.stats.interrupted++;
            } else {
                window.DebugManager?.log('preloader', `❌ Preload selhal: ${error.message}`);
                this.stats.failed++;
            }
        }
    }

    /**
     * ⏰ Bezpečné čekání s možností přerušení
     */
    _waitSafely(ms) {
        return new Promise((resolve, reject) => {
            this.waitTimeout = setTimeout(() => {
                this.waitTimeout = null;
                resolve();
            }, ms);

            // Listener pro přerušení
            const interruptListener = () => {
                if (this.waitTimeout) {
                    clearTimeout(this.waitTimeout);
                    this.waitTimeout = null;
                }
                reject(new Error('INTERRUPTED'));
            };

            window.addEventListener('track-loading-start', interruptListener, { once: true });
            window.addEventListener('track-changed', interruptListener, { once: true });
        });
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
        const audio = this.cache.get(src);
        if (!audio) return false;
        
        const isReady = audio.readyState >= 3;
        
        if (!isReady) {
            this._cancelPreload(src);
            return false;
        }
        
        return true;
    }

    /**
     * 🚀 Preload s retry mechanikou
     */
    async _startPreloadWithRetry(track, index, retryCount = 0) {
        this.stats.totalAttempts++;
        
        if (retryCount > 0) {
            this.stats.retries++;
            window.DebugManager?.log('preloader', `🔄 RETRY pokus ${retryCount}/${this.config.MAX_RETRY_ATTEMPTS}`);
        }

        return new Promise((resolve, reject) => {
            const audio = new Audio();
            let hasResolved = false;

            // ⏱️ Timeout protection
            this.preloadTimeout = setTimeout(() => {
                if (hasResolved) return;
                hasResolved = true;

                window.DebugManager?.log('preloader', `⏱️ TIMEOUT (${this.config.TIMEOUT_MS/1000}s)`);
                this._cancelPreload(track.src);

                if (retryCount < this.config.MAX_RETRY_ATTEMPTS) {
                    const delay = this._getRetryDelay(retryCount);
                    setTimeout(() => {
                        this._startPreloadWithRetry(track, index, retryCount + 1)
                            .then(resolve)
                            .catch(reject);
                    }, delay);
                } else {
                    this.stats.failed++;
                    reject(new Error('Timeout'));
                }
            }, this.config.TIMEOUT_MS);

            // ✅ SUCCESS
            audio.addEventListener('canplaythrough', () => {
                if (hasResolved) return;
                hasResolved = true;

                clearTimeout(this.preloadTimeout);
                this.preloadTimeout = null;
                this.retryAttempts.delete(track.src);
                this.stats.successful++;

                window.DebugManager?.log('preloader', '✅ Skladba připravena!');
                window.DebugManager?.log('preloader', '💾 Uloženo v browser cache');

                window.dispatchEvent(new CustomEvent('track-preloaded', {
                    detail: { src: track.src, title: track.title, index: index }
                }));

                resolve();
            }, { once: true });

            // ❌ ERROR
            audio.addEventListener('error', (e) => {
                if (hasResolved) return;
                hasResolved = true;

                clearTimeout(this.preloadTimeout);
                this.preloadTimeout = null;

                const errorType = this._detectErrorType(e, audio);
                window.DebugManager?.log('preloader', `❌ Chyba: ${errorType}`);

                const shouldRetry = this._shouldRetryError(errorType, retryCount);

                if (shouldRetry && retryCount < this.config.MAX_RETRY_ATTEMPTS) {
                    const delay = this._getRetryDelay(retryCount);
                    setTimeout(() => {
                        this._startPreloadWithRetry(track, index, retryCount + 1)
                            .then(resolve)
                            .catch(reject);
                    }, delay);
                } else {
                    this.cache.delete(track.src);
                    this.stats.failed++;
                    reject(new Error(errorType));
                }
            }, { once: true });

            // 🚀 Spustíme
            audio.preload = 'auto';
            audio.src = track.src;

            this.cache.set(track.src, audio);
            this.currentPreloadSrc = track.src;
            this.retryAttempts.set(track.src, retryCount);
        });
    }

    /**
     * 🤖 Detekce AI aktivity
     */
    _detectAIActivity() {
        const isClaudeActive = document.querySelector('.claude-message-pending');
        const isGeminiActive = document.querySelector('[data-gemini-loading]');
        return !!(isClaudeActive || isGeminiActive);
    }

    /**
     * 🔍 Detekce typu chyby
     */
    _detectErrorType(errorEvent, audioElement) {
        const error = audioElement?.error;
        if (!error) return 'UNKNOWN_ERROR';

        switch(error.code) {
            case MediaError.MEDIA_ERR_ABORTED: return 'ABORTED';
            case MediaError.MEDIA_ERR_NETWORK: return 'NETWORK_ERROR';
            case MediaError.MEDIA_ERR_DECODE: return 'DECODE_ERROR';
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: return 'FORMAT_NOT_SUPPORTED';
            default: return 'UNKNOWN_ERROR';
        }
    }

    /**
     * 🤔 Rozhodnutí o retry
     */
    _shouldRetryError(errorType, currentRetryCount) {
        const noRetryErrors = ['ABORTED', 'FORMAT_NOT_SUPPORTED', 'NOT_FOUND', 'FORBIDDEN'];
        if (noRetryErrors.includes(errorType)) return false;

        const alwaysRetryErrors = ['NETWORK_ERROR', 'CONNECTION_ERROR', 'TIMEOUT', 'DECODE_ERROR'];
        return alwaysRetryErrors.includes(errorType) || errorType === 'UNKNOWN_ERROR';
    }

    /**
     * ⏱️ Exponenciální backoff
     */
    _getRetryDelay(retryCount) {
        const delay = this.config.RETRY_DELAY_BASE * Math.pow(2, retryCount);
        return Math.min(delay, this.config.RETRY_DELAY_MAX);
    }

    /**
     * 🗑️ Zruší konkrétní preload
     */
    _cancelPreload(src) {
        const audio = this.cache.get(src);
        if (audio) {
            audio.src = '';
            audio.load();
            this.cache.delete(src);
        }
        this.retryAttempts.delete(src);
    }

    /**
     * 🧹 Vyčistí staré preloady
     */
    _cleanupOldPreloads(currentSrc, nextSrc) {
        const toDelete = [];
        
        for (const [src] of this.cache.entries()) {
            if (src !== currentSrc && src !== nextSrc && src !== this.currentPreloadSrc) {
                toDelete.push(src);
            }
        }
        
        if (toDelete.length > 0) {
            window.DebugManager?.log('preloader', `🧹 Čistím ${toDelete.length} starých preloadů`);
            toDelete.forEach(src => this._cancelPreload(src));
        }
    }

    /**
     * 🤖 Automatické čištění
     */
    _autoCleanup() {
        const toDelete = [];
        
        for (const [src, audio] of this.cache.entries()) {
            if (audio.readyState < 3) {
                const retryCount = this.retryAttempts.get(src) || 0;
                if (retryCount >= this.config.MAX_RETRY_ATTEMPTS) {
                    toDelete.push(src);
                }
            }
        }
        
        if (toDelete.length > 0) {
            window.DebugManager?.log('preloader', `🗑️ Auto-cleanup: ${toDelete.length} neúspěšných`);
            toDelete.forEach(src => this._cancelPreload(src));
        }
    }

    /**
     * 🛑 Zastavení preloadingu
     */
    stopPreloading(reason = 'Manual stop') {
        window.DebugManager?.log('preloader', `🛑 STOP: ${reason}`);
        
        // Vyčisti timeouty
        if (this.waitTimeout) {
            clearTimeout(this.waitTimeout);
            this.waitTimeout = null;
        }
        
        if (this.preloadTimeout) {
            clearTimeout(this.preloadTimeout);
            this.preloadTimeout = null;
        }

        this.state = 'STOPPED';
        
        // Pošli událost o zastavení
        window.dispatchEvent(new CustomEvent('preloader-stopped', { detail: { reason } }));
        
        // Za 1 sekundu se vrať do STANDBY (aby se mohl znovu spustit)
        setTimeout(() => {
            if (this.state === 'STOPPED') {
                this.state = 'STANDBY';
                window.DebugManager?.log('preloader', '🔄 Návrat do STANDBY režimu');
            }
        }, 1000);
    }

    /**
     * ⏸️ Pozastavení
     */
    pausePreloading() {
        if (this.state === 'ACTIVE') {
            this.state = 'PAUSED';
            window.DebugManager?.log('preloader', '⏸️ Preload POZASTAVEN');
        }
    }

    /**
     * ▶️ Pokračování
     */
    resumePreloading() {
        if (this.state === 'PAUSED') {
            this.state = 'ACTIVE';
            window.DebugManager?.log('preloader', '▶️ Preload OBNOVEN');
        }
    }

    /**
     * ✅ Je v cache?
     */
    isCached(src) {
        const audio = this.cache.get(src);
        return audio ? audio.readyState >= 3 : false;
    }

    /**
     * 📦 Získej z cache
     */
    getPreloaded(src) {
        return this.cache.get(src) || null;
    }

    /**
     * 🔧 Zapni/vypni
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        window.DebugManager?.log('preloader', `🔧 Preloader ${enabled ? '✅ ZAPNUT' : '⏸️ VYPNUT'}`);
        
        if (!enabled) {
            this.clearAll();
        }
    }

    /**
     * 🗑️ Vyčisti vše
     */
    clearAll() {
        window.DebugManager?.log('preloader', '🗑️ Čistím všechny přednahrané skladby');
        
        if (this.waitTimeout) clearTimeout(this.waitTimeout);
        if (this.preloadTimeout) clearTimeout(this.preloadTimeout);
        
        for (const audio of this.cache.values()) {
            audio.src = '';
            audio.load();
        }
        
        this.cache.clear();
        this.currentPreloadSrc = null;
        this.retryAttempts.clear();
        this.state = 'STANDBY';
        
        window.DebugManager?.log('preloader', '✅ Vyčištěno!');
    }

    /**
     * 📊 Statistiky
     */
    getStats() {
        let readyCount = 0;
        let loadingCount = 0;
        
        for (const audio of this.cache.values()) {
            if (audio.readyState >= 3) readyCount++;
            else loadingCount++;
        }
        
        return {
            ...this.stats,
            total: this.cache.size,
            ready: readyCount,
            loading: loadingCount,
            state: this.state,
            enabled: this.isEnabled,
            online: this.isOnline,
            successRate: this.stats.totalAttempts > 0 
                ? Math.round((this.stats.successful / this.stats.totalAttempts) * 100) 
                : 0
        };
    }

    /**
     * 📊 Zobraz statistiky
     */
    logStats() {
        const stats = this.getStats();
        
        window.DebugManager?.log('preloader', '\n📊 ═══════ PRELOADER V5 STATISTIKY ═══════');
        window.DebugManager?.log('preloader', `🔧 Stav: ${stats.state} | ${stats.enabled ? 'ZAPNUTO ✅' : 'VYPNUTO ⏸️'}`);
        window.DebugManager?.log('preloader', `🌐 Síť: ${stats.online ? 'ONLINE ✅' : 'OFFLINE ⚠️'}`);
        window.DebugManager?.log('preloader', '');
        window.DebugManager?.log('preloader', '📈 VÝSLEDKY:');
        window.DebugManager?.log('preloader', `   Celkem pokusů: ${stats.totalAttempts}`);
        window.DebugManager?.log('preloader', `   ✅ Úspěšných: ${stats.successful}`);
        window.DebugManager?.log('preloader', `   ❌ Selhání: ${stats.failed}`);
        window.DebugManager?.log('preloader', `   🚫 Blokováno: ${stats.blocked}`);
        window.DebugManager?.log('preloader', `   ⚠️ Přerušeno: ${stats.interrupted}`);
        window.DebugManager?.log('preloader', `   🔄 Retry: ${stats.retries}`);
        window.DebugManager?.log('preloader', `   📊 Úspěšnost: ${stats.successRate}%`);
        window.DebugManager?.log('preloader', '');
        window.DebugManager?.log('preloader', '💾 CACHE:');
        window.DebugManager?.log('preloader', `   📦 Celkem: ${stats.total}`);
        window.DebugManager?.log('preloader', `   ✅ Připraveno: ${stats.ready}`);
        window.DebugManager?.log('preloader', `   ⏳ Načítá se: ${stats.loading}`);
        window.DebugManager?.log('preloader', '═════════════════════════════════════════\n');
    }

    /**
     * 🧨 Destructor
     */
    destroy() {
        window.DebugManager?.log('preloader', '🧨 Destruktor: Uvolňuji zdroje');
        
        if (this.cleanupInterval) clearInterval(this.cleanupInterval);
        this.clearAll();
        
        window.DebugManager?.log('preloader', '✅ Preloader V5 ukončen');
    }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INICIALIZACE & EXPORT
// ═══════════════════════════════════════════════════════════════

window.audioPreloader = new SmartAudioPreloaderV5();

// Helper pro zpětnou kompatibilitu
window.preloadTracks = async (tracks, currentIndex, isShuffled, shuffledIndices) => {
    if (window.audioPreloader) {
        await window.audioPreloader.preloadAroundCurrent(tracks, currentIndex, isShuffled, shuffledIndices);
    }
};

// Dummy metody pro kompatibilitu
window.audioPreloader.createObjectURL = () => null;
window.audioPreloader.setDelay = () => {};
window.audioPreloader.clearCache = () => window.audioPreloader.clearAll();

// Cleanup při zavření
window.addEventListener('beforeunload', () => {
    window.audioPreloader?.destroy();
});

// ═══════════════════════════════════════════════════════════════
// 📢 ZÁVĚREČNÉ HLÁŠENÍ
// ═══════════════════════════════════════════════════════════════

window.DebugManager?.log('preloader', '🖖 Smart Audio Preloader V5.0 nahrán a připraven!');
window.DebugManager?.log('preloader', '');
window.DebugManager?.log('preloader', '💡 PŘÍKAZY:');
window.DebugManager?.log('preloader', '   window.audioPreloader.logStats()        - zobraz statistiky');
window.DebugManager?.log('preloader', '   window.audioPreloader.setEnabled(false) - vypni preloading');
window.DebugManager?.log('preloader', '   window.audioPreloader.clearAll()        - vymaž cache');
window.DebugManager?.log('preloader', '   window.audioPreloader.state             - aktuální stav');
window.DebugManager?.log('preloader', '');
window.DebugManager?.log('preloader', '⚡ Čeká 15s před spuštěním, neblokuje hlavní audio!');
window.DebugManager?.log('preloader', '🛡️ Event-driven komunikace se script.js!');
window.DebugManager?.log('preloader', '🖖 Live long and prosper!');
window.DebugManager?.log('preloader', '');
