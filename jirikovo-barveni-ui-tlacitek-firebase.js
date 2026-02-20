// jirikovo-barveni-ui-tlacitek-firebase.js
// 🖖 JIŘÍKOVO BARVENÍ UI - FIREBASE MODUL
// Verze: 1.0.0
// ═══════════════════════════════════════════════════════════════════════════════
// ✅ Více admirál Jiřík & Admirál Claude.AI
// ☁️ Ukládání a načítání konfigurace barvení tlačítek do/z Firebase Firestore
// ═══════════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    const __BARVENI_FIREBASE_START = performance.now();

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 KONFIGURACE
    // ═══════════════════════════════════════════════════════════════════════════
    const COLLECTION_NAME = 'jirikBarveniTlacitek'; // vlastní kolekce
    const DOC_NAME = 'config';
    const VERSION_FIREBASE = "1.0.0";

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 LOGOVACÍ SYSTÉM - napojený na DebugManager
    // ═══════════════════════════════════════════════════════════════════════════
    function log(component, message, data = null, type = 'info') {
        if (!window.DebugManager?.isEnabled('buttons')) return;

        const style = type === 'error'   ? 'background: #550000; color: #ffaaaa' :
                      type === 'success' ? 'background: #003300; color: #00ff00' :
                      type === 'warn'    ? 'background: #332200; color: #ffcc00' :
                                           'background: #1a0030; color: #ff00ff';

        console.groupCollapsed(
            `%c[${component}] ${message}`,
            `padding: 2px 5px; border-radius: 3px; font-weight: bold; ${style}`
        );
        if (data) console.log('📦 Data:', data);
        if (type === 'error') console.trace('🔍 Stack Trace (Error)');
        console.groupEnd();
    }

    function apiLog(action, details = '') {
        if (!window.DebugManager?.isEnabled('buttons')) return;
        console.log(`%c[Firebase Barveni] ${action}`, 'color: #FF00FF; font-weight: bold;', details);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ POMOCNÉ FUNKCE - STABILITA & OFFLINE OCHRANA
    // ═══════════════════════════════════════════════════════════════════════════
    function getFirestoreDB() {
        // 3-vrstvá ochrana (stejný vzor jako buttonVisibilityFirebase.js)
        if (!navigator.onLine || typeof firebase === 'undefined') {
            return null;
        }
        if (firebase.apps.length === 0) {
            console.warn('[Barveni Firebase] Firebase existuje, ale NENÍ inicializován!');
            return null;
        }
        if (window.db) return window.db;
        if (firebase.firestore) return firebase.firestore();
        return null;
    }

    async function waitForDatabaseConnection() {
        // Offline check
        if (!navigator.onLine || typeof firebase === 'undefined') {
            log('DB Check', '📡 Offline režim - použiji lokální data.', null, 'warn');
            return false;
        }
        if (firebase.apps.length === 0) {
            log('DB Check', '⚠️ Firebase není inicializován - offline režim.', null, 'warn');
            return false;
        }

        let attempts = 0;
        log('DB Check', '⏳ Ověřuji Firestore pro Barvení UI...');

        while (!getFirestoreDB() && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        const isReady = !!getFirestoreDB();

        if (isReady) {
            log('DB Check', '✅ Firestore připraven pro Barvení UI.', null, 'success');
        } else {
            console.warn('[Barveni Firebase] ⚠️ Timeout - offline režim aktivován.');
        }

        return isReady;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 SAVE - Uložení konfigurace barvení do Firebase
    // ═══════════════════════════════════════════════════════════════════════════
    window.jirikBarveniSaveToFirestore = async function (dataToSync) {
        log('SAVE Barveni', '🚀 Požadavek na uložení konfigurace barvení přijat.');

        // RED ALERT POJISTKA - offline/firebase check
        if (!navigator.onLine || typeof firebase === 'undefined') {
            log('SAVE Barveni', '🔴 RED ALERT: Offline/Firebase nedostupný - ukládám pouze lokálně.', null, 'error');
            window.showNotification && window.showNotification('Offline: Data uložena pouze lokálně.', 'warning');
            return false;
        }

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            log('SAVE Barveni', 'Databáze nedostupná!', null, 'error');
            window.showNotification && window.showNotification('Chyba: Cloud nedostupný!', 'error');
            return false;
        }

        if (!dataToSync || !dataToSync.config) {
            log('SAVE Barveni', 'Žádná data k uložení (config je prázdné/null).', dataToSync, 'error');
            return false;
        }

        try {
            const totalButtons = Object.keys(dataToSync.config).length;
            const aktivnichBarev = Object.values(dataToSync.config).filter(c => c && c.aktivni).length;

            apiLog(`💾 Ukládám konfiguraci ${totalButtons} tlačítek (${aktivnichBarev} aktivních barev) do '${COLLECTION_NAME}/${DOC_NAME}'`);

            await database.collection(COLLECTION_NAME).doc(DOC_NAME).set({
                barveniConfig: dataToSync.config,
                version: dataToSync.version || VERSION_FIREBASE,
                lastModified: dataToSync.lastModified || new Date().toISOString(),
                totalButtons: totalButtons,
                aktivnichBarev: aktivnichBarev,
                lastSync: firebase.firestore.FieldValue.serverTimestamp()
            });

            log('SAVE Barveni', '✅ ZÁPIS ÚSPĚŠNÝ! Konfigurace barvení je v cloudu.', null, 'success');
            return true;

        } catch (error) {
            console.warn('[Barveni Firebase] ⚠️ Firebase nedostupný (SAVE):', error.code || error.message);
            log('SAVE Barveni', 'KRITICKÁ CHYBA PŘI ZÁPISU', error, 'error');
            throw error;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📥 LOAD - Načtení konfigurace barvení z Firebase
    // ═══════════════════════════════════════════════════════════════════════════
    window.jirikBarveniLoadFromFirestore = async function () {
        log('LOAD Barveni', '📥 Požadavek na stažení konfigurace barvení.');

        // RED ALERT POJISTKA - offline/firebase check
        if (!navigator.onLine || typeof firebase === 'undefined') {
            log('LOAD Barveni', '🔴 RED ALERT: Offline/Firebase nedostupný - vracím null.', null, 'error');
            return null;
        }

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            log('LOAD Barveni', 'Databáze nedostupná!', null, 'error');
            return null;
        }

        try {
            const doc = await database.collection(COLLECTION_NAME).doc(DOC_NAME).get();

            if (doc.exists) {
                const data = doc.data();
                apiLog(`📥 Načtena konfigurace ${data.totalButtons || 0} tlačítek (${data.aktivnichBarev || 0} aktivních barev) z cloudu.`);
                log('LOAD Barveni', '✅ Dokument nalezen.', data, 'success');

                return {
                    config: data.barveniConfig,
                    version: data.version,
                    lastModified: data.lastModified
                };
            } else {
                log('LOAD Barveni', `ℹ️ Dokument '${COLLECTION_NAME}/${DOC_NAME}' neexistuje (první spuštění?).`, null, 'info');
                return null;
            }

        } catch (error) {
            console.warn('[Barveni Firebase] ⚠️ Firebase nedostupný (LOAD):', error.code || error.message);
            log('LOAD Barveni', 'CHYBA PŘI ČTENÍ', error, 'error');
            return null;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 SYNC - Inteligentní synchronizace (cloud vs. lokální)
    // ═══════════════════════════════════════════════════════════════════════════
    window.jirikBarveniSyncWithFirestore = async function (localConfig) {
        log('SYNC Barveni', '🔄 Zahajuji inteligentní synchronizaci barvení...');

        // Offline check
        if (!navigator.onLine || typeof firebase === 'undefined') {
            log('SYNC Barveni', '🔴 RED ALERT: Offline - sync vynechán.', null, 'error');
            return {
                success: false,
                message: 'Offline režim - pouze lokální data',
                config: localConfig,
                source: 'local'
            };
        }

        const isReady = await waitForDatabaseConnection();
        const database = getFirestoreDB();

        if (!isReady || !database) {
            return { success: false, message: 'Cloud nedostupný', config: localConfig, source: 'local' };
        }

        try {
            const cloudData = await window.jirikBarveniLoadFromFirestore();

            if (!cloudData) {
                // Cloud prázdný → nahraj lokální
                log('SYNC Barveni', 'Cloud je prázdný - nahrávám lokální konfiguraci.', null, 'info');
                await window.jirikBarveniSaveToFirestore({
                    config: localConfig,
                    version: VERSION_FIREBASE,
                    lastModified: new Date().toISOString()
                });
                return {
                    success: true,
                    message: 'Lokální konfigurace nahrána do cloudu',
                    config: localConfig,
                    source: 'local'
                };
            }

            // Porovnání timestampů
            const localTime = new Date(localStorage.getItem('jirikovo-barveni-tlacitek_lastModified') || 0);
            const cloudTime = new Date(cloudData.lastModified || 0);

            if (cloudTime > localTime) {
                // Cloud je novější
                log('SYNC Barveni', `☁️ Cloud je novější (${cloudData.lastModified}) - stahuji.`, null, 'info');
                return {
                    success: true,
                    message: 'Načtena novější konfigurace z cloudu',
                    config: cloudData.config,
                    source: 'cloud'
                };
            } else {
                // Lokální je novější nebo stejný
                log('SYNC Barveni', '💾 Lokální data jsou novější - nahrávám do cloudu.', null, 'info');
                await window.jirikBarveniSaveToFirestore({
                    config: localConfig,
                    version: VERSION_FIREBASE,
                    lastModified: new Date().toISOString()
                });
                return {
                    success: true,
                    message: 'Lokální konfigurace nahrána do cloudu',
                    config: localConfig,
                    source: 'local'
                };
            }

        } catch (error) {
            console.error('[Barveni Firebase] Chyba při synchronizaci:', error);
            log('SYNC Barveni', 'CHYBA PŘI SYNCHRONIZACI', error, 'error');
            return {
                success: false,
                message: 'Chyba při synchronizaci: ' + (error.message || error),
                config: localConfig,
                source: 'local'
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 AUTO-SYNC PŘI INICIALIZACI
    // Pokus o automatické načtení z cloudu při spuštění stránky
    // ═══════════════════════════════════════════════════════════════════════════
    async function autoSync() {
        // Počkej chvíli na inicializaci Firebase
        await new Promise(resolve => setTimeout(resolve, 3500));

        if (!navigator.onLine || typeof firebase === 'undefined' || (typeof firebase !== 'undefined' && firebase.apps.length === 0)) {
            log('AUTO-SYNC', '📡 Firebase není připraven - přeskakuji auto-sync.', null, 'warn');
            return;
        }

        try {
            // Zavolej sync z hlavního modulu pokud existuje
            if (typeof window.JirikBarveni?.getConfig === 'function') {
                const localConfig = window.JirikBarveni.getConfig();
                const result = await window.jirikBarveniSyncWithFirestore(localConfig);

                if (result.success && result.source === 'cloud' && result.config) {
                    // Cloud data jsou novější, aplikuj je
                    window.JirikBarveni?.setConfig(result.config);
                    log('AUTO-SYNC', '✅ Auto-sync dokončen - aplikována cloud konfigurace.', null, 'success');
                }
            }
        } catch (e) {
            log('AUTO-SYNC', 'Chyba při auto-sync (nezávažná).', e, 'warn');
        }
    }

    // Spustit auto-sync
    autoSync();

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 LOG INICIALIZACE
    // ═══════════════════════════════════════════════════════════════════════════
    console.log(
        `%c☁️ [Barveni Firebase] Firebase modul v${VERSION_FIREBASE} načten za ${(performance.now() - __BARVENI_FIREBASE_START).toFixed(2)} ms`,
        'background: #000; color: #ff00ff; font-weight: bold; padding: 2px;'
    );

})();
