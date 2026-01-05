/**
 * 🚀 SPRÁVA ROZHRANÍ - Media Session & UI Enhancement Module
 * Rozšířený modul pro vylepšení Android notifikací a UI ovládání
 * Více admirál Jiřík © 2025
 * Verze: 1.1 (DebugManager Integration)
 */

// 🔇 Starý přepínač odstraněn - nyní řízeno přes DebugManager (klíč 'interface')
// const DEBUG_ROZHRANI = false;
const __ MediaSessionAPI_START = performance.now();
 
// --- Media Session API Manager ---
class MediaSessionManager {
    constructor() {
        this.isSupported = 'mediaSession' in navigator;
        this.currentArtwork = null;
        this.positionState = {
            duration: 0,
            playbackRate: 1.0,
            position: 0
        };
        
        window.DebugManager?.log('interface', 'MediaSessionManager: Inicializace', {
            supported: this.isSupported,
            userAgent: navigator.userAgent
        });
    }

    /**
     * Inicializace Media Session s plnou sadou ovládacích prvků
     */
    initialize(audioPlayer) {
        if (!this.isSupported) {
            window.DebugManager?.log('interface', 'MediaSessionManager: Media Session API není podporováno');
            return false;
        }

        try {
            // Nastavení action handlerů - OPRAVENO pro toggle play/pause
            navigator.mediaSession.setActionHandler('play', () => {
                window.DebugManager?.log('interface', 'MediaSession: Play action');
                if (audioPlayer.paused) {
                    audioPlayer.play().catch(e => console.error('Play error:', e));
                }
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                window.DebugManager?.log('interface', 'MediaSession: Pause action');
                if (!audioPlayer.paused) {
                    audioPlayer.pause();
                }
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                window.DebugManager?.log('interface', 'MediaSession: Previous track action');
                document.getElementById('prev-button')?.click();
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                window.DebugManager?.log('interface', 'MediaSession: Next track action');
                document.getElementById('next-button')?.click();
            });

            navigator.mediaSession.setActionHandler('stop', () => {
                window.DebugManager?.log('interface', 'MediaSession: Stop action');
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            });

            // Seek actions (posun ±15 sekund)
            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                const seekTime = details.seekOffset || 15;
                window.DebugManager?.log('interface', `MediaSession: Seek backward ${seekTime}s`);
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - seekTime);
            });

            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                const seekTime = details.seekOffset || 15;
                window.DebugManager?.log('interface', `MediaSession: Seek forward ${seekTime}s`);
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + seekTime);
            });

            // Seek to position (přetažení progress baru v notifikaci - pokud zařízení podporuje)
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.fastSeek && 'fastSeek' in audioPlayer) {
                    audioPlayer.fastSeek(details.seekTime);
                } else {
                    audioPlayer.currentTime = details.seekTime;
                }
                window.DebugManager?.log('interface', `MediaSession: Seek to ${details.seekTime}s`);
            });

            window.DebugManager?.log('interface', 'MediaSessionManager: Všechny action handlery inicializovány');
            return true;

        } catch (error) {
            console.error('MediaSessionManager: Chyba při inicializaci:', error);
            return false;
        }
    }

    /**
     * Aktualizace metadat v notifikaci
     */
    updateMetadata(track, artwork = null) {
        if (!this.isSupported) return;

        try {
            const metadata = {
                title: track.title || 'Neznámý track',
                artist: track.artist || 'Star Trek Collection',
                album: track.album || 'Hudební přehrávač',
                artwork: []
            };

            // Přidání artworku (cover art)
            if (artwork) {
                this.currentArtwork = artwork;
            }

            if (this.currentArtwork) {
                metadata.artwork = [
                    {
                        src: this.currentArtwork,
                        sizes: '512x512',
                        type: 'image/jpeg'
                    },
                    {
                        src: this.currentArtwork,
                        sizes: '256x256',
                        type: 'image/jpeg'
                    }
                ];
            }

            navigator.mediaSession.metadata = new MediaMetadata(metadata);
            
            // DŮLEŽITÉ: Udržet playback state jako 'playing' i během přepínání
            if (navigator.mediaSession.playbackState !== 'playing') {
                navigator.mediaSession.playbackState = 'playing';
            }
            
            window.DebugManager?.log('interface', 'MediaSessionManager: Metadata aktualizována', metadata);

        } catch (error) {
            console.error('MediaSessionManager: Chyba při aktualizaci metadat:', error);
        }
    }

    /**
     * Předběžná aktualizace metadat (volat PŘED načtením tracku)
     */
    preloadMetadata(track, artwork = null) {
        if (!this.isSupported) return;

        try {
            // Okamžitě zobrazíme nový track v notifikaci
            const metadata = {
                title: track.title || 'Načítání...',
                artist: track.artist || 'Star Trek Collection',
                album: track.album || 'Hudební přehrávač',
                artwork: []
            };

            if (artwork) {
                this.currentArtwork = artwork;
            }

            if (this.currentArtwork) {
                metadata.artwork = [
                    {
                        src: this.currentArtwork,
                        sizes: '512x512',
                        type: 'image/jpeg'
                    }
                ];
            }

            navigator.mediaSession.metadata = new MediaMetadata(metadata);
            
            // Udržíme notifikaci aktivní
            navigator.mediaSession.playbackState = 'playing';
            
            window.DebugManager?.log('interface', 'MediaSessionManager: Preload metadata:', metadata);

        } catch (error) {
            console.error('MediaSessionManager: Chyba při preload metadat:', error);
        }
    }

    /**
     * Aktualizace position state (progress bar v notifikaci)
     */
    updatePositionState(duration, position, playbackRate = 1.0) {
        if (!this.isSupported) return;

        try {
            if (isFinite(duration) && duration > 0) {
                this.positionState = {
                    duration: duration,
                    playbackRate: playbackRate,
                    position: Math.min(position, duration)
                };

                navigator.mediaSession.setPositionState(this.positionState);
                
                window.DebugManager?.log('interface', 'MediaSessionManager: Position state aktualizován', this.positionState);
            }
        } catch (error) {
            console.error('MediaSessionManager: Chyba při aktualizaci position state:', error);
        }
    }

    /**
     * Nastavení playback state
     */
    setPlaybackState(state) {
        if (!this.isSupported) return;
        
        try {
            navigator.mediaSession.playbackState = state; // 'none', 'paused', 'playing'
            window.DebugManager?.log('interface', 'MediaSessionManager: Playback state:', state);
        } catch (error) {
            console.error('MediaSessionManager: Chyba při nastavení playback state:', error);
        }
    }

    /**
     * Reset Media Session
     */
    reset() {
        if (!this.isSupported) return;
        
        try {
            navigator.mediaSession.metadata = null;
            navigator.mediaSession.playbackState = 'none';
            this.currentArtwork = null;
            window.DebugManager?.log('interface', 'MediaSessionManager: Reset dokončen');
        } catch (error) {
            console.error('MediaSessionManager: Chyba při resetu:', error);
        }
    }
}

// --- Quick Volume Controls Manager (Opravená kalibrace) ---
// --- Quick Volume Controls Manager (Toggle Edition) ---
class QuickVolumeManager {
    constructor() {
        // Presety odpovídající pozici slideru
        this.presets = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        this.container = null;
        this.buttons = [];
        this.isVisible = false; // Stav viditelnosti
    }

    createUI() {
        // 1. Vytvoření kontejneru
        this.container = document.createElement('div');
        this.container.id = 'quick-volume-controls';
        this.container.className = 'quick-volume-container';
        
        // 🕵️ VÝCHOZÍ STAV: SKRYTO (Maskování zapnuto)
        this.container.style.display = 'none'; 

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'quick-volume-buttons';

        // 2. Vytvoření tlačítek presetů
        this.presets.forEach(percent => {
            const button = document.createElement('button');
            button.className = 'quick-volume-button';
            button.dataset.volume = percent;
            button.textContent = `${percent}`;
            button.title = `Nastavit posuvník na ${percent}%`;
            
            button.addEventListener('click', () => this.setVolume(percent));
            
            this.buttons.push(button);
            buttonsContainer.appendChild(button);
        });

        this.container.appendChild(buttonsContainer);

        // 3. Vložení do DOMu (vedle slideru nebo do panelu)
        const volumeSlider = document.getElementById('volume-slider');
        const controlPanel = document.getElementById('control-panel');
        
        if (volumeSlider && volumeSlider.parentElement) {
            volumeSlider.parentElement.parentElement.insertBefore(
                this.container, 
                volumeSlider.parentElement.nextSibling
            );
        } else if (controlPanel) {
            controlPanel.appendChild(this.container);
        }

        // 4. 🔗 NAPOJENÍ NA TVÉ TLAČÍTKO (zobrazit-panel-hlasitosti)
        const toggleButton = document.getElementById('zobrazit-panel-hlasitosti');
        if (toggleButton) {
            window.DebugManager?.log('interface', 'QuickVolume: Tlačítko pro zobrazení nalezeno a připojeno.');
            
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleVisibility();
                // Vizuální efekt aktivního tlačítka
                toggleButton.classList.toggle('active', this.isVisible);
            });
        } else {
            console.warn('QuickVolumeManager: Tlačítko #zobrazit-panel-hlasitosti nenalezeno!');
        }
    }
//////////////////////////
    /**
     * Přepínání viditelnosti panelu (Maskování ON/OFF)
     */
    /**
     * Přepínání viditelnosti panelu (Maskování ON/OFF)
     */
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.container.style.display = this.isVisible ? 'block' : 'none';
        
        if (this.isVisible) {
            // Animace příletu
            this.container.style.animation = 'fadeIn 0.3s ease-out';
        }
        
        // 1. Nastavení textu notifikace (stručně a jasně)
        const msgText = this.isVisible 
            ? 'Panel hlasitosti zobrazen' 
            : 'Panel hlasitosti skryt';

        // 2. Zobrazení notifikace na 3 sekundy
        window.showNotification?.(msgText, 'info', 3000);
        
        // Log pro kontrolu
        window.DebugManager?.log('interface', `QuickVolume: Panel ${this.isVisible ? 'SHOWN' : 'HIDDEN'}`);
    }
//////////////////////////
    setVolume(percent) {
        const audioPlayer = document.getElementById('audioPlayer');
        const volumeSlider = document.getElementById('volume-slider');
        
        if (!audioPlayer || !volumeSlider) return;

        // Výpočet: Procenta -> Slider -> Hlasitost^3
        const sliderValue = percent / 100;
        const volumeValue = Math.pow(sliderValue, 3);
        
        volumeSlider.value = sliderValue;
        audioPlayer.volume = volumeValue;
        audioPlayer.muted = false;

        this.updateActiveButton(percent);
        volumeSlider.dispatchEvent(new Event('input'));
        
        if (window.showNotification) {
            window.showNotification(`Posuvník: ${percent}%`, 'info', 2100);
        }
    }

    updateActiveButton(currentPercent) {
        this.buttons.forEach(button => {
            const buttonPercent = parseInt(button.dataset.volume);
            const isActive = Math.abs(buttonPercent - currentPercent) <= 1;
            button.classList.toggle('active', isActive);
        });
    }

    syncWithSlider(audioPlayer) {
        const volumeSlider = document.getElementById('volume-slider');
        if (!volumeSlider) return;

        const updateFromSlider = () => {
            const currentSliderPercent = Math.round(volumeSlider.value * 100);
            this.updateActiveButton(currentSliderPercent);
        };

        volumeSlider.addEventListener('input', updateFromSlider);
        audioPlayer.addEventListener('volumechange', () => {
             const sliderValFromVol = Math.pow(audioPlayer.volume, 1/3) * 100;
             this.updateActiveButton(Math.round(sliderValFromVol));
        });
    }
}

// --- Vylepšený Progress Bar Manager ---
class EnhancedProgressManager {
    constructor(audioPlayer) {
        this.audioPlayer = audioPlayer;
        this.progressBar = document.getElementById('progress-bar');
        this.updateInterval = null;
        this.isUserSeeking = false;
    }

    /**
     * Inicializace vylepšeného progress baru
     */
    initialize() {
        if (!this.progressBar) {
            console.error('EnhancedProgressManager: Progress bar nenalezen');
            return;
        }

        // Vylepšené event listenery
        this.progressBar.addEventListener('mousedown', () => {
            this.isUserSeeking = true;
        });

        this.progressBar.addEventListener('mouseup', () => {
            this.isUserSeeking = false;
        });

        this.progressBar.addEventListener('touchstart', () => {
            this.isUserSeeking = true;
        });

        this.progressBar.addEventListener('touchend', () => {
            this.isUserSeeking = false;
        });

        // Plynulá aktualizace (60 FPS)
        this.startSmoothUpdate();

        window.DebugManager?.log('interface', 'EnhancedProgressManager: Inicializováno');
    }

    /**
     * Plynulá aktualizace progress baru
     */
    startSmoothUpdate() {
        if (this.updateInterval) {
            cancelAnimationFrame(this.updateInterval);
        }

        const update = () => {
            if (!this.isUserSeeking && this.audioPlayer.duration > 0) {
                const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                this.progressBar.value = progress;
            }
            this.updateInterval = requestAnimationFrame(update);
        };

        this.updateInterval = requestAnimationFrame(update);
    }

    /**
     * Zastavení aktualizace
     */
    stop() {
        if (this.updateInterval) {
            cancelAnimationFrame(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// --- Hlavní třída pro správu rozhraní ---
class InterfaceManager {
    constructor() {
        this.mediaSession = new MediaSessionManager();
        this.quickVolume = new QuickVolumeManager();
        this.progressManager = null;
        this.audioPlayer = null;
        this.isInitialized = false;
    }

    /**
     * Plná inicializace všech modulů
     */
    async initialize() {
        if (this.isInitialized) {
            // Varování necháme v logu, je to užitečné
            window.DebugManager?.log('interface', 'InterfaceManager: Již inicializováno');
            return;
        }

        // Počkat na DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        this.audioPlayer = document.getElementById('audioPlayer');
        if (!this.audioPlayer) {
            console.error('InterfaceManager: Audio player nenalezen');
            return false;
        }

        // Inicializace Media Session
        this.mediaSession.initialize(this.audioPlayer);

        // Quick Volume UI - deaktivováno na žádost více admirála
          this.quickVolume.createUI(); //
          this.quickVolume.syncWithSlider(this.audioPlayer); //

        // Inicializace Enhanced Progress
        this.progressManager = new EnhancedProgressManager(this.audioPlayer);
        this.progressManager.initialize();

        // Event listenery pro automatickou aktualizaci
        this.setupEventListeners();

        this.isInitialized = true;
        
        window.DebugManager?.log('interface', 'InterfaceManager: Kompletní inicializace dokončena');
        
        if (window.showNotification) {
            window.showNotification('nazev funke doplnit podle kodu??', 'info', 2000);
        }

        return true;
    }

    /**
     * Nastavení event listenerů
     */
    setupEventListeners() {
        // Zachytíme změnu tracku PŘED načtením (hook do playTrack funkce)
        this.hookIntoPlayTrack();

        // Aktualizace metadat při načtení
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            const trackTitle = document.getElementById('trackTitle')?.textContent || 'Neznámý track';
            
            this.mediaSession.updateMetadata({
                title: trackTitle,
                artist: 'Star Trek Collection',
                album: 'Hudební přehrávač'
            }, this.getDefaultArtwork());

            this.mediaSession.updatePositionState(
                this.audioPlayer.duration,
                this.audioPlayer.currentTime
            );
        });

        // Aktualizace position state při změně času
        this.audioPlayer.addEventListener('timeupdate', () => {
            if (this.audioPlayer.duration > 0) {
                this.mediaSession.updatePositionState(
                    this.audioPlayer.duration,
                    this.audioPlayer.currentTime
                );
            }
        });

        // Aktualizace playback state - VYLEPŠENO s debug výpisem
        this.audioPlayer.addEventListener('play', () => {
            this.mediaSession.setPlaybackState('playing');
            window.DebugManager?.log('interface', 'InterfaceManager: Audio PLAY event → playbackState=playing');
        });

        this.audioPlayer.addEventListener('pause', () => {
            // Nastavíme vždy 'paused' pro správnou synchronizaci s notifikací
            this.mediaSession.setPlaybackState('paused');
            window.DebugManager?.log('interface', 'InterfaceManager: Audio PAUSE event → playbackState=paused');
        });

        this.audioPlayer.addEventListener('ended', () => {
            // Při skončení tracku nastavíme paused
            this.mediaSession.setPlaybackState('paused');
            window.DebugManager?.log('interface', 'InterfaceManager: Audio ENDED event → playbackState=paused');
        });

        // Zachytíme loading state
        this.audioPlayer.addEventListener('loadstart', () => {
            // Udržíme notifikaci aktivní během načítání
            this.mediaSession.setPlaybackState('playing');
        });

        this.audioPlayer.addEventListener('waiting', () => {
            // Během bufferingu ponecháme 'playing'
            this.mediaSession.setPlaybackState('playing');
        });

        window.DebugManager?.log('interface', 'InterfaceManager: Event listenery nastaveny');
    }

    /**
     * Hook do playTrack funkce pro okamžitou aktualizaci metadat
     */
    hookIntoPlayTrack() {
        // Monitorujeme změny v #trackTitle
        const trackTitle = document.getElementById('trackTitle');
        if (!trackTitle) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const newTitle = trackTitle.textContent;
                    if (newTitle && newTitle !== 'Playlist je prázdný') {
                        // Okamžitě aktualizujeme metadata
                        this.mediaSession.preloadMetadata({
                            title: newTitle,
                            artist: 'Star Trek Collection',
                            album: 'Hudební přehrávač'
                        }, this.getDefaultArtwork());
                        
                        window.DebugManager?.log('interface', 'InterfaceManager: Track změněn na:', newTitle);
                    }
                }
            });
        });

        observer.observe(trackTitle, {
            childList: true,
            characterData: true,
            subtree: true
        });

        window.DebugManager?.log('interface', 'InterfaceManager: MutationObserver aktivován pro trackTitle');
    }

    /**
     * Získání výchozího artworku (Star Trek logo)
     */
    getDefaultArtwork() {
        // Vlastní logo více admirála Jiříka - 512×512 px
        return 'https://img40.rajce.idnes.cz/d4003/19/19517/19517492_984d6887838eae80a8eb677199393188/images/image_512x512_2.jpg?ver=0';
    }

    /**
     * Manuální aktualizace metadat (pro volání z hlavního skriptu)
     */
    updateTrackInfo(track, artwork = null) {
        this.mediaSession.updateMetadata(track, artwork || this.getDefaultArtwork());
    }

    /**
     * Reset všech modulů
     */
    reset() {
        this.mediaSession.reset();
        this.progressManager?.stop();
        window.DebugManager?.log('interface', 'InterfaceManager: Reset dokončen');
    }
}

// --- Export globální instance ---
window.interfaceManager = new InterfaceManager();

// --- CSS Styly pro Quick Volume Controls ---
const styles = document.createElement('style');
styles.textContent = `
    .quick-volume-container {
        margin: 10px 0;
        padding: 15px;
        background: rgba(0, 100, 200, 0.15);
        border: 1px solid rgba(100, 200, 255, 0.3);
        border-radius: 8px;
        backdrop-filter: blur(10px);
    }

    .quick-volume-title {
        color: #00BFFF;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
        text-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
    }

    .quick-volume-buttons {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
    }

    .quick-volume-button {
        flex: 1;
        min-width: 55px;
        padding: 12px 8px;
        background: linear-gradient(135deg, rgba(0, 100, 200, 0.3), rgba(0, 150, 255, 0.2));
        border: 2px solid rgba(0, 191, 255, 0.4);
        border-radius: 6px;
        color: #00BFFF;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        text-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .quick-volume-button:hover {
        background: linear-gradient(135deg, rgba(0, 150, 255, 0.4), rgba(0, 200, 255, 0.3));
        border-color: rgba(0, 255, 255, 0.6);
        box-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
        transform: translateY(-2px);
    }

    .quick-volume-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    }

    .quick-volume-button.active {
        background: linear-gradient(135deg, rgba(0, 191, 255, 0.5), rgba(0, 255, 255, 0.4));
        border-color: #00FFFF;
        color: #FFF;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 10px rgba(0, 255, 255, 0.3);
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }

    /* Responzivní design pro mobily */
    @media (max-width: 768px) {
        .quick-volume-buttons {
            gap: 5px;
        }

        .quick-volume-button {
            min-width: 50px;
            padding: 10px 5px;
            font-size: 12px;
        }
    }

    /* Vylepšení progress baru */
    #progress-bar {
        cursor: pointer;
        transition: all 0.2s ease;
    }

    #progress-bar:hover {
        transform: scaleY(1.2);
    }

    #progress-bar:active {
        cursor: grabbing;
    }
`;
document.head.appendChild(styles);

// --- Auto-inicializace ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.interfaceManager.initialize();
    });
} else {
    window.interfaceManager.initialize();
}

window.DebugManager?.log('interface', '🚀 Modul sprava-rozhrani.js načten - Verze 1.1 - Více admirál Jiřík');

console.log(`%c🚀 [MediaSessionAPI] Načteno za ${(performance.now() - __MediaSessionAPI_START).toFixed(2)} ms`, 'background: #000; color: #00ff00; font-weight: bold; padding: 2px;');
