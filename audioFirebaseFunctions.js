// audioFirebaseFunctions.js
// 🖖 STAR TREK AUDIO CORE - DEBUGMANAGER EDITION (V3.5 - CLEAN)
// Verze: 3.5 (Button Visibility ODSTRANĚNO - Separace modulů)
// ═══════════════════════════════════════════════════════════════════════════════
// ✅ KOMPLETNÍ KONTROLA PROVEDENA - VÍCE ADMIRÁL JIŘÍK & ADMIRÁL CLAUDE.AI
// ═══════════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 📡 KONFIGURACE FIREBASE (SECURE LINK)
    // ═══════════════════════════════════════════════════════════════════════════
    const firebaseConfig = {
        apiKey: "AIzaSyCxO2BdPLkvRW9q3tZTW5J39pjjAoR-9Sk", 
        authDomain: "audio-prehravac-v-3.firebaseapp.com",
        projectId: "audio-prehravac-v-3", 
        storageBucket: "audio-prehravac-v-3.firebasestorage.app", 
        messagingSenderId: "343140348126", 
        appId: "1:343140348126:web:c61dc969efb6dcb547524f" 
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

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INICIALIZACE FIREBASE
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
            }, 100);
        });
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎵 HLAVNÍ PLAYLIST (UPRAVENO - BEZ HTTPS ODKAZŮ)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * 💾 SAVE PLAYLIST - Ukládáme JEN názvy skladeb (BEZ src odkazů)
     */
    window.savePlaylistToFirestore = async function(tracks) {
        log("SAVE Playlist", "🚀 Požadavek na uložení playlistu přijat (JEN názvy, BEZ odkazů).");

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
            // 🔥 KLÍČOVÁ ZMĚNA: Ukládáme JEN názvy, ne odkazy
            const cleanTracks = tracksToSave.map((track, index) => ({
                // ✅ ULOŽÍME: Názvy a metadata
                title: track.title || "Neznámá skladba",
                originalTitle: track.originalTitle || track.title,
                manuallyEdited: track.manuallyEdited || false,
                lastEditedAt: track.lastEditedAt || null,
                
                // 🔑 PÁROVACÍ KLÍČ: Čistý odkaz (BEZ tokenu)
                cleanSrc: track.src ? track.src.split('?')[0].trim() : `__INDEX_${index}__`,
                
                // ❌ NEULOŽÍME: track.src (HTTPS odkaz zůstane v myPlaylist.js)
                // ❌ NEULOŽÍME: track.duration (nepotřebujeme)
                // ❌ NEULOŽÍME: track.addedAt (nepotřebujeme)
            }));

            apiLog(`💾 Ukládám ${cleanTracks.length} názvů skladeb do 'app_data/main_playlist' (BEZ HTTPS)`);
            
            if (window.DebugManager?.isEnabled('firebase')) {
                log("SAVE Playlist", `Připravuji ${cleanTracks.length} názvů k teleportaci.`, cleanTracks);
            }

            await database.collection("app_data").doc("main_playlist").set({
                tracks: cleanTracks,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                totalTracks: cleanTracks.length,
                version: "3.5-NoSrcLinks-Clean"
            });

            log("SAVE Playlist", "✅ ZÁPIS ÚSPĚŠNÝ! Názvy jsou v cloudu.", null, 'success');
            if (window.showNotification) window.showNotification("Názvy skladeb uloženy do Cloudu!", "success");
            return true;

        } catch (error) {
            console.error("❌ CRITICAL SAVE ERROR:", error);
            log("SAVE Playlist", "KRITICKÁ CHYBA PŘI ZÁPISU", error, 'error');
            if (window.showNotification) window.showNotification("Chyba při ukládání!", "error");
            throw error;
        }
    };

    /**
     * 📥 LOAD PLAYLIST - Párujeme názvy z Cloudu s odkazy z myPlaylist.js
     */
    window.loadPlaylistFromFirestore = async function() {
        log("LOAD Playlist", "📥 Požadavek na stažení playlistu (názvy z Cloudu + odkazy lokálně).");

        // 🔥 RACE CONDITION FIX: Čekáme na explicitní signál z myPlaylist.js
        let waitAttempts = 0;
        const maxAttempts = 100; // Zvýšeno z 30 na 100 (10 sekund místo 2.4s)
        const waitInterval = 100; // 100ms interval
        
        log("LOAD Playlist", "⏳ Čekám na signál window.PLAYLIST_SOURCE_READY z myPlaylist.js...");
        
        while (!window.PLAYLIST_SOURCE_READY && waitAttempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, waitInterval));
            waitAttempts++;
            
            // Progress log každou sekundu (každých 10 pokusů)
            if (waitAttempts % 10 === 0 && window.DebugManager?.isEnabled('firebase')) {
                console.log(`⏳ Stále čekám... (${waitAttempts * waitInterval / 1000}s / ${maxAttempts * waitInterval / 1000}s)`);
            }
        }
        
        if (window.PLAYLIST_SOURCE_READY) {
            log("LOAD Playlist", `✅ myPlaylist.js je READY! (${window.originalTracks?.length || 0} skladeb) - načetl se za ${waitAttempts * waitInterval}ms`, null, 'success');
        } else {
            log("LOAD Playlist", `⚠️ TIMEOUT po ${maxAttempts * waitInterval / 1000} sekundách! myPlaylist.js se nenačetl. Pokračuji s rizikem...`, null, 'error');
        }

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) return null;

        try {
            const doc = await database.collection("app_data").doc("main_playlist").get();
            
            if (doc.exists) {
                const data = doc.data();
                const cloudTracks = data.tracks || [];
                
                apiLog(`📥 Načteno ${cloudTracks.length} názvů z Cloudu`);
                
                if (window.DebugManager?.isEnabled('firebase')) {
                    log("LOAD Playlist", `✅ Dokument nalezen. Obsahuje ${cloudTracks.length} názvů.`, data, 'success');
                }

                // 🔥 PÁROVACÍ LOGIKA - Propojíme cloud názvy s lokálními odkazy
                if (!window.originalTracks || window.originalTracks.length === 0) {
                    log("LOAD Playlist", "⚠️ window.originalTracks je prázdné! Nelze párovat.", null, 'error');
                    return cloudTracks; // Vrátíme alespoň názvy
                }

                // Vytvoříme mapu: cleanSrc → cloudData
                const cloudMap = new Map();
                cloudTracks.forEach(ct => {
                    if (ct.cleanSrc) {
                        cloudMap.set(ct.cleanSrc, ct);
                    }
                });

                // Projdeme lokální skladby a najdeme jim názvy z Cloudu
                const mergedTracks = window.originalTracks.map((localTrack, index) => {
                   const cleanSrc = localTrack.src ? localTrack.src.split('?')[0].trim() : `__INDEX_${index}__`;
                    const cloudData = cloudMap.get(cleanSrc);

                    if (cloudData) {
                        // ✅ NAŠLI JSME SHODU - použijeme název z Cloudu
                        return {
                            src: localTrack.src, // ✅ Odkaz z myPlaylist.js
                            title: cloudData.title, // ✅ Název z Cloudu
                            originalTitle: cloudData.originalTitle || localTrack.title,
                            manuallyEdited: cloudData.manuallyEdited ?? false,
                            lastEditedAt: cloudData.lastEditedAt ?? null,
                            duration: localTrack.duration || "" // Z lokálu
                        };
                    } else {
                        // ⚠️ NENÍ V CLOUDU - nová skladba, použijeme lokální název
                        log("LOAD Playlist", `⚠️ Skladba "${localTrack.title}" není v Cloudu (nová?)`, null, 'info');
                        return localTrack;
                    }
                });

                log("LOAD Playlist", `✅ Spárováno ${mergedTracks.length} skladeb (názvy z Cloudu + odkazy lokálně)`, null, 'success');
                return mergedTracks;
                
            } else {
                log("LOAD Playlist", "ℹ️ Dokument 'main_playlist' v kolekci 'app_data' neexistuje (první spuštění?).", null, 'info');
                return null;
            }
        } catch (error) {
            log("LOAD Playlist", "CHYBA PŘI ČTENÍ", error, 'error');
            return null;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // ⭐ OBLÍBENÉ SKLADBY
    // ═══════════════════════════════════════════════════════════════════════════
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
            // 1. Smazání hlavního playlistu
            await database.collection("app_data").doc("main_playlist").delete();
            log("DANGER", "🔥 Dokument 'main_playlist' smazán.", null, 'success');

            // 2. Smazání všech nastavení (BEZ button_visibility)
            const settingsDocs = ['favorites', 'mainSettings', 'playlistSettings'];
            for (const docId of settingsDocs) {
                await database.collection('audioPlayerSettings').doc(docId).delete();
                log("DANGER", `🔥 Nastavení '${docId}' smazáno.`, null, 'success');
            }

            log("DANGER", "✅ AUDIO CLOUD JE ČISTÝ (Tabula Rasa).", null, 'success');

            // 3. Totální čistka lokální paměti (jen audio části)
            const keysToRemove = ['favorites', 'playerSettings', 'playlistSettings'];
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
    // 📡 ZÁVĚREČNÁ ZPRÁVA
    // ═══════════════════════════════════════════════════════════════════════════
    console.log(
        "%c🖖 audioFirebaseFunctions V3.5 - CLEAN (bez Button Visibility)", 
        "color: #00FF00; font-size: 14px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #00FF00;"
    );
    console.log(
        "%c   📡 Napojeno na DebugManager | Modul: 'firebase'", 
        "color: #FFCC00; font-size: 12px;"
    );
    console.log(
        "%c   🔒 HTTPS odkazy SE NEUKLÁDAJÍ do Cloudu (jen názvy)", 
        "color: #00CCFF; font-size: 11px; font-weight: bold;"
    );
    console.log(
        "%c   🧹 Button Visibility ODSTRANĚNO - separátní modul", 
        "color: #FF6B35; font-size: 11px; font-weight: bold;"
    );
    console.log(
        "%c   Zapni logging: Ctrl+Shift+D → Firebase modul", 
        "color: #00CCFF; font-size: 11px;"
    );

})();
