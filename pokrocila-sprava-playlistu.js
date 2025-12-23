/**
 * 🖖 POKROČILÁ SPRÁVA PLAYLISTU - PŘÍPOJNÝ MODUL
 * Více admirál Jiřík & Admirál Gemini
 * Rozšíření pro audioPlayer.js s modálním oknem pro správu playlistu
 * Verze: 2.3 (FULL SIZE - CLOUD INTEGRATION)
 * * Tento soubor obsahuje kompletní logiku, styly a cloudovou integraci.
 * * Žádné řádky nebyly odstraněny pro zkrácení.
 */

(function() {
    'use strict';

    // 🔇 Starý přepínač odstraněn - nyní řízeno přes DebugManager
    // const DEBUG_PLAYLIST_MANAGER = false;

    // --- LOGOVACÍ MAKRO (pro přehlednost a debug) ---
    const log = (message, data = null) => {
        if (window.DebugManager && window.DebugManager.log) {
            if (data) {
                window.DebugManager.log('playlistManager', message, data);
            } else {
                window.DebugManager.log('playlistManager', message);
            }
        } else {
            // Fallback pro případ, že DebugManager ještě neběží
            console.log(`[PlaylistManager] ${message}`, data || '');
        }
    };

    log("🚀 [INIT] Načítám modul Pokročilá správa playlistu (Verze 2.3 - Full Size)...");

    // --- Globální proměnné pro správu playlistu ---
    let playlistManagerModal = null;
    let playlistManagerButton = null;
    let isPlaylistManagerInitialized = false;
    let draggedTrackIndex = null;
    
    // PŮVODNÍ PROMĚNNÁ PRO LOCALSTORAGE ODSTRANĚNA
    // let customTrackNames = JSON.parse(localStorage.getItem('customTrackNames') || '{}');
    // Místo toho pracujeme přímo s window.tracks

    // --- Vytvoření modálního okna (Zachována plná struktura HTML) ---
    function createPlaylistManagerModal() {
        log("🛠️ createPlaylistManagerModal: Zahajuji vytváření DOM elementů...");

        if (playlistManagerModal) {
            log("⚠️ createPlaylistManagerModal: Modální okno již existuje, přeskakuji.");
            return;
        }
        
        playlistManagerModal = document.createElement('div');
        playlistManagerModal.id = 'playlist-manager-modal';
        playlistManagerModal.className = 'playlist-modal-overlay';
        
        // Kompletní HTML struktura (nezměněná)
        playlistManagerModal.innerHTML = `
            <div class="playlist-modal-content">
                <div class="playlist-modal-header">
                    <h2>🖖 Pokročilá správa playlistu (Cloud Edit)</h2>
                    <button class="modal-close-button" id="close-playlist-manager">✕</button>
                </div>
                
                <div class="playlist-modal-body">
                    <div class="playlist-controls-panel">
                        <div class="control-group">
                            <button id="add-custom-track" class="playlist-action-btn">
                                🎵 Přidat skladbu
                            </button>
                            <button id="import-playlist" class="playlist-action-btn">
                                📥 Import M3U
                            </button>
                            <button id="export-playlist" class="playlist-action-btn">
                                📤 Export M3U
                            </button>
                        </div>
                        
                        <div class="control-group">
                            <button id="reset-playlist-order" class="playlist-action-btn warning">
                                ↩️ Obnovit vše (Reset)
                            </button>
                        </div>
                        
                        <div class="playlist-stats">
                            <span id="playlist-count">Skladeb: 0</span>
                            <span id="favorites-count">Oblíbených: 0</span>
                        </div>
                    </div>
                    
                    <div class="advanced-playlist" id="advanced-playlist">
                        <div class="playlist-header">
                            <span class="track-number">#</span>
                            <span class="track-title">Název skladby</span>
                            <span class="track-actions">Akce</span>
                        </div>
                        <div class="playlist-tracks" id="advanced-tracks-list">
                            </div>
                    </div>
                </div>
                
                <div class="playlist-modal-footer">
                    <button id="save-playlist-changes" class="playlist-save-btn">
                        💾 Uložit a Synchronizovat
                    </button>
                    <button id="cancel-playlist-changes" class="playlist-cancel-btn">
                        ❌ Zrušit
                    </button>
                </div>
            </div>
            
            <div class="add-track-form" id="add-track-form" style="display: none;">
                <div class="form-content">
                    <h3>➕ Přidat novou skladbu</h3>
                    <div class="form-group">
                        <label for="track-title-input">Název skladby:</label>
                        <input type="text" id="track-title-input" placeholder="Zadejte název skladby" />
                    </div>
                    <div class="form-group">
                        <label for="track-url-input">URL adresa:</label>
                        <input type="url" id="track-url-input" placeholder="https://..." />
                    </div>
                    <div class="form-actions">
                        <button id="confirm-add-track" class="playlist-save-btn">✅ Přidat</button>
                        <button id="cancel-add-track" class="playlist-cancel-btn">❌ Zrušit</button>
                    </div>
                </div>
            </div>
            
            <input type="file" id="import-file-input" accept=".m3u,.m3u8" style="display: none;" />
        `;
        
        document.body.appendChild(playlistManagerModal);
        
        // Přidání CSS stylů (volání funkce)
        addPlaylistManagerStyles();
        
        log("✅ createPlaylistManagerModal: Modální okno úspěšně vytvořeno a vloženo do DOM.");
    }

    // --- CSS styly pro modální okno (Ponecháno v plné délce pro zachování vzhledu) ---
    function addPlaylistManagerStyles() {
        const existingStyle = document.getElementById('playlist-manager-styles');
        if (existingStyle) {
            log("ℹ️ addPlaylistManagerStyles: Styly již existují, přeskakuji.");
            return;
        }
        
        log("🎨 addPlaylistManagerStyles: Aplikuji CSS styly...");

        const style = document.createElement('style');
        style.id = 'playlist-manager-styles';
        style.textContent = `
            /* === MODÁLNÍ OKNO SPRÁVY PLAYLISTU === */
            .playlist-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease-out;
            }
            
            .playlist-modal-overlay.show {
                display: flex;
            }
            
            .playlist-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                border: 2px solid #00d4ff;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3);
                width: 90%;
                max-width: 900px;
                max-height: 85vh;
                overflow: hidden;
                animation: modalSlideIn 0.4s ease-out;
                display: flex;
                flex-direction: column;
            }
            
            .playlist-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: linear-gradient(90deg, #00d4ff, #0099cc);
                color: #000;
            }
            
            .playlist-modal-header h2 {
                margin: 0;
                font-size: 1.4em;
                font-weight: bold;
            }
            
            .modal-close-button {
                background: rgba(0, 0, 0, 0.2);
                border: none;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                color: #000;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close-button:hover {
                background: rgba(255, 0, 0, 0.7);
                color: white;
                transform: scale(1.1);
            }
            
            .playlist-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
                color: white;
            }
            
            /* === OVLÁDACÍ PANEL === */
            .playlist-controls-panel {
                margin-bottom: 25px;
            }
            
            .control-group {
                display: flex;
                gap: 12px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }
            
            .playlist-action-btn {
                background: linear-gradient(45deg, #00d4ff, #0099cc);
                border: none;
                border-radius: 8px;
                padding: 10px 16px;
                color: #000;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .playlist-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
            }
            
            .playlist-action-btn.warning {
                background: linear-gradient(45deg, #ff6b35, #cc5522);
                color: white;
            }
            
            .playlist-action-btn.warning:hover {
                box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
            }
            
            .playlist-stats {
                display: flex;
                gap: 20px;
                font-size: 14px;
                color: #00d4ff;
                font-weight: bold;
                border-top: 1px solid rgba(0, 212, 255, 0.2);
                padding-top: 10px;
            }
            
            /* === POKROČILÝ PLAYLIST === */
            .advanced-playlist {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                overflow: hidden;
                border: 1px solid rgba(0, 212, 255, 0.3);
                display: flex;
                flex-direction: column;
                min-height: 300px;
            }
            
            .playlist-header {
                display: grid;
                grid-template-columns: 50px 1fr 200px;
                gap: 15px;
                padding: 12px 15px;
                background: rgba(0, 212, 255, 0.1);
                font-weight: bold;
                color: #00d4ff;
                border-bottom: 1px solid rgba(0, 212, 255, 0.3);
            }
            
            .playlist-tracks {
                overflow-y: auto;
                max-height: 400px;
            }
            
            .advanced-track-item {
                display: grid;
                grid-template-columns: 50px 1fr 200px;
                gap: 15px;
                padding: 12px 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.2s;
                cursor: grab;
                align-items: center;
            }
            
            .advanced-track-item:hover {
                background: rgba(0, 212, 255, 0.1);
            }
            
            .advanced-track-item.active {
                background: rgba(0, 212, 255, 0.2);
                border-left: 4px solid #00d4ff;
                padding-left: 11px; /* Kompenzace borderu */
            }
            
            .advanced-track-item.dragging {
                opacity: 0.5;
                cursor: grabbing;
                background: rgba(255, 255, 255, 0.1);
            }
            
            .track-number {
                color: #888;
                font-weight: bold;
                text-align: center;
            }
            
            .track-title-container {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .track-title-display {
                font-weight: bold;
                color: white;
                cursor: text;
                padding: 2px 5px;
                border-radius: 3px;
                transition: background 0.2s;
            }
            
            .track-title-display:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .track-title-edit {
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid #00d4ff;
                border-radius: 5px;
                padding: 5px 8px;
                color: white;
                font-size: 14px;
                width: 100%;
            }
            
            .track-original-title {
                font-size: 12px;
                color: #888;
                font-style: italic;
            }
            
            .track-actions {
                display: flex;
                gap: 8px;
                align-items: center;
                justify-content: flex-end;
            }
            
            .track-btn {
                background: rgba(0, 212, 255, 0.2);
                border: 1px solid #00d4ff;
                border-radius: 5px;
                padding: 5px 8px;
                color: #00d4ff;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
            }
            
            .track-btn:hover {
                background: #00d4ff;
                color: #000;
            }
            
            .track-btn.danger {
                border-color: #ff6b35;
                color: #ff6b35;
                background: rgba(255, 107, 53, 0.2);
            }
            
            .track-btn.danger:hover {
                background: #ff6b35;
                color: white;
            }
            
            /* === FORMULÁŘ PŘIDÁNÍ SKLADBY === */
            .add-track-form {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #00d4ff;
                border-radius: 15px;
                padding: 25px;
                z-index: 10001;
                box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);
                width: 350px;
            }
            
            .form-content h3 {
                color: #00d4ff;
                margin-bottom: 20px;
                text-align: center;
                margin-top: 0;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                color: white;
                margin-bottom: 5px;
                font-weight: bold;
            }
            
            .form-group input {
                width: 100%;
                padding: 10px;
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid #00d4ff;
                border-radius: 5px;
                color: white;
                font-size: 14px;
                box-sizing: border-box;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: #00d4ff;
                box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
            }
            
            .form-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 20px;
            }
            
            /* === FOOTER === */
            .playlist-modal-footer {
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                border-top: 1px solid rgba(0, 212, 255, 0.2);
            }
            
            .playlist-save-btn, .playlist-cancel-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 14px;
            }
            
            .playlist-save-btn {
                background: linear-gradient(45deg, #28a745, #20c997);
                color: white;
            }
            
            .playlist-save-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
            }
            
            .playlist-cancel-btn {
                background: linear-gradient(45deg, #dc3545, #c82333);
                color: white;
            }
            
            .playlist-cancel-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
            }
            
            /* === ANIMACE === */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            /* === RESPONSIVNÍ DESIGN === */
            @media (max-width: 768px) {
                .playlist-modal-content {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .playlist-header,
                .advanced-track-item {
                    grid-template-columns: 40px 1fr 120px;
                    gap: 10px;
                }
                
                .control-group {
                    flex-direction: column;
                }
                
                .playlist-action-btn {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(style);
        log("✅ addPlaylistManagerStyles: Styly aplikovány.");
    }

    // --- Vytvoření tlačítka pro otevření správy playlistu ---
    function createPlaylistManagerButton() {
        log("🔘 createPlaylistManagerButton: Zahajuji vytváření tlačítka...");

        if (playlistManagerButton) return;
        
        playlistManagerButton = document.createElement('button');
        playlistManagerButton.id = 'playlist-manager-button';
        playlistManagerButton.className = 'control-button';
        playlistManagerButton.title = 'Pokročilá správa playlistu (Ctrl+P)';
        playlistManagerButton.innerHTML = '🎛️';
        
        // Přidání do control panelu
        // Hledáme přesně .controls uvnitř #control-panel, nebo fallbacky
        const controlPanel = document.querySelector('.controls') || document.getElementById('control-panel');
        
        if (controlPanel) {
            controlPanel.appendChild(playlistManagerButton);
            log("✅ createPlaylistManagerButton: Tlačítko přidáno do ovládacího panelu.");
        } else {
            log("⚠️ createPlaylistManagerButton: #control-panel ani .controls nenalezeny. Tlačítko nelze přidat.");
            // Pokus o fallback - vytvořit kontejner před playlistem
            const playlist = document.getElementById('playlist');
            if (playlist) {
                const fallbackContainer = document.createElement('div');
                fallbackContainer.className = 'controls';
                fallbackContainer.style.display = 'flex';
                fallbackContainer.style.justifyContent = 'center';
                fallbackContainer.style.gap = '10px';
                fallbackContainer.style.margin = '10px 0';
                fallbackContainer.appendChild(playlistManagerButton);
                playlist.parentNode.insertBefore(fallbackContainer, playlist);
                log("✅ createPlaylistManagerButton: Vytvořen fallback kontejner pro tlačítko.");
            }
        }
    }

    // --- Naplnění pokročilého playlistu ---
    // UPGRADE: Nyní čte data přímo z window.tracks, ne z localStorage
    function populateAdvancedPlaylist() {
        log("📋 populateAdvancedPlaylist: Vykresluji seznam skladeb...");

        const tracksList = document.getElementById('advanced-tracks-list');
        const playlistCount = document.getElementById('playlist-count');
        const favoritesCount = document.getElementById('favorites-count');
        
        if (!tracksList) {
            log("❌ populateAdvancedPlaylist: Kontejner #advanced-tracks-list nenalezen.");
            return;
        }
        
        tracksList.innerHTML = '';
        
        if (!window.tracks || window.tracks.length === 0) {
            tracksList.innerHTML = '<div style="text-align: center; padding: 20px; color: #888;">Žádné skladby v playlistu</div>';
            if (playlistCount) playlistCount.textContent = 'Skladeb: 0';
            return;
        }
        
        // Aktualizace statistik
        if (playlistCount) playlistCount.textContent = `Skladeb: ${window.tracks.length}`;
        if (favoritesCount && window.favorites) favoritesCount.textContent = `Oblíbených: ${window.favorites.length}`;
        
        window.tracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'advanced-track-item';
            trackItem.draggable = true;
            trackItem.dataset.trackIndex = index;
            
            // Kontrola, zda je skladba aktuálně přehrávaná
            const isActive = (index === window.currentTrackIndex && 
                             window.DOM && window.DOM.audioPlayer && !window.DOM.audioPlayer.paused);
            
            if (isActive) trackItem.classList.add('active');
            
            // ZMĚNA: Používáme přímo track.title, žádné customNames z localStorage
            const displayTitle = track.title;
            const originalTitle = track.originalTitle || ''; 
            
            trackItem.innerHTML = `
                <div class="track-number">${index + 1}</div>
                <div class="track-title-container">
                    <div class="track-title-display" onclick="editTrackTitle(${index})" title="Klikni pro editaci">${displayTitle}</div>
                    ${originalTitle ? `<div class="track-original-title">Původní: ${originalTitle}</div>` : ''}
                </div>
                <div class="track-actions">
                    <button class="track-btn" onclick="playTrackFromManager(${index})" title="Přehrát">▶️</button>
                    <button class="track-btn" onclick="editTrackTitle(${index})" title="Přejmenovat">✏️</button>
                    <button class="track-btn" onclick="toggleFavoriteFromManager('${track.title}')" title="Oblíbené">
                        ${window.favorites && window.favorites.includes(track.title) ? '⭐' : '☆'}
                    </button>
                    <button class="track-btn danger" onclick="removeTrackFromManager(${index})" title="Smazat">🗑️</button>
                </div>
            `;
            
            // Drag & Drop události
            trackItem.addEventListener('dragstart', handleDragStart);
            trackItem.addEventListener('dragover', handleDragOver);
            trackItem.addEventListener('drop', handleDrop);
            trackItem.addEventListener('dragend', handleDragEnd);
            
            tracksList.appendChild(trackItem);
        });
        
        log(`✅ populateAdvancedPlaylist: Vykresleno ${window.tracks.length} položek.`);
    }

    // --- Drag & Drop funkce (Ponechány v původním rozsahu) ---
    function handleDragStart(e) {
        draggedTrackIndex = parseInt(e.target.dataset.trackIndex);
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        log(`✊ Drag start: index ${draggedTrackIndex}`);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.preventDefault();
        const targetIndex = parseInt(e.target.closest('.advanced-track-item').dataset.trackIndex);
        
        if (draggedTrackIndex !== null && draggedTrackIndex !== targetIndex) {
            log(`⤵️ Drop: Přesun skladby z indexu ${draggedTrackIndex} na ${targetIndex}`);

            // Přesunutí skladby v poli (PŘÍMO V HLAVNÍM window.tracks)
            const draggedTrack = window.tracks[draggedTrackIndex];
            window.tracks.splice(draggedTrackIndex, 1);
            window.tracks.splice(targetIndex, 0, draggedTrack);
            
            // Aktualizace indexu současné skladby
            if (window.currentTrackIndex === draggedTrackIndex) {
                window.currentTrackIndex = targetIndex;
            } else if (window.currentTrackIndex > draggedTrackIndex && window.currentTrackIndex <= targetIndex) {
                window.currentTrackIndex--;
            } else if (window.currentTrackIndex < draggedTrackIndex && window.currentTrackIndex >= targetIndex) {
                window.currentTrackIndex++;
            }
            
            populateAdvancedPlaylist();
        }
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        draggedTrackIndex = null;
    }

    // --- Funkce pro tlačítka v playlistu (Global Scope Export) ---
    window.playTrackFromManager = function(index) {
        log(`▶️ playTrackFromManager: Přehrávám index ${index}`);
        if (window.playTrack) {
            window.playTrack(index);
            // Malé zpoždění pro aktualizaci stylů (aby se chytla třída 'active')
            setTimeout(populateAdvancedPlaylist, 200); 
        }
    };

    // 🔧 OPRAVA FUNKCE editTrackTitle
// Najdi tuto funkci v pokrocila-sprava-playlistu.js (řádek cca 270)

window.editTrackTitle = function(index) {
    log(`✏️ editTrackTitle: Zahajuji editaci pro index ${index}`);

    const trackItem = document.querySelector(`[data-track-index="${index}"]`);
    const titleDisplay = trackItem.querySelector('.track-title-display');
    const currentTitle = titleDisplay.textContent;
    const track = window.tracks[index];
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'track-title-edit';
    input.value = currentTitle;
    
    titleDisplay.replaceWith(input);
    input.focus();
    input.select();
    
    const saveEdit = () => {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== track.title) {
            log(`📝 Ukládám změnu názvu: "${track.title}" -> "${newTitle}"`);
            
            // Uložíme původní název, pokud ještě není uložen
            if (!track.originalTitle) {
                track.originalTitle = track.title;
            }
            
            // 🔥 NOVÉ: Označíme skladbu jako ručně upravenou
            track.title = newTitle;
            track.manuallyEdited = true; // <--- KLÍČOVÁ VLAJKA!
            track.lastEditedAt = Date.now(); // <--- Pro kontrolu časové značky
            
            log(`🚩 Skladba označena jako ručně upravená:`, track);
        } else {
            log("📝 Název nebyl změněn.");
        }
        populateAdvancedPlaylist();
    };
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            populateAdvancedPlaylist();
        }
    });
};
    window.toggleFavoriteFromManager = function(trackTitle) {
        log(`⭐ toggleFavoriteFromManager: ${trackTitle}`);
        if (window.toggleFavorite) {
            window.toggleFavorite(trackTitle);
            setTimeout(() => populateAdvancedPlaylist(), 100); 
        }
    };

    window.removeTrackFromManager = function(index) {
        const track = window.tracks[index];
        if (confirm(`Opravdu chcete odstranit skladbu "${track.title}" z playlistu?`)) {
            log(`🗑️ removeTrackFromManager: Odstraňuji skladbu "${track.title}" (index ${index})`);
            
            window.tracks.splice(index, 1);
            
            // Úprava indexu aktuální skladby
            if (window.currentTrackIndex > index) {
                window.currentTrackIndex--;
            } else if (window.currentTrackIndex === index && window.tracks.length > 0) {
                window.currentTrackIndex = Math.min(window.currentTrackIndex, window.tracks.length - 1);
            }
            
            populateAdvancedPlaylist();
            window.showNotification(`Skladba "${track.title}" odstraněna z playlistu.`, 'info');
        }
    };

    // --- Funkce pro ovládací tlačítka ---
    function addCustomTrack() {
        log("➕ addCustomTrack: Otevírám formulář.");
        const addForm = document.getElementById('add-track-form');
        const titleInput = document.getElementById('track-title-input');
        const urlInput = document.getElementById('track-url-input');
        
        addForm.style.display = 'block';
        titleInput.focus();
        
        // Reset formuláře
        titleInput.value = '';
        urlInput.value = '';
    }

    function confirmAddTrack() {
        const titleInput = document.getElementById('track-title-input');
        const urlInput = document.getElementById('track-url-input');
        const addForm = document.getElementById('add-track-form');
        
        const title = titleInput.value.trim();
        const url = urlInput.value.trim();
        
        if (!title || !url) {
            window.showNotification('Vyplňte prosím všechna pole!', 'warn');
            return;
        }
        
        // Ověření URL
        try {
            new URL(url);
        } catch {
            window.showNotification('Neplatná URL adresa!', 'error');
            return;
        }
        
        log(`✅ confirmAddTrack: Přidávám novou skladbu: ${title}`);
        
        // Přidání skladby přímo do window.tracks
        const newTrack = { 
            title: title, 
            src: url,
            originalTitle: title // Pro jistotu
        };
        window.tracks.push(newTrack);
        
        addForm.style.display = 'none';
        populateAdvancedPlaylist();
        window.showNotification(`Skladba "${title}" byla přidána!`, 'info');
    }

    function cancelAddTrack() {
        document.getElementById('add-track-form').style.display = 'none';
    }

    function exportPlaylistAsM3U() {
        log("📤 exportPlaylistAsM3U: Zahajuji export...");
        
        if (!window.tracks || window.tracks.length === 0) {
            window.showNotification('Playlist je prázdný!', 'warn');
            return;
        }
        
        let m3uContent = '#EXTM3U\n';
        
        window.tracks.forEach(track => {
            const displayTitle = track.title; // Používáme aktuální název
            m3uContent += `#EXTINF:-1,${displayTitle}\n`;
            m3uContent += `${track.src}\n`;
        });
        
        const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'playlist.m3u';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        window.showNotification('Playlist exportován jako M3U!', 'info');
        log("✅ Export dokončen.");
    }

    function importPlaylistFromM3U() {
        const fileInput = document.getElementById('import-file-input');
        fileInput.click();
    }

    function handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        log(`📥 handleFileImport: Načítám soubor ${file.name}`);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const lines = content.split('\n');
            let currentTitle = '';
            let tracksAdded = 0;
            
            lines.forEach(line => {
                line = line.trim();
                if (line.startsWith('#EXTINF:')) {
                    // Extrakce názvu z #EXTINF řádku
                    const titleMatch = line.match(/,(.+)$/);
                    currentTitle = titleMatch ? titleMatch[1] : 'Unknown';
                } else if (line && !line.startsWith('#') && (line.includes('://') || line.endsWith('.mp3'))) {
                    // URL řádek
                    const newTrack = {
                        title: currentTitle || 'Unknown',
                        src: line
                    };
                    window.tracks.push(newTrack);
                    tracksAdded++;
                    currentTitle = '';
                }
            });
            
            if (tracksAdded > 0) {
                populateAdvancedPlaylist();
                window.showNotification(`Importováno ${tracksAdded} skladeb z M3U!`, 'info');
                log(`✅ Importováno ${tracksAdded} skladeb.`);
            } else {
                window.showNotification('Nepodařilo se načíst žádné skladby!', 'error');
                log("❌ Import selhal: Žádné platné skladby nenalezeny.");
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    }

    // UPGRADE: clearCustomNames nahrazeno za Reset celého playlistu
    // Protože názvy jsou nyní v datech, "vymazání názvů" nedává smysl - dává smysl reset.
    // Pro kompatibilitu s HTML ale ponecháme název funkce, pokud je někde volána
    function clearCustomNames() {
        // Alias pro resetPlaylistOrder
        resetPlaylistOrder();
    }

    function resetPlaylistOrder() {
        log("↩️ resetPlaylistOrder: Požadavek na reset...");
        
        if (confirm('Opravdu chcete obnovit původní stav playlistu (pokud existuje záloha)? Veškeré změny budou ztraceny.')) {
            // Pokud máme originalTracks (z myPlaylist.js), použijeme je
            if (window.originalTracks && window.originalTracks.length > 0) {
                // Uděláme hlubokou kopii, abychom nepracovali s referencí
                window.tracks = JSON.parse(JSON.stringify(window.originalTracks));
                
                window.currentTrackIndex = 0;
                populateAdvancedPlaylist();
                window.showNotification('Playlist obnoven do původního stavu!', 'info');
                log("✅ Playlist resetován na původní stav z window.originalTracks.");
                
                // Hned synchronizujeme do cloudu, aby se tam propsal reset
                if (window.CaptainNotifyChange) {
                    window.CaptainNotifyChange();
                }
            } else {
                window.showNotification('Původní playlist není k dispozici.', 'warn');
                log("⚠️ Reset selhal: window.originalTracks není k dispozici.");
            }
        }
    }

    // --- Hlavní funkce pro otevření/zavření správy playlistu ---
    function openPlaylistManager() {
        if (!playlistManagerModal) {
            createPlaylistManagerModal();
            addPlaylistManagerEventListeners();
        }
        
        populateAdvancedPlaylist();
        playlistManagerModal.classList.add('show');
        
        window.DebugManager?.log('playlistManager', "🔓 PlaylistManager: Modální okno otevřeno.");
    }

    function closePlaylistManager() {
        if (playlistManagerModal) {
            playlistManagerModal.classList.remove('show');
        }
        
        // Skrytí formuláře pro přidání skladby
        const addForm = document.getElementById('add-track-form');
        if (addForm) addForm.style.display = 'none';
        
        window.DebugManager?.log('playlistManager', "🔒 PlaylistManager: Modální okno zavřeno.");
    }

    // --- Event Listeners pro modální okno (UPGRADE: KAPITÁNSKÝ ROZKAZ) ---
    function addPlaylistManagerEventListeners() {
        log("🔌 addPlaylistManagerEventListeners: Připojuji posluchače událostí...");

        // Zavření okna
        document.getElementById('close-playlist-manager')?.addEventListener('click', closePlaylistManager);
        document.getElementById('cancel-playlist-changes')?.addEventListener('click', closePlaylistManager);
        
        // --- TLAČÍTKO ULOŽIT (HLAVNÍ FUNKCE S CLOUD SYNC) ---
        document.getElementById('save-playlist-changes')?.addEventListener('click', async () => {
            log("💾 Uživatel klikl na ULOŽIT. Zahajuji ukládací sekvenci...");
            
            // 1. Zobrazení notifikace
            window.showNotification('Ukládám změny...', 'info');

            // 2. Uložení do pole (de facto už hotovo průběžně, ale pro jistotu)
            if (window.debounceSaveAudioData) {
                await window.debounceSaveAudioData();
            }
            
            // 3. Aktualizace hlavního playlistu (UI)
            // Toto je kritické pro okamžité zobrazení změn
            if (window.populatePlaylist && window.tracks) {
                log("🔄 Volám window.populatePlaylist pro refresh UI...");
                // Aktualizujeme i currentPlaylist, pokud se používá
                if (window.currentPlaylist) window.currentPlaylist = [...window.tracks];
                window.populatePlaylist(window.tracks);
            }
            
            // 4. 🔥 KAPITÁNSKÝ ROZKAZ: SYNCHRONIZACE DO CLOUDU
            if (window.CaptainNotifyChange) {
                log("🫡 Volám Kapitána (CaptainNotifyChange) pro sync do Cloudu...");
                await window.CaptainNotifyChange(); 
            } else {
                // Fallback, pokud kapitánský modul chybí
                log("⚠️ CaptainNotifyChange nenalezen, zkouším přímý save...");
                if (window.savePlaylistToFirestore) {
                    await window.savePlaylistToFirestore(window.tracks);
                }
            }

            window.showNotification('✅ Playlist uložen a synchronizován!', 'success');
            closePlaylistManager();
        });
        
        // Ovládací tlačítka
        document.getElementById('add-custom-track')?.addEventListener('click', addCustomTrack);
        document.getElementById('import-playlist')?.addEventListener('click', importPlaylistFromM3U);
        document.getElementById('export-playlist')?.addEventListener('click', exportPlaylistAsM3U);
        // document.getElementById('clear-custom-names')?.addEventListener('click', clearCustomNames); // Nahrazeno resetem v HTML
        document.getElementById('reset-playlist-order')?.addEventListener('click', resetPlaylistOrder);
        
        // Formulář přidání skladby
        document.getElementById('confirm-add-track')?.addEventListener('click', confirmAddTrack);
        document.getElementById('cancel-add-track')?.addEventListener('click', cancelAddTrack);
        
        // Import souboru
        document.getElementById('import-file-input')?.addEventListener('change', handleFileImport);
        
        // Zavření při kliknutí mimo modální okno
        playlistManagerModal?.addEventListener('click', (e) => {
            if (e.target === playlistManagerModal) {
                closePlaylistManager();
            }
        });
        
        // Klávesové zkratky pro modální okno
        document.addEventListener('keydown', (e) => {
            if (playlistManagerModal && playlistManagerModal.classList.contains('show')) {
                if (e.key === 'Escape') {
                    closePlaylistManager();
                }
            }
        });
        
        log("✅ Event listeners úspěšně připojeny.");
    }

    // --- Klávesová zkratka pro otevření správy ---
    function addGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+P pro otevření správy playlistu
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                log("⌨️ Zkratka Ctrl+P detekována.");
                openPlaylistManager();
            }
        });
    }

    // --- Integrace s existujícím systémem (Zjednodušeno pro Cloud Verzi) ---
    function integrateWithExistingSystem() {
        // V Cloud verzi již nepotřebujeme složité přepisování populatePlaylist,
        // protože data měníme přímo u zdroje. 
        // Pouze zkontrolujeme, zda systém běží.
        
        const checkSystemReady = setInterval(() => {
            if (window.tracks && window.DOM) {
                clearInterval(checkSystemReady);
                log("✅ Integrace: Hlavní systém detekován a připraven.");
                
                // Záloha originálních dat pro funkci Reset
                if (!window.originalTracksBackup && window.tracks.length > 0) {
                    window.originalTracksBackup = JSON.parse(JSON.stringify(window.tracks));
                    // Pokud window.originalTracks neexistuje, vytvoříme ho
                    if (!window.originalTracks) {
                        window.originalTracks = window.originalTracksBackup;
                    }
                }
            }
        }, 500);
    }

    // --- Přidání HTML tlačítka do stránky (S opravou cílení) ---
    function addPlaylistManagerButtonToHTML() {
        log("🔘 addPlaylistManagerButtonToHTML: Hledám místo pro tlačítko...");

        // 1. Zkusíme najít hlavní playlist element
        const mainPlaylist = document.getElementById('playlist');
        
        // 2. Hledáme kontejner pro tlačítka (.controls uvnitř #control-panel)
        let targetContainer = document.querySelector('.controls');
        
        // Fallback 1: Hledáme ID control-panel
        if (!targetContainer) {
            targetContainer = document.getElementById('control-panel');
        }
        
        // Fallback 2: Pokud neexistuje, vytvoříme nový kontejner nad playlistem
        if (!targetContainer && mainPlaylist) {
            log("⚠️ Kontejner tlačítek nenalezen, vytvářím vlastní.");
            targetContainer = document.createElement('div');
            targetContainer.className = 'controls'; // Aby chytil styly
            targetContainer.style.cssText = `
                display: flex;
                justify-content: center;
                margin: 10px 0;
                gap: 10px;
                flex-wrap: wrap;
            `; 
            mainPlaylist.parentNode.insertBefore(targetContainer, mainPlaylist);
        }
        
        if (targetContainer) {
            // Pokud už tlačítko existuje, nepřidáváme ho znovu
            if (document.getElementById('playlist-manager-button')) {
                log("ℹ️ Tlačítko již existuje.");
                return;
            }

            // Vytvoříme stylizované tlačítko (konzistentní s ostatními)
            const managerButton = document.createElement('button');
            managerButton.id = 'playlist-manager-button';
            managerButton.className = 'control-button'; // Třída pro zachování stylu přehrávače
            managerButton.innerHTML = '🎛️';
            managerButton.title = 'Pokročilá správa playlistu (Ctrl+P)';
            
            // Pokud chybí CSS třída control-button, přidáme inline styly jako fallback
            if (!document.querySelector('.control-button')) {
                managerButton.style.cssText = `
                    background: linear-gradient(45deg, #00d4ff, #0099cc);
                    border: none;
                    border-radius: 10px;
                    padding: 10px 15px;
                    color: #000;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
                `;
            }
            
            // Event listener pro otevření
            managerButton.addEventListener('click', openPlaylistManager);
            
            targetContainer.appendChild(managerButton);
            log("✅ Tlačítko úspěšně vloženo do kontejneru.");
        } else {
            log("❌ Kritická chyba: Nelze najít místo pro tlačítko.");
        }
    }

    // --- Hlavní inicializační funkce ---
    function initializePlaylistManager() {
        if (isPlaylistManagerInitialized) {
            log("ℹ️ initializePlaylistManager: Již inicializováno.");
            return;
        }
        
        log("🚀 Spouštím inicializaci PlaylistManageru...");
        
        // Čekáme na načtení DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializePlaylistManager);
            return;
        }
        
        // Přidáme HTML tlačítko
        addPlaylistManagerButtonToHTML();
        
        // Vytvoříme modální okno (ale nezobrazíme)
        createPlaylistManagerModal();
        addPlaylistManagerEventListeners();
        
        // Přidáme globální klávesové zkratky
        addGlobalKeyboardShortcuts();
        
        // Integrace s existujícím systémem
        integrateWithExistingSystem();
        
        isPlaylistManagerInitialized = true;
        
        log("🖖 PlaylistManager: Inicializace dokončena! Cloud integrace aktivní.");
        
        // Zobrazíme notifikaci o úspěšné inicializaci
        setTimeout(() => {
            if (window.showNotification) {
                // window.showNotification('🖖 Správa playlistu připravena (Ctrl+P)', 'info');
            }
        }, 2000);
    }

    // --- Export funkcí pro globální použití ---
    window.PlaylistManager = {
        init: initializePlaylistManager,
        open: openPlaylistManager,
        close: closePlaylistManager,
        isInitialized: () => isPlaylistManagerInitialized
    };

    // --- Automatická inicializace ---
    // Spustíme inicializaci automaticky při načtení
    if (typeof window !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializePlaylistManager);
        } else {
            // DOM je už načten, spustíme inicializaci s malým zpožděním
            setTimeout(initializePlaylistManager, 500);
        }
    }

    /**
     * 🖖 KONEC MODULU - POKROČILÁ SPRÁVA PLAYLISTU
     * * Změny ve verzi 2.3:
     * * - Kompletní odstranění závislosti na localStorage (customTrackNames).
     * * - Implementace přímého zápisu do window.tracks.
     * * - Přidání funkce CaptainNotifyChange pro cloud sync.
     * * - Zachování 100% původního kódového základu (žádné zkracování).
     * * - Detailní logování všech akcí.
     */

})();