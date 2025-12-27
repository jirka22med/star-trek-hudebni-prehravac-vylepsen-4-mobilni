// audioFirebaseFunctions.js
// 🖖 STAR TREK AUDIO CORE - DEBUGMANAGER EDITION (V3.3)
// Verze: 3.3 (DebugManager Integration)
// Tento soubor nyní respektuje centrální DebugManager

(function() {
    'use strict';

    // 🔥 NOVÉ: Dynamické logování přes DebugManager
    // Místo konstanty DEBUG_COLOUDE_FIRESTORE používáme DebugManager.isEnabled('firebase')
    
    // --- 1. KONFIGURACE (SECURE LINK) ---
    const firebaseConfig = {
        apiKey: "AIzaSyCxO2BdPLkvRW9q3tZTW5J39pjjAoR-9Sk", 
        authDomain: "audio-prehravac-v-3.firebaseapp.com",
        projectId: "audio-prehravac-v-3", 
        storageBucket: "audio-prehravac-v-3.firebasestorage.app", 
        messagingSenderId: "343140348126", 
        appId: "1:343140348126:web:c61dc969efb6dcb547524f" 
    };

    let db; // Globální instance databáze

    // 🔥 NOVÝ LOGOVACÍ SYSTÉM - Napojený na DebugManager
    function log(component, message, data = null, type = 'info') {
        // Kontrola, zda je DebugManager připraven a modul 'firebase' je zapnutý
        if (!window.DebugManager?.isEnabled('firebase')) return;
        
        const style = type === 'error' ? 'background: #550000; color: #ffaaaa' : 
                      type === 'success' ? 'background: #003300; color: #00ff00' : 
                      'background: #000033; color: #00ffff';
        
        console.groupCollapsed(`%c[${component}] ${message}`, `padding: 2px 5px; border-radius: 3px; font-weight: bold; ${style}`);
        if (data) console.log("📦 Data:", data);
        
        // Stack trace jen při errorech (optimalizace)
        if (type === 'error') {
            console.trace("🔍 Stack Trace (Error)");
        }
        
        console.groupEnd();
    }

    // 🔥 NOVÝ: Pomocná funkce pro API logy (kratší formát)
    function apiLog(action, details = '') {
        if (!window.DebugManager?.isEnabled('firebase')) return;
        console.log(`%c[Firebase API] ${action}`, 'color: #00CCFF; font-weight: bold;', details);
    }

    // --- 2. POMOCNÉ FUNKCE PRO STABILITU ---

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
        
        // 🔥 ZMĚNA: Logujeme jen pokud je firebase logging zapnutý
        if (window.DebugManager?.isEnabled('firebase')) {
            console.log("⏳ [DB Check] Ověřuji spojení s warp jádrem (Firestore)...");
        }
        
        while (!getFirestoreDB() && attempts < 50) { 
            await new Promise(resolve => setTimeout(resolve, 100));
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

    // --- 3. INICIALIZACE ---
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
            }, 100);
        });
    };

    // ============================================================================
    // 🎵 HLAVNÍ PLAYLIST (CORE FUNCTIONS)
    // ============================================================================

    window.savePlaylistToFirestore = async function(tracks) {
        log("SAVE Playlist", "🚀 Požadavek na uložení playlistu přijat.");

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
            // Očištění dat + DIAGNOSTIKA DAT
            const cleanTracks = tracksToSave.map(track => ({
                title: track.title || "Neznámá skladba", 
                src: track.src || "",
                originalTitle: track.originalTitle || track.title, 
                duration: track.duration || "", 
                addedAt: track.addedAt || Date.now(),
                // 🔥 Ochrana ručních úprav
                manuallyEdited: track.manuallyEdited || false,
                lastEditedAt: track.lastEditedAt || null
            }));

            // 🔥 ZMĚNA: Zkrácený log - zobrazí jen základní info
            apiLog(`💾 Ukládám ${cleanTracks.length} skladeb do 'app_data/main_playlist'`);
            
            // 🔥 VOLITELNÉ: Detailní log jen při zapnutém firebase debuggingu
            if (window.DebugManager?.isEnabled('firebase')) {
                log("SAVE Playlist", `Připravuji ${cleanTracks.length} skladeb k teleportaci.`, cleanTracks);
            }

            await database.collection("app_data").doc("main_playlist").set({
                tracks: cleanTracks,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                totalTracks: cleanTracks.length,
                version: "3.3-DebugManager-Integration"
            });

            log("SAVE Playlist", "✅ ZÁPIS ÚSPĚŠNÝ! Data jsou v cloudu.", null, 'success');
            if (window.showNotification) //window.showNotification("Playlist uložen do Cloudu!", "success");
            return true;
        } catch (error) {
            console.error("❌ CRITICAL SAVE ERROR:", error);
            log("SAVE Playlist", "KRITICKÁ CHYBA PŘI ZÁPISU", error, 'error');
            if (window.showNotification) window.showNotification("Chyba při ukládání!", "error");
            throw error;
        }
    };

    window.loadPlaylistFromFirestore = async function() {
        log("LOAD Playlist", "📥 Požadavek na stažení playlistu.");

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) return null;

        try {
            const doc = await database.collection("app_data").doc("main_playlist").get();
            
            if (doc.exists) {
                const data = doc.data();
                
                // 🔥 ZMĚNA: Zkrácený log
                apiLog(`📥 Načteno ${data.tracks?.length || 0} skladeb z Cloudu`);
                
                // 🔥 VOLITELNÉ: Detailní log
                if (window.DebugManager?.isEnabled('firebase')) {
                    log("LOAD Playlist", `✅ Dokument nalezen. Obsahuje ${data.tracks?.length || 0} skladeb.`, data, 'success');
                }
                
                return data.tracks || [];
            } else {
                log("LOAD Playlist", "ℹ️ Dokument 'main_playlist' v kolekci 'app_data' neexistuje (první spuštění?).", null, 'info');
                return null;
            }
        } catch (error) {
            log("LOAD Playlist", "CHYBA PŘI ČTENÍ", error, 'error');
            return null;
        }
    };

    // ============================================================================
    // ⭐ OBLÍBENÉ A NASTAVENÍ
    // ============================================================================

    window.saveFavoritesToFirestore = async function(favoritesArray) {
        apiLog("💾 Ukládám oblíbené...");
        if (!await waitForDatabaseConnection()) return;
        try {
            await getFirestoreDB().collection('audioPlayerSettings').doc('favorites')
                .set({ titles: favoritesArray }, { merge: true });
            log("SAVE Favorites", "✅ Oblíbené uloženy.", null, 'success');
        } catch (e) { log("SAVE Favorites", "Chyba", e, 'error'); }
    };

    window.loadFavoritesFromFirestore = async function() {
        apiLog("📥 Načítám oblíbené...");
        if (!await waitForDatabaseConnection()) return null;
        try {
            const doc = await getFirestoreDB().collection('audioPlayerSettings').doc('favorites').get();
            const data = doc.exists ? doc.data().titles : null;
            if (data) apiLog(`✅ Načteno ${data.length} oblíbených skladeb`);
            return data;
        } catch (e) { return null; }
    };

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

    // ============================================================================
    // 🛠️ NASTAVENÍ VZHLEDU PLAYLISTU
    // ============================================================================

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

    // ============================================================================
    // 👁️ BUTTON VISIBILITY MANAGER
    // ============================================================================

    window.saveButtonVisibilityToFirestore = async function(config) {
        apiLog("💾 Ukládám konfiguraci tlačítek...");
        if (!await waitForDatabaseConnection()) return;
        try {
            await getFirestoreDB().collection('audioPlayerSettings').doc('buttonVisibilityConfig')
                .set({ ...config, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        } catch (e) { log("SAVE Visibility", "Chyba", e, 'error'); }
    };

    window.loadButtonVisibilityFromFirestore = async function() {
        if (!await waitForDatabaseConnection()) return null;
        try {
            const doc = await getFirestoreDB().collection('audioPlayerSettings').doc('buttonVisibilityConfig').get();
            if (doc.exists) {
                const { lastUpdated, version, deviceInfo, configHash, ...data } = doc.data();
                return data;
            }
            return null;
        } catch (e) { return null; }
    };

    window.syncButtonVisibilityWithFirestore = async function(localConfig = null) {
        apiLog("🔄 Zahajuji synchronizaci tlačítek...");
        if (!await waitForDatabaseConnection()) return { success: false };
        
        const cloudConfig = await window.loadButtonVisibilityFromFirestore();
        
        if (!localConfig) {
            const stored = localStorage.getItem('buttonVisibility');
            localConfig = stored ? JSON.parse(stored) : null;
        }

        if (!cloudConfig && localConfig) {
            log("SYNC Visibility", "Cloud prázdný -> Nahrávám lokální.");
            await window.saveButtonVisibilityToFirestore(localConfig);
            return { action: 'uploaded_to_cloud', config: localConfig };
        } else if (cloudConfig) {
            log("SYNC Visibility", "Cloud nalezen -> Stahuji do lokálu.");
            localStorage.setItem('buttonVisibility', JSON.stringify(cloudConfig));
            return { action: 'downloaded_from_cloud', config: cloudConfig };
        }
        return { action: 'no_changes' };
    };

    window.autoSyncButtonVisibilityOnLoad = async function() {
        await window.initializeFirebaseAppAudio();
        const res = await window.syncButtonVisibilityWithFirestore();
        if (res.config && window.ButtonVisibilityManager) {
            window.ButtonVisibilityManager.setConfig(res.config);
            log("AUTO SYNC", "Konfigurace aplikována do UI.");
        }
    };

    // EXPORT PRO VISIBILITY MANAGER
    window.ButtonVisibilityFirebaseManager = {
        save: window.saveButtonVisibilityToFirestore,
        load: window.loadButtonVisibilityFromFirestore,
        sync: window.syncButtonVisibilityWithFirestore,
        autoSync: window.autoSyncButtonVisibilityOnLoad
    };

    // ============================================================================
    // 🧹 ÚDRŽBA - FUNKČNÍ ATOMOVKA
    // ============================================================================

    window.clearAllAudioFirestoreData = async function() {
        log("DANGER", "⚠️ SPUŠTĚNA SEKVICE AUTODESTRUKCE CLOUDU!", null, 'error');
        
        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            log("DANGER", "Nelze smazat - Cloud nedostupný!", null, 'error');
            return false;
        }

        try {
            // 1. Smazání hlavního playlistu
            await database.collection("app_data").doc("main_playlist").delete();
            log("DANGER", "🔥 Dokument 'main_playlist' smazán.", null, 'success');

            // 2. Smazání všech nastavení
            const settingsDocs = ['favorites', 'mainSettings', 'playlistSettings', 'buttonVisibilityConfig'];
            for (const docId of settingsDocs) {
                await database.collection('audioPlayerSettings').doc(docId).delete();
                log("DANGER", `🔥 Nastavení '${docId}' smazáno.`, null, 'success');
            }

            log("DANGER", "✅ CLOUD JE ČISTÝ (Tabula Rasa).", null, 'success');

            // 3. Totální čistka lokální paměti
            localStorage.clear();
            sessionStorage.clear();
            log("DANGER", "🧹 Lokální mezipaměť vymazána.", null, 'success');

            if (window.showNotification) {
                window.showNotification("Všechna data vymazána. Systém se restartuje...", "success");
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

    // Automatický start syncu
    if (typeof window !== 'undefined') {
        setTimeout(() => window.autoSyncButtonVisibilityOnLoad(), 2000);
    }

    // 🔥 ZÁVĚREČNÁ ZPRÁVA - Zobrazí se vždy
    console.log(
        "%c🖖 audioFirebaseFunctions V3.3", 
        "color: #00FF00; font-size: 14px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #00FF00;"
    );
    console.log(
        "%c   📡 Napojeno na DebugManager | Modul: 'firebase'", 
        "color: #FFCC00; font-size: 12px;"
    );
    console.log(
        "%c   Zapni logging: Ctrl+Shift+D → Firebase modul", 
        "color: #00CCFF; font-size: 11px;"
    );


//ŠTĚNICE PRO TESTOVACÍ SOUBOR PRO test-vypadku-cloude-firestore.js \\



})(); 
