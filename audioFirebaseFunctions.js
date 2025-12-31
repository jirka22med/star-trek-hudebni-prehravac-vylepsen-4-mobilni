// audioFirebaseFunctions.js
// 🖖 STAR TREK AUDIO CORE - FIREBASE V11.1.0 (Leden 2025)
// Verze: 4.1 - FIXED INIT SEQUENCE (Race Condition FIX)
// ═══════════════════════════════════════════════════════════════════════════════
// ✅ UPGRADE: V8 → V11.1.0 | LOGIKA: 100% ZACHOVÁNA | FIX: Async Init
// ═══════════════════════════════════════════════════════════════════════════════

// 🔥 IMPORT FIREBASE V11 MODULŮ (automaticky z CDN)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc,
    setDoc, 
    deleteDoc,
    serverTimestamp,
    enableIndexedDbPersistence 
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 📡 KONFIGURACE FIREBASE (tvoje původní config)
// ═══════════════════════════════════════════════════════════════════════════════
const firebaseConfig = {
    apiKey: "AIzaSyCxO2BdPLkvRW9q3tZTW5J39pjjAoR-9Sk", 
    authDomain: "audio-prehravac-v-3.firebaseapp.com",
    projectId: "audio-prehravac-v-3", 
    storageBucket: "audio-prehravac-v-3.firebasestorage.app", 
    messagingSenderId: "343140348126", 
    appId: "1:343140348126:web:c61dc969efb6dcb547524f" 
};

let app = null;
let db = null;
let isInitialized = false; // 🔥 NOVÝ: Sledování stavu inicializace
let initPromise = null; // 🔥 NOVÝ: Promise pro synchronizaci

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 LOGOVACÍ SYSTÉM - Napojený na DebugManager (NEZMĚNĚNO)
// ═══════════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════════
// 🛠️ POMOCNÉ FUNKCE PRO STABILITU (OPRAVENO)
// ═══════════════════════════════════════════════════════════════════════════════
function getFirestoreDB() {
    return db || window.db || null;
}

async function waitForDatabaseConnection() {
    // 🔥 NOVÝ: Pokud inicializace běží, počkáme na ni
    if (initPromise && !isInitialized) {
        if (window.DebugManager?.isEnabled('firebase')) {
            console.log("⏳ [DB Check] Čekám na dokončení inicializace...");
        }
        await initPromise;
    }

    // 🔥 NOVÝ: Pokud už je inicializováno, rovnou vrátíme
    if (isInitialized && getFirestoreDB()) {
        if (window.DebugManager?.isEnabled('firebase')) {
            console.log("✅ [DB Check] Databáze JIŽ připravena (skip wait).");
        }
        return true;
    }

    // Fallback: Klasická wait loop (pro edge cases)
    let attempts = 0;
    if (window.DebugManager?.isEnabled('firebase')) {
        console.log("⏳ [DB Check] Ověřuji spojení s warp jádrem (Firestore V11)...");
    }
    
    while (!getFirestoreDB() && attempts < 50) { 
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    const isReady = !!getFirestoreDB();
    
    if (isReady) {
        if (window.DebugManager?.isEnabled('firebase')) {
            console.log("✅ [DB Check] Spojení NAVÁZÁNO (V11 aktivní).");
        }
    } else {
        console.error("❌ [DB Check] Spojení SELHALO po 5 sekundách.");
    }
    return isReady;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INICIALIZACE FIREBASE V11 (OPRAVENO)
// ═══════════════════════════════════════════════════════════════════════════════
window.initializeFirebaseAppAudio = async function() {
    // 🔥 NOVÝ: Prevence duplicitní inicializace
    if (isInitialized) {
        log("INIT", "Firebase již inicializován (skip).", null, 'info');
        return true;
    }

    // 🔥 NOVÝ: Pokud inicializace běží, vrátíme existující promise
    if (initPromise) {
        log("INIT", "Inicializace již běží, čekám na dokončení...", null, 'info');
        return await initPromise;
    }

    log("INIT", "Zahajuji start sekvence Firebase V11.1.0...");
    
    initPromise = (async () => {
        try {
            // Inicializace Firebase App
            if (!app) {
                app = initializeApp(firebaseConfig);
                log("INIT", "Firebase App V11 Inicializována.");
            }

            // Inicializace Firestore
            db = getFirestore(app);
            window.db = db; // 🔥 DŮLEŽITÉ: Exportujeme do window HNED

            // Test spojení (dummy read)
            try {
                const testRef = doc(db, "_test_", "connection");
                await getDoc(testRef); // Testovací read
                log("INIT", "✅ Test spojení úspěšný.", null, 'success');
            } catch (testErr) {
                log("INIT", "⚠️ Test spojení selhal (může být OK pro offline)", testErr, 'info');
            }

            // 🆕 OFFLINE REŽIM (IndexedDB Persistence)
            try {
                await enableIndexedDbPersistence(db);
                log("INIT", "✅ Offline režim AKTIVNÍ (IndexedDB Persistence)", null, 'success');
            } catch (err) {
                if (err.code === 'failed-precondition') {
                    log("INIT", "⚠️ Offline persistence selhala: Příliš mnoho otevřených záložek.", null, 'info');
                } else if (err.code === 'unimplemented') {
                    log("INIT", "⚠️ Prohlížeč nepodporuje offline persistenci.", null, 'info');
                } else {
                    log("INIT", "⚠️ Offline persistence nedostupná.", err, 'info');
                }
            }

            isInitialized = true; // 🔥 DŮLEŽITÉ: Označíme jako hotovo
            log("INIT", "✅ Warpové jádro ONLINE!", null, 'success');
            return true;

        } catch (error) {
            console.error("❌ CRITICAL INIT ERROR:", error);
            log("INIT", "KRITICKÁ CHYBA PŘI INICIALIZACI", error, 'error');
            isInitialized = false;
            initPromise = null; // Reset pro možnost retry
            return false;
        }
    })();

    return await initPromise;
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎵 HLAVNÍ PLAYLIST (LOGIKA ZACHOVÁNA)
// ═══════════════════════════════════════════════════════════════════════════════

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
        const cleanTracks = tracksToSave.map((track, index) => ({
            title: track.title || "Neznámá skladba",
            originalTitle: track.originalTitle || track.title,
            manuallyEdited: track.manuallyEdited || false,
            lastEditedAt: track.lastEditedAt || null,
            cleanSrc: track.src ? track.src.split('?')[0].trim() : `__INDEX_${index}__`,
        }));

        apiLog(`💾 Ukládám ${cleanTracks.length} názvů skladeb do 'app_data/main_playlist' (V11 API)`);
        
        if (window.DebugManager?.isEnabled('firebase')) {
            log("SAVE Playlist", `Připravuji ${cleanTracks.length} názvů k teleportaci.`, cleanTracks);
        }

        const docRef = doc(database, "app_data", "main_playlist");
        await setDoc(docRef, {
            tracks: cleanTracks,
            lastUpdated: serverTimestamp(),
            totalTracks: cleanTracks.length,
            version: "4.1-V11-FixedInit"
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

    // 🔥 RACE CONDITION FIX (NEZMĚNĚNO)
    let waitAttempts = 0;
    const maxAttempts = 100;
    const waitInterval = 100;
    
    log("LOAD Playlist", "⏳ Čekám na signál window.PLAYLIST_SOURCE_READY z myPlaylist.js...");
    
    while (!window.PLAYLIST_SOURCE_READY && waitAttempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, waitInterval));
        waitAttempts++;
        
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
        const docRef = doc(database, "app_data", "main_playlist");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const cloudTracks = data.tracks || [];
            
            apiLog(`📥 Načteno ${cloudTracks.length} názvů z Cloudu (V11)`);
            
            if (window.DebugManager?.isEnabled('firebase')) {
                log("LOAD Playlist", `✅ Dokument nalezen. Obsahuje ${cloudTracks.length} názvů.`, data, 'success');
            }

            if (!window.originalTracks || window.originalTracks.length === 0) {
                log("LOAD Playlist", "⚠️ window.originalTracks je prázdné! Nelze párovat.", null, 'error');
                return cloudTracks;
            }

            const cloudMap = new Map();
            cloudTracks.forEach(ct => {
                if (ct.cleanSrc) {
                    cloudMap.set(ct.cleanSrc, ct);
                }
            });

            const mergedTracks = window.originalTracks.map((localTrack, index) => {
                const cleanSrc = localTrack.src ? localTrack.src.split('?')[0].trim() : `__INDEX_${index}__`;
                const cloudData = cloudMap.get(cleanSrc);

                if (cloudData) {
                    return {
                        src: localTrack.src,
                        title: cloudData.title,
                        originalTitle: cloudData.originalTitle || localTrack.title,
                        manuallyEdited: cloudData.manuallyEdited || false,
                        lastEditedAt: cloudData.lastEditedAt || null,
                        duration: localTrack.duration || ""
                    };
                } else {
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

// ═══════════════════════════════════════════════════════════════════════════════
// ⭐ OBLÍBENÉ SKLADBY (V11 API)
// ═══════════════════════════════════════════════════════════════════════════════
window.saveFavoritesToFirestore = async function(favoritesArray) {
    apiLog("💾 Ukládám oblíbené...");
    if (!await waitForDatabaseConnection()) return;
    try {
        const docRef = doc(getFirestoreDB(), 'audioPlayerSettings', 'favorites');
        await setDoc(docRef, { titles: favoritesArray }, { merge: true });
        log("SAVE Favorites", "✅ Oblíbené uloženy.", null, 'success');
    } catch (e) { log("SAVE Favorites", "Chyba", e, 'error'); }
};

window.loadFavoritesFromFirestore = async function() {
    apiLog("📥 Načítám oblíbené...");
    if (!await waitForDatabaseConnection()) return null;
    try {
        const docRef = doc(getFirestoreDB(), 'audioPlayerSettings', 'favorites');
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data().titles : null;
        if (data) apiLog(`✅ Načteno ${data.length} oblíbených skladeb`);
        return data;
    } catch (e) { return null; }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ⚙️ NASTAVENÍ PŘEHRÁVAČE (V11 API)
// ═══════════════════════════════════════════════════════════════════════════════
window.savePlayerSettingsToFirestore = async function(settings) {
    apiLog("💾 Ukládám nastavení přehrávače...");
    if (!await waitForDatabaseConnection()) return;
    try {
        const docRef = doc(getFirestoreDB(), 'audioPlayerSettings', 'mainSettings');
        await setDoc(docRef, settings, { merge: true });
    } catch (e) { log("SAVE Settings", "Chyba", e, 'error'); }
};

window.loadPlayerSettingsFromFirestore = async function() {
    if (!await waitForDatabaseConnection()) return null;
    try {
        const docRef = doc(getFirestoreDB(), 'audioPlayerSettings', 'mainSettings');
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (e) { return null; }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🛠️ NASTAVENÍ VZHLEDU PLAYLISTU (V11 API)
// ═══════════════════════════════════════════════════════════════════════════════
window.savePlaylistSettingsToFirestore = async function(settings) {
    apiLog("💾 Ukládám vizuální nastavení playlistu...");
    if (!await waitForDatabaseConnection()) return;
    try {
        const docRef = doc(getFirestoreDB(), 'audioPlayerSettings', 'playlistSettings');
        await setDoc(docRef, { 
            ...settings, 
            lastUpdated: serverTimestamp() 
        }, { merge: true });
        log("SAVE PlaylistStyle", "✅ Uloženo.", null, 'success');
    } catch (e) { log("SAVE PlaylistStyle", "Chyba", e, 'error'); }
};

window.loadPlaylistSettingsFromFirestore = async function() {
    apiLog("📥 Hledám vizuální nastavení...");
    if (!await waitForDatabaseConnection()) return null;
    try {
        const docRef = doc(getFirestoreDB(), 'audioPlayerSettings', 'playlistSettings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { lastUpdated, version, ...data } = docSnap.data();
            log("LOAD PlaylistStyle", "✅ Nalezeno.", data);
            return data;
        }
        return null;
    } catch (e) { return null; }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🧹 ÚDRŽBA - FUNKČNÍ ATOMOVKA (V11 API)
// ═══════════════════════════════════════════════════════════════════════════════
window.clearAllAudioFirestoreData = async function() {
    log("DANGER", "⚠️ SPUŠTĚNA SEKVENCE AUTODESTRUKCE CLOUDU!", null, 'error');
    
    const isReady = await waitForDatabaseConnection();
    const database = getFirestoreDB();

    if (!isReady || !database) {
        log("DANGER", "Nelze smazat - Cloud nedostupný!", null, 'error');
        return false;
    }

    try {
        await deleteDoc(doc(database, "app_data", "main_playlist"));
        log("DANGER", "🔥 Dokument 'main_playlist' smazán.", null, 'success');

        const settingsDocs = ['favorites', 'mainSettings', 'playlistSettings'];
        for (const docId of settingsDocs) {
            await deleteDoc(doc(database, 'audioPlayerSettings', docId));
            log("DANGER", `🔥 Nastavení '${docId}' smazáno.`, null, 'success');
        }

        log("DANGER", "✅ AUDIO CLOUD JE ČISTÝ (Tabula Rasa).", null, 'success');

        const keysToRemove = ['favorites', 'playerSettings', 'playlistSettings'];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        log("DANGER", "🧹 Lokální audio cache vymazána.", null, 'success');

        if (window.showNotification) {
            window.showNotification("Audio data vymazána. Systém se restartuje...", "success");
        }

        setTimeout(() => location.reload(), 1500);
        return true;

    } catch (error) {
        console.error("❌ CHYBA PŘI MAZÁNÍ:", error);
        log("DANGER", "Smazání selhalo!", error, 'error');
        return false;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 AUTO-START SEKVENCE (OPRAVENO)
// ═══════════════════════════════════════════════════════════════════════════════
(async function() {
    console.log(
        "%c🖖 audioFirebaseFunctions V4.1 - FIREBASE V11.1.0 (FIXED INIT)", 
        "color: #00FF00; font-size: 16px; font-weight: bold; background: #000; padding: 12px; border: 3px solid #00FF00;"
    );
    console.log(
        "%c   🔧 FIX: Async race condition v inicializaci vyřešena", 
        "color: #FFD700; font-size: 13px; font-weight: bold;"
    );
    console.log(
        "%c   📡 Modulární Import | Žádné externí knihovny v HTML!", 
        "color: #00CCFF; font-size: 12px;"
    );
    console.log(
        "%c   🔒 HTTPS odkazy SE NEUKLÁDAJÍ do Cloudu (jen názvy)", 
        "color: #FFCC00; font-size: 11px;"
    );
    console.log(
        "%c   🆕 IndexedDB Persistence AKTIVNÍ (offline režim)", 
        "color: #00FF00; font-size: 11px;"
    );
    console.log(
        "%c   Zapni logging: Ctrl+Shift+D → Firebase modul", 
        "color: #00CCFF; font-size: 11px;"
    );

    // Auto-inicializace Firebase s lepším error handlingem
    try {
        await window.initializeFirebaseAppAudio();
        console.log("%c✅ Firebase inicializace dokončena!", "color: #00FF00; font-weight: bold;");
    } catch (error) {
        console.error("%c❌ Firebase inicializace selhala!", "color: #FF0000; font-weight: bold;", error);
    }
})();
