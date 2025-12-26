/**
 * 🖖 STAR TREK AUDIO SMART PRELOADER V4.1 🚀
 * ═══════════════════════════════════════════════════════════════
 * 💪 NETWORK-AWARE EDITION - Inteligentní přizpůsobení síti!
 * ═══════════════════════════════════════════════════════════════
 * ✅ Retry mechanismus s exponenciálním backoffem
 * ✅ Timeout protection (30s limit)
 * ✅ Network error detection (ERR_CONNECTION_RESET, atd.)
 * ✅ Rate limiting detection (429 Too Many Requests)
 * ✅ Memory leak prevention
 * ✅ Graceful degradation při výpadku sítě
 * ✅ Automatic cleanup po chybách
 * ✅ Enhanced debugging & statistics
 * 🆕 Detekce síťové zátěže (odkládá preload při přetížení)
 * 🆕 Detekce AI aktivity (odkládá preload při konverzaci s AI)
 * 🆕 Klávesová zkratka Ctrl+P pro toggle (+ event pro script.js)
 * ═══════════════════════════════════════════════════════════════
 * Autor vylepšení: Admirál Claude.AI
 * Architekt projektu: Více admirál Jiřík
 * Verze: 4.1 (27.12.2025)
 * ═══════════════════════════════════════════════════════════════
 */

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
            networkErrors: 0,
            delayedByNetwork: 0,      // 🆕 Odloženo kvůli síti
            delayedByAI: 0            // 🆕 Odloženo kvůli AI
        };
        
        // ⚙️ Konfigurace
        this.config = {
            MAX_RETRY_ATTEMPTS: 3,
            TIMEOUT_MS: 30000,           // 30 sekund
            RETRY_DELAY_BASE: 2000,      // 2 sekundy pro první retry
            RETRY_DELAY_MAX: 10000,      // Max 10 sekund mezi pokusy
            CLEANUP_INTERVAL: 60000,     // Cleanup každou minutu
            NETWORK_LOAD_THRESHOLD: 10,  // 🆕 Max aktivních requestů
            AI_DELAY_MS: 5000            // 🆕 Delay při AI aktivitě
        };
        
        // 🧹 Automatické čištění každou minutu
        this.cleanupInterval = setInterval(() => {
            this._autoCleanup();
        }, this.config.CLEANUP_INTERVAL);
        
        // 🌐 Síťový status monitoring
        this.isOnline = navigator.onLine;
        this._setupNetworkMonitoring();
        
        // ⌨️ Klávesová zkratka Ctrl+P
        this._setupKeyboardShortcut();
        
        // 📢 Úvodní banner
        this._logBanner();
    }

    /**
     * 📢 Úvodní banner
     */
    _logBanner() {
        if (!window.DebugManager?.isEnabled('preloader')) return;
        
        window.DebugManager.log('preloader', '');
        window.DebugManager.log('preloader', '🖖════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '🚀 Smart Audio Preloader V4.1 - NETWORK-AWARE');
        window.DebugManager.log('preloader', '════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '✅ Retry mechanismus aktivní');
        window.DebugManager.log('preloader', '✅ Timeout protection (30s)');
        window.DebugManager.log('preloader', '✅ Network error recovery');
        window.DebugManager.log('preloader', '✅ Rate limiting detection');
        window.DebugManager.log('preloader', '✅ Memory leak prevention');
        window.DebugManager.log('preloader', '✅ Auto-cleanup každou minutu');
        window.DebugManager.log('preloader', '🆕 Detekce síťové zátěže');
        window.DebugManager.log('preloader', '🆕 Detekce AI konverzace (Claude/Gemini)');
        window.DebugManager.log('preloader', '🆕 Klávesová zkratka: Ctrl+P (toggle)');
        window.DebugManager.log('preloader', '🖖════════════════════════════════════════════════');
        window.DebugManager.log('preloader', '');
    }

    /**
     * ⌨️ Setup klávesové zkratky Ctrl+P
     */
    _setupKeyboardShortcut() {
        // Event listener jen pro zachycení, skutečnou logiku si přidáš do script.js
        window.addEventListener('preloader-toggle-request', () => {
            this.toggle();
        });
        
        window.DebugManager?.log('preloader', '⌨️  Zkratka Ctrl+P připravena (čeká na script.js integration)');
    }

    /**
     * 🔄 Toggle preloaderu (pro klávesovou zkratku)
     */
    toggle() {
        this.setEnabled(!this.isEnabled);
        
        // Dispatch event pro notifikaci (pokud chceš zobrazit hlášku)
        window.dispatchEvent(new CustomEvent('preloader-toggled', {
            detail: { enabled: this.isEnabled }
        }));
        
        window.DebugManager?.log('preloader', 
            `🔄 Preloader ${this.isEnabled ? '✅ ZAPNUT' : '⏸️ VYPNUT'} (zkratkou)`
        );
    }

    /**
     * 🌐 Setup pro monitoring síťového stavu
     */
    _setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            window.DebugManager?.log('preloader', '🌐 Internet ONLINE - preloading obnoven!');
            
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
     * 🌐 Kontrola síťové zátěže před preloadem
     */
    _checkNetworkLoad() {
        try {
            // Získáme všechny resource requesty
            const activeRequests = performance.getEntriesByType('resource')
                .filter(r => r.duration === 0); // Běžící requesty (duration 0 = ještě neskončily)
            
            if (activeRequests.length > this.config.NETWORK_LOAD_THRESHOLD) {
                window.DebugManager?.log('preloader', 
                    `⚠️ Vysoká síťová zátěž (${activeRequests.length} requestů), odkládám preload...`
                );
                this.stats.delayedByNetwork++;
                return false;
            }
            
            return true;
        } catch (error) {
            // Fallback: pokud performance API nefunguje, povol preload
            window.DebugManager?.log('preloader', 
                '⚠️ Performance API nedostupné, pokračuji bez kontroly zátěže'
            );
            return true;
        }
    }

    /**
     * 🤖 Detekce AI aktivity (Claude.ai / Gemini.ai)
     */
    _detectAIActivity() {
        try {
            // Detekce Claude.ai aktivity
            const isClaudeActive = !!(
                document.querySelector('.claude-message-pending') ||
                document.querySelector('[data-test-id="loading-message"]') ||
                document.querySelector('.animate-spin') // Loading spinner
            );
            
            // Detekce Gemini.ai aktivity
            const isGeminiActive = !!(
                document.querySelector('[data-gemini-loading]') ||
                document.querySelector('.gemini-loading') ||
                document.querySelector('[aria-label*="loading"]')
            );
            
            return isClaudeActive || isGeminiActive;
        } catch (error) {
            // Fallback: pokud selektory nefungují, předpokládej žádnou AI aktivitu
            return false;
        }
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
        
        // 🆕 KONTROLA SÍŤOVÉ ZÁTĚŽE
        if (!this._checkNetworkLoad()) {
            // Zkusíme to znovu za 3 sekundy
            setTimeout(() => {
                this.preloadAroundCurrent(tracks, currentIndex, isShuffled, shuffledIndices);
            }, 3000);
            return;
        }
        
        // 🆕 KONTROLA AI AKTIVITY
        if (this._detectAIActivity()) {
            window.DebugManager?.log('preloader', 
                '🤖 AI konverzace aktivní, odkládám preload o 5s...'
            );
            this.stats.delayedByAI++;
            
            setTimeout(() => {
                this.preloadAroundCurrent(tracks, currentIndex, isShuffled, shuffledIndices);
            }, this.config.AI_DELAY_MS);
            return;
        }
        
        if (this.isPreloading) {
            window.DebugManager?.log('preloader', '⏸️ Preload již běží, přeskakuji...');
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
        
        const isReady = audio.readyState >= 3;
        
        if (isReady) {
            return true;
        } else {
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
            const audio = new Audio();
            let hasResolved = false;
            
            // ⏱️ Timeout protection
            const timeoutId = setTimeout(() => {
                if (hasResolved) return;
                hasResolved = true;
                
                this.stats.timeouts++;
                window.DebugManager?.log('preloader', `   ⏱️ TIMEOUT (${this.config.TIMEOUT_MS/1000}s) - ruším preload`);
                
                this._cancelPreload(track.src);
                
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
        
        if (!error) return 'UNKNOWN_ERROR';
        
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
        const noRetryErrors = [
            'ABORTED',
            'FORMAT_NOT_SUPPORTED',
            'NOT_FOUND',
            'FORBIDDEN'
        ];
        
        if (noRetryErrors.includes(errorType)) return false;
        
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
        const timeoutId = this.preloadTimeouts.get(src);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.preloadTimeouts.delete(src);
        }
        
        const audio = this.preloadedElements.get(src);
        if (audio) {
            audio.src = '';
            audio.load();
            this.preloadedElements.delete(src);
        }
        
        this.retryAttempts.delete(src);
    }

    /**
     * 🧹 Vyčistí staré preloady
     */
    _cleanupOldPreloads(currentSrc, nextSrc) {
        const toDelete = [];
        
        for (const [src, audio] of this.preloadedElements.entries()) {
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
        const toDelete = [];
        
        for (const [src, audio] of this.preloadedElements.entries()) {
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
        
        for (const timeoutId of this.preloadTimeouts.values()) {
            clearTimeout(timeoutId);
        }
        this.preloadTimeouts.clear();
        
        for (const audio of this.preloadedElements.values()) {
            audio.src = '';
            audio.load();
        }
        this.preloadedElements.clear();
        
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
        window.DebugManager?.log('preloader', `   🎯 Celkem pokusů: ${stats.totalAttempts}`);
        window.DebugManager?.log('preloader', `   ✅ Úspěšných: ${stats.successful}`);
        window.DebugManager?.log('preloader', `   ❌ Selhání: ${stats.failed}`);
        window.DebugManager?.log('preloader', `   🔄 Retry pokusů: ${stats.retries}`);
        window.DebugManager?.log('preloader', `   ⏱️ Timeoutů: ${stats.timeouts}`);
        window.DebugManager?.log('preloader', `   🌐 Síťových chyb: ${stats.networkErrors}`);
        window.DebugManager?.log('preloader', `   📊 Úspěšnost: ${stats.successRate}%`);
        window.DebugManager?.log('preloader', `   ⚠️ Odloženo (síť): ${stats.delayedByNetwork}`);
        window.DebugManager?.log('preloader', `   🤖 Odloženo (AI): ${stats.delayedByAI}`);
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
                
                window.DebugManager?.log('preloader', `   ${i// ═══════════════════════════════════════════════════════════════
// 🖖 PRELOADER V4.1 - CHYBĚJÍCÍ KONCOVKA
// ═══════════════════════════════════════════════════════════════
// ⚠️ INSTRUKCE: Toto NAVAZUJE na řádek:
//    window.DebugManager?.log('preloader', `   ${i
// 
// Zkopíruj toto a vlož HNED ZA ten řádek!
// ═══════════════════════════════════════════════════════════════

                }. ${src.substring(0, 50)}...`);
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
        
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        
        this.clearAll();
        
        window.DebugManager?.log('preloader', '✅ Preloader ukončen');
    }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INICIALIZACE & EXPORT
// ═══════════════════════════════════════════════════════════════

window.audioPreloader = new SmartAudioPreloader();

window.preloadTracks = async (tracks, currentIndex, isShuffled, shuffledIndices) => {
    if (window.audioPreloader) {
        await window.audioPreloader.preloadAroundCurrent(tracks, currentIndex, isShuffled, shuffledIndices);
    }
};

// Dummy metody pro kompatibilitu se starým kódem
window.audioPreloader.createObjectURL = () => null;
window.audioPreloader.setDelay = () => window.DebugManager?.log('preloader', '💡 Smart Preloader V4.1 nepouŞívá delay (má retry mechanismus)');
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

window.DebugManager?.log('preloader', '🖖 Smart Audio Preloader V4.1 nahrán a připraven!');
window.DebugManager?.log('preloader', '');
window.DebugManager?.log('preloader', '💡 PŘÍKAZY:');
window.DebugManager?.log('preloader', '   window.audioPreloader.logStats()        - zobraz statistiky');
window.DebugManager?.log('preloader', '   window.audioPreloader.setEnabled(false) - vypni preloading');
window.DebugManager?.log('preloader', '   window.audioPreloader.clearAll()        - vymaž všechny přednahrané');
window.DebugManager?.log('preloader', '   window.audioPreloader.setConfig({...})  - změň konfiguraci');
window.DebugManager?.log('preloader', '   window.audioPreloader.toggle()          - přepni zapnuto/vypnuto');
window.DebugManager?.log('preloader', '');
window.DebugManager?.log('preloader', '⌨️  KLÁVESOVÁ ZKRATKA:');
window.DebugManager?.log('preloader', '   Ctrl+P - toggle preloaderu (po integraci do script.js)');
window.DebugManager?.log('preloader', '');
window.DebugManager?.log('preloader', '⚡ Inteligentní přizpůsobení síti & AI aktivitě!');
window.DebugManager?.log('preloader', '🖖 Live long and prosper!');
window.DebugManager?.log('preloader', '');




// ═══════════════════════════════════════════════════════════════
// 🖖 KONEC SOUBORU prednacitani-pisnicek.js
// ═══════════════════════════════════════════════════════════════
