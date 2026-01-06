// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ MODUL: LEHKÁ ATOMOVKA V3 (Ultimátní Duchobijka)
// ═══════════════════════════════════════════════════════════════════════════
// Autor: Admirál Claude.AI pro více admirála Jiříka
// Verze: 3.0 ULTIMATE
// Datum: 2026-01-06
// ═══════════════════════════════════════════════════════════════════════════

(function() {
    const __lehkaatomovka3_START = performance.now();

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛡️ KONFIGURACE & WHITELIST
    // ═══════════════════════════════════════════════════════════════════════════
    const CONFIG = {
        whitelist: [
            'lehka-atomovka-backup',
            'lehka-atomovka-config',
            'user-preferences',
            // Přidej další kritické klíče sem
        ],
        autoBackup: true,          // Automatická záloha před smazáním
        showStats: true,           // Zobrazit statistiky
        confirmBeforeDelete: true, // Potvrzovací dialog
        dryRunMode: false          // Testovací mód (nic se nesmaže)
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATISTICKÝ MODUL
    // ═══════════════════════════════════════════════════════════════════════════
    const StatsCollector = {
        async collect() {
            const stats = {
                localStorage: {
                    total: Object.keys(localStorage).length,
                    protected: 0,
                    toDelete: 0,
                    sizeBytes: 0
                },
                sessionStorage: {
                    total: Object.keys(sessionStorage).length,
                    sizeBytes: 0
                },
                cookies: {
                    total: 0
                },
                indexedDB: {
                    databases: []
                },
                caches: {
                    total: 0,
                    names: []
                },
                serviceWorkers: {
                    total: 0,
                    scopes: []
                }
            };

            // localStorage analýza
            Object.keys(localStorage).forEach(key => {
                const value = localStorage.getItem(key);
                stats.localStorage.sizeBytes += (key.length + (value?.length || 0)) * 2;
                
                if (CONFIG.whitelist.includes(key)) {
                    stats.localStorage.protected++;
                } else {
                    stats.localStorage.toDelete++;
                }
            });

            // sessionStorage
            Object.keys(sessionStorage).forEach(key => {
                const value = sessionStorage.getItem(key);
                stats.sessionStorage.sizeBytes += (key.length + (value?.length || 0)) * 2;
            });

            // Cookies
            stats.cookies.total = document.cookie.split(';').filter(c => c.trim()).length;

            // IndexedDB
            if (window.indexedDB && window.indexedDB.databases) {
                try {
                    const databases = await window.indexedDB.databases();
                    stats.indexedDB.databases = databases.map(db => db.name);
                } catch (e) {
                    window.DebugManager?.log('lehka-atomovka-v3', `⚠️ IndexedDB scan failed: ${e.message}`);
                }
            }

            // Cache API
            if ('caches' in window) {
                try {
                    const cacheNames = await caches.keys();
                    stats.caches.total = cacheNames.length;
                    stats.caches.names = cacheNames;
                } catch (e) {
                    window.DebugManager?.log('lehka-atomovka-v3', `⚠️ Cache scan failed: ${e.message}`);
                }
            }

            // Service Workers
            if ('serviceWorker' in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    stats.serviceWorkers.total = registrations.length;
                    stats.serviceWorkers.scopes = registrations.map(r => r.scope);
                } catch (e) {
                    window.DebugManager?.log('lehka-atomovka-v3', `⚠️ SW scan failed: ${e.message}`);
                }
            }

            return stats;
        },

        format(stats) {
            const formatBytes = (bytes) => {
                if (bytes < 1024) return `${bytes} B`;
                if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
                return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
            };

            return `
📊 ═══════════════════════════════════════════════════════════
   STATISTIKY PŘED EXPLOZÍ
═══════════════════════════════════════════════════════════

🗄️  localStorage:
    ├─ Celkem položek: ${stats.localStorage.total}
    ├─ Chráněno (whitelist): ${stats.localStorage.protected}
    ├─ K odstranění: ${stats.localStorage.toDelete}
    └─ Velikost: ${formatBytes(stats.localStorage.sizeBytes)}

💾  sessionStorage:
    ├─ Celkem položek: ${stats.sessionStorage.total}
    └─ Velikost: ${formatBytes(stats.sessionStorage.sizeBytes)}

🍪  Cookies: ${stats.cookies.total} položek

🗄️  IndexedDB: ${stats.indexedDB.databases.length} databází
${stats.indexedDB.databases.map(db => `    ├─ ${db}`).join('\n')}

💥  Cache API: ${stats.caches.total} cache
${stats.caches.names.slice(0, 3).map(name => `    ├─ ${name}`).join('\n')}
${stats.caches.names.length > 3 ? `    └─ ... a ${stats.caches.names.length - 3} dalších` : ''}

👻  Service Workers: ${stats.serviceWorkers.total} registrací
${stats.serviceWorkers.scopes.map(scope => `    ├─ ${scope}`).join('\n')}

═══════════════════════════════════════════════════════════
`;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 ZÁLOHOVACÍ SYSTÉM
    // ═══════════════════════════════════════════════════════════════════════════
    const BackupSystem = {
        create() {
            window.DebugManager?.log('lehka-atomovka-v3', '🔒 Vytváření zálohy...');

            const backup = {
                timestamp: new Date().toISOString(),
                version: '3.0',
                data: {
                    localStorage: {},
                    sessionStorage: {},
                    cookies: document.cookie
                }
            };

            // Záloha localStorage (vše, i whitelist)
            Object.keys(localStorage).forEach(key => {
                backup.data.localStorage[key] = localStorage.getItem(key);
            });

            // Záloha sessionStorage
            Object.keys(sessionStorage).forEach(key => {
                backup.data.sessionStorage[key] = sessionStorage.getItem(key);
            });

            // Uložení do localStorage
            try {
                localStorage.setItem('lehka-atomovka-backup', JSON.stringify(backup));
                window.DebugManager?.log('lehka-atomovka-v3', '✅ Záloha uložena do localStorage');
            } catch (e) {
                window.DebugManager?.log('lehka-atomovka-v3', `❌ Chyba při ukládání zálohy: ${e.message}`);
            }

            // Export do JSON souboru
            this.downloadBackup(backup);

            return backup;
        },

        downloadBackup(backup) {
            try {
                const blob = new Blob([JSON.stringify(backup, null, 2)], { 
                    type: 'application/json' 
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `atomovka-backup-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                window.DebugManager?.log('lehka-atomovka-v3', '💾 Záloha stažena jako JSON soubor');
            } catch (e) {
                window.DebugManager?.log('lehka-atomovka-v3', `⚠️ Download zálohy selhal: ${e.message}`);
            }
        },

        restore() {
            const backupStr = localStorage.getItem('lehka-atomovka-backup');
            if (!backupStr) {
                window.DebugManager?.log('lehka-atomovka-v3', '❌ Žádná záloha nenalezena!');
                alert('❌ Žádná záloha k obnovení!');
                return false;
            }

            try {
                const backup = JSON.parse(backupStr);
                window.DebugManager?.log('lehka-atomovka-v3', `🔄 Obnovuji zálohu z ${backup.timestamp}...`);

                // Obnovení localStorage
                Object.keys(backup.data.localStorage).forEach(key => {
                    localStorage.setItem(key, backup.data.localStorage[key]);
                });

                // Obnovení sessionStorage
                Object.keys(backup.data.sessionStorage).forEach(key => {
                    sessionStorage.setItem(key, backup.data.sessionStorage[key]);
                });

                window.DebugManager?.log('lehka-atomovka-v3', '✅ Záloha úspěšně obnovena!');
                alert('✅ Záloha obnovena! Stránka se restartuje...');
                
                setTimeout(() => location.reload(), 1000);
                return true;
            } catch (e) {
                window.DebugManager?.log('lehka-atomovka-v3', `❌ Chyba při obnově: ${e.message}`);
                alert(`❌ Chyba při obnově zálohy: ${e.message}`);
                return false;
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 💥 HLAVNÍ ČISTÍCÍ ENGINE
    // ═══════════════════════════════════════════════════════════════════════════
    const CleaningEngine = {
        async execute(dryRun = false) {
            const mode = dryRun ? '🧪 DRY RUN' : '💥 LIVE MODE';
            window.DebugManager?.log('lehka-atomovka-v3', `${mode} - Zahajuji čištění...`);

            const report = {
                deleted: {
                    localStorage: 0,
                    sessionStorage: 0,
                    cookies: 0,
                    indexedDB: 0,
                    caches: 0,
                    serviceWorkers: 0
                },
                errors: []
            };

            try {
                // ═══ KROK 1: localStorage ═══
                window.DebugManager?.log('lehka-atomovka-v3', '[1/6] 🧹 Čistím localStorage...');
                const localKeys = Object.keys(localStorage);
                localKeys.forEach(key => {
                    if (!CONFIG.whitelist.includes(key) && key !== 'lehka-atomovka-backup') {
                        if (!dryRun) localStorage.removeItem(key);
                        report.deleted.localStorage++;
                        window.DebugManager?.log('lehka-atomovka-v3', `  ├─ Smazán: ${key}`);
                    } else {
                        window.DebugManager?.log('lehka-atomovka-v3', `  ├─ 🛡️ Chráněn: ${key}`);
                    }
                });
                await this.delay(200);

                // ═══ KROK 2: sessionStorage ═══
                window.DebugManager?.log('lehka-atomovka-v3', '[2/6] 💾 Likviduji sessionStorage...');
                report.deleted.sessionStorage = Object.keys(sessionStorage).length;
                if (!dryRun) sessionStorage.clear();
                await this.delay(200);

                // ═══ KROK 3: IndexedDB ═══
                window.DebugManager?.log('lehka-atomovka-v3', '[3/6] 🗄️ Exploduji IndexedDB...');
                if (window.indexedDB && window.indexedDB.databases) {
                    try {
                        const databases = await window.indexedDB.databases();
                        for (const db of databases) {
                            if (db.name) {
                                if (!dryRun) window.indexedDB.deleteDatabase(db.name);
                                report.deleted.indexedDB++;
                                window.DebugManager?.log('lehka-atomovka-v3', `  ├─ Smazána DB: ${db.name}`);
                            }
                        }
                    } catch (e) {
                        report.errors.push(`IndexedDB: ${e.message}`);
                    }
                }
                await this.delay(200);

                // ═══ KROK 4: Cookies ═══
                window.DebugManager?.log('lehka-atomovka-v3', '[4/6] 🍪 Rozpouštím cookies...');
                const cookies = document.cookie.split(";");
                for (let cookie of cookies) {
                    const eqPos = cookie.indexOf("=");
                    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                    if (name) {
                        if (!dryRun) {
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                        }
                        report.deleted.cookies++;
                    }
                }
                await this.delay(200);

                // ═══ KROK 5: Service Workers ═══
                window.DebugManager?.log('lehka-atomovka-v3', '[5/6] 👻 Vyháním Service Workers...');
                if ('serviceWorker' in navigator) {
                    try {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (let registration of registrations) {
                            const success = !dryRun ? await registration.unregister() : true;
                            if (success) {
                                report.deleted.serviceWorkers++;
                                window.DebugManager?.log('lehka-atomovka-v3', `  ├─ ✅ SW odstraněn: ${registration.scope}`);
                            }
                        }
                    } catch (e) {
                        report.errors.push(`Service Workers: ${e.message}`);
                    }
                }
                await this.delay(200);

                // ═══ KROK 6: Cache API ═══
                window.DebugManager?.log('lehka-atomovka-v3', '[6/6] 💥 Destrukce Cache API...');
                if ('caches' in window) {
                    try {
                        const cacheNames = await caches.keys();
                        for (const name of cacheNames) {
                            if (!dryRun) await caches.delete(name);
                            report.deleted.caches++;
                            window.DebugManager?.log('lehka-atomovka-v3', `  ├─ Cache smazána: ${name}`);
                        }
                    } catch (e) {
                        report.errors.push(`Cache API: ${e.message}`);
                    }
                }

                return report;

            } catch (error) {
                window.DebugManager?.log('lehka-atomovka-v3', `❌ KRITICKÁ CHYBA: ${error.message}`);
                report.errors.push(`CRITICAL: ${error.message}`);
                return report;
            }
        },

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        formatReport(report) {
            return `
🎯 ═══════════════════════════════════════════════════════════
   ZÁVĚREČNÝ REPORT ATOMOVKY V3
═══════════════════════════════════════════════════════════

✅ SMAZÁNO:
   ├─ localStorage: ${report.deleted.localStorage} položek
   ├─ sessionStorage: ${report.deleted.sessionStorage} položek
   ├─ Cookies: ${report.deleted.cookies} položek
   ├─ IndexedDB: ${report.deleted.indexedDB} databází
   ├─ Service Workers: ${report.deleted.serviceWorkers} registrací
   └─ Cache API: ${report.deleted.caches} caches

${report.errors.length > 0 ? `
⚠️ CHYBY:
${report.errors.map(e => `   ├─ ${e}`).join('\n')}
` : '✨ Žádné chyby!'}

═══════════════════════════════════════════════════════════
`;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎮 HLAVNÍ OVLÁDACÍ INTERFACE
    // ═══════════════════════════════════════════════════════════════════════════
    const btnLehkaAtomovka = document.getElementById('lehka-atomovka');

    if (btnLehkaAtomovka) {
        btnLehkaAtomovka.addEventListener('click', async () => {
            
            window.DebugManager?.log('lehka-atomovka-v3', '🚀 LEHKÁ ATOMOVKA V3 AKTIVOVÁNA!');

            // Krok 1: Sběr statistik
            if (CONFIG.showStats) {
                if (typeof window.showNotification === 'function') {
                    window.showNotification('📊 Analyzuji systém...', 'info', 2000);
                }

                const stats = await StatsCollector.collect();
                const statsText = StatsCollector.format(stats);
                console.log(statsText);
                window.DebugManager?.log('lehka-atomovka-v3', statsText);
            }

            // Krok 2: Potvrzení
            if (CONFIG.confirmBeforeDelete) {
                const confirmation = confirm(
                    '⚠️ VAROVÁNÍ HVĚZDNÉ FLOTILY ⚠️\n\n' +
                    'Spouštíte LEHKOU ATOMOVKU V3.\n\n' +
                    'Tato operace vymaže:\n' +
                    '• localStorage (kromě whitelistu)\n' +
                    '• sessionStorage\n' +
                    '• IndexedDB\n' +
                    '• Cookies\n' +
                    '• Service Workers\n' +
                    '• Cache API\n\n' +
                    `Chráněné položky (${CONFIG.whitelist.length}): ${CONFIG.whitelist.join(', ')}\n\n` +
                    '💾 Automatická záloha bude vytvořena před smazáním.\n\n' +
                    'Pokračovat?'
                );

                if (!confirmation) {
                    window.DebugManager?.log('lehka-atomovka-v3', '🛑 Operace zrušena admirálem.');
                    if (typeof window.showNotification === 'function') {
                        window.showNotification('Operace zrušena', 'info', 1500);
                    }
                    return;
                }
            }

            // Krok 3: Automatická záloha
            if (CONFIG.autoBackup) {
                if (typeof window.showNotification === 'function') {
                    window.showNotification('💾 Vytvářím zálohu...', 'info', 2000);
                }
                BackupSystem.create();
            }

            // Krok 4: Spuštění čištění
            if (typeof window.showNotification === 'function') {
                window.showNotification('💥 Spouštím atomovku...', 'warning', 2000);
            }

            const report = await CleaningEngine.execute(CONFIG.dryRunMode);
            
            // Krok 5: Zobrazení reportu
            const reportText = CleaningEngine.formatReport(report);
            console.log(reportText);
            window.DebugManager?.log('lehka-atomovka-v3', reportText);

            // Krok 6: Restart
            if (!CONFIG.dryRunMode) {
                window.DebugManager?.log('lehka-atomovka-v3', '🔄 Restartuji systém s čerstvými daty...');
                
                if (typeof window.showNotification === 'function') {
                    window.showNotification('✅ Hotovo! Restartuji...', 'success', 2000);
                }

                setTimeout(() => {
                    window.location.href = window.location.href.split('?')[0] + '?nocache=' + Date.now();
                }, 2500);
            } else {
                alert('🧪 DRY RUN dokončen - nic nebylo smazáno. Viz konzole pro report.');
            }
        });

        // Přidání globálních funkcí pro ruční ovládání
        window.LehkaAtomovka = {
            stats: () => StatsCollector.collect(),
            backup: () => BackupSystem.create(),
            restore: () => BackupSystem.restore(),
            clean: (dryRun = false) => CleaningEngine.execute(dryRun),
            config: CONFIG
        };

        window.DebugManager?.log('lehka-atomovka-v3', '💤 Modul připraven. Čeká na aktivaci...');
        window.DebugManager?.log('lehka-atomovka-v3', `🛡️ Whitelist (${CONFIG.whitelist.length} položek): ${CONFIG.whitelist.join(', ')}`);
        
    } else {
        window.DebugManager?.log('lehka-atomovka-v3', "⚠️ VAROVÁNÍ: Tlačítko 'lehka-atomovka' nenalezeno!");
        console.warn('🔴 Lehká atomovka V3: Chybí element s ID "lehka-atomovka"');
    }

    const loadTime = (performance.now() - __lehkaatomovka3_START).toFixed(2);
    console.log(
        `%c🚀 [lehkaatomovka3] Načteno za ${loadTime} ms | V3 ULTIMATE READY 💥`, 
        'background: #0a0a0a; color: #00ff41; font-weight: bold; padding: 6px 12px; border: 2px solid #00ff41; border-radius: 4px;'
    );
    console.log(
        `%c💡 TIP: Použij window.LehkaAtomovka.stats() pro manuální kontrolu`, 
        'background: #1a1a2e; color: #ffaa00; padding: 4px 8px;'
    );
})();
