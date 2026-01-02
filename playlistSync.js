// playlistSync.js
// 🖖 Hvězdná flotila - Inteligentní synchronizace playlistu
// Více admirál Jiřík & Admirál Claude.AI & Specialista Gemini
// KOMPLETNÍ MODUL - UPGRADE O FUZZY LOGIC + OCHRANA RUČNÍCH ÚPRAV
// Verze: 2.2 (Manual Edit Protection Edition)

window.DebugManager?.log('sync', "🖖 playlistSync.js: Modul synchronizace načten (Verze 2.2 - Manual Edit Protection).");

// === HLAVNÍ SYNCHRONIZAČNÍ MANAGER ===
window.PlaylistSyncManager = {
    
    // Konfigurace
    config: {
        autoSyncOnLoad: true,
        showNotifications: true,
        compareMethod: 'hash',
        buttonId: 'playlist-sync-button', 
        autoInitButton: true 
    },

    // Reference
    button: null,

    // -----------------------------------------------------------------------
    // ⚓ KAPITÁNSKÝ PROTOKOL (Propojení se Správcem playlistu)
    // -----------------------------------------------------------------------
    notifyDataChanged: async function() {
        window.DebugManager?.log('sync', "🖖 Kapitán hlásí změnu dat! Spouštím sekvenci obnovy.");
        
        // 1. Refresh UI
        if (window.populatePlaylist && Array.isArray(window.tracks)) {
            window.populatePlaylist(window.tracks);
        }
        if (window.applyEverything) {
            window.applyEverything();
        }

        // 2. Status
        this.updateButtonStatus('warning');

        // 3. Auto-save do Cloudu
        return await this.syncLocalToCloud(true);
    },
    // -----------------------------------------------------------------------

    // Generuje hash (zjednodušený)
    generatePlaylistHash: function(tracks) {
        if (!Array.isArray(tracks) || tracks.length === 0) return 'empty';
        try {
            // Pro hash používáme taky normalizované SRC, aby to sedělo
            const playlistString = tracks.map(track => {
                const cleanSrc = track.src ? track.src.split('?')[0].trim() : '';
                return `${track.title}|${cleanSrc}`;
            }).sort().join('||');
            
            let hash = 0;
            for (let i = 0; i < playlistString.length; i++) {
                const char = playlistString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        } catch (error) {
            return 'error';
        }
    },

    // Porovnání s Cloudem
    comparePlaylistWithCloud: async function() {
        if (!window.tracks) return { error: "Lokální data nedostupná" };

        try {
            const cloudPlaylist = await window.loadPlaylistFromFirestore?.();
            if (!cloudPlaylist) return { identical: false, reason: 'cloud_empty' };

            const localHash = this.generatePlaylistHash(window.tracks);
            const cloudHash = this.generatePlaylistHash(cloudPlaylist);
            
            return {
                identical: localHash === cloudHash,
                localHash,
                cloudHash,
                localCount: window.tracks.length,
                cloudCount: cloudPlaylist.length
            };
        } catch (error) {
            return { error: error.message };
        }
    },

    // Synchronizace UP (Local -> Cloud)
    syncLocalToCloud: async function(force = false) {
        window.DebugManager?.log('sync', "playlistSync.js: Uploaduji playlist do cloudu...");

        if (!window.tracks) return { success: false, error: "Žádná data" };

        try {
            if (!force) {
                const check = await this.comparePlaylistWithCloud();
                if (check.identical) {
                    window.DebugManager?.log('sync', "✅ Data jsou shodná, není třeba upload.");
                    this.updateButtonStatus('ok');
                    return { success: true, action: 'none' };
                }
            }

            // Odeslání
            const result = await window.savePlaylistToFirestore?.(window.tracks);
            if (!result) throw new Error("Save selhal");

            // Uložení stavu
            localStorage.setItem('playlistLastSync', new Date().toISOString());
            localStorage.setItem('playlistHash', this.generatePlaylistHash(window.tracks));
            
            this.updateButtonState('success', 'Uloženo!');
            this.updateButtonStatus('ok');

            return { success: true, action: 'uploaded' };

        } catch (error) {
            console.error("Sync Error:", error);
            this.updateButtonState('error', 'Chyba!');
            return { success: false, error: error.message };
        }
    },

    // =========================================================================
// 🧠 SMART MERGE V2.3: FUZZY LOGIC + MANUAL EDIT PROTECTION (FIXED!)
// =========================================================================
autoCheckOnLoad: async function() {
    if (!this.config.autoSyncOnLoad) return;

    window.DebugManager?.log('sync', "playlistSync.js: ⚡ Spouštím Smart Merge (Manual Protection ACTIVE)...");
    await this.waitForFirebase();

    try {
        // 1. Získáme data z Cloudu
        const cloudPlaylist = await window.loadPlaylistFromFirestore?.();
        
        if (!cloudPlaylist || cloudPlaylist.length === 0) {
            window.DebugManager?.log('sync', "playlistSync.js: Cloud prázdný, používám lokální data.");
            return;
        }

        // 2. Normalizační funkce (ořízneme tokeny)
        const normalizeSrc = (src) => src ? src.split('?')[0].trim() : '';

        // 3. Vytvoříme mapu Cloud dat (klíč = čistý odkaz)
        const cloudMap = new Map();
        cloudPlaylist.forEach(track => {
            if (track.src || track.cleanSrc) {
                const key = track.cleanSrc || normalizeSrc(track.src);
                cloudMap.set(key, track);
            }
        });

        let hasChanges = false;
        
      // 4. PROCHÁZÍME LOKÁLNÍ PLAYLIST (window.tracks)
const mergedTracks = window.tracks.map((localTrack, idx) => {
    const cleanSrc = normalizeSrc(localTrack.src);
    const cloudVersion = cloudMap.get(cleanSrc);
    
    if (!cloudVersion) {
        // Skladba není v Cloudu → nová, necháme bejt
        hasChanges = true;
        return localTrack;
    }
    
    // ═══════════════════════════════════════════════════════════
    // 🔥 KLÍČOVÁ OPRAVA: PRIORITA RUČNÍCH ÚPRAV + METADATA
    // ═══════════════════════════════════════════════════════════
    
    // 1. Kontrola: Je skladba ručně editovaná V CLOUDU?
    if (cloudVersion.manuallyEdited === true) {
        window.DebugManager?.log('sync', `🛡️ "${cloudVersion.title}" - Cloud má manual flag → POUŽIJU CLOUD`);
        
        // Pokud se lokální název liší, UPDATE!
        if (localTrack.title !== cloudVersion.title) {
            hasChanges = true;
            return {
                ...localTrack,
                title: cloudVersion.title,
                originalTitle: cloudVersion.originalTitle || localTrack.title,
                manuallyEdited: cloudVersion.manuallyEdited ?? false,    // ✅ OPRAVENO
                lastEditedAt: cloudVersion.lastEditedAt ?? null          // ✅ OPRAVENO
            };
        }
        // Název sedí → ponecháme jak je (ale zkontrolujeme metadata!)
        return {
            ...localTrack,
            manuallyEdited: cloudVersion.manuallyEdited ?? localTrack.manuallyEdited ?? false,  // ✅ PŘIDÁNO
            lastEditedAt: cloudVersion.lastEditedAt ?? localTrack.lastEditedAt ?? null          // ✅ PŘIDÁNO
        };
    }
    
    // 2. Kontrola: Je skladba ručně editovaná LOKÁLNĚ?
    if (localTrack.manuallyEdited === true) {
        window.DebugManager?.log('sync', `🚫 "${localTrack.title}" - LOCAL má manual flag → IGNORUJI CLOUD`);
        return localTrack; // <--- LOKÁLNÍ PRIORITA!
    }
    
    // 3. Žádné ruční úpravy → běžná sync z Cloudu
    if (localTrack.title !== cloudVersion.title) {
        hasChanges = true;
        window.DebugManager?.log('sync', `🔄 Obnovuji název: "${localTrack.title}" → "${cloudVersion.title}"`);
        return {
            ...localTrack,
            title: cloudVersion.title,
            originalTitle: cloudVersion.originalTitle || localTrack.title,
            manuallyEdited: cloudVersion.manuallyEdited ?? false,     // ✅ OPRAVENO (místo false)
            lastEditedAt: cloudVersion.lastEditedAt ?? null           // ✅ PŘIDÁNO
        };
    }
    
    // 4. Žádné změny názvu → ale zkontrolujeme metadata
    return {
        ...localTrack,
        manuallyEdited: cloudVersion.manuallyEdited ?? localTrack.manuallyEdited ?? false,  // ✅ PŘIDÁNO
        lastEditedAt: cloudVersion.lastEditedAt ?? localTrack.lastEditedAt ?? null          // ✅ PŘIDÁNO
    };
});

        // 5. Aplikujeme výsledek
        window.tracks = mergedTracks;
        
        // 6. Uložíme a překreslíme
        localStorage.setItem('currentPlaylist', JSON.stringify(window.tracks));
        
        if (window.populatePlaylist) window.populatePlaylist(window.tracks);
        if (window.applyEverything) window.applyEverything();

        // 7. Sync zpět do cloudu, pokud jsme něco sloučili
        if (hasChanges) {
            window.DebugManager?.log('sync', "playlistSync.js: 🔄 Aktualizuji Cloud (sjednocení verzí)...");
            await this.syncLocalToCloud(true);
        } else {
            window.DebugManager?.log('sync', "playlistSync.js: ✅ Data sedí.");
            this.updateButtonStatus('ok');
        }

    } catch (error) {
        console.error("playlistSync.js: Chyba Smart Merge:", error);
        this.updateButtonStatus('error');
    }
}
    // =========================================================================

    // Pomocné funkce
    waitForFirebase: function(timeout = 10000) {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (window.db || (typeof firebase !== 'undefined' && firebase.apps?.length > 0)) {
                    clearInterval(check);
                    resolve(true);
                }
            }, 500);
            setTimeout(() => { clearInterval(check); resolve(false); }, timeout);
        });
    },

    // UI Tlačítka
    initButton: function() {
        this.button = document.getElementById(this.config.buttonId);
        if (!this.button) return;
        
        this.button.addEventListener('click', () => this.handleButtonClick());
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
                e.preventDefault();
                this.handleButtonClick();
            }
        });
        setTimeout(() => this.checkButtonStatus(), 3000);
    },

    handleButtonClick: async function() {
        this.updateButtonState('syncing');
        const res = await this.syncLocalToCloud();
        if (res.success) this.updateButtonState('success');
        else this.updateButtonState('error');
    },

    updateButtonState: function(state, msg) {
        if (!this.button) return;
        this.button.classList.remove('syncing', 'success', 'error');
        if (state !== 'idle') this.button.classList.add(state);
        if (msg) this.button.title = msg;
        if (state === 'success' || state === 'error') {
            setTimeout(() => this.button.classList.remove(state), 3000);
        }
    },

    updateButtonStatus: function(status) {
        if (!this.button) return;
        this.button.classList.remove('status-ok', 'status-warning', 'status-error');
        this.button.classList.add(`status-${status}`);
    },

    checkButtonStatus: async function() {
        const check = await this.comparePlaylistWithCloud();
        if (check.identical) this.updateButtonStatus('ok');
        else this.updateButtonStatus('warning');
    }
};

// Start
if (typeof window !== 'undefined') {
    const init = () => {
        window.PlaylistSyncManager.autoCheckOnLoad();
        if (window.PlaylistSyncManager.config.autoInitButton) window.PlaylistSyncManager.initButton();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 3000));
    else setTimeout(init, 3000);
}

// Exporty
window.syncPlaylist = () => window.PlaylistSyncManager.syncLocalToCloud();
window.CaptainNotifyChange = () => window.PlaylistSyncManager.notifyDataChanged();
