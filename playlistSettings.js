// playlistSettings.js - Modulární nastavení playlistu
// Připojitelný soubor pro modal okno s nastavením playlistu
// Verze: 1.1 (DebugManager Integration)
const __playlistSettingsJS_START = performance.now();
 
const PlaylistSettings = {
    // Konfigurace
    // 🔇 DEBUG_MODE odstraněn - řízeno centrálně přes DebugManager

    // DOM elementy
    DOM: {
        settingsButton: null,
        modal: null,
        modalContent: null,
        closeButton: null,
        saveButton: null,
        cancelButton: null,
        playlist: null
    },

    // Aktuální nastavení
    currentSettings: {
        trackDisplayStyle: 'default',
        showTrackNumbers: true,
        showDuration: false,
        showFavoriteButtons: true,
        playlistTheme: 'dark',
        autoScroll: true,
        trackHoverEffect: true,
        animateTransitions: true,
        fontSize: 'medium',
        trackSpacing: 'normal',
        headerFontSizePx: 24,
        trackTitleFontSizePx: 20,
        mobileHeaderFontSizePx: 18,        // 📱 NOVÉ
        mobileTrackTitleFontSizePx: 16,    // 📱 NOVÉ
        customColors: {
            backgroundColor: '#1a1a1a',
            backgroundGradientStart: '#1a1a1a',
            backgroundGradientEnd: '#2d2d2d',
            textColor: '#ffffff',
            activeTrackColor: '#00ff88',
            activeTrackBackground: 'rgba(0, 255, 136, 0.2)',
            hoverColor: '#00ff88',
            hoverBackground: 'rgba(0, 255, 136, 0.1)',
            borderColor: '#444444',
            scrollbarColor: '#666666',
            favoriteStarColor: '#ffd700',
            trackNumberColor: '#888888'
        },
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 8,
        backgroundType: 'gradient',
        shadowEffect: true,
        glowEffect: false,
        
        // ═══════════════════════════════════════════════════════════════
        // 🎯 VÝŠKA PLAYLISTU - 4 SLIDERY (Více admirál Jiřík)
        // ═══════════════════════════════════════════════════════════════
        playlistHeightDesktopNormal: 270,      // Desktop - normální režim (px)
        playlistHeightDesktopFullscreen: 390,  // Desktop - fullscreen (px)
        playlistHeightMobileNormal: 184,       // Mobil - normální režim (px)
        playlistHeightMobileFullscreen: 296    // Mobil - fullscreen (px)
    },

    // Inicializace modulu
    init() {
        this.log('Inicializace PlaylistSettings modulu...');
        this.createElements();
        this.loadSettingsFromStorage();
        this.attachEventListeners();
       // ═══════════════════════════════════════════════════════════════
        // 🎯 Sledování fullscreen změn
        // ═══════════════════════════════════════════════════════════════
        document.addEventListener('fullscreenchange', () => this.applyPlaylistHeight());
        document.addEventListener('webkitfullscreenchange', () => this.applyPlaylistHeight());
        document.addEventListener('mozfullscreenchange', () => this.applyPlaylistHeight());
        
        // Sledování změny velikosti okna
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.applyPlaylistHeight(), 250);
        });
        
        this.log('PlaylistSettings modul inicializován.');
    },

    // Vytvoření HTML elementů
    createElements() {
        // Vytvoření tlačítka pro otevření nastavení
        this.DOM.settingsButton = document.createElement('button');
        this.DOM.settingsButton.id = 'playlist-settings-button';
        this.DOM.settingsButton.className = 'control-button settings-button';
        this.DOM.settingsButton.title = 'Nastavení playlistu (N)';
        this.DOM.settingsButton.innerHTML = '⚙️';

        // Přidání tlačítka do control panelu
        const controlsDiv = document.querySelector('#control-panel .controls');
        if (controlsDiv) {
            controlsDiv.appendChild(this.DOM.settingsButton);
            this.log('Tlačítko nastavení přidáno do control panelu.');
        } else {
            this.log('Control panel nenalezen, tlačítko přidáno do body.', null, 'warn');
            document.body.appendChild(this.DOM.settingsButton);
        }

        // Vytvoření modal okna
        this.createModal();
        
        // Najití playlist elementu
        this.DOM.playlist = document.getElementById('playlist');
        if (!this.DOM.playlist) {
            this.log('Playlist element nenalezen!', null, 'error');
        }
    },

    // Vytvoření modal okna
    createModal() {
        // Modal container
        this.DOM.modal = document.createElement('div');
        this.DOM.modal.id = 'playlist-settings-modal';
        this.DOM.modal.className = 'settings-modal';
        this.DOM.modal.style.display = 'none';

        // Modal content
        this.DOM.modalContent = document.createElement('div');
        this.DOM.modalContent.className = 'settings-modal-content';

        // Modal HTML obsah
        this.DOM.modalContent.innerHTML = this.getModalHTML();

        this.DOM.modal.appendChild(this.DOM.modalContent);
        document.body.appendChild(this.DOM.modal);

        // Cachování important elementů
        this.DOM.closeButton = this.DOM.modal.querySelector('.close-button');
        this.DOM.saveButton = this.DOM.modal.querySelector('.save-settings');
        this.DOM.cancelButton = this.DOM.modal.querySelector('.cancel-settings');

        this.log('Modal okno vytvořeno.');
    },

    // HTML obsah modalu
    getModalHTML() {
        return `
            <div class="settings-header">
                <h2>⚙️ Nastavení Playlistu</h2>
                <button class="close-button" title="Zavřít">&times;</button>
            </div>
            
            <div class="settings-body">
                <div class="settings-section">
                    <h3>🎨 Vzhled skladeb</h3>
                    <div class="setting-item">
                        <label for="track-display-style">Styl zobrazení:</label>
                        <select id="track-display-style" class="setting-select">
                            <option value="default">Výchozí</option>
                            <option value="minimal">Minimální</option>
                            <option value="detailed">Detailní</option>
                            <option value="compact">Kompaktní</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label for="playlist-theme">Barevné schéma:</label>
                        <select id="playlist-theme" class="setting-select">
                            <option value="dark">Tmavé</option>
                            <option value="light">Světlé</option>
                            <option value="neon">Neonové</option>
                            <option value="classic">Klasické</option>
                            <option value="custom">Vlastní barvy</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label for="font-size">Velikost písma:</label>
                        <select id="font-size" class="setting-select">
                            <option value="small">Malé</option>
                            <option value="medium">Střední</option>
                            <option value="large">Velké</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label for="track-spacing">Rozestupy mezi skladbami:</label>
                        <select id="track-spacing" class="setting-select">
                            <option value="compact">Kompaktní</option>
                            <option value="normal">Normální</option>
                            <option value="spacious">Prostorné</option>
                        </select>
                    </div>
                </div>
                    
                
                    <!-- řádek 195 brackets řádkování začátek      -->
                    <div class="setting-item">
                        <label for="header-font-size">💻 Velikost nadpisu (Header):</label>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="range" id="header-font-size" class="range-input" min="1" max="30" value="24">
                            <span class="range-value">24px</span>
                        </div>
                    </div>

                    <div class="setting-item">
                        <label for="track-title-font-size">💻 Velikost názvu skladby:</label>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="range" id="track-title-font-size" class="range-input" min="1" max="30" value="20">
                            <span class="range-value">20px</span>
                        </div>
                    </div>
                        <!-- řádek 211 brackets řádkování konec      -->
                    
                    <!-- 📱 MOBILE FONT SIZE SLIDERY - Více admirál Jiřík -->
<div class="setting-item">
    <label for="mobile-header-font-size">📱 Mobil - Velikost nadpisu (Header):</label>
    <div style="display:flex; align-items:center; gap:10px;">
        <input type="range" id="mobile-header-font-size" class="range-input" min="12" max="15" value="18">
        <span class="range-value" id="mobile-header-value">18px</span>
    </div>
</div>

<div class="setting-item">
    <label for="mobile-track-title-font-size">📱 Mobil - Velikost názvu skladby:</label>
    <div style="display:flex; align-items:center; gap:10px;">
        <input type="range" id="mobile-track-title-font-size" class="range-input" min="10" max="18" value="16">
        <span class="range-value" id="mobile-track-value">16px</span>
    </div>
</div>           

                  <!-- ═══════════════════════════════════════════════════ -->
                <!-- 🎯 NOVÁ SEKCE: VÝŠKA PLAYLISTU (4 SLIDERY)        -->
                <!-- Více admirál Jiřík - Funkční slidery               -->
                <!-- ═══════════════════════════════════════════════════ -->
                <div class="settings-section">
                    <h3>📏 Výška playlistu</h3>
                    
                    <!-- 💻 Desktop Normal -->
                    <div class="setting-item">
                        <label for="height-desktop-normal">🖥️ Desktop (Normální režim):</label>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="range" id="height-desktop-normal" class="range-input height-slider" 
                                   min="100" max="337" value="270" data-mode="desktopNormal">
                            <span class="range-value">270px</span>
                        </div>
                    </div>

                    <!-- 💻 Desktop Fullscreen -->
                    <div class="setting-item">
                        <label for="height-desktop-fullscreen">🖥️ Desktop (Fullscreen):</label>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="range" id="height-desktop-fullscreen" class="range-input height-slider" 
                                   min="100" max="494" value="372" data-mode="desktopFullscreen">
                            <span class="range-value">390px</span>
                        </div>
                    </div>

                    <!-- 📱 Mobil Normal -->
                    <div class="setting-item">
                        <label for="height-mobile-normal">📱 Mobil (Normální režim):</label>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="range" id="height-mobile-normal" class="range-input height-slider" 
                                   min="50" max="600" value="184" data-mode="mobileNormal">
                            <span class="range-value">184px</span>
                        </div>
                    </div>

                    <!-- 📱 Mobil Fullscreen -->
                    <div class="setting-item">
                        <label for="height-mobile-fullscreen">📱 Mobil (Fullscreen):</label>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="range" id="height-mobile-fullscreen" class="range-input height-slider" 
                                   min="50" max="600" value="296" data-mode="mobileFullscreen">
                            <span class="range-value">296px</span>
                        </div>
                    </div>
                </div>


                <div class="settings-section" id="custom-colors-section">
                    <h3>🌈 Vlastní barvy</h3>
                    <div class="color-settings-grid">
                        <div class="color-setting-item">
                            <label for="background-type">Typ pozadí:</label>
                            <select id="background-type" class="setting-select">
                                <option value="solid">Jednotná barva</option>
                                <option value="gradient">Gradient</option>
                            </select>
                        </div>
                        
                        <div class="color-setting-item">
                            <label for="bg-color">Barva pozadí:</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="bg-color" class="color-input" value="#1a1a1a">
                                <span class="color-value">#1a1a1a</span>
                            </div>
                        </div>
                        
                        <div class="color-setting-item gradient-only">
                            <label for="bg-gradient-end">Barva gradientu (konec):</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="bg-gradient-end" class="color-input" value="#2d2d2d">
                                <span class="color-value">#2d2d2d</span>
                            </div>
                        </div>
                        
                        <div class="color-setting-item">
                            <label for="text-color">Barva textu:</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="text-color" class="color-input" value="#ffffff">
                                <span class="color-value">#ffffff</span>
                            </div>
                        </div>
                        
                        <div class="color-setting-item">
                            <label for="active-track-color">Barva aktivní skladby:</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="active-track-color" class="color-input" value="#00ff88">
                                <span class="color-value">#00ff88</span>
                            </div>
                        </div>
                        
                        <div class="color-setting-item">
                            <label for="hover-color">Barva při najetí myší:</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="hover-color" class="color-input" value="#00ff88">
                                <span class="color-value">#00ff88</span>
                            </div>
                        </div>
                        
                        <div class="color-setting-item">
                            <label for="border-color">Barva okrajů:</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="border-color" class="color-input" value="#444444">
                                <span class="color-value">#444444</span>
                            </div>
                        </div>
                        
                        <div class="color-setting-item">
                            <label for="favorite-star-color">Barva hvězdičky oblíbených:</label>
                            <div class="color-input-wrapper">
                                <input type="color" id="favorite-star-color" class="color-input" value="#ffd700">
                                <span class="color-value">#ffd700</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="color-presets">
                        <label>Rychlé barevné předvolby:</label>
                        <div class="preset-buttons">
                            <button type="button" class="preset-btn" data-preset="dark-blue" style="background: linear-gradient(135deg, #0f1419 0%, #1a365d 100%);">Tmavě modrá</button>
                            <button type="button" class="preset-btn" data-preset="purple-pink" style="background: linear-gradient(135deg, #2d1b69 0%, #8b5cf6 100%);">Fialově růžová</button>
                            <button type="button" class="preset-btn" data-preset="green-forest" style="background: linear-gradient(135deg, #064e3b 0%, #10b981 100%);">Zelený les</button>
                            <button type="button" class="preset-btn" data-preset="orange-sunset" style="background: linear-gradient(135deg, #7c2d12 0%, #f97316 100%);">Oranžový západ</button>
                            <button type="button" class="preset-btn" data-preset="cyberpunk" style="background: linear-gradient(135deg, #0a0a0a 0%, #ff00ff 100%);">Cyberpunk</button>
                            <!-- 🆕 NOVÉ STAR TREK PRESETY -->
<button type="button" class="preset-btn" data-preset="enterprise-command" style="background: linear-gradient(135deg, #1a0000 0%, #cc0000 100%);">Enterprise Command</button>
<button type="button" class="preset-btn" data-preset="voyager-astrometrics" style="background: linear-gradient(135deg, #000d1a 0%, #0066ff 100%);">Voyager Astrometrics</button>
<button type="button" class="preset-btn" data-preset="deep-space-nine" style="background: linear-gradient(135deg, #1a1100 0%, #cc8800 100%);">Deep Space Nine</button>
<button type="button" class="preset-btn" data-preset="borg-cube" style="background: linear-gradient(135deg, #000a00 0%, #00ff00 100%);">Borg Cube</button>
<button type="button" class="preset-btn" data-preset="romulan-warbird" style="background: linear-gradient(135deg, #001a00 0%, #00cc44 100%);">Romulan Warbird</button>
<button type="button" class="preset-btn" data-preset="klingon-bridge" style="background: linear-gradient(135deg, #330000 0%, #ff0000 100%);">Klingon Bridge</button>    

                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>✨ Styly a efekty</h3>
                    <div class="setting-item">
                        <label for="border-style">Styl okrajů:</label>
                        <select id="border-style" class="setting-select">
                            <option value="solid">Plný</option>
                            <option value="dashed">Čárkovaný</option>
                            <option value="dotted">Tečkovaný</option>
                            <option value="double">Dvojitý</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label for="border-width">Šířka okrajů (px):</label>
                        <input type="range" id="border-width" class="range-input" min="0" max="10" value="2">
                        <span class="range-value">2px</span>
                    </div>
                    
                    <div class="setting-item">
                        <label for="border-radius">Zaoblení rohů (px):</label>
                        <input type="range" id="border-radius" class="range-input" min="0" max="130" value="8">
                        <span class="range-value">8px</span>
                    </div>
                    
                    <div class="setting-item checkbox-item">
                        <input type="checkbox" id="shadow-effect" class="setting-checkbox">
                        <label for="shadow-effect">Efekt stínu</label>
                    </div>
                    
                    <div class="setting-item checkbox-item">
                        <input type="checkbox" id="glow-effect" class="setting-checkbox">
                        <label for="glow-effect">Efekt svícení</label>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>📋 Zobrazované informace</h3>
                    <div class="setting-item checkbox-item">
                        <input type="checkbox" id="show-track-numbers" class="setting-checkbox">
                        <label for="show-track-numbers">Zobrazit čísla skladeb</label>
                    </div>
                    
                    <div class="setting-item checkbox-item">
                        <input type="checkbox" id="show-duration" class="setting-checkbox">
                        <label for="show-duration">Zobrazit délku skladby</label>
                    </div>
                    
                    <div class="setting-item checkbox-item">
                        <input type="checkbox" id="show-favorite-buttons" class="setting-checkbox">
                        <label for="show-favorite-buttons">Zobrazit tlačítka oblíbených</label>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>⚡ Chování</h3>
                    <div class="setting-item checkbox-item">
                        <input type="checkbox" id="auto-scroll" class="setting-checkbox">
                        <label for="auto-scroll">Automatické posouvání k aktivní skladbě</label>
                    </div>
                    
                    <div class="setting-item checkbox-item">
                        <input type="checkbox" id="track-hover-effect" class="setting-checkbox">
                        <label for="track-hover-effect">Efekt při najetí myší</label>
                    </div>
                    
                    <div class="setting-item checkbox-item">
                        <input type="checkbox" id="animate-transitions" class="setting-checkbox">
                        <label for="animate-transitions">Animované přechody</label>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>🔄 Akce</h3>
                    <div class="setting-item">
                        <button id="reset-playlist-settings" class="action-button reset-button">
                            🔄 Obnovit výchozí nastavení
                        </button>
                    </div>
                    <div class="setting-item">
                        <button id="export-settings" class="action-button">
                            📤 Exportovat nastavení
                        </button>
                    </div>
                    <div class="setting-item">
                        <button id="import-settings" class="action-button">
                            📥 Importovat nastavení
                        </button>
                        <input type="file" id="import-file" accept=".json" style="display: none;">
                    </div>
                </div>
            </div>
            
            <div class="settings-footer">
                <button class="cancel-settings">Zrušit</button>
                <button class="save-settings">Uložit nastavení</button>
            </div>
        `;
    },

    // Připojení event listenerů
    attachEventListeners() {
        // Otevření modalu
        this.DOM.settingsButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal();
        });

        // Zavření modalu
        this.DOM.closeButton?.addEventListener('click', () => this.closeModal());
        this.DOM.cancelButton?.addEventListener('click', () => this.closeModal());

        // Uložení nastavení
        this.DOM.saveButton?.addEventListener('click', () => this.saveSettings());

        // Zavření při kliknutí mimo modal
        this.DOM.modal?.addEventListener('click', (e) => {
            if (e.target === this.DOM.modal) {
                this.closeModal();
            }
        });

        // Klávesové zkratky
        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
            
            switch (e.code) {
                case 'KeyN':
                    if (!this.isModalOpen()) {
                        this.openModal();
                        e.preventDefault();
                    }
                    break;
                case 'Escape':
                    if (this.isModalOpen()) {
                        this.closeModal();
                        e.preventDefault();
                    }
                    break;
            }
        });

        // Event listenery pro akční tlačítka
        this.attachActionListeners();

        // Event listenery pro barevná nastavení
        this.attachColorListeners();

        this.log('Event listenery připojeny.');
    },

    // Připojení listenerů pro akční tlačítka
    attachActionListeners() {
        // Reset nastavení
        const resetButton = this.DOM.modal?.querySelector('#reset-playlist-settings');
        resetButton?.addEventListener('click', () => this.resetSettings());

        // Export nastavení
        const exportButton = this.DOM.modal?.querySelector('#export-settings');
        exportButton?.addEventListener('click', () => this.exportSettings());

        // Import nastavení
        const importButton = this.DOM.modal?.querySelector('#import-settings');
        const importFile = this.DOM.modal?.querySelector('#import-file');
        
        importButton?.addEventListener('click', () => importFile?.click());
        importFile?.addEventListener('change', (e) => this.importSettings(e));

        // Live preview při změnách
        const inputs = this.DOM.modal?.querySelectorAll('select, input[type="checkbox"], input[type="color"], input[type="range"]');
        inputs?.forEach(input => {
            input.addEventListener('change', () => {
                if (input.id !== 'import-file') {
                    this.updatePreview();
                }
            });
            
            // Pro range inputy přidáme i input event pro live aktualizaci
            if (input.type === 'range') {
                input.addEventListener('input', () => {
                    this.updateRangeValue(input);
                    this.updatePreview();
                });
            }
        });

        
        // ═══════════════════════════════════════════════════════════════
        // 🎯 LIVE PREVIEW PRO SLIDERY VÝŠKY (Okamžitá odezva)
        // ═══════════════════════════════════════════════════════════════
        const heightSliders = this.DOM.modal?.querySelectorAll('.height-slider');
        heightSliders?.forEach(slider => {
            slider.addEventListener('input', () => {
                // Aktualizace zobrazené hodnoty
                this.updateRangeValue(slider);
                
                // Okamžitá změna výšky
                const mode = slider.dataset.mode;
                const value = parseInt(slider.value);
                
                // Dočasná změna nastavení pro preview
                switch(mode) {
                    case 'desktopNormal':
                        this.currentSettings.playlistHeightDesktopNormal = value;
                        break;
                    case 'desktopFullscreen':
                        this.currentSettings.playlistHeightDesktopFullscreen = value;
                        break;
                    case 'mobileNormal':
                        this.currentSettings.playlistHeightMobileNormal = value;
                        break;
                    case 'mobileFullscreen':
                        this.currentSettings.playlistHeightMobileFullscreen = value;
                        break;
                }
                
                // Aplikuj novou výšku HNED
                this.applyPlaylistHeight();
            });
        });
    },

    // Event listenery pro barevná nastavení
    attachColorListeners() {
        // Playlist theme change listener
        const themeSelect = this.DOM.modal?.querySelector('#playlist-theme');
        themeSelect?.addEventListener('change', () => {
            this.toggleCustomColorsSection();
        });

        // Background type change listener
        const backgroundTypeSelect = this.DOM.modal?.querySelector('#background-type');
        backgroundTypeSelect?.addEventListener('change', () => {
            this.toggleGradientSettings();
        });

        // Color input listeners s live aktualizací hodnot
        const colorInputs = this.DOM.modal?.querySelectorAll('input[type="color"]');
        colorInputs?.forEach(input => {
            input.addEventListener('input', () => {
                this.updateColorValue(input);
                this.updatePreview();
            });
        });

        // Preset buttons listeners
        const presetButtons = this.DOM.modal?.querySelectorAll('.preset-btn');
        presetButtons?.forEach(button => {
            button.addEventListener('click', () => {
                const preset = button.dataset.preset;
                this.applyColorPreset(preset);
            });
        });
    },

    // Aktualizace zobrazené hodnoty u range inputů
    updateRangeValue(input) {
        const valueSpan = input.parentElement?.querySelector('.range-value');
        if (valueSpan) {
            valueSpan.textContent = `${input.value}px`;
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🚀 DETEKCE ZAŘÍZENÍ (Desktop vs Mobil + Fullscreen)
    // ═══════════════════════════════════════════════════════════════
    detectDevice() {
        const screenWidth = window.innerWidth;
        const userAgent = navigator.userAgent.toLowerCase();
        
        const isAndroidMobile = (
            userAgent.includes('android') && 
            userAgent.includes('mobile')
        );
        
        const isMobile = (
            isAndroidMobile || 
            (screenWidth <= 768 && userAgent.includes('mobile'))
        );
        
        return {
            isMobile: isMobile,
            isDesktop: !isMobile,
            isFullscreen: document.fullscreenElement !== null
        };
    },

    // ═══════════════════════════════════════════════════════════════
    // 🎯 APLIKACE VÝŠKY PLAYLISTU PODLE ZAŘÍZENÍ A REŽIMU
    // ═══════════════════════════════════════════════════════════════
    applyPlaylistHeight() {
        if (!this.DOM.playlist) return;
        
        const device = this.detectDevice();
        let height;
        
        if (device.isDesktop) {
            height = device.isFullscreen 
                ? this.currentSettings.playlistHeightDesktopFullscreen 
                : this.currentSettings.playlistHeightDesktopNormal;
        } else {
            height = device.isFullscreen 
                ? this.currentSettings.playlistHeightMobileFullscreen 
                : this.currentSettings.playlistHeightMobileNormal;
        }
        
        this.DOM.playlist.style.maxHeight = `${height}px`;
        
        // 🔍 Debug log
        this.log(`📏 Výška playlistu: ${height}px | Desktop: ${device.isDesktop} | Fullscreen: ${device.isFullscreen}`);
    },

    // Aktualizace zobrazené hodnoty u color inputů
    updateColorValue(input) {
        const valueSpan = input.parentElement?.querySelector('.color-value');
        if (valueSpan) {
            valueSpan.textContent = input.value.toUpperCase();
        }
    },

    // Zobrazení/skrytí sekce vlastních barev
    toggleCustomColorsSection() {
        const customColorsSection = this.DOM.modal?.querySelector('#custom-colors-section');
        const themeSelect = this.DOM.modal?.querySelector('#playlist-theme');
        
        if (customColorsSection && themeSelect) {
            const isCustomTheme = themeSelect.value === 'custom';
            customColorsSection.style.display = isCustomTheme ? 'block' : 'none';
        }
    },

    // Zobrazení/skrytí nastavení gradientu
    toggleGradientSettings() {
        const gradientElements = this.DOM.modal?.querySelectorAll('.gradient-only');
        const backgroundTypeSelect = this.DOM.modal?.querySelector('#background-type');
        
        if (gradientElements && backgroundTypeSelect) {
            const isGradient = backgroundTypeSelect.value === 'gradient';
            gradientElements.forEach(element => {
                element.style.display = isGradient ? 'block' : 'none';
            });
        }
    },

    // Aplikování barevných presetů
    applyColorPreset(presetName) {
        const presets = {
            'dark-blue': {
                backgroundColor: '#0f1419',
                backgroundGradientStart: '#0f1419',
                backgroundGradientEnd: '#1a365d',
                textColor: '#ffffff',
                activeTrackColor: '#3b82f6',
                hoverColor: '#60a5fa',
                borderColor: '#1e40af',
                favoriteStarColor: '#fbbf24'
            },
            'purple-pink': {
                backgroundColor: '#2d1b69',
                backgroundGradientStart: '#2d1b69',
                backgroundGradientEnd: '#8b5cf6',
                textColor: '#ffffff',
                activeTrackColor: '#a855f7',
                hoverColor: '#c084fc',
                borderColor: '#7c3aed',
                favoriteStarColor: '#f472b6'
            },
            'green-forest': {
                backgroundColor: '#064e3b',
                backgroundGradientStart: '#064e3b',
                backgroundGradientEnd: '#10b981',
                textColor: '#ffffff',
                activeTrackColor: '#34d399',
                hoverColor: '#6ee7b7',
                borderColor: '#059669',
                favoriteStarColor: '#fbbf24'
            },
            'orange-sunset': {
                backgroundColor: '#7c2d12',
                backgroundGradientStart: '#7c2d12',
                backgroundGradientEnd: '#f97316',
                textColor: '#ffffff',
                activeTrackColor: '#fb923c',
                hoverColor: '#fdba74',
                borderColor: '#ea580c',
                favoriteStarColor: '#fef3c7'
            },
            'cyberpunk': {
                backgroundColor: '#0a0a0a',
                backgroundGradientStart: '#0a0a0a',
                backgroundGradientEnd: '#1a0033',
                textColor: '#00ff88',
                activeTrackColor: '#ff00ff',
                hoverColor: '#ff44ff',
                borderColor: '#ff00ff',
                favoriteStarColor: '#00ffff'
            },
       // 🆕 STAR TREK PRESETY - OPRAVENÁ VERZE (TMAVŠÍ)
'enterprise-command': {
    backgroundColor: '#1a0000',
    backgroundGradientStart: '#1a0000',
    backgroundGradientEnd: '#8b0000',
    textColor: '#ffffff',
    activeTrackColor: '#cc0000',
    hoverColor: '#ff3333',
    borderColor: '#660000',
    favoriteStarColor: '#ffcc00'
},
'voyager-astrometrics': {
    backgroundColor: '#000d1a',
    backgroundGradientStart: '#000d1a',
    backgroundGradientEnd: '#003d7a',
    textColor: '#e0f0ff',
    activeTrackColor: '#0080ff',
    hoverColor: '#3399ff',
    borderColor: '#004080',
    favoriteStarColor: '#ffaa00'
},
'deep-space-nine': {
    backgroundColor: '#1a1100',
    backgroundGradientStart: '#1a1100',
    backgroundGradientEnd: '#FF8C00',
    textColor: '#ffddaa',
    activeTrackColor: '#cc6600',
    hoverColor: '#ff8833',
    borderColor: '#663300',
    favoriteStarColor: '#ffdd00'
},
'borg-cube': {
    backgroundColor: '#000a00',
    backgroundGradientStart: '#000a00',
    backgroundGradientEnd: '#006400',
    textColor: '#00ff00',
    activeTrackColor: '#00ff00',
    hoverColor: '#33ff33',
    borderColor: '#008800',
    favoriteStarColor: '#00ffff'
},
'romulan-warbird': {
    backgroundColor: '#001a00',
    backgroundGradientStart: '#001a00',
    backgroundGradientEnd: '#006622',
    textColor: '#ccffcc',
    activeTrackColor: '#00cc44',
    hoverColor: '#33ff66',
    borderColor: '#004411',
    favoriteStarColor: '#ffdd00'
},
'klingon-bridge': {
    backgroundColor: '#1a0000',
    backgroundGradientStart: '#1a0000',
    backgroundGradientEnd: '#92000A',
    textColor: '#ffcccc',
    activeTrackColor: '#ff0000',
    hoverColor: '#ff4444',
    borderColor: '#880000',
    favoriteStarColor: '#ffaa00'
}
        };

        const preset = presets[presetName];
        if (!preset) return;

        // Aplikování preset hodnot do formuláře
        Object.entries({
            'bg-color': 'backgroundColor',
            'bg-gradient-end': 'backgroundGradientEnd',
            'text-color': 'textColor',
            'active-track-color': 'activeTrackColor',
            'hover-color': 'hoverColor',
            'border-color': 'borderColor',
            'favorite-star-color': 'favoriteStarColor'
        }).forEach(([id, setting]) => {
            const element = this.DOM.modal.querySelector(`#${id}`);
            if (element && preset[setting]) {
                element.value = preset[setting];
                this.updateColorValue(element);
            }
        });

        // Automaticky přepneme na gradient typ
        const backgroundTypeSelect = this.DOM.modal?.querySelector('#background-type');
        if (backgroundTypeSelect) {
            backgroundTypeSelect.value = 'gradient';
            this.toggleGradientSettings();
        }

        // Live preview
        this.updatePreview();

        if (window.showNotification) {
            window.showNotification(`🎨 Preset "${presetName}" aplikován!`, 'info', 2000);
        }
    },

    // Otevření modalu
    openModal() {
        if (!this.DOM.modal) return;
        
        this.loadSettingsToForm();
        this.DOM.modal.style.display = 'flex';
        this.DOM.settingsButton?.classList.add('active');
        
        // Fokus na první input
        const firstInput = this.DOM.modal.querySelector('select, input');
        firstInput?.focus();
        
        this.log('Modal otevřen.');
    },

    // Zavření modalu
    closeModal() {
        if (!this.DOM.modal) return;
        
        this.DOM.modal.style.display = 'none';
        this.DOM.settingsButton?.classList.remove('active');
        this.log('Modal zavřen.');
    },

    // Zkontrolování, zda je modal otevřen
    isModalOpen() {
        return this.DOM.modal?.style.display === 'flex';
    },

    // Načtení nastavení do formuláře
    loadSettingsToForm() {
        if (!this.DOM.modal) return;

        // Select elementy
        Object.entries({
            'track-display-style': 'trackDisplayStyle',
            'playlist-theme': 'playlistTheme',
            'font-size': 'fontSize',
            'track-spacing': 'trackSpacing',
            'background-type': 'backgroundType',
            'border-style': 'borderStyle'
        }).forEach(([id, setting]) => {
            const element = this.DOM.modal.querySelector(`#${id}`);
            if (element) element.value = this.currentSettings[setting];
        });

        // Checkbox elementy
        Object.entries({
            'show-track-numbers': 'showTrackNumbers',
            'show-duration': 'showDuration',
            'show-favorite-buttons': 'showFavoriteButtons',
            'auto-scroll': 'autoScroll',
            'track-hover-effect': 'trackHoverEffect',
            'animate-transitions': 'animateTransitions',
            'shadow-effect': 'shadowEffect',
            'glow-effect': 'glowEffect'
        }).forEach(([id, setting]) => {
            const element = this.DOM.modal.querySelector(`#${id}`);
            if (element) element.checked = this.currentSettings[setting];
        });

        // Color input elementy
        Object.entries({
            'bg-color': 'backgroundColor',
            'bg-gradient-end': 'backgroundGradientEnd',
            'text-color': 'textColor',
            'active-track-color': 'activeTrackColor',
            'hover-color': 'hoverColor',
            'border-color': 'borderColor',
            'favorite-star-color': 'favoriteStarColor'
        }).forEach(([id, setting]) => {
            const element = this.DOM.modal.querySelector(`#${id}`);
            if (element && this.currentSettings.customColors) {
                element.value = this.currentSettings.customColors[setting];
                // Aktualizace zobrazované hodnoty
                const valueSpan = element.parentElement?.querySelector('.color-value');
                if (valueSpan) valueSpan.textContent = element.value;
            }
        });

        // Range input elementy
        const borderWidthInput = this.DOM.modal.querySelector('#border-width');
        if (borderWidthInput) {
            borderWidthInput.value = this.currentSettings.borderWidth;
            const valueSpan = borderWidthInput.parentElement?.querySelector('.range-value');
            if (valueSpan) valueSpan.textContent = `${borderWidthInput.value}px`;
        }

        const borderRadiusInput = this.DOM.modal.querySelector('#border-radius');
        if (borderRadiusInput) {
            borderRadiusInput.value = this.currentSettings.borderRadius;
            const valueSpan = borderRadiusInput.parentElement?.querySelector('.range-value');
            if (valueSpan) valueSpan.textContent = `${borderRadiusInput.value}px`;
        }

             //<!-- řádek 939 brackets řádkování začátek      -->
        /* 🆕 Načtení velikosti písma do posuvníků */
        const headerFontInput = this.DOM.modal.querySelector('#header-font-size');
        if (headerFontInput && this.currentSettings.headerFontSizePx) {
            headerFontInput.value = this.currentSettings.headerFontSizePx;
            this.updateRangeValue(headerFontInput);
        }

        const trackTitleFontInput = this.DOM.modal.querySelector('#track-title-font-size');
        if (trackTitleFontInput && this.currentSettings.trackTitleFontSizePx) {
            trackTitleFontInput.value = this.currentSettings.trackTitleFontSizePx;
            this.updateRangeValue(trackTitleFontInput);
        }
          //<!-- řádek 952 brackets řádkování konec      -->
         // 📱 NOVÉ - Mobile font sizes
const mobileHeaderFontInput = this.DOM.modal.querySelector('#mobile-header-font-size');
if (mobileHeaderFontInput && this.currentSettings.mobileHeaderFontSizePx) {
    mobileHeaderFontInput.value = this.currentSettings.mobileHeaderFontSizePx;
    this.updateRangeValue(mobileHeaderFontInput);
}

const mobileTrackTitleFontInput = this.DOM.modal.querySelector('#mobile-track-title-font-size');
if (mobileTrackTitleFontInput && this.currentSettings.mobileTrackTitleFontSizePx) {
    mobileTrackTitleFontInput.value = this.currentSettings.mobileTrackTitleFontSizePx;
    this.updateRangeValue(mobileTrackTitleFontInput);
}

       // ═══════════════════════════════════════════════════════════════
        // 🎯 Načtení výšek playlistu do sliderů
        // ═══════════════════════════════════════════════════════════════
        const heightDesktopNormal = this.DOM.modal.querySelector('#height-desktop-normal');
        if (heightDesktopNormal && this.currentSettings.playlistHeightDesktopNormal) {
            heightDesktopNormal.value = this.currentSettings.playlistHeightDesktopNormal;
            this.updateRangeValue(heightDesktopNormal);
        }

        const heightDesktopFullscreen = this.DOM.modal.querySelector('#height-desktop-fullscreen');
        if (heightDesktopFullscreen && this.currentSettings.playlistHeightDesktopFullscreen) {
            heightDesktopFullscreen.value = this.currentSettings.playlistHeightDesktopFullscreen;
            this.updateRangeValue(heightDesktopFullscreen);
        }

        const heightMobileNormal = this.DOM.modal.querySelector('#height-mobile-normal');
        if (heightMobileNormal && this.currentSettings.playlistHeightMobileNormal) {
            heightMobileNormal.value = this.currentSettings.playlistHeightMobileNormal;
            this.updateRangeValue(heightMobileNormal);
        }

        const heightMobileFullscreen = this.DOM.modal.querySelector('#height-mobile-fullscreen');
        if (heightMobileFullscreen && this.currentSettings.playlistHeightMobileFullscreen) {
            heightMobileFullscreen.value = this.currentSettings.playlistHeightMobileFullscreen;
            this.updateRangeValue(heightMobileFullscreen);
        }

        // Zobrazení/skrytí gradient nastavení
        this.toggleGradientSettings();
        this.toggleCustomColorsSection();
    },

    // Získání nastavení z formuláře
    getSettingsFromForm() {
        if (!this.DOM.modal) return this.currentSettings;

        const newSettings = { ...this.currentSettings };

        // Select elementy
        Object.entries({
            'track-display-style': 'trackDisplayStyle',
            'playlist-theme': 'playlistTheme',
            'font-size': 'fontSize',
            'track-spacing': 'trackSpacing',
            'background-type': 'backgroundType',
            'border-style': 'borderStyle'
        }).forEach(([id, setting]) => {
            const element = this.DOM.modal.querySelector(`#${id}`);
            if (element) newSettings[setting] = element.value;
        });

        // Checkbox elementy
        Object.entries({
            'show-track-numbers': 'showTrackNumbers',
            'show-duration': 'showDuration',
            'show-favorite-buttons': 'showFavoriteButtons',
            'auto-scroll': 'autoScroll',
            'track-hover-effect': 'trackHoverEffect',
            'animate-transitions': 'animateTransitions',
            'shadow-effect': 'shadowEffect',
            'glow-effect': 'glowEffect'
        }).forEach(([id, setting]) => {
            const element = this.DOM.modal.querySelector(`#${id}`);
            if (element) newSettings[setting] = element.checked;
        });

        // Color input elementy
        newSettings.customColors = { ...this.currentSettings.customColors };
        Object.entries({
            'bg-color': 'backgroundColor',
            'bg-gradient-end': 'backgroundGradientEnd',
            'text-color': 'textColor',
            'active-track-color': 'activeTrackColor',
            'hover-color': 'hoverColor',
            'border-color': 'borderColor',
            'favorite-star-color': 'favoriteStarColor'
        }).forEach(([id, setting]) => {
            const element = this.DOM.modal.querySelector(`#${id}`);
            if (element) newSettings.customColors[setting] = element.value;
        });

        // Range input elementy
        const borderWidthInput = this.DOM.modal.querySelector('#border-width');
        if (borderWidthInput) newSettings.borderWidth = parseInt(borderWidthInput.value);

        const borderRadiusInput = this.DOM.modal.querySelector('#border-radius');
        if (borderRadiusInput) newSettings.borderRadius = parseInt(borderRadiusInput.value);
        
              // <!-- řádek 1042 brackets řádkování začátek      -->            
       // 📱 NOVÉ - Mobile font sizes
const mobileHeaderFontInput = this.DOM.modal.querySelector('#mobile-header-font-size');
if (mobileHeaderFontInput) newSettings.mobileHeaderFontSizePx = parseInt(mobileHeaderFontInput.value);

const mobileTrackTitleFontInput = this.DOM.modal.querySelector('#mobile-track-title-font-size');
if (mobileTrackTitleFontInput) newSettings.mobileTrackTitleFontSizePx = parseInt(mobileTrackTitleFontInput.value);
     
            
            
            
            /* 🆕 Uložení velikosti písma z posuvníků */
        const headerFontInput = this.DOM.modal.querySelector('#header-font-size');
        if (headerFontInput) newSettings.headerFontSizePx = parseInt(headerFontInput.value);

        const trackTitleFontInput = this.DOM.modal.querySelector('#track-title-font-size');
        if (trackTitleFontInput) newSettings.trackTitleFontSizePx = parseInt(trackTitleFontInput.value);
            //<!-- řádek 1049 brackets řádkování konec      -->
            
       // ═══════════════════════════════════════════════════════════════
        // 🎯 Uložení výšek playlistu ze sliderů
        // ═══════════════════════════════════════════════════════════════
        const heightDesktopNormal = this.DOM.modal.querySelector('#height-desktop-normal');
        if (heightDesktopNormal) newSettings.playlistHeightDesktopNormal = parseInt(heightDesktopNormal.value);

        const heightDesktopFullscreen = this.DOM.modal.querySelector('#height-desktop-fullscreen');
        if (heightDesktopFullscreen) newSettings.playlistHeightDesktopFullscreen = parseInt(heightDesktopFullscreen.value);

        const heightMobileNormal = this.DOM.modal.querySelector('#height-mobile-normal');
        if (heightMobileNormal) newSettings.playlistHeightMobileNormal = parseInt(heightMobileNormal.value);

        const heightMobileFullscreen = this.DOM.modal.querySelector('#height-mobile-fullscreen');
        if (heightMobileFullscreen) newSettings.playlistHeightMobileFullscreen = parseInt(heightMobileFullscreen.value);
            
        return newSettings;
    },

    // Uložení nastavení
    async saveSettings() {
        const newSettings = this.getSettingsFromForm();
        this.currentSettings = { ...newSettings };
        
        await this.saveSettingsToStorage();
        this.applySettings();
        this.closeModal();
        
        if (window.showNotification) {
            window.showNotification('✅ Nastavení playlistu uloženo!', 'info', 2000);
        }
        
        this.log('Nastavení uloženo:', this.currentSettings);
    },

    // Načtení nastavení z úložiště
    async loadSettingsFromStorage() {
        try {
            // Pokus o načtení z Firestore
            if (window.loadPlaylistSettingsFromFirestore) {
                const firestoreSettings = await window.loadPlaylistSettingsFromFirestore();
                if (firestoreSettings) {
                    this.currentSettings = { ...this.currentSettings, ...firestoreSettings };
                    this.log('Nastavení načteno z Firestore.');
                    this.applySettings();
                    return;
                }
            }
            
            // Fallback na localStorage
            const savedSettings = localStorage.getItem('playlistSettings');
            if (savedSettings) {
                this.currentSettings = { ...this.currentSettings, ...JSON.parse(savedSettings) };
                this.log('Nastavení načteno z localStorage.');
            } else {
                this.log('Žádná uložená nastavení nenalezena, používám výchozí.');
            }
            
            this.applySettings();
        } catch (error) {
            this.log('Chyba při načítání nastavení:', error, 'error');
            if (window.showNotification) {
                window.showNotification('Chyba při načítání nastavení playlistu.', 'error');
            }
        }
    },

    // Uložení nastavení do úložiště
    async saveSettingsToStorage() {
        try {
            // Uložení do localStorage
            localStorage.setItem('playlistSettings', JSON.stringify(this.currentSettings));
            
            // Pokus o uložení do Firestore
            if (window.savePlaylistSettingsToFirestore) {
                await window.savePlaylistSettingsToFirestore(this.currentSettings);
                this.log('Nastavení uloženo do Firestore.');
            } else {
                this.log('Firestore funkce nedostupná, uloženo pouze do localStorage.');
            }
        } catch (error) {
            this.log('Chyba při ukládání nastavení:', error, 'error');
            if (window.showNotification) {
                window.showNotification('Chyba při ukládání nastavení do cloudu.', 'error');
            }
        }
    },

    // Aplikování nastavení na playlist
    applySettings() {
        if (!this.DOM.playlist) return;

        const playlist = this.DOM.playlist;
        const settings = this.currentSettings;

        // Odstranění starých CSS tříd
        playlist.classList.remove(
            'playlist-minimal', 'playlist-detailed', 'playlist-compact',
            'theme-dark', 'theme-light', 'theme-neon', 'theme-classic',
            'font-small', 'font-medium', 'font-large',
            'spacing-compact', 'spacing-normal', 'spacing-spacious',
            'no-hover-effect', 'no-animations'
        );

        // Aplikování nových CSS tříd
        if (settings.trackDisplayStyle !== 'default') {
            playlist.classList.add(`playlist-${settings.trackDisplayStyle}`);
        }
        
        playlist.classList.add(`theme-${settings.playlistTheme}`);
        playlist.classList.add(`font-${settings.fontSize}`);
        playlist.classList.add(`spacing-${settings.trackSpacing}`);
        
        if (!settings.trackHoverEffect) {
            playlist.classList.add('no-hover-effect');
        }
        
        if (!settings.animateTransitions) {
            playlist.classList.add('no-animations');
        }

        // Aplikování custom CSS pro specifické funkce
        this.applyCustomStyles();
        
       // ═══════════════════════════════════════════════════════════════
        // 🎯 Aplikace výšky playlistu
        // ═══════════════════════════════════════════════════════════════
        this.applyPlaylistHeight();
        
        this.log('Všechna nastavení aplikována.');
    },


    // Aplikování custom CSS stylů
    applyCustomStyles() {
        let customCSS = '';
        const settings = this.currentSettings;
        const colors = settings.customColors;
        
        /*<!-- řádek 1189 brackets řádkování začátek      -->*/
        /* 🆕 APLIKACE VELIKOSTI PÍSMA HLAVIČKY */
        const h1Size = settings.headerFontSizePx || 24; 
        const h2Size = settings.trackTitleFontSizePx || 20;
 
        customCSS += `
            /* Přebijeme inline styly v index.html pomocí !important */
            h1#nazev-prehravace {
                font-size: ${h1Size}px !important;
            }
            h2#trackTitle {
                font-size: ${h2Size}px !important;
            }
        `;
        //<!-- řádek 1203 brackets řádkování konec      -->
        
        // 📱 NOVÉ - Mobile responsive font sizes
const mobileH1Size = settings.mobileHeaderFontSizePx || 18;
const mobileH2Size = settings.mobileTrackTitleFontSizePx || 16;

customCSS += `
    @media (max-width: 768px) {
        h1#nazev-prehravace {
            font-size: ${mobileH1Size}px !important;
        }
        h2#trackTitle {
            font-size: ${mobileH2Size}px !important;
        }
    }
`;
        
        
        
        // Skrytí/zobrazení čísel skladeb
        if (!settings.showTrackNumbers) {
            customCSS += '.playlist .track-number { display: none !important; }';
        }

        // Skrytí/zobrazení délky skladby
        if (!settings.showDuration) {
            customCSS += '.playlist .track-duration { display: none !important; }';
        }

        // Skrytí/zobrazení tlačítek oblíbených
        if (!settings.showFavoriteButtons) {
            customCSS += '.playlist .favorite-button { display: none !important; }';
        }

        // Vlastní barevné schéma
        if (settings.playlistTheme === 'custom') {
            const backgroundStyle = settings.backgroundType === 'gradient' 
                ? `linear-gradient(135deg, ${colors.backgroundColor} 0%, ${colors.backgroundGradientEnd} 100%)`
                : colors.backgroundColor;

            customCSS += `
                .playlist.theme-custom {
                    background: ${backgroundStyle} !important;
                    color: ${colors.textColor} !important;
                    border: ${settings.borderWidth}px ${settings.borderStyle} ${colors.borderColor} !important;
                    border-radius: ${settings.borderRadius}px !important;
                    
                    /* --- 🛠️ JIŘÍKOVA STABILIZACE + VZDUCH --- */
                    box-sizing: border-box !important;  /* Rámeček se počítá dovnitř (nepřeteče) */
                    
                    /* Tady přidáme trochu vzduchu, aby text nebyl nalepený na rámečku: */
                    padding: 4px !important;            
                    
                    /* Centrování na mobilu: */
                    margin-left: auto !important;       
                    margin-right: auto !important;
                    width: 98% !important;              /* Jistota, aby se nedotýkal okrajů displeje */
                    /* -------------------------------------- */

                    ${settings.shadowEffect ? 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;' : ''}
                    ${settings.glowEffect ? `box-shadow: 0 0 20px ${colors.activeTrackColor}40 !important;` : ''}
                }
                
                .playlist.theme-custom .playlist-item {
                    color: ${colors.textColor} !important;
                    border-color: ${colors.borderColor}33 !important;
                }
                
                .playlist.theme-custom .playlist-item.active {
                    background-color: ${this.hexToRgba(colors.activeTrackColor, 0.2)} !important;
                    color: ${colors.activeTrackColor} !important;
                    border-color: ${colors.activeTrackColor} !important;
                    ${settings.glowEffect ? `box-shadow: 0 0 10px ${colors.activeTrackColor}66 !important;` : ''}
                }
                
                .playlist.theme-custom .playlist-item:hover {
                    background-color: ${this.hexToRgba(colors.hoverColor, 0.1)} !important;
                    color: ${colors.hoverColor} !important;
                    border-color: ${colors.hoverColor}66 !important;
                }
                
                .playlist.theme-custom .favorite-button {
                    color: ${colors.favoriteStarColor} !important;
                }
                
                .playlist.theme-custom .track-number {
                    color: ${colors.trackNumberColor} !important;
                }
                
                .playlist.theme-custom::-webkit-scrollbar-thumb {
                    background: ${colors.scrollbarColor} !important;
                }
                
                .playlist.theme-custom::-webkit-scrollbar-thumb:hover {
                    background: ${colors.activeTrackColor} !important;
                }
            `;
        }

        // Aplikování CSS
        let styleElement = document.getElementById('playlist-custom-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'playlist-custom-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = customCSS;
    },

    // Převod hex barvy na rgba
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    // Live preview změn
    updatePreview() {
        const tempSettings = this.getSettingsFromForm();
        const originalSettings = { ...this.currentSettings };
        this.currentSettings = { ...tempSettings };
        this.applySettings();
        // Nastavení se vrátí při zavření/uložení
    },

    // Reset nastavení na výchozí hodnoty
    async resetSettings() {
        if (!confirm('Opravdu chcete obnovit všechna nastavení na výchozí hodnoty?')) {
            return;
        }

        this.currentSettings = {
            trackDisplayStyle: 'default',
            showTrackNumbers: true,
            showDuration: false,
            showFavoriteButtons: true,
            playlistTheme: 'dark',
            autoScroll: true,
            trackHoverEffect: true,
            animateTransitions: true,
            fontSize: 'medium',
            trackSpacing: 'normal',
            customColors: {
                backgroundColor: '#1a1a1a',
                backgroundGradientStart: '#1a1a1a',
                backgroundGradientEnd: '#2d2d2d',
                textColor: '#ffffff',
                activeTrackColor: '#00ff88',
                activeTrackBackground: 'rgba(0, 255, 136, 0.2)',
                hoverColor: '#00ff88',
                hoverBackground: 'rgba(0, 255, 136, 0.1)',
                borderColor: '#444444',
                scrollbarColor: '#666666',
                favoriteStarColor: '#ffd700',
                trackNumberColor: '#888888'
            },
            borderStyle: 'solid',
            borderWidth: 2,
            borderRadius: 8,
            backgroundType: 'gradient',
            shadowEffect: true,
            glowEffect: false
        };

        await this.saveSettingsToStorage();
        this.loadSettingsToForm();
        this.applySettings();

        if (window.showNotification) {
            window.showNotification('🔄 Nastavení obnoveno na výchozí hodnoty!', 'info');
        }

        this.log('Nastavení resetováno.');
    },

    // Export nastavení
    exportSettings() {
        const settingsBlob = new Blob(
            [JSON.stringify(this.currentSettings, null, 2)],
            { type: 'application/json' }
        );
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(settingsBlob);
        link.download = `playlist-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
        
        if (window.showNotification) {
            window.showNotification('📤 Nastavení exportováno!', 'info');
        }
        
        this.log('Nastavení exportováno.');
    },

    // Import nastavení
    async importSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importedSettings = JSON.parse(text);
            
            // Validace nastavení
            if (this.validateSettings(importedSettings)) {
                this.currentSettings = { ...this.currentSettings, ...importedSettings };
                await this.saveSettingsToStorage();
                this.loadSettingsToForm();
                this.applySettings();
                
                if (window.showNotification) {
                    window.showNotification('📥 Nastavení úspěšně importováno!', 'info');
                }
                
                this.log('Nastavení importováno:', importedSettings);
            } else {
                throw new Error('Neplatný formát souboru s nastavením.');
            }
        } catch (error) {
            this.log('Chyba při importu nastavení:', error, 'error');
            if (window.showNotification) {
                window.showNotification('❌ Chyba při importu nastavení!', 'error');
            }
        }

        // Reset file input
        event.target.value = '';
    },

    // Validace importovaných nastavení
    validateSettings(settings) {
        if (!settings || typeof settings !== 'object') return false;
        
        const validKeys = Object.keys(this.currentSettings);
        const importedKeys = Object.keys(settings);
        
        // Alespoň jeden platný klíč musí být přítomen
        return importedKeys.some(key => validKeys.includes(key));
    },

    // Logging funkce (Nové centrální řízení)
    log(message, data = null, level = 'info') {
        // Chyby a varování vypisujeme vždy (bezpečnost)
        if (level === 'error') {
            console.error(`[PlaylistSettings] ${message}`, data || '');
            return;
        }
        if (level === 'warn') {
            console.warn(`[PlaylistSettings] ${message}`, data || '');
            return;
        }
        
        // Informativní výpisy řídí DebugManager
        window.DebugManager?.log('playlistSettings', message, data || '');
    },

    // Public API pro externí použití
    getSettings() {
        return { ...this.currentSettings };
    },

    updateSettings(newSettings) {
        this.currentSettings = { ...this.currentSettings, ...newSettings };
        this.applySettings();
        this.saveSettingsToStorage();
    },

    // Cleanup funkce
    destroy() {
        if (this.DOM.modal) {
            this.DOM.modal.remove();
        }
        if (this.DOM.settingsButton) {
            this.DOM.settingsButton.remove();
        }
        
        const styleElement = document.getElementById('playlist-custom-styles');
        if (styleElement) {
            styleElement.remove();
        }
        
        this.log('PlaylistSettings modul zničen.');
    }
};

 

// Automatická inicializace při načtení DOM
document.addEventListener('DOMContentLoaded', () => {

    
    // Inicializace modulu s malým zpožděním
    setTimeout(() => {
        if (typeof PlaylistSettings !== 'undefined') {
            PlaylistSettings.init();
        }
    }, 500);
});

// Export pro použití v jiných souborech
if (typeof window !== 'undefined') {
    window.PlaylistSettings = PlaylistSettings;
}

// Export pro Node.js prostředí
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlaylistSettings;

}

console.log(`%c🚀 [playlistSettingsJS] Načteno za ${(performance.now() - __playlistSettingsJS_START).toFixed(2)} ms`, 'background: #000; color: #00ff00; font-weight: bold; padding: 2px;');

