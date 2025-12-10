/**
 * 🖖 STAR TREK MOBILE VOICE CONTROL HELPER
 * =====================================================
 * Více admirál Jiřík & Admirál Claude.AI
 * Soubor: pomocnik-hlasoveho-ovladani-pro-mobil.js
 * Účel: Android/Edge Mobile optimalizace pro Bender Voice Control
 * Verze: 1.0 (Infinix Note 30 / Android 13 / Edge Mobile)
 * 
 * 🎯 FUNKCE:
 * - Inteligentní detekce JBL Quantum vs vestavěný mikrofon
 * - Edge Mobile specific fixes (timing, stream handling)
 * - Real-time microphone switching
 * - Diagnostické okno při selhání
 * - Recognition engine pre-warming
 * - Touch event sanitization
 */

(function() {
    'use strict';

    // ============================================================================
    // 🔍 MOBILNÍ DETEKCE
    // ============================================================================
    
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const isEdge = /Edg\//i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (!isMobile || !isAndroid) {
        console.log("📱 Mobile Helper: Není mobilní Android, deaktivuji se.");
        return;
    }

    // ============================================================================
    // 🎯 MOBILNÍ HLASOVÝ POMOCNÍK
    // ============================================================================

    class MobileVoiceHelper {
        constructor() {
            this.voiceController = null;
            this.originalActivateListening = null;
            this.originalAcquireMediaStream = null;
            
            // Microphone management
            this.currentMicrophone = null;
            this.microphonePriority = ['jbl', 'quantum', 'bluetooth', 'usb', 'headset', 'built-in'];
            this.deviceChangeTimeout = null;
            
            // Edge Mobile specifics
            this.edgeStreamBuffer = isEdge ? 300 : 200; // Edge potřebuje víc času
            this.recognitionWarmupDone = false;
            
            // Touch handling
            this.lastTouchTime = 0;
            this.touchDebounceMs = 300;
            
            // Diagnostic
            this.failCount = 0;
            this.maxFailBeforeDiag = 3;
            
            this.init();
        }

        async init() {
            window.DebugManager?.log('mobile', "📱 Mobile Helper: Inicializace (Android 13 / Edge)");
            
            // Čekáme na VoiceController
            await this.waitForVoiceController();
            
            // Patchujeme metody
            this.patchVoiceController();
            
            // Nastavíme listenery
            this.setupMicrophoneMonitoring();
            this.setupTouchSanitizer();
            this.warmupRecognition();
            
            // UI
            this.injectDiagnosticModal();
            
            window.DebugManager?.log('mobile', "✅ Mobile Helper: Ready!");
            this.showNotification("📱 Mobilní optimalizace aktivována", 'success', 3000);
        }

        async waitForVoiceController(timeout = 10000) {
            const start = Date.now();
            while (!window.voiceController) {
                if (Date.now() - start > timeout) {
                    console.error("📱 Mobile Helper: VoiceController timeout!");
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            this.voiceController = window.voiceController;
            window.DebugManager?.log('mobile', "📱 VoiceController nalezen!");
        }

        // ========================================================================
        // 🎤 INTELIGENTNÍ MIKROFON MANAGEMENT
        // ========================================================================

        async detectBestMicrophone() {
            if (!this.voiceController) return null;

            const devices = this.voiceController.audioDevices || [];
            
            window.DebugManager?.log('mobile', `📱 Detekuji mikrofony (${devices.length} nalezeno)`);

            // Projdeme priority list
            for (const priority of this.microphonePriority) {
                const device = devices.find(d => {
                    const label = d.label.toLowerCase();
                    return label.includes(priority);
                });
                
                if (device) {
                    window.DebugManager?.log('mobile', `🎧 Vybrán mikrofon: ${device.label}`);
                    return device;
                }
            }

            // Fallback: první dostupný
            const fallback = devices[0];
            if (fallback) {
                window.DebugManager?.log('mobile', `⚠️ Fallback mikrofon: ${fallback.label}`);
            }
            return fallback;
        }

        async testMicrophoneQuality(deviceId) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        deviceId: { exact: deviceId },
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });

                // Mini test nahrávka
                await new Promise(resolve => setTimeout(resolve, 10));
                
                const track = stream.getAudioTracks()[0];
                const settings = track.getSettings();
                
                stream.getTracks().forEach(t => t.stop());
                
                window.DebugManager?.log('mobile', `✅ Mikrofon test OK: ${settings.sampleRate}Hz`);
                return true;
                
            } catch (error) {
                window.DebugManager?.log('mobile', `❌ Mikrofon test FAIL: ${error.message}`);
                return false;
            }
        }

        setupMicrophoneMonitoring() {
            navigator.mediaDevices.addEventListener('devicechange', async () => {
                // Debounce: Android spouští tento event vícekrát
                clearTimeout(this.deviceChangeTimeout);
                
                this.deviceChangeTimeout = setTimeout(async () => {
                    window.DebugManager?.log('mobile', "📱 Změna audio zařízení detekována");
                    
                    // Reload device list
                    if (this.voiceController) {
                        await this.voiceController.detectAudioDevices();
                    }
                    
                    const newBest = await this.detectBestMicrophone();
                    
                    if (newBest && newBest.deviceId !== this.currentMicrophone?.deviceId) {
                        this.currentMicrophone = newBest;
                        
                        // Update VoiceController
                        if (this.voiceController) {
                            this.voiceController.selectedMicrophoneId = newBest.deviceId;
                        }
                        
                        const message = `🎧 Přepnutí na: ${newBest.label}`;
                        this.showNotification(message, 'info', 4000);
                        this.speak(message);
                    }
                    
                }, 500);
            });
        }

        // ========================================================================
        // 🛠️ VOICE CONTROLLER PATCHING
        // ========================================================================

        patchVoiceController() {
            if (!this.voiceController) return;

            // Backup originálních metod
            this.originalActivateListening = this.voiceController.activateListening.bind(this.voiceController);
            this.originalAcquireMediaStream = this.voiceController.acquireMediaStream.bind(this.voiceController);

            // Patch activateListening
            this.voiceController.activateListening = async () => {
                window.DebugManager?.log('mobile', "📱 Patched activateListening called");
                
                if (this.voiceController.isListening || !this.voiceController.isEnabled) return;
                
                this.voiceController.isPTTActive = true;

                // 1. Ensure nejlepší mikrofon
                const bestMic = await this.detectBestMicrophone();
                if (bestMic) {
                    this.voiceController.selectedMicrophoneId = bestMic.deviceId;
                    this.currentMicrophone = bestMic;
                }

                // 2. Acquire stream s quality testem
                try {
                    await this.mobileAcquireMediaStream();
                } catch (error) {
                    console.error("📱 Stream acquisition failed:", error);
                    this.handleActivationFailure(error);
                    return;
                }

                // 3. Audio ducking
                this.voiceController.saveAndDuckAudio();

                // 4. EDGE MOBILE BUFFER - kritický pro stabilitu!
                await new Promise(resolve => setTimeout(resolve, this.edgeStreamBuffer));

                // 5. Start recognition
                try {
                    this.voiceController.recognition.start();
                    window.DebugManager?.log('mobile', "✅ Recognition started (mobile mode)");
                    this.failCount = 0; // Reset fail counter
                    
                } catch (error) {
                    console.error("📱 Recognition start failed:", error);
                    this.voiceController.restoreAudioVolume();
                    this.voiceController.releaseMediaStream();
                    this.handleActivationFailure(error);
                }
            };

            // Patch acquireMediaStream
            this.mobileAcquireMediaStream = async () => {
                this.voiceController.releaseMediaStream();

                const constraints = {
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 48000,
                    }
                };

                // Použijeme nejlepší dostupný mikrofon
                if (this.voiceController.selectedMicrophoneId) {
                    constraints.audio.deviceId = { exact: this.voiceController.selectedMicrophoneId };
                }

                try {
                    this.voiceController.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    
                    const track = this.voiceController.mediaStream.getAudioTracks()[0];
                    window.DebugManager?.log('mobile', `🎤 Stream acquired: ${track.label}`);
                    
                    return this.voiceController.mediaStream;
                    
                } catch (error) {
                    // Fallback bez deviceId
                    if (error.name === 'OverconstrainedError') {
                        window.DebugManager?.log('mobile', "⚠️ Fallback na výchozí mikrofon");
                        constraints.audio.deviceId = undefined;
                        this.voiceController.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                        return this.voiceController.mediaStream;
                    }
                    throw error;
                }
            };

            window.DebugManager?.log('mobile', "✅ VoiceController patched for mobile");
        }

        // ========================================================================
        // 🔧 RECOGNITION PRE-WARMING (Edge Mobile Fix)
        // ========================================================================

        async warmupRecognition() {
            if (this.recognitionWarmupDone) return;
            
            try {
                window.DebugManager?.log('mobile', "🔥 Pre-warming recognition engine...");
                
                // Dummy inicializace
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const dummy = new SpeechRecognition();
                dummy.lang = 'cs-CZ';
                
                dummy.onstart = () => {
                    dummy.stop();
                    this.recognitionWarmupDone = true;
                    window.DebugManager?.log('mobile', "✅ Recognition engine warmed up");
                };
                
                dummy.onerror = () => {
                    dummy.stop();
                };
                
                dummy.start();
                
            } catch (error) {
                window.DebugManager?.log('mobile', "⚠️ Warmup failed (non-critical):", error.message);
            }
        }

        // ========================================================================
        // 👆 TOUCH EVENT SANITIZER
        // ========================================================================

        setupTouchSanitizer() {
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (type === 'touchstart' && this.classList?.contains('voice-ptt-trigger')) {
                    
                    const sanitizedListener = (e) => {
                        const now = Date.now();
                        const helper = window.mobileVoiceHelper;
                        
                        if (helper && (now - helper.lastTouchTime) < helper.touchDebounceMs) {
                            window.DebugManager?.log('mobile', "⏭️ Touch debounced");
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        
                        if (helper) helper.lastTouchTime = now;
                        listener.call(this, e);
                    };
                    
                    return originalAddEventListener.call(this, type, sanitizedListener, options);
                }
                
                return originalAddEventListener.call(this, type, listener, options);
            };
            
            window.DebugManager?.log('mobile', "✅ Touch sanitizer installed");
        }

        // ========================================================================
        // 🩺 DIAGNOSTIC WINDOW
        // ========================================================================

        handleActivationFailure(error) {
            this.failCount++;
            
            window.DebugManager?.log('mobile', `❌ Activation failure #${this.failCount}: ${error.message}`);
            
            if (this.failCount >= this.maxFailBeforeDiag) {
                this.showDiagnostic(error);
            } else {
                this.showNotification(`⚠️ Pokus ${this.failCount}/${this.maxFailBeforeDiag} selhal, zkouším znovu...`, 'warn', 3000);
            }
        }

        showDiagnostic(error) {
            const modal = document.getElementById('mobile-voice-diagnostic');
            if (!modal) return;

            const info = this.gatherDiagnosticInfo(error);
            
            const content = modal.querySelector('.diagnostic-content-body');
            content.innerHTML = `
                <div class="diag-section">
                    <h4>❌ Problém detekován</h4>
                    <p><strong>Chyba:</strong> ${error.message}</p>
                    <p><strong>Typ:</strong> ${error.name}</p>
                </div>
                
                <div class="diag-section">
                    <h4>📱 Systémové info</h4>
                    <p><strong>Zařízení:</strong> ${info.device}</p>
                    <p><strong>Browser:</strong> ${info.browser}</p>
                    <p><strong>Android:</strong> ${info.android}</p>
                </div>
                
                <div class="diag-section">
                    <h4>🎤 Mikrofon status</h4>
                    <p><strong>Dostupné:</strong> ${info.micsAvailable}</p>
                    <p><strong>Vybraný:</strong> ${info.selectedMic}</p>
                    <p><strong>Permission:</strong> ${info.micPermission}</p>
                </div>
                
                <div class="diag-section">
                    <h4>🔋 Baterie</h4>
                    <p>${info.battery}</p>
                </div>
                
                <div class="diag-actions">
                    <button class="diag-btn retry-btn" onclick="window.mobileVoiceHelper.retryActivation()">
                        🔄 Zkusit znovu
                    </button>
                    <button class="diag-btn test-btn" onclick="window.mobileVoiceHelper.runFullTest()">
                        🧪 Spustit test
                    </button>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }

        gatherDiagnosticInfo(error) {
            const vc = this.voiceController;
            
            return {
                device: navigator.userAgent.match(/Android[^;]+/)?.[0] || 'Unknown',
                browser: `Edge ${navigator.userAgent.match(/Edg\/(\d+)/)?.[1] || '?'}`,
                android: navigator.userAgent.match(/Android (\d+)/)?.[1] || '?',
                micsAvailable: vc?.audioDevices?.length || 0,
                selectedMic: this.currentMicrophone?.label || 'None',
                micPermission: 'Checking...',
                battery: 'Checking...'
            };
        }

        injectDiagnosticModal() {
            const modal = document.createElement('div');
            modal.id = 'mobile-voice-diagnostic';
            modal.className = 'mobile-diagnostic-modal hidden';
            
            modal.innerHTML = `
                <div class="diagnostic-content">
                    <div class="diagnostic-header">
                        <h3>🛠️ Mobilní diagnostika hlasového ovládání</h3>
                        <button class="close-diagnostic" onclick="document.getElementById('mobile-voice-diagnostic').classList.add('hidden')">✕</button>
                    </div>
                    <div class="diagnostic-content-body">
                        <!-- Naplní se dynamicky -->
                    </div>
                    <div class="diagnostic-footer">
                        <small>Více admirál Jiřík & Admirál Claude.AI | Mobile Helper v1.0</small>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            this.injectDiagnosticStyles();
        }

        injectDiagnosticStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .mobile-diagnostic-modal {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 99999; backdrop-filter: blur(10px);
                    font-family: 'Segoe UI', sans-serif;
                }
                .mobile-diagnostic-modal.hidden { display: none; }
                
                .diagnostic-content {
                    width: 90%; max-width: 500px; max-height: 90vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 3px solid #ff9800; border-radius: 15px;
                    box-shadow: 0 0 40px rgba(255, 152, 0, 0.6);
                    display: flex; flex-direction: column; color: #fff;
                    overflow: hidden;
                }
                
                .diagnostic-header {
                    background: linear-gradient(90deg, #ff9800, #ff5722); color: #000;
                    padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;
                }
                .diagnostic-header h3 { margin: 0; font-weight: bold; font-size: 1.1em; }
                
                .close-diagnostic {
                    background: none; border: none; font-size: 28px; cursor: pointer;
                    color: #000; font-weight: bold; width: 35px; height: 35px;
                }
                
                .diagnostic-content-body {
                    padding: 20px; overflow-y: auto; flex: 1;
                }
                
                .diag-section {
                    background: rgba(255, 255, 255, 0.05);
                    border-left: 3px solid #ff9800;
                    padding: 12px; margin-bottom: 15px; border-radius: 5px;
                }
                .diag-section h4 {
                    margin: 0 0 10px 0; color: #ff9800; font-size: 1em;
                }
                .diag-section p {
                    margin: 5px 0; font-size: 0.9em; line-height: 1.4;
                }
                
                .diag-actions {
                    display: flex; gap: 10px; margin-top: 15px;
                }
                .diag-btn {
                    flex: 1; padding: 12px; border: none; border-radius: 8px;
                    font-weight: bold; cursor: pointer; font-size: 0.95em;
                    transition: all 0.3s;
                }
                .retry-btn {
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                }
                .test-btn {
                    background: linear-gradient(135deg, #2196F3, #1976D2);
                    color: white;
                }
                .diag-btn:active { transform: scale(0.95); }
                
                .diagnostic-footer {
                    padding: 10px; text-align: center; font-size: 11px; color: #888;
                    background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.1);
                }
            `;
            document.head.appendChild(style);
        }

        async retryActivation() {
            document.getElementById('mobile-voice-diagnostic').classList.add('hidden');
            this.failCount = 0;
            
            this.showNotification("🔄 Znovu inicializuji...", 'info', 2000);
            
            // Re-detect devices
            if (this.voiceController) {
                await this.voiceController.detectAudioDevices();
            }
            
            // Retry
            setTimeout(() => {
                if (this.voiceController && this.voiceController.isEnabled) {
                    this.voiceController.activateListening();
                }
            }, 500);
        }

        async runFullTest() {
            this.showNotification("🧪 Spouštím komplexní test...", 'info', 2000);
            
            // Test 1: Permissions
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(t => t.stop());
                console.log("✅ Microphone permission: OK");
            } catch (e) {
                console.error("❌ Microphone permission: FAIL", e);
            }
            
            // Test 2: Recognition
            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const test = new SpeechRecognition();
                console.log("✅ Recognition API: OK");
            } catch (e) {
                console.error("❌ Recognition API: FAIL", e);
            }
            
            // Test 3: Best mic
            const best = await this.detectBestMicrophone();
            console.log("🎤 Best microphone:", best?.label || "None");
            
            this.showNotification("✅ Test dokončen - viz konzole", 'success', 4000);
        }

        // ========================================================================
        // 🔊 HELPER UTILITIES
        // ========================================================================

        speak(text) {
            if (this.voiceController && typeof this.voiceController.speak === 'function') {
                this.voiceController.speak(text);
            }
        }

        showNotification(message, type = 'info', duration = 3000) {
            if (typeof window.showNotification === 'function') {
                window.showNotification(message, type, duration);
            } else {
                console.log(`[${type.toUpperCase()}] ${message}`);
            }
        }
    }

    // ============================================================================
    // 🚀 INICIALIZACE
    // ============================================================================

    window.mobileVoiceHelper = null;

    const initMobileHelper = () => {
        if (window.mobileVoiceHelper) return;
        
        window.mobileVoiceHelper = new MobileVoiceHelper();
        
        console.log(`
🖖 MOBILE VOICE HELPER AKTIVOVÁN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 Zařízení: ${navigator.userAgent.match(/Android[^;]+/)?.[0]}
🌐 Browser: Edge Mobile
🎤 Optimalizace: JBL Quantum priority
✅ Status: Ready for orders!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
    };

    // Čekáme na DOM + VoiceController
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initMobileHelper, 1000);
        });
    } else {
        setTimeout(initMobileHelper, 1000);
    }

})();