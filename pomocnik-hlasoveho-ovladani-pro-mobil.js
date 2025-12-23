/**
 * 🖖 STAR TREK MOBILE VOICE CONTROL HELPER v2.0
 * =====================================================
 * Více admirál Jiřík & Admirál Claude.AI
 * Soubor: pomocnik-hlasoveho-ovladani-pro-mobil.js
 * Verze: 2.0 FULL UPGRADE (Production Ready)
 * 
 * 🚀 NOVÉ FEATURY v2.0:
 * - Wake Word Smart Manager (auto-disable na mobilu)
 * - Advanced Error Analyzer (intelligent diagnostics)
 * - Battery Guardian System (dynamic optimization)
 * - Command History Tracker (last 10 commands)
 * - Real-time Quality Monitor (mic level meter)
 * - Auto-Recovery Protocols (3-level retry)
 * - Visual Feedback System (Star Trek animations)
 * - Network Quality Detector (Wi-Fi vs mobile)
 * - Background Tab Handler (pause/resume)
 * - Export Diagnostics (sharable logs)
 */

(function() {
    'use strict';

    // ============================================================================
    // 🔍 MOBILNÍ DETEKCE & ENVIRONMENT CHECK
    // ============================================================================
    
    const ENV = {
        isMobile: /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent),
        isEdge: /Edg\//i.test(navigator.userAgent),
        isAndroid: /Android/i.test(navigator.userAgent),
        androidVersion: navigator.userAgent.match(/Android (\d+)/)?.[1] || null,
        edgeVersion: navigator.userAgent.match(/Edg\/(\d+)/)?.[1] || null,
        hasNotch: window.screen.height / window.screen.width > 2,
        deviceName: navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || 'Unknown'
    };
    
    if (!ENV.isMobile || !ENV.isAndroid) {
        console.log("📱 Mobile Helper v2.0: Není mobilní Android, standby mode.");
        return;
    }

    console.log(`
╔══════════════════════════════════════════════════════╗
║  🖖 MOBILE VOICE HELPER v2.0 ACTIVATED              ║
╠══════════════════════════════════════════════════════╣
║  📱 Device: ${ENV.deviceName.substring(0, 30).padEnd(30)}        ║
║  🤖 Android: ${(ENV.androidVersion || '?').padEnd(42)}║
║  🌐 Browser: Edge ${(ENV.edgeVersion || '?').padEnd(36)}║
║  ⚡ Status: Full Power Mode                         ║
╚══════════════════════════════════════════════════════╝
    `);

    // ============================================================================
    // 🎯 MOBILNÍ HLASOVÝ POMOCNÍK v2.0
    // ============================================================================

    class MobileVoiceHelper {
        constructor() {
            this.version = '2.0.0';
            this.voiceController = null;
            
            // Core patches
            this.originalActivateListening = null;
            this.originalAcquireMediaStream = null;
            
            // Microphone intelligence
            this.currentMicrophone = null;
            this.microphonePriority = ['jbl', 'quantum', 'bluetooth', 'wireless', 'usb', 'headset', 'wired', 'built-in'];
            this.deviceChangeTimeout = null;
            this.micQualityHistory = [];
            
            // Edge Mobile specifics
            this.edgeStreamBuffer = ENV.isEdge ? 350 : 200;
            this.recognitionWarmupDone = false;
            
            // Touch handling
            this.lastTouchTime = 0;
            this.touchDebounceMs = 300;
            this.activeTouchTargets = new WeakSet();
            
            // Error handling & recovery
            this.failCount = 0;
            this.maxFailBeforeDiag = 3;
            this.lastError = null;
            this.recoveryLevel = 0;
            this.recoveryTimeout = null;
            
            // Command history
            this.commandHistory = [];
            this.maxHistorySize = 10;
            
            // Battery management
            this.batteryLevel = 100;
            this.batteryMonitor = null;
            this.powerMode = 'full'; // full, balanced, saver, emergency
            
            // Quality monitoring
            this.audioAnalyzer = null;
            this.audioContext = null;
            this.micLevelInterval = null;
            this.currentMicLevel = 0;
            this.noiseFloor = -60;
            
            // Network
            this.networkType = 'unknown';
            this.networkQuality = 'good';
            
            // Wake Word Manager
            this.wakeWordDisabled = false;
            
            // Background handling
            this.isTabVisible = true;
            this.pausedOperations = [];
            
            this.init();
        }

        async init() {
            window.DebugManager?.log('mobile', "📱 Mobile Helper v2.0: Full init začíná...");
            
            // Wait for dependencies
            await this.waitForVoiceController();
            
            // Core setup
            this.patchVoiceController();
            this.setupMicrophoneMonitoring();
            this.setupTouchSanitizer();
            this.warmupRecognition();
            
            // Advanced features
            await this.initBatteryMonitor();
            this.initNetworkMonitor();
            this.setupBackgroundHandler();
            this.disableWakeWordOnMobile();
            
            // UI
            this.injectAdvancedUI();
            this.startQualityMonitoring();
            
            window.DebugManager?.log('mobile', "✅ Mobile Helper v2.0: Plně operační!");
            this.showNotification("🚀 Mobilní optimalizace v2.0 aktivována", 'success', 4000);
        }

        async waitForVoiceController(timeout = 10000) {
            const start = Date.now();
            while (!window.voiceController) {
                if (Date.now() - start > timeout) {
                    console.error("📱 VoiceController timeout!");
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            this.voiceController = window.voiceController;
            window.DebugManager?.log('mobile', "🎤 VoiceController connected");
        }

        // ========================================================================
        // 🛡️ WAKE WORD SMART MANAGER
        // ========================================================================

        disableWakeWordOnMobile() {
            if (!window.wakeWordWatcher) {
                window.DebugManager?.log('mobile', "👁️ Wake Word Watcher není přítomen");
                return;
            }

            try {
                if (window.wakeWordWatcher.isWatching) {
                    window.wakeWordWatcher.stopWatching();
                    window.DebugManager?.log('mobile', "👁️ Wake Word deaktivován (Android omezení)");
                }

                // Hide UI toggle
                const wakeBtn = document.getElementById('wake-word-toggle');
                if (wakeBtn) {
                    wakeBtn.style.display = 'none';
                    wakeBtn.style.opacity = '0.3';
                    wakeBtn.style.pointerEvents = 'none';
                    wakeBtn.title = 'Wake Word není dostupný na mobilu';
                }

                this.wakeWordDisabled = true;
                
                // Notify user once
                setTimeout(() => {
                    this.showNotification("ℹ️ Wake Word deaktivován na mobilu (použij PTT tlačítko)", 'info', 5000);
                }, 2000);

            } catch (error) {
                window.DebugManager?.log('mobile', "⚠️ Wake Word disable error:", error.message);
            }
        }

        // ========================================================================
        // 🎤 ADVANCED MICROPHONE MANAGEMENT
        // ========================================================================

        async detectBestMicrophone() {
            if (!this.voiceController) return null;

            const devices = this.voiceController.audioDevices || [];
            
            window.DebugManager?.log('mobile', `🔍 Scanning ${devices.length} microphones...`);

            // Score-based selection
            let bestDevice = null;
            let bestScore = -1;

            for (const device of devices) {
                const score = this.scoreMicrophone(device);
                window.DebugManager?.log('mobile', `  📊 ${device.label}: score ${score}`);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestDevice = device;
                }
            }

            if (bestDevice) {
                window.DebugManager?.log('mobile', `🏆 Winner: ${bestDevice.label} (score: ${bestScore})`);
                
                // Quality test
                const quality = await this.testMicrophoneQuality(bestDevice.deviceId);
                if (quality < 0.5) {
                    window.DebugManager?.log('mobile', `⚠️ Quality too low (${quality}), trying fallback...`);
                    return devices[0]; // Fallback to first available
                }
            }

            return bestDevice || devices[0];
        }

        scoreMicrophone(device) {
            const label = device.label.toLowerCase();
            let score = 0;

            // Priority-based scoring
            this.microphonePriority.forEach((keyword, index) => {
                if (label.includes(keyword)) {
                    score += (this.microphonePriority.length - index) * 10;
                }
            });

            // Bonus for external devices
            if (label.includes('usb') || label.includes('bluetooth')) score += 5;
            
            // Penalty for generic names
            if (label.includes('default') || label.includes('built-in')) score -= 3;

            return score;
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

                // Mini quality check via AudioContext
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioCtx.createMediaStreamSource(stream);
                const analyzer = audioCtx.createAnalyser();
                analyzer.fftSize = 256;
                source.connect(analyzer);

                const dataArray = new Uint8Array(analyzer.frequencyBinCount);
                
                // Sample 3 times over 30ms
                let totalLevel = 0;
                for (let i = 0; i < 3; i++) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                    analyzer.getByteFrequencyData(dataArray);
                    const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
                    totalLevel += avg;
                }

                stream.getTracks().forEach(t => t.stop());
                audioCtx.close();

                const quality = Math.min(totalLevel / (3 * 255), 1);
                window.DebugManager?.log('mobile', `✅ Quality test: ${(quality * 100).toFixed(0)}%`);
                
                this.micQualityHistory.push({ deviceId, quality, timestamp: Date.now() });
                if (this.micQualityHistory.length > 10) this.micQualityHistory.shift();

                return quality;
                
            } catch (error) {
                window.DebugManager?.log('mobile', `❌ Quality test failed: ${error.message}`);
                return 0;
            }
        }

        setupMicrophoneMonitoring() {
            navigator.mediaDevices.addEventListener('devicechange', async () => {
                clearTimeout(this.deviceChangeTimeout);
                
                this.deviceChangeTimeout = setTimeout(async () => {
                    window.DebugManager?.log('mobile', "🔄 Device change detected");
                    
                    if (this.voiceController) {
                        await this.voiceController.detectAudioDevices();
                    }
                    
                    const newBest = await this.detectBestMicrophone();
                    
                    if (newBest && newBest.deviceId !== this.currentMicrophone?.deviceId) {
                        this.currentMicrophone = newBest;
                        
                        if (this.voiceController) {
                            this.voiceController.selectedMicrophoneId = newBest.deviceId;
                        }
                        
                        const message = `🎧 Mikrofon: ${newBest.label}`;
                        this.showNotification(message, 'info', 4000);
                        this.speak(`Přepnutí na ${newBest.label.split(' ')[0]}`);
                        
                        this.updateDashboard();
                    }
                    
                }, 500);
            });
        }

        // ========================================================================
        // 🛠️ VOICE CONTROLLER PATCHING (Enhanced)
        // ========================================================================

        patchVoiceController() {
            if (!this.voiceController) return;

            this.originalActivateListening = this.voiceController.activateListening.bind(this.voiceController);
            this.originalAcquireMediaStream = this.voiceController.acquireMediaStream.bind(this.voiceController);

            // Enhanced activateListening
            this.voiceController.activateListening = async () => {
                window.DebugManager?.log('mobile', "🎙️ Enhanced activation starting...");
                
                if (this.voiceController.isListening || !this.voiceController.isEnabled) return;
                
                this.voiceController.isPTTActive = true;

                // 1. Best microphone selection
                const bestMic = await this.detectBestMicrophone();
                if (bestMic) {
                    this.voiceController.selectedMicrophoneId = bestMic.deviceId;
                    this.currentMicrophone = bestMic;
                }

                // 2. Stream acquisition with retry
                try {
                    await this.acquireStreamWithRetry();
                } catch (error) {
                    this.handleActivationFailure(error);
                    return;
                }

                // 3. Audio ducking
                this.voiceController.saveAndDuckAudio();

                // 4. Stabilization buffer (Edge optimized)
                await new Promise(resolve => setTimeout(resolve, this.edgeStreamBuffer));

                // 5. Start recognition with error handling
                try {
                    this.voiceController.recognition.start();
                    window.DebugManager?.log('mobile', "✅ Recognition started (mobile v2.0)");
                    this.failCount = 0;
                    this.recoveryLevel = 0;
                    this.startQualityMonitoring();
                    
                } catch (error) {
                    this.voiceController.restoreAudioVolume();
                    this.voiceController.releaseMediaStream();
                    this.handleActivationFailure(error);
                }
            };

            // Patch processCommand for history tracking
            const originalProcessCommand = this.voiceController.processCommand.bind(this.voiceController);
            this.voiceController.processCommand = (transcript) => {
                this.trackCommand(transcript);
                originalProcessCommand(transcript);
            };

            window.DebugManager?.log('mobile', "✅ VoiceController patched (v2.0)");
        }

        async acquireStreamWithRetry(maxRetries = 3) {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const stream = await this.mobileAcquireMediaStream();
                    window.DebugManager?.log('mobile', `✅ Stream acquired (attempt ${attempt})`);
                    return stream;
                } catch (error) {
                    window.DebugManager?.log('mobile', `❌ Attempt ${attempt} failed: ${error.message}`);
                    
                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
                    } else {
                        throw error;
                    }
                }
            }
        }

        async mobileAcquireMediaStream() {
            if (this.voiceController) {
                this.voiceController.releaseMediaStream();
            }

            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000,
                }
            };

            if (this.voiceController?.selectedMicrophoneId) {
                constraints.audio.deviceId = { exact: this.voiceController.selectedMicrophoneId };
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (this.voiceController) {
                    this.voiceController.mediaStream = stream;
                }
                
                const track = stream.getAudioTracks()[0];
                window.DebugManager?.log('mobile', `🎤 Stream: ${track.label}`);
                
                return stream;
                
            } catch (error) {
                if (error.name === 'OverconstrainedError') {
                    window.DebugManager?.log('mobile', "⚠️ Fallback mode");
                    constraints.audio.deviceId = undefined;
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (this.voiceController) {
                        this.voiceController.mediaStream = stream;
                    }
                    return stream;
                }
                throw error;
            }
        }

        // ========================================================================
        // 🔧 RECOGNITION PRE-WARMING
        // ========================================================================

        async warmupRecognition() {
            if (this.recognitionWarmupDone) return;
            
            try {
                window.DebugManager?.log('mobile', "🔥 Warming up recognition engine...");
                
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const dummy = new SpeechRecognition();
                dummy.lang = 'cs-CZ';
                
                dummy.onstart = () => {
                    setTimeout(() => {
                        dummy.stop();
                        this.recognitionWarmupDone = true;
                        window.DebugManager?.log('mobile', "✅ Recognition engine ready");
                    }, 100);
                };
                
                dummy.onerror = () => dummy.stop();
                
                dummy.start();
                
            } catch (error) {
                window.DebugManager?.log('mobile', `⚠️ Warmup skipped: ${error.message}`);
            }
        }

        // ========================================================================
        // 👆 ULTRA TOUCH SANITIZER
        // ========================================================================

        setupTouchSanitizer() {
            document.addEventListener('touchstart', (e) => {
                const target = e.target.closest('.voice-ptt-trigger, .voice-control-toggle');
                if (!target) return;

                const now = Date.now();
                
                if (this.activeTouchTargets.has(target)) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (now - this.lastTouchTime < this.touchDebounceMs) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.DebugManager?.log('mobile', "⏭️ Touch debounced");
                    return;
                }

                this.activeTouchTargets.add(target);
                this.lastTouchTime = now;

                setTimeout(() => {
                    this.activeTouchTargets.delete(target);
                }, this.touchDebounceMs);
            }, { passive: false });

            window.DebugManager?.log('mobile', "✅ Ultra touch sanitizer active");
        }

        // ========================================================================
        // 📊 COMMAND HISTORY TRACKER
        // ========================================================================

        trackCommand(transcript) {
            const entry = {
                transcript,
                timestamp: Date.now(),
                confidence: 0,
                success: false
            };

            // Najdeme matching command
            if (this.voiceController?.commands) {
                for (const [pattern] of this.voiceController.commands) {
                    if (transcript.toLowerCase().includes(pattern)) {
                        entry.success = true;
                        entry.confidence = 0.75; // Estimate
                        break;
                    }
                }
            }

            this.commandHistory.unshift(entry);
            if (this.commandHistory.length > this.maxHistorySize) {
                this.commandHistory.pop();
            }

            this.updateDashboard();
        }

        // ========================================================================
        // 🔋 BATTERY GUARDIAN SYSTEM
        // ========================================================================

        async initBatteryMonitor() {
            if (!('getBattery' in navigator)) {
                window.DebugManager?.log('mobile', "⚠️ Battery API not available");
                return;
            }

            try {
                const battery = await navigator.getBattery();
                this.batteryLevel = battery.level * 100;
                this.updatePowerMode();

                battery.addEventListener('levelchange', () => {
                    this.batteryLevel = battery.level * 100;
                    this.updatePowerMode();
                });

                battery.addEventListener('chargingchange', () => {
                    window.DebugManager?.log('mobile', `🔌 Charging: ${battery.charging}`);
                    this.updatePowerMode();
                });

                window.DebugManager?.log('mobile', `🔋 Battery: ${this.batteryLevel.toFixed(0)}%`);

            } catch (error) {
                window.DebugManager?.log('mobile', "⚠️ Battery monitor failed");
            }
        }

        updatePowerMode() {
            const oldMode = this.powerMode;

            if (this.batteryLevel >= 80) {
                this.powerMode = 'full';
            } else if (this.batteryLevel >= 50) {
                this.powerMode = 'balanced';
            } else if (this.batteryLevel >= 20) {
                this.powerMode = 'saver';
            } else {
                this.powerMode = 'emergency';
            }

            if (oldMode !== this.powerMode) {
                window.DebugManager?.log('mobile', `⚡ Power mode: ${this.powerMode}`);
                this.applyPowerMode();
                this.updateDashboard();
            }
        }

        applyPowerMode() {
            switch (this.powerMode) {
                case 'full':
                    this.micLevelUpdateInterval = 100;
                    break;
                case 'balanced':
                    this.micLevelUpdateInterval = 200;
                    break;
                case 'saver':
                    this.micLevelUpdateInterval = 500;
                    this.stopQualityMonitoring();
                    break;
                case 'emergency':
                    this.micLevelUpdateInterval = 1000;
                    this.stopQualityMonitoring();
                    this.showNotification("🚨 Baterie nízko - Úsporný režim", 'warn', 5000);
                    break;
            }
        }

        // ========================================================================
        // 📡 NETWORK MONITOR
        // ========================================================================

        initNetworkMonitor() {
            if (!('connection' in navigator)) {
                this.networkType = 'unknown';
                return;
            }

            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (conn) {
                this.updateNetworkInfo(conn);
                
                conn.addEventListener('change', () => {
                    this.updateNetworkInfo(conn);
                });
            }
        }

        updateNetworkInfo(conn) {
            this.networkType = conn.effectiveType || conn.type || 'unknown';
            
            const downlink = conn.downlink || 0;
            if (downlink > 10) {
                this.networkQuality = 'excellent';
            } else if (downlink > 5) {
                this.networkQuality = 'good';
            } else if (downlink > 1) {
                this.networkQuality = 'fair';
            } else {
                this.networkQuality = 'poor';
            }

            window.DebugManager?.log('mobile', `📡 Network: ${this.networkType} (${this.networkQuality})`);
            this.updateDashboard();
        }

        // ========================================================================
        // 🎤 REAL-TIME QUALITY MONITORING
        // ========================================================================

        async startQualityMonitoring() {
            if (this.micLevelInterval || this.powerMode === 'saver' || this.powerMode === 'emergency') return;

            try {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                if (this.voiceController?.mediaStream) {
                    const source = this.audioContext.createMediaStreamSource(this.voiceController.mediaStream);
                    this.audioAnalyzer = this.audioContext.createAnalyser();
                    this.audioAnalyzer.fftSize = 256;
                    source.connect(this.audioAnalyzer);

                    this.micLevelInterval = setInterval(() => {
                        this.updateMicLevel();
                    }, this.micLevelUpdateInterval || 100);
                }

            } catch (error) {
                window.DebugManager?.log('mobile', `⚠️ Quality monitor failed: ${error.message}`);
            }
        }

        stopQualityMonitoring() {
            if (this.micLevelInterval) {
                clearInterval(this.micLevelInterval);
                this.micLevelInterval = null;
            }
        }

        updateMicLevel() {
            if (!this.audioAnalyzer) return;

            const dataArray = new Uint8Array(this.audioAnalyzer.frequencyBinCount);
            this.audioAnalyzer.getByteFrequencyData(dataArray);

            const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
            this.currentMicLevel = Math.min((avg / 255) * 100, 100);

            this.updateMicLevelUI();
        }

        updateMicLevelUI() {
            const meter = document.getElementById('mobile-mic-level-meter');
            if (!meter) return;

            const fill = meter.querySelector('.mic-level-fill');
            const text = meter.querySelector('.mic-level-text');

            if (fill) {
                fill.style.width = `${this.currentMicLevel}%`;
                
                if (this.currentMicLevel > 70) {
                    fill.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
                } else if (this.currentMicLevel > 30) {
                    fill.style.background = 'linear-gradient(90deg, #ffc107, #ff9800)';
                } else {
                    fill.style.background = 'linear-gradient(90deg, #666, #888)';
                }
            }

            if (text) {
                text.textContent = `${this.currentMicLevel.toFixed(0)}%`;
            }
        }

        // ========================================================================
        // 🌓 BACKGROUND TAB HANDLER
        // ========================================================================

        setupBackgroundHandler() {
            document.addEventListener('visibilitychange', () => {
                this.isTabVisible = !document.hidden;

                if (document.hidden) {
                    this.onTabHidden();
                } else {
                    this.onTabVisible();
                }
            });
        }

        onTabHidden() {
            window.DebugManager?.log('mobile', "🌑 Tab hidden - pausing operations");
            
            this.stopQualityMonitoring();
            this.pausedOperations.push('qualityMonitor');
        }

        onTabVisible() {
            window.DebugManager?.log('mobile', "🌕 Tab visible - resuming operations");
            
            if (this.pausedOperations.includes('qualityMonitor') && this.voiceController?.isListening) {
                this.startQualityMonitoring();
            }
            
            this.pausedOperations = [];
        }

        // ========================================================================
        // 🩺 ADVANCED ERROR HANDLING & AUTO-RECOVERY
        // ========================================================================

        handleActivationFailure(error) {
            this.failCount++;
            this.lastError = error;
            
            window.DebugManager?.log('mobile', `❌ Failure #${this.failCount}: ${error.message}`);
            
            if (this.failCount >= this.maxFailBeforeDiag) {
                this.showAdvancedDiagnostic(error);
            } else {
                this.attemptAutoRecovery(error);
            }
        }

        async attemptAutoRecovery(error) {
            this.recoveryLevel++;
            
            const strategies = [
                { name: 'Soft Retry', delay: 500, action: () => this.softRetry() },
                { name: 'Medium Retry', delay: 2000, action: () => this.mediumRetry() },
                { name: 'Hard Recovery', delay: 5000, action: () => this.hardRecovery() }
            ];

            const strategy = strategies[Math.min(this.recoveryLevel - 1, strategies.length - 1)];
            
            window.DebugManager?.log('mobile', `🔄 Trying: ${strategy.name}`);
            this.showNotification(`🔄 ${strategy.name}... (${this.failCount}/${this.maxFailBeforeDiag})`, 'info', 2000);

            clearTimeout(this.recoveryTimeout);
            this.recoveryTimeout = setTimeout(async () => {
                await strategy.action();
            }, strategy.delay);
        }

        async softRetry() {
            if (this.voiceController?.isEnabled) {
                this.voiceController.activateListening();
            }
        }

        async mediumRetry() {
            if (this.voiceController) {
                await this.voiceController.detectAudioDevices();
                const fallback = await this.detectBestMicrophone();
                if (fallback) {
                    this.voiceController.selectedMicrophoneId = fallback.deviceId;
                }
                this.voiceController.activateListening();
            }
        }

        async hardRecovery() {
            window.DebugManager?.log('mobile', "🚨 Hard recovery initiated");
            
            if (this.voiceController) {
                this.voiceController.releaseMediaStream();
                await new Promise(resolve => setTimeout(resolve, 1000));
                await this.voiceController.detectAudioDevices();
                await this.warmupRecognition();
                this.voiceController.activateListening();
            }
        }

        // ========================================================================
        // 🎨 ADVANCED UI - DASHBOARD, HISTORY, LEVEL METER
        // ========================================================================

        injectAdvancedUI() {
            this.injectDashboard();
            this.injectMicLevelMeter();
            this.injectCommandHistory();
            this.injectDiagnosticModal();
            this.injectStyles();
        }

        injectDashboard() {
            const existing = document.getElementById('mobile-dashboard');
            if (existing) existing.remove();

            const dashboard = document.createElement('div');
            dashboard.id = 'mobile-dashboard';
            dashboard.className = 'mobile-dashboard hidden';
            
            dashboard.innerHTML = `
                <div class="dashboard-toggle" onclick="document.getElementById('mobile-dashboard').classList.toggle('expanded')">
                    📊
                </div>
                <div class="dashboard-content">
                    <h4>🎯 System Status</h4>
                    <div class="status-grid">
                        <div class="status-item">
                            <span class="status-label">🎤 Mikrofon:</span>
                            <span class="status-value" id="dash-mic">--</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">🔋 Baterie:</span>
                            <span class="status-value" id="dash-battery">--</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">📡 Síť:</span>
                            <span class="status-value" id="dash-network">--</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">⚡ Režim:</span>
                            <span class="status-value" id="dash-power">--</span>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dashboard);
            
            // Show by default for first 5 seconds
            setTimeout(() => {
                dashboard.classList.remove('hidden');
                setTimeout(() => {
                    dashboard.classList.add('hidden');
                }, 5000);
            }, 2000);
        }

        injectMicLevelMeter() {
            const existing = document.getElementById('mobile-mic-level-meter');
            if (existing) existing.remove();

            const meter = document.createElement('div');
            meter.id = 'mobile-mic-level-meter';
            meter.className = 'mic-level-meter hidden';
            
            meter.innerHTML = `
                <div class="mic-level-label">🎤 Level</div>
                <div class="mic-level-bar">
                    <div class="mic-level-fill"></div>
                </div>
                <div class="mic-level-text">0%</div>
            `;
            
            document.body.appendChild(meter);
        }

        injectCommandHistory() {
            const existing = document.getElementById('mobile-command-history');
            if (existing) existing.remove();

            const history = document.createElement('div');
            history.id = 'mobile-command-history';
            history.className = 'command-history hidden';
            
            history.innerHTML = `
                <div class="history-toggle" onclick="document.getElementById('mobile-command-history').classList.toggle('expanded')">
                    📜
                </div>
                <div class="history-content">
                    <h4>📜 Poslední příkazy</h4>
                    <div id="history-list"></div>
                </div>
            `;
            
            document.body.appendChild(history);
        }

        injectDiagnosticModal() {
            const existing = document.getElementById('mobile-diagnostic-v2');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'mobile-diagnostic-v2';
            modal.className = 'diagnostic-modal-v2 hidden';
            
            modal.innerHTML = `
                <div class="diagnostic-content-v2">
                    <div class="diagnostic-header-v2">
                        <h3>🛠️ Pokročilá diagnostika</h3>
                        <button class="close-diagnostic-v2" onclick="document.getElementById('mobile-diagnostic-v2').classList.add('hidden')">✕</button>
                    </div>
                    <div class="diagnostic-body-v2" id="diagnostic-body-content">
                        <!-- Dynamic content -->
                    </div>
                    <div class="diagnostic-footer-v2">
                        <button class="diag-btn-v2 retry" onclick="window.mobileVoiceHelper.manualRetry()">🔄 Zkusit znovu</button>
                        <button class="diag-btn-v2 test" onclick="window.mobileVoiceHelper.runFullTest()">🧪 Full test</button>
                        <button class="diag-btn-v2 export" onclick="window.mobileVoiceHelper.exportDiagnostics()">📋 Export</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }

        showAdvancedDiagnostic(error) {
            const modal = document.getElementById('mobile-diagnostic-v2');
            if (!modal) return;

            const info = this.gatherFullDiagnostics(error);
            const body = document.getElementById('diagnostic-body-content');
            
            body.innerHTML = `
                <div class="diag-section-v2 error">
                    <h4>❌ Chyba detekována</h4>
                    <p><strong>Typ:</strong> ${info.error.name}</p>
                    <p><strong>Zpráva:</strong> ${info.error.message}</p>
                    <p><strong>Počet selhání:</strong> ${this.failCount}</p>
                </div>

                <div class="diag-section-v2">
                    <h4>📱 Systém</h4>
                    <p>Zařízení: ${info.system.device}</p>
                    <p>Android: ${info.system.android}</p>
                    <p>Browser: ${info.system.browser}</p>
                </div>

                <div class="diag-section-v2">
                    <h4>🎤 Audio</h4>
                    <p>Dostupné mikrofony: ${info.audio.available}</p>
                    <p>Vybraný: ${info.audio.selected}</p>
                    <p>Kvalita: ${info.audio.quality}</p>
                </div>

                <div class="diag-section-v2">
                    <h4>🔋 Baterie & Síť</h4>
                    <p>Baterie: ${info.battery}% (${this.powerMode})</p>
                    <p>Síť: ${this.networkType} (${this.networkQuality})</p>
                </div>

                <div class="diag-section-v2">
                    <h4>📊 Poslední příkazy</h4>
                    ${this.commandHistory.slice(0, 5).map((cmd, i) => `
                        <p>${i+1}. "${cmd.transcript}" ${cmd.success ? '✅' : '❌'}</p>
                    `).join('')}
                </div>

                <div class="diag-section-v2 suggestion">
                    <h4>💡 Doporučení</h4>
                    ${this.getSuggestions(error)}
                </div>
            `;

            modal.classList.remove('hidden');
        }

        gatherFullDiagnostics(error) {
            return {
                error: {
                    name: error.name,
                    message: error.message
                },
                system: {
                    device: ENV.deviceName,
                    android: ENV.androidVersion || '?',
                    browser: `Edge ${ENV.edgeVersion || '?'}`
                },
                audio: {
                    available: this.voiceController?.audioDevices?.length || 0,
                    selected: this.currentMicrophone?.label || 'None',
                    quality: this.micQualityHistory.length > 0 ? 
                        `${(this.micQualityHistory[0].quality * 100).toFixed(0)}%` : 'Unknown'
                },
                battery: this.batteryLevel.toFixed(0)
            };
        }

        getSuggestions(error) {
            const suggestions = [];

            if (error.name === 'NotAllowedError') {
                suggestions.push('<p>🔐 Povolte přístup k mikrofonu v nastavení browseru</p>');
            }

            if (this.batteryLevel < 20) {
                suggestions.push('<p>🔌 Připojte nabíječku pro lepší výkon</p>');
            }

            if (this.networkQuality === 'poor') {
                suggestions.push('<p>📡 Zkuste silnější Wi-Fi síť</p>');
            }

            if (this.failCount >= 3) {
                suggestions.push('<p>🔄 Zkuste restartovat browser</p>');
            }

            if (suggestions.length === 0) {
                suggestions.push('<p>✅ Zkuste použít tlačítko "Zkusit znovu"</p>');
            }

            return suggestions.join('');
        }

        updateDashboard() {
            const micEl = document.getElementById('dash-mic');
            const batteryEl = document.getElementById('dash-battery');
            const networkEl = document.getElementById('dash-network');
            const powerEl = document.getElementById('dash-power');

            if (micEl) micEl.textContent = this.currentMicrophone?.label.split(' ')[0] || '--';
            if (batteryEl) batteryEl.textContent = `${this.batteryLevel.toFixed(0)}%`;
            if (networkEl) networkEl.textContent = this.networkType;
            if (powerEl) powerEl.textContent = this.powerMode;
        }

        updateCommandHistoryUI() {
            const list = document.getElementById('history-list');
            if (!list) return;

            list.innerHTML = this.commandHistory.slice(0, 5).map((cmd, i) => `
                <div class="history-item ${cmd.success ? 'success' : 'fail'}">
                    <span class="history-num">${i+1}.</span>
                    <span class="history-text">"${cmd.transcript}"</span>
                    <span class="history-icon">${cmd.success ? '✅' : '❌'}</span>
                </div>
            `).join('');
        }

        // ========================================================================
        // 🛠️ UTILITY METHODS
        // ========================================================================

        manualRetry() {
            document.getElementById('mobile-diagnostic-v2').classList.add('hidden');
            this.failCount = 0;
            this.recoveryLevel = 0;
            
            this.showNotification("🔄 Manuální restart...", 'info', 2000);
            
            setTimeout(() => {
                if (this.voiceController?.isEnabled) {
                    this.voiceController.activateListening();
                }
            }, 500);
        }

        async runFullTest() {
            this.showNotification("🧪 Spouštím full test...", 'info', 2000);
            
            const results = [];

            // Test 1: Permissions
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(t => t.stop());
                results.push('✅ Microphone permission: OK');
            } catch (e) {
                results.push(`❌ Microphone permission: ${e.message}`);
            }

            // Test 2: Recognition API
            try {
                const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                const test = new SR();
                results.push('✅ Recognition API: OK');
            } catch (e) {
                results.push(`❌ Recognition API: ${e.message}`);
            }

            // Test 3: Best mic
            const best = await this.detectBestMicrophone();
            results.push(`🎤 Best mic: ${best?.label || 'None'}`);

            // Test 4: Battery
            results.push(`🔋 Battery: ${this.batteryLevel.toFixed(0)}% (${this.powerMode})`);

            // Test 5: Network
            results.push(`📡 Network: ${this.networkType} (${this.networkQuality})`);

            console.log('🧪 FULL TEST RESULTS:');
            results.forEach(r => console.log(r));

            this.showNotification("✅ Test dokončen - viz konzole", 'success', 4000);
        }

        exportDiagnostics() {
            const data = {
                version: this.version,
                timestamp: new Date().toISOString(),
                device: ENV,
                microphone: {
                    current: this.currentMicrophone,
                    history: this.micQualityHistory
                },
                commandHistory: this.commandHistory,
                errors: {
                    failCount: this.failCount,
                    lastError: this.lastError ? {
                        name: this.lastError.name,
                        message: this.lastError.message
                    } : null
                },
                system: {
                    battery: this.batteryLevel,
                    powerMode: this.powerMode,
                    network: this.networkType,
                    networkQuality: this.networkQuality
                }
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mobile-voice-diagnostic-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            this.showNotification("📋 Diagnostika exportována", 'success', 3000);
        }

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

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Dashboard */
                .mobile-dashboard {
                    position: fixed; bottom: 80px; right: 10px;
                    background: rgba(26, 26, 46, 0.95);
                    border: 2px solid #ff9800; border-radius: 12px;
                    padding: 10px; min-width: 200px;
                    box-shadow: 0 0 20px rgba(255, 152, 0, 0.4);
                    z-index: 9000; transition: all 0.3s;
                }
                .mobile-dashboard.hidden { opacity: 0; pointer-events: none; }
                .mobile-dashboard .dashboard-toggle {
                    position: absolute; top: -35px; right: 0;
                    width: 30px; height: 30px; background: #ff9800;
                    border-radius: 50%; display: flex;
                    align-items: center; justify-content: center;
                    cursor: pointer; font-size: 16px;
                }
                .dashboard-content { display: none; }
                .mobile-dashboard.expanded .dashboard-content { display: block; }
                .dashboard-content h4 {
                    margin: 0 0 10px 0; color: #ff9800;
                    font-size: 0.9em; text-align: center;
                }
                .status-grid { display: flex; flex-direction: column; gap: 8px; }
                .status-item {
                    display: flex; justify-content: space-between;
                    font-size: 0.85em; color: #fff;
                }
                .status-label { color: #ccc; }
                .status-value { color: #00d4ff; font-weight: bold; }

                /* Mic Level Meter */
                .mic-level-meter {
                    position: fixed; bottom: 80px; left: 10px;
                    background: rgba(26, 26, 46, 0.95);
                    border: 2px solid #4CAF50; border-radius: 10px;
                    padding: 8px 12px; min-width: 150px;
                    box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
                    z-index: 9000; transition: all 0.3s;
                }
                .mic-level-meter.hidden { opacity: 0; pointer-events: none; }
                .mic-level-label {
                    font-size: 0.75em; color: #ccc;
                    margin-bottom: 5px; text-align: center;
                }
                .mic-level-bar {
                    width: 100%; height: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px; overflow: hidden;
                    position: relative;
                }
                .mic-level-fill {
                    height: 100%; width: 0%;
                    background: linear-gradient(90deg, #4CAF50, #45a049);
                    transition: width 0.1s ease, background 0.3s;
                }
                .mic-level-text {
                    text-align: center; font-size: 0.8em;
                    color: #00d4ff; margin-top: 5px;
                    font-weight: bold;
                }

                /* Command History */
                .command-history {
                    position: fixed; top: 80px; right: 10px;
                    background: rgba(26, 26, 46, 0.95);
                    border: 2px solid #2196F3; border-radius: 12px;
                    padding: 10px; min-width: 220px;
                    max-height: 300px; overflow-y: auto;
                    box-shadow: 0 0 20px rgba(33, 150, 243, 0.4);
                    z-index: 9000; transition: all 0.3s;
                }
                .command-history.hidden { opacity: 0; pointer-events: none; }
                .history-toggle {
                    position: absolute; top: -35px; right: 0;
                    width: 30px; height: 30px; background: #2196F3;
                    border-radius: 50%; display: flex;
                    align-items: center; justify-content: center;
                    cursor: pointer; font-size: 16px;
                }
                .history-content { display: none; }
                .command-history.expanded .history-content { display: block; }
                .history-content h4 {
                    margin: 0 0 10px 0; color: #2196F3;
                    font-size: 0.9em; text-align: center;
                }
                .history-item {
                    display: flex; gap: 8px; align-items: center;
                    padding: 6px; border-radius: 5px;
                    background: rgba(255, 255, 255, 0.05);
                    margin-bottom: 5px; font-size: 0.8em;
                }
                .history-item.success { border-left: 3px solid #4CAF50; }
                .history-item.fail { border-left: 3px solid #dc3545; }
                .history-num { color: #888; font-weight: bold; }
                .history-text { flex: 1; color: #fff; }
                .history-icon { font-size: 1.2em; }

                /* Diagnostic Modal v2 */
                .diagnostic-modal-v2 {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 99999; backdrop-filter: blur(10px);
                }
                .diagnostic-modal-v2.hidden { display: none; }
                
                .diagnostic-content-v2 {
                    width: 95%; max-width: 500px; max-height: 90vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 3px solid #ff5722; border-radius: 15px;
                    box-shadow: 0 0 50px rgba(255, 87, 34, 0.7);
                    display: flex; flex-direction: column;
                    animation: diagnosticSlideIn 0.3s ease-out;
                }

                @keyframes diagnosticSlideIn {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .diagnostic-header-v2 {
                    background: linear-gradient(90deg, #ff5722, #ff9800);
                    color: #000; padding: 15px 20px;
                    display: flex; justify-content: space-between;
                    align-items: center; border-radius: 12px 12px 0 0;
                }
                .diagnostic-header-v2 h3 {
                    margin: 0; font-size: 1.1em; font-weight: bold;
                }
                
                .close-diagnostic-v2 {
                    background: none; border: none;
                    font-size: 28px; cursor: pointer;
                    color: #000; font-weight: bold;
                    width: 35px; height: 35px;
                    transition: transform 0.2s;
                }
                .close-diagnostic-v2:active { transform: scale(0.9); }

                .diagnostic-body-v2 {
                    padding: 20px; overflow-y: auto;
                    flex: 1; color: #fff;
                }

                .diag-section-v2 {
                    background: rgba(255, 255, 255, 0.05);
                    border-left: 3px solid #ff9800;
                    padding: 12px; margin-bottom: 15px;
                    border-radius: 5px;
                }
                .diag-section-v2.error {
                    border-left-color: #dc3545;
                    background: rgba(220, 53, 69, 0.1);
                }
                .diag-section-v2.suggestion {
                    border-left-color: #4CAF50;
                    background: rgba(76, 175, 80, 0.1);
                }
                .diag-section-v2 h4 {
                    margin: 0 0 10px 0; color: #ff9800;
                    font-size: 0.95em;
                }
                .diag-section-v2 p {
                    margin: 5px 0; font-size: 0.85em;
                    line-height: 1.4; color: #ddd;
                }

                .diagnostic-footer-v2 {
                    padding: 15px; display: flex; gap: 10px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.3);
                }
                .diag-btn-v2 {
                    flex: 1; padding: 12px; border: none;
                    border-radius: 8px; font-weight: bold;
                    cursor: pointer; font-size: 0.9em;
                    transition: all 0.2s;
                }
                .diag-btn-v2.retry {
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                }
                .diag-btn-v2.test {
                    background: linear-gradient(135deg, #2196F3, #1976D2);
                    color: white;
                }
                .diag-btn-v2.export {
                    background: linear-gradient(135deg, #ff9800, #f57c00);
                    color: white;
                }
                .diag-btn-v2:active { transform: scale(0.95); }

                /* Mobile optimizations */
                @media (max-width: 480px) {
                    .mobile-dashboard { bottom: 70px; right: 5px; min-width: 180px; }
                    .mic-level-meter { bottom: 70px; left: 5px; min-width: 130px; }
                    .command-history { top: 70px; right: 5px; min-width: 200px; }
                    .diagnostic-content-v2 { width: 98%; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ============================================================================
    // 🚀 INICIALIZACE
    // ============================================================================

    window.mobileVoiceHelper = null;

    const initMobileHelper = async () => {
        if (window.mobileVoiceHelper) return;
        
        try {
            window.mobileVoiceHelper = new MobileVoiceHelper();
            
            // Global exposure for console debugging
            window.mobileDiag = {
                showDashboard: () => {
                    const dash = document.getElementById('mobile-dashboard');
                    if (dash) dash.classList.remove('hidden');
                },
                showHistory: () => {
                    const hist = document.getElementById('mobile-command-history');
                    if (hist) hist.classList.remove('hidden');
                },
                showMeter: () => {
                    const meter = document.getElementById('mobile-mic-level-meter');
                    if (meter) meter.classList.remove('hidden');
                },
                runTest: () => window.mobileVoiceHelper.runFullTest(),
                export: () => window.mobileVoiceHelper.exportDiagnostics()
            };

            console.log(`
╔══════════════════════════════════════════════════════╗
║  ✅ MOBILE HELPER v2.0 READY                        ║
╠══════════════════════════════════════════════════════╣
║  Commands:                                           ║
║  • window.mobileDiag.showDashboard()                 ║
║  • window.mobileDiag.showHistory()                   ║
║  • window.mobileDiag.showMeter()                     ║
║  • window.mobileDiag.runTest()                       ║
║  • window.mobileDiag.export()                        ║
╚══════════════════════════════════════════════════════╝
            `);

        } catch (error) {
            console.error("❌ Mobile Helper init failed:", error);
        }
    };

    // Delayed init to ensure VoiceController is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initMobileHelper, 1500);
        });
    } else {
        setTimeout(initMobileHelper, 1500);
    }

})();
