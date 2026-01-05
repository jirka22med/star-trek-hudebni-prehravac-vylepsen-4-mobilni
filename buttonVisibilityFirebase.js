// buttonVisibilityFirebase.js
// 🖖 BUTTON VISIBILITY FIREBASE MODULE
// Verze: 1.0.0 (Samostatná struktura v Cloud Firestore)
// ═══════════════════════════════════════════════════════════════════════════════
// ✅ Více admirál Jiřík & Admirál Claude.AI
// ═══════════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';
const __buttonVisibilityFirebase_START = performance.now();
 
    const COLLECTION_NAME = 'spravaTlacitek'; // Samostatná kolekce
    const DOC_NAME = 'config'; // Hlavní dokument s konfigurací

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 LOGOVACÍ SYSTÉM - Napojený na DebugManager
    // ═══════════════════════════════════════════════════════════════════════════
    function log(component, message, data = null, type = 'info') {
        if (!window.DebugManager?.isEnabled('buttons')) return;
        
        const style = type === 'error' ? 'background: #550000; color: #ffaaaa' : 
                      type === 'success' ? 'background: #003300; color: #00ff00' : 
                      'background: #330033; color: #ff00ff';
        
        console.groupCollapsed(`%c[${component}] ${message}`, `padding: 2px 5px; border-radius: 3px; font-weight: bold; ${style}`);
        if (data) console.log("📦 Data:", data);
        if (type === 'error') console.trace("🔍 Stack Trace (Error)");
        console.groupEnd();
    }

    function apiLog(action, details = '') {
        if (!window.DebugManager?.isEnabled('buttons')) return;
        console.log(`%c[Firebase Buttons] ${action}`, 'color: #FF00FF; font-weight: bold;', details);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ POMOCNÉ FUNKCE
    // ═══════════════════════════════════════════════════════════════════════════
    function getFirestoreDB() {
        if (window.db) return window.db;
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            return firebase.firestore();
        }
        return null;
    }

    async function waitForDatabaseConnection() {
        let attempts = 0;
        
        if (window.DebugManager?.isEnabled('buttons')) {
            console.log("⏳ [Button DB Check] Ověřuji spojení s Firebase...");
        }
        
        while (!getFirestoreDB() && attempts < 50) { 
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        const isReady = !!getFirestoreDB();
        
        if (isReady) {
            if (window.DebugManager?.isEnabled('buttons')) {
                console.log("✅ [Button DB Check] Spojení NAVÁZÁNO.");
            }
        } else {
            console.error("❌ [Button DB Check] Spojení SELHALO po 5 sekundách.");
        }
        return isReady;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 SAVE - Uložení konfigurace tlačítek
    // ═══════════════════════════════════════════════════════════════════════════
    window.saveButtonVisibilityToFirestore = async function(dataToSync) {
        log("SAVE Buttons", "🚀 Požadavek na uložení konfigurace tlačítek přijat.");

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            log("SAVE Buttons", "Databáze nedostupná!", null, 'error');
            if (window.showNotification) {
                window.showNotification("Chyba: Cloud nedostupný!", "error");
            }
            return false;
        }

        if (!dataToSync || !dataToSync.config) {
            log("SAVE Buttons", "Žádná data k uložení (config je prázdné/null).", dataToSync, 'error');
            return false;
        }

        try {
            const totalButtons = Object.keys(dataToSync.config).length;

            apiLog(`💾 Ukládám konfiguraci ${totalButtons} tlačítek do '${COLLECTION_NAME}/${DOC_NAME}'`);
            
            if (window.DebugManager?.isEnabled('buttons')) {
                log("SAVE Buttons", `Připravuji ${totalButtons} nastavení k teleportaci.`, dataToSync);
            }

            await database.collection(COLLECTION_NAME).doc(DOC_NAME).set({
                buttonVisibility: dataToSync.config,
                version: dataToSync.version,
                lastModified: dataToSync.lastModified,
                totalButtons: totalButtons,
                lastSync: firebase.firestore.FieldValue.serverTimestamp()
            });

            log("SAVE Buttons", "✅ ZÁPIS ÚSPĚŠNÝ! Konfigurace je v cloudu.", null, 'success');
            
            if (window.showNotification) {
                window.showNotification("Konfigurace tlačítek uložena do Cloudu!", "success");
            }
            
            return true;

        } catch (error) {
            console.error("❌ CRITICAL SAVE ERROR:", error);
            log("SAVE Buttons", "KRITICKÁ CHYBA PŘI ZÁPISU", error, 'error');
            
            if (window.showNotification) {
                window.showNotification("Chyba při ukládání konfigurace!", "error");
            }
            
            throw error;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📥 LOAD - Načtení konfigurace tlačítek
    // ═══════════════════════════════════════════════════════════════════════════
    window.loadButtonVisibilityFromFirestore = async function() {
        log("LOAD Buttons", "📥 Požadavek na stažení konfigurace tlačítek.");

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            log("LOAD Buttons", "Databáze nedostupná!", null, 'error');
            return null;
        }

        try {
            const doc = await database.collection(COLLECTION_NAME).doc(DOC_NAME).get();
            
            if (doc.exists) {
                const data = doc.data();
                
                apiLog(`📥 Načtena konfigurace ${data.totalButtons || 0} tlačítek z Cloudu`);
                
                if (window.DebugManager?.isEnabled('buttons')) {
                    log("LOAD Buttons", `✅ Dokument nalezen.`, data, 'success');
                }

                // Vrátíme strukturu kompatibilní s buttonVisibilityManager.js
                return {
                    config: data.buttonVisibility,
                    version: data.version,
                    lastModified: data.lastModified
                };
                
            } else {
                log("LOAD Buttons", `ℹ️ Dokument '${COLLECTION_NAME}/${DOC_NAME}' neexistuje (první spuštění?).`, null, 'info');
                return null;
            }
        } catch (error) {
            console.error("❌ LOAD ERROR:", error);
            log("LOAD Buttons", "CHYBA PŘI ČTENÍ", error, 'error');
            return null;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 SYNC - Inteligentní synchronizace (konflikt management)
    // ═══════════════════════════════════════════════════════════════════════════
    window.syncButtonVisibilityWithFirestore = async function(localConfig) {
        log("SYNC Buttons", "🔄 Zahajuji inteligentní synchronizaci...");

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            return { success: false, message: "Cloud nedostupný" };
        }

        try {
            const cloudData = await window.loadButtonVisibilityFromFirestore();

            if (!cloudData) {
                // Cloud je prázdný - nahrajeme lokální data
                log("SYNC Buttons", "Cloud je prázdný - nahrávám lokální konfiguraci.", null, 'info');
                
                await window.saveButtonVisibilityToFirestore({
                    config: localConfig,
                    version: window.VERSION_BVIS || "1.0.0",
                    lastModified: new Date().toISOString()
                });

                return { 
                    success: true, 
                    message: "Lokální konfigurace nahrána do cloudu",
                    config: localConfig
                };
            }

            // Porovnání verzí/timestampů
            const localTime = new Date(localStorage.getItem('buttonVisibilityLastModified') || 0);
            const cloudTime = new Date(cloudData.lastModified || 0);

            if (cloudTime > localTime) {
                // Cloud je novější - stáhneme
                log("SYNC Buttons", "☁️ Cloud je novější - stahuji konfiguraci.", null, 'info');
                
                return { 
                    success: true, 
                    message: "Stažena novější konfigurace z cloudu",
                    config: cloudData.config,
                    source: "cloud"
                };
            } else {
                // Lokál je novější - nahrajeme
                log("SYNC Buttons", "📤 Lokální konfigurace je novější - nahrávám.", null, 'info');
                
                await window.saveButtonVisibilityToFirestore({
                    config: localConfig,
                    version: window.VERSION_BVIS || "1.0.0",
                    lastModified: new Date().toISOString()
                });

                return { 
                    success: true, 
                    message: "Lokální konfigurace nahrána do cloudu",
                    config: localConfig,
                    source: "local"
                };
            }

        } catch (error) {
            console.error("❌ SYNC ERROR:", error);
            log("SYNC Buttons", "CHYBA PŘI SYNCHRONIZACI", error, 'error');
            
            return { 
                success: false, 
                message: `Chyba synchronizace: ${error.message}` 
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 BACKUP - Vytvoření zálohy
    // ═══════════════════════════════════════════════════════════════════════════
    window.backupButtonVisibilityToFirestore = async function(backupName = null, config = null) {
        log("BACKUP Buttons", "💾 Vytvářím zálohu konfigurace...");

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            throw new Error("Cloud nedostupný");
        }

        try {
            const timestamp = new Date().toISOString();
            const name = backupName || `backup_${timestamp.replace(/[:.]/g, '-')}`;

            await database.collection(COLLECTION_NAME).doc('backups').collection('history').doc(name).set({
                buttonVisibility: config || window.buttonVisibility || {},
                version: window.VERSION_BVIS || "1.0.0",
                createdAt: timestamp,
                backupName: name
            });

            log("BACKUP Buttons", `✅ Záloha '${name}' vytvořena.`, null, 'success');
            
            return name;

        } catch (error) {
            console.error("❌ BACKUP ERROR:", error);
            log("BACKUP Buttons", "CHYBA PŘI VYTVÁŘENÍ ZÁLOHY", error, 'error');
            throw error;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🗑️ CLEAR - Smazání konfigurace tlačítek
    // ═══════════════════════════════════════════════════════════════════════════
    window.clearButtonVisibilityFromFirestore = async function() {
        log("CLEAR Buttons", "⚠️ MAZÁNÍ konfigurace tlačítek!", null, 'error');

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            log("CLEAR Buttons", "Databáze nedostupná!", null, 'error');
            return false;
        }

        try {
            await database.collection(COLLECTION_NAME).doc(DOC_NAME).delete();
            
            log("CLEAR Buttons", "🔥 Konfigurace tlačítek smazána z cloudu.", null, 'success');
            
            if (window.showNotification) {
                window.showNotification("Konfigurace tlačítek vymazána z cloudu!", "success");
            }
            
            return true;

        } catch (error) {
            console.error("❌ CLEAR ERROR:", error);
            log("CLEAR Buttons", "Chyba při mazání", error, 'error');
            return false;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📡 ZÁVĚREČNÁ ZPRÁVA
    // ═══════════════════════════════════════════════════════════════════════════
    console.log(
        "%c🖖 buttonVisibilityFirebase V1.0.0", 
        "color: #FF00FF; font-size: 14px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #FF00FF;"
    );
    console.log(
        "%c   📡 Napojeno na DebugManager | Modul: 'buttons'", 
        "color: #FFCC00; font-size: 12px;"
    );
    console.log(
        "%c   ☁️ Samostatná struktura: spravaTlacitek/config", 
        "color: #00CCFF; font-size: 11px; font-weight: bold;"
    );
    console.log(
        "%c   Zapni logging: Ctrl+Shift+D → Buttons modul", 
        "color: #00CCFF; font-size: 11px;"
    );

console.log(`%c🚀 [buttonVisibilityFirebase] Načteno za ${(performance.now() - __buttonVisibilityFirebase_START).toFixed(2)} ms`, 'background: #000; color: #00ff00; font-weight: bold; padding: 2px;');
})();
