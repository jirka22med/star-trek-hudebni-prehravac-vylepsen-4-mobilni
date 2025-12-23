(function() {
    'use strict';

    let trackColors = {}; // Mapa barev: { "Název skladby": "hex_barva" }

    // --- 1. Inicializace Modálního okna (Moldaru) ---
    const modal = document.createElement('div');
    modal.id = 'color-modal';
    modal.className = 'modal-system';
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; display:none; justify-content:center; align-items:center; backdrop-filter:blur(12px);";
    document.body.appendChild(modal);

    // --- 2. Synchronizace s Cloud Firestore ---
    async function loadColorsFromCloud() {
        if (!window.db) return;
        try {
            const doc = await window.db.collection('audioPlayerSettings').doc('trackColors').get();
            if (doc.exists) {
                trackColors = doc.data().colors || {};
                applyEverything();
            }
        } catch (error) {
            console.error("❌ Chyba synchronizace:", error);
        }
    }

    async function saveColorsToCloud() {
        if (!window.db) return;
        try {
            await window.db.collection('audioPlayerSettings').doc('trackColors').set({
                colors: trackColors,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            if (window.showNotification) window.showNotification("🎨 Konfigurace barev uložena!", 'info');
        } catch (error) {
            console.error("❌ Chyba při zápisu:", error);
        }
    }

    // --- 3. Jádro Vizuálního Systému (Barvení & Styl) ---
    function applyEverything() {
        const currentTitle = document.getElementById('trackTitle')?.textContent;
        const activeTrackColor = trackColors[currentTitle] || '#E0E1DD';

        // Přebarvení Headeru a Title
        const header = document.getElementById('nazev-prehravace');
        const trackTitle = document.getElementById('trackTitle');
        if (header) {
            header.style.color = activeTrackColor;
            header.style.textShadow = `0 0 15px ${activeTrackColor}aa`;
        }
        if (trackTitle) trackTitle.style.color = activeTrackColor;

        // Aplikace barev na Playlist
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            const titleSpan = item.querySelector('.track-title');
            const trackName = titleSpan?.textContent;
            const trackNum = item.querySelector('.track-number');

            if (trackName && trackColors[trackName]) {
                const color = trackColors[trackName];
                titleSpan.style.color = color;
                if (trackNum) trackNum.style.color = color;
                item.style.borderLeft = `4px solid ${color}`;
            } else {
                if (titleSpan) titleSpan.style.color = '';
                item.style.borderLeft = '4px solid transparent';
            }

            // Zebra řádkování
            item.style.backgroundColor = (index % 2 === 0) ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.08)';
        });
    }

    // --- 4. Vykreslení Rozhraní (Color Picker + Opravené číslování) ---
    function renderModalContent() {
        const currentlyPlaying = document.getElementById('trackTitle')?.textContent;

        modal.innerHTML = `
            <div class="modal-content" style="border:2px solid #00B7EB; background:#0D1B2A; color:white; border-radius:15px; width:95%; max-width:600px; padding:20px; box-shadow:0 0 40px rgba(0, 183, 235, 0.4);">
                <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #00B7EB; padding-bottom:15px; margin-bottom:15px;">
                    <h2 style="margin:0; font-family:Orbitron, sans-serif; font-size:1.3rem;">🎨 BARVY & ORIENTACE</h2>
                    <button id="close-modal-btn" class="control-button" style="width:35px; height:35px; border-radius:50%; padding:0;">✕</button>
                </div>
                <div id="color-track-list" class="modal-body" style="max-height:65vh; overflow-y:auto; padding-right:10px;"></div>
                <div class="modal-footer" style="padding-top:15px; border-top:1px solid rgba(0,183,235,0.3);">
                    <button id="sync-cloud-btn" class="control-button" style="width:100%; font-weight:bold; letter-spacing:1px;">🚀 SYNCHRONIZOVAT CLOUD</button>
                </div>
            </div>
        `;

        const listContainer = modal.querySelector('#color-track-list');
        
        // window.tracks z myPlaylist.js
        window.tracks.forEach((track, index) => {
            const item = document.createElement('div');
            const trackNumStr = String(index + 1).padStart(2, '0');
            const currentColor = trackColors[track.title] || '#E0E1DD';
            const isActive = track.title === currentlyPlaying;
            
            // Styl řádku - nyní se zvýrazněným ČÍSLEM místo blesku
            item.style.cssText = `
                display:flex; justify-content:space-between; align-items:center; padding:12px; border-radius:10px; margin-bottom:6px; 
                background:${index % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'}; 
                border:1px solid ${isActive ? '#39FF14' : 'rgba(0,183,235,0.1)'};
                ${isActive ? 'box-shadow: 0 0 10px rgba(57,255,20,0.3);' : ''}
            `;
            
            // Struktura s Color Pickerem podle playlistSettings.js
            item.innerHTML = `
                <div style="display:flex; align-items:center; gap:15px; flex:1;">
                    <span style="color:${isActive ? '#39FF14' : '#00B7EB'}; font-family:monospace; font-weight:bold; min-width:35px; font-size:1.1rem; text-shadow:${isActive ? '0 0 8px #39FF14' : 'none'};">
                        ${trackNumStr}.
                    </span>
                    <span style="font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:260px; color:${isActive ? '#39FF14' : 'white'};">
                        ${track.title}
                    </span>
                </div>
                <div class="color-picker-ui" style="display:flex; align-items:center; gap:10px; background:rgba(0,0,0,0.5); padding:5px 12px; border-radius:20px; border:1px solid ${isActive ? '#39FF14' : '#444'};">
                    <input type="color" class="track-color-input" value="${currentColor}" style="width:25px; height:25px; border:none; background:none; cursor:pointer; padding:0;">
                    <span style="font-family:monospace; font-size:0.8rem; color:#aaa; min-width:65px;">${currentColor.toUpperCase()}</span>
                </div>
            `;
            
            const colorInput = item.querySelector('.track-color-input');
            colorInput.oninput = (e) => {
                const newColor = e.target.value;
                trackColors[track.title] = newColor;
                item.querySelector('span:last-child').textContent = newColor.toUpperCase();
                applyEverything();
            };

            listContainer.appendChild(item);
        });

        modal.querySelector('#close-modal-btn').onclick = () => modal.style.display = 'none';
        modal.querySelector('#sync-cloud-btn').onclick = saveColorsToCloud;
    }

    // --- 5. Startovací Protokoly ---
    window.addEventListener('load', () => {
        const uiBtn = document.getElementById('uprava-barev-moldar-system');
        if (uiBtn) {
            uiBtn.onclick = () => {
                renderModalContent();
                modal.style.display = 'flex';
            };
        }

        const player = document.getElementById('audioPlayer');
        if (player) {
            player.addEventListener('play', applyEverything);
        }

        const observer = new MutationObserver(applyEverything);
        const playlistEl = document.getElementById('playlist');
        if (playlistEl) {
            observer.observe(playlistEl, { childList: true });
        }

        setTimeout(loadColorsFromCloud, 2000);
    });

})();