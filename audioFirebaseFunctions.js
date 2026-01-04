// audioFirebaseFunctions.js
// 🖖 STAR TREK AUDIO CORE - DEBUGMANAGER EDITION (V3.7 - VERZOVÁNÍ)
// Verze: 3.7 (Přidáno automatické verzování + ZACHOVÁNA původní inicializace)
// ═══════════════════════════════════════════════════════════════════════════════
// ✅ TVOJE PŮVODNÍ INICIALIZACE ZACHOVÁNA - VÍCE ADMIRÁL JIŘÍK & ADMIRÁL CLAUDE.AI
// ═══════════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';
// ⏱️ LOG START
const __WARP_START = performance.now();
    // ═══════════════════════════════════════════════════════════════════════════
    // 📡 KONFIGURACE FIREBASE (SECURE LINK)
    // ═══════════════════════════════════════════════════════════════════════════
    const firebaseConfig = {
  apiKey: "AIzaSyC0TDTs0DDqVEWaXGPUCSoTHAC53KgrmaM",
  authDomain: "star-trek-hudebni-prehravac-4m.firebaseapp.com",
  projectId: "star-trek-hudebni-prehravac-4m",
  storageBucket: "star-trek-hudebni-prehravac-4m.firebasestorage.app",
  messagingSenderId: "983335156196",
  appId: "1:983335156196:web:56a21a3fefe08cb217aff1",
  measurementId: "G-GFGWZN6M15"
};

    let db; // Globální instance databáze

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 LOGOVACÍ SYSTÉM - Napojený na DebugManager
    // ═══════════════════════════════════════════════════════════════════════════
    function log(component, message, data = null, type = 'info') {
        if (!window.DebugManager?.isEnabled('firebase')) return;
        
        const style = type === 'error' ? 'background: #550000; color: #ffaaaa' : 
                      type === 'success' ? 'background: #003300; color: #00ff00' : 
                      'background: #000033; color: #00ffff';
        
        console.groupCollapsed(`%c[${component}] ${message}`, `padding: 2px 5px; border-radius: 3px; font-weight: bold; ${style}`);
        if (data) console.log("📦 Data:", data);
        if (type === 'error') console.trace("🔍 Stack Trace (Error)");
        console.groupEnd();
    }

    function apiLog(action, details = '') {
        if (!window.DebugManager?.isEnabled('firebase')) return;
        console.log(`%c[Firebase API] ${action}`, 'color: #00CCFF; font-weight: bold;', details);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ POMOCNÉ FUNKCE PRO STABILITU
    // ═══════════════════════════════════════════════════════════════════════════
    function getFirestoreDB() {
        if (db) return db;
        if (window.db) return window.db;
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            db = firebase.firestore();
            return db;
        }
        return null;
    }

    async function waitForDatabaseConnection() {
        let attempts = 0;
        
        if (window.DebugManager?.isEnabled('firebase')) {
            console.log("⏳ [DB Check] Ověřuji spojení s warp jádrem (Firestore)...");
        }
        
        while (!getFirestoreDB() && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 200));  // ← každých 200ms (pomalejší)
            attempts++;
        }
        
        const isReady = !!getFirestoreDB();
        
        if (isReady) {
            if (window.DebugManager?.isEnabled('firebase')) {
                console.log("✅ [DB Check] Spojení NAVÁZÁNO.");
            }
        } else {
            console.error("❌ [DB Check] Spojení SELHALO po 5 sekundách.");
        }
        return isReady;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INICIALIZACE FIREBASE (TVOJE PŮVODNÍ - NEZMĚNĚNO!)
    // ═══════════════════════════════════════════════════════════════════════════
    window.initializeFirebaseAppAudio = async function() {
        log("INIT", "Zahajuji start sekvence Firebase...");
        
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (typeof firebase !== 'undefined' && firebase.firestore) {
                    clearInterval(check);
                    if (!firebase.apps.length) {
                        firebase.initializeApp(firebaseConfig);
                        log("INIT", "Firebase App Inicializována.");
                    } else {
                        log("INIT", "Firebase App již běží.");
                    }
                    db = firebase.firestore();
                    window.db = db;
                    resolve(true);
                }
            }, 300);
        });
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔢 FIREBASE VERSION MANAGER - NOVÝ MODUL PRO VERZOVÁNÍ
    // ═══════════════════════════════════════════════════════════════════════════
    const FirebaseVersionManager = {
        currentVersion: null,
        sessionId: null,
        
        async init() {
            window.DebugManager?.log('firebase-verze', '🚀 Spouštím verzovací systém...', 'info');
            
            this.sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            this.currentVersion = await this.generateNewVersion();
            
            localStorage.setItem('firebase_current_version', this.currentVersion);
            localStorage.setItem('firebase_session_id', this.sessionId);
            
            window.DebugManager?.log('firebase-verze', 
                `✅ Nová verze aktivována: ${this.currentVersion}`, 
                'success', 
                { sessionId: this.sessionId }
            );
            
            return this.currentVersion;
        },
        
        async generateNewVersion() {
    // 🔥 FIXNÍ VERZE v1.0 - žádný auto-increment (Gemini diagnostika)
    window.DebugManager?.log('firebase-verze', '✅ Používám fixní verzi v1.0 (Fleet-register řídí globální verze)', 'info');
    return 'v1.0';
},
        
        getVersionedDocId(baseName) {
            return `${baseName}_${this.currentVersion}`;
        },
        
        async switchVersion(targetVersion) {
            const db = getFirestoreDB();
            if (!db) {
                window.DebugManager?.log('firebase-verze', '❌ DB nedostupná', 'error');
                return false;
            }
            
            try {
                const docId = `main_playlist_${targetVersion}`;
                const doc = await db.collection('app_data').doc(docId).get();
                
                if (!doc.exists) {
                    window.DebugManager?.log('firebase-verze', 
                        `❌ Verze ${targetVersion} neexistuje v cloudu!`, 
                        'error'
                    );
                    return false;
                }
                
                this.currentVersion = targetVersion;
                localStorage.setItem('firebase_current_version', targetVersion);
                
                window.DebugManager?.log('firebase-verze', 
                    `✅ Přepnuto na verzi: ${targetVersion}`, 
                    'success'
                );
                
                if (window.loadPlaylistFromFirestore) {
                    await window.loadPlaylistFromFirestore();
                }
                
                return true;
                
            } catch (error) {
                window.DebugManager?.log('firebase-verze', 
                    '❌ Chyba při přepínání verze', 
                    'error', 
                    error
                );
                return false;
            }
        },
        
        async listAllVersions() {
            const db = getFirestoreDB();
            if (!db) return [];
            
            try {
                const snapshot = await db.collection('app_data')
                    .where('versionNum', '>=', 0)
                    .orderBy('versionNum', 'desc')
                    .get();
                
                const versions = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        version: data.versionString || 'neznámá',
                        versionNum: data.versionNum || 0,
                        docId: doc.id,
                        lastUpdated: data.lastUpdated?.toDate(),
                        trackCount: data.totalTracks || 0,
                        sessionId: data.sessionId || 'N/A'
                    };
                });
                
                window.DebugManager?.log('firebase-verze', 
                    `📚 Nalezeno verzí: ${versions.length}`, 
                    'info', 
                    versions
                );
                
                return versions;
                
            } catch (error) {
                window.DebugManager?.log('firebase-verze', 
                    '❌ Chyba při listování verzí', 
                    'error', 
                    error
                );
                return [];
            }
        },
        
        async cleanOldVersions(keepCount = 5) {
            const db = getFirestoreDB();
            if (!db) return false;
            
            try {
                const allVersions = await this.listAllVersions();
                
                if (allVersions.length <= keepCount) {
                    window.DebugManager?.log('firebase-verze', 
                        `ℹ️ Počet verzí (${allVersions.length}) je OK, není co mazat`, 
                        'info'
                    );
                    return true;
                }
                
                const toDelete = allVersions.slice(keepCount);
                
                window.DebugManager?.log('firebase-verze', 
                    `🧹 Mažu ${toDelete.length} starých verzí...`, 
                    'warning', 
                    toDelete.map(v => v.version)
                );
                
                for (const version of toDelete) {
                    await db.collection('app_data').doc(version.docId).delete();
                    window.DebugManager?.log('firebase-verze', 
                        `🗑️ Smazána: ${version.version}`, 
                        'info'
                    );
                }
                
                window.DebugManager?.log('firebase-verze', 
                    `✅ Úklid dokončen! Ponecháno ${keepCount} nejnovějších verzí.`, 
                    'success'
                );
                
                return true;
                
            } catch (error) {
                window.DebugManager?.log('firebase-verze', 
                    '❌ Chyba při mazání starých verzí', 
                    'error', 
                    error
                );
                return false;
            }
        }
    };
    
    // Exportuj do window
    window.FirebaseVersionManager = FirebaseVersionManager;

 // ============================================================================
    // 🎵 HLAVNÍ PLAYLIST - S VERZOVÁNÍM
    // ============================================================================

    window.savePlaylistToFirestore = async function(tracks) {
    // 🔢 Inicializace verzování (pokud ještě není)
    if (!FirebaseVersionManager.currentVersion) {
        await FirebaseVersionManager.init();
    }
    
    const docId = FirebaseVersionManager.getVersionedDocId('main_playlist');
    log("SAVE Playlist", `🚀 Požadavek na uložení playlistu do ${docId}.`);

    const isReady = await waitForDatabaseConnection();
    const database = getFirestoreDB();

    if (!isReady || !database) {
        log("SAVE Playlist", "Databáze nedostupná!", null, 'error');
        if (window.showNotification) window.showNotification("Chyba: Cloud nedostupný!", "error");
        return false;
    }

    const tracksToSave = tracks || window.tracks;
    if (!tracksToSave || !Array.isArray(tracksToSave)) {
        log("SAVE Playlist", "Žádná data k uložení (tracks je prázdné/null).", tracksToSave, 'error');
        return false;
    }

    try {
        // Očištění dat + ZACHOVÁNÍ RUČNÍCH ÚPRAV
        const cleanTracks = tracksToSave.map(track => ({
            title: track.title || "Neznámá skladba", 
            src: track.src || "",
            originalTitle: track.originalTitle || track.title, 
            duration: track.duration || "", 
            addedAt: track.addedAt || Date.now(),
            // 🔥 ZACHOVÁNO: Vlajka ručních úprav!
            manuallyEdited: track.manuallyEdited || false,
            lastEditedAt: track.lastEditedAt || null
        }));

        log("SAVE Playlist", `Připravuji ${cleanTracks.length} skladeb k teleportaci do '${docId}'.`, cleanTracks);

        // 🔢 Extrakce čísla verze pro řazení
        const versionNum = parseFloat(FirebaseVersionManager.currentVersion.replace('v', ''));

        await database.collection("app_data").doc(docId).set({
            tracks: cleanTracks,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            totalTracks: cleanTracks.length,
            // 🔢 VERZOVÁNÍ (kompatibilní s ostatními moduly):
            versionString: FirebaseVersionManager.currentVersion,
            versionNum: versionNum,
            sessionId: FirebaseVersionManager.sessionId,
            version: "3.7-AutoVersioning"
        });

        log("SAVE Playlist", "✅ ZÁPIS ÚSPĚŠNÝ! Data jsou v cloudu.", null, 'success');
        if (window.showNotification) window.showNotification(`Playlist uložen (${FirebaseVersionManager.currentVersion})!`, "success");
        return true;
    } catch (error) {
        console.error("❌ CRITICAL SAVE ERROR:", error);
        log("SAVE Playlist", "KRITICKÁ CHYBA PŘI ZÁPISU", error, 'error');
        if (window.showNotification) window.showNotification("Chyba při ukládání!", "error");
        throw error;
    }
};

    window.loadPlaylistFromFirestore = async function() {
        // 🔢 Inicializace verzování (pokud ještě není)
        if (!FirebaseVersionManager.currentVersion) {
            await FirebaseVersionManager.init();
        }
        
        const docId = FirebaseVersionManager.getVersionedDocId('main_playlist');
        log("LOAD Playlist", `📥 Požadavek na stažení playlistu z ${docId}.`);

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) return null;

        try {
            const doc = await database.collection("app_data").doc(docId).get();
            
            if (doc.exists) {
                const data = doc.data();
                log("LOAD Playlist", `✅ Dokument nalezen. Obsahuje ${data.tracks?.length || 0} skladeb.`, data, 'success');
                return data.tracks || [];
            } else {
                log("LOAD Playlist", `ℹ️ Dokument '${docId}' neexistuje (první spuštění této verze?).`, null, 'info');
                return null;
            }
        } catch (error) {
            log("LOAD Playlist", "CHYBA PŘI ČTENÍ", error, 'error');
            return null;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚙️ NASTAVENÍ PŘEHRÁVAČE
    // ═══════════════════════════════════════════════════════════════════════════
    window.savePlayerSettingsToFirestore = async function(settings) {
        apiLog("💾 Ukládám nastavení přehrávače...");
        if (!await waitForDatabaseConnection()) return;
        try {
            await getFirestoreDB().collection('audioPlayerSettings').doc('mainSettings')
                .set(settings, { merge: true });
        } catch (e) { log("SAVE Settings", "Chyba", e, 'error'); }
    };

    window.loadPlayerSettingsFromFirestore = async function() {
        if (!await waitForDatabaseConnection()) return null;
        try {
            const doc = await getFirestoreDB().collection('audioPlayerSettings').doc('mainSettings').get();
            return doc.exists ? doc.data() : null;
        } catch (e) { return null; }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ NASTAVENÍ VZHLEDU PLAYLISTU
    // ═══════════════════════════════════════════════════════════════════════════
    window.savePlaylistSettingsToFirestore = async function(settings) {
        apiLog("💾 Ukládám vizuální nastavení playlistu...");
        if (!await waitForDatabaseConnection()) return;
        try {
            await getFirestoreDB().collection('audioPlayerSettings').doc('playlistSettings')
                .set({ ...settings, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
            log("SAVE PlaylistStyle", "✅ Uloženo.", null, 'success');
        } catch (e) { log("SAVE PlaylistStyle", "Chyba", e, 'error'); }
    };

    window.loadPlaylistSettingsFromFirestore = async function() {
        apiLog("📥 Hledám vizuální nastavení...");
        if (!await waitForDatabaseConnection()) return null;
        try {
            const doc = await getFirestoreDB().collection('audioPlayerSettings').doc('playlistSettings').get();
            if (doc.exists) {
                const { lastUpdated, version, ...data } = doc.data();
                log("LOAD PlaylistStyle", "✅ Nalezeno.", data);
                return data;
            }
            return null;
        } catch (e) { return null; }
    };

    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧹 ÚDRŽBA - FUNKČNÍ ATOMOVKA
    // ═══════════════════════════════════════════════════════════════════════════
    window.clearAllAudioFirestoreData = async function() {
        log("DANGER", "⚠️ SPUŠTĚNA SEKVICE AUTODESTRUKCE CLOUDU!", null, 'error');
        
        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            log("DANGER", "Nelze smazat - Cloud nedostupný!", null, 'error');
            return false;
        }

        try {
            // 1. Smazání VŠECH verzovaných playlistů
            const snapshot = await database.collection("app_data")
                .where('versionNum', '>=', 0)
                .get();
            
            for (const doc of snapshot.docs) {
                await doc.ref.delete();
                log("DANGER", `🔥 Dokument '${doc.id}' smazán.`, null, 'success');
            }

            // 2. Smazání všech nastavení
            const settingsDocs = ['favorites', 'mainSettings', 'playlistSettings'];
            for (const docId of settingsDocs) {
                await database.collection('audioPlayerSettings').doc(docId).delete();
                log("DANGER", `🔥 Nastavení '${docId}' smazáno.`, null, 'success');
            }

            log("DANGER", "✅ AUDIO CLOUD JE ČISTÝ (Tabula Rasa).", null, 'success');

            // 3. Totální čistka lokální paměti
            const keysToRemove = ['favorites', 'playerSettings', 'playlistSettings', 'firebase_current_version', 'firebase_session_id'];
            keysToRemove.forEach(key => localStorage.removeItem(key));
            log("DANGER", "🧹 Lokální audio cache vymazána.", null, 'success');

            if (window.showNotification) {
                window.showNotification("Audio data vymazána. Systém se restartuje...", "success");
            }

            // 4. Restart lodi
            setTimeout(() => location.reload(), 1500);
            return true;

        } catch (error) {
            console.error("❌ CHYBA PŘI MAZÁNÍ:", error);
            log("DANGER", "Smazání selhalo!", error, 'error');
            return false;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 AUTO-START VERZOVACÍHO SYSTÉMU (spustí se PO inicializaci Firebase)
    // ═══════════════════════════════════════════════════════════════════════════
    (async function autoInitVersioning() {
    // 🔥 POČKEJ NA FIREBASE (kterou inicializuje DebugManager)
    await new Promise(resolve => {
        const check = setInterval(() => {
            if (window.db || (typeof firebase !== 'undefined' && firebase.apps.length > 0)) {
                clearInterval(check);
                console.log("✅ [AutoInit] Firebase je ready, spouštím verzování...");
                resolve();
            }
        }, 200);
    });
    
    // Extra delay pro jistotu
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Pak inicializuj verzování
    await FirebaseVersionManager.init();
        
        console.log(
            `%c🔢 FirebaseVersionManager V2.0 - AUTO-INCREMENT`, 
            'color: #00FF00; font-size: 14px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #00FF00;'
        );
        console.log(
            `%c   📡 Aktivní verze: ${FirebaseVersionManager.currentVersion}`, 
            'color: #00CCFF; font-size: 12px; font-weight: bold;'
        );
        console.log(
            `%c   🔄 Každý refresh = nová verze (ochrana před duplikáty)`, 
            'color: #FFCC00; font-size: 11px;'
        );
        console.log(
            `%c   🎛️ API: FirebaseVersionManager.listAllVersions() / .switchVersion('v1.2')`, 
            'color: #FF6B35; font-size: 10px;'
        );
    })();

    // ═══════════════════════════════════════════════════════════════════════════
    // 📡 ZÁVĚREČNÁ ZPRÁVA
    // ═══════════════════════════════════════════════════════════════════════════
    console.log(
        "%c🖖 audioFirebaseFunctions V3.7 - AUTO VERSIONING (Původní inicializace)", 
        "color: #00FF00; font-size: 14px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #00FF00;"
    );
    console.log(
        "%c   📡 Napojeno na DebugManager | Modul: 'firebase' + 'firebase-verze'", 
        "color: #FFCC00; font-size: 12px;"
    );
    console.log(
        "%c   🔓 HTTPS odkazy i Názvy SE UKLÁDAJÍ do Cloudu (Full Sync)", 
        "color: #00FF00; font-size: 11px; font-weight: bold;"
    );
    console.log(
        "%c   🔢 Automatické verzování: Každý refresh = nová verze", 
        "color: #FF6B35; font-size: 11px; font-weight: bold;"
    );
    console.log(
        "%c   🛡️ Ochrana ručních úprav: manuallyEdited + lastEditedAt ZACHOVÁNO", 
        "color: #00FF00; font-size: 11px; font-weight: bold;"
    );
    console.log(
        "%c   🚀 TVOJE PŮVODNÍ INICIALIZACE ZACHOVÁNA!", 
        "color: #FF00FF; font-size: 11px; font-weight: bold;"
    );
    console.log(
        "%c   Zapni logging: Ctrl+Shift+D → Firebase modul + firebase-verze", 
        "color: #00CCFF; font-size: 11px;"
    );
// ⏱️ LOG END
console.log(`%c🔥 [FIREBASE] Načteno za ${(performance.now() - __WARP_START).toFixed(2)} ms`, 'color: #ff9900; font-weight: bold;');
})();
