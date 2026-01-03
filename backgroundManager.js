// ═══════════════════════════════════════════════════════════════════════════
// 🖼️ BACKGROUND MANAGER V1.1 - PLNĚ AUTOMATICKÝ + OPRAVENÝ
// ═══════════════════════════════════════════════════════════════════════════
// Autor: Admirál Claude.AI
// Architekt projektu: Více admirál Jiřík
// Datum: 29.12.2025
// ═══════════════════════════════════════════════════════════════════════════
// ✨ NOVÉ FUNKCE V1.1:
// • 🔧 OPRAVA: Správná detekce při startu (vyřešen problém špatné tapety)
// • 📡 NOVÉ: Hlídač internetového připojení
// • 🔄 NOVÉ: Automatické obnovení tapety při online
// • 🛡️ VYLEPŠENO: Anti-kopírování ochrana
// • 💾 VYLEPŠENO: Firebase persistence s validací
// • 🎯 VYLEPŠENO: Forced refresh při resize (oprava manuálního tahu okna)
// ═══════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // 📚 KNIHOVNA TAPET
    // ═══════════════════════════════════════════════════════════════════════
    const BACKGROUNDS = {
        desktop: {
            url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_1920x1080_2.jpg?ver=0',
            name: 'Starfleet Command Desktop',
            resolution: '1920x1080'
        },
        mobile: {
            url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_1024x1792.jpg?ver=0',
            name: 'Starfleet Command Mobile',
            resolution: '1024x1792'
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // 🛠️ BACKGROUND MANAGER CLASS
    // ═══════════════════════════════════════════════════════════════════════
    class BackgroundManager {
        constructor() {
            this.currentBackground = null;
            this.deviceType = null;
            this.bgElement = null;
            this.initialized = false;
            this.lastValidDeviceType = null; // Pro kontrolu změn
        }

        // ───────────────────────────────────────────────────────────────────
        // 🔍 DETEKCE TYPU ZAŘÍZENÍ (VYLEPŠENÁ)
        // ───────────────────────────────────────────────────────────────────
        detectDeviceType() {
            const userAgent = navigator.userAgent.toLowerCase();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // 🤖 ANDROID DETEKCE
            const isAndroid = (
                userAgent.includes('android') && 
                userAgent.includes('mobile')
            );
            
            // 🪟 WINDOWS DETEKCE
            const isWindows = (
                userAgent.includes('windows') && 
                !userAgent.includes('mobile') && 
                !userAgent.includes('android')
            );
            
            // 🎯 KONEČNÉ ROZHODNUTÍ
            let deviceType;
            
            if (isAndroid || (screenWidth <= 768 && userAgent.includes('mobile'))) {
                deviceType = 'mobile';
            } else if (isWindows || screenWidth > 768) {
                deviceType = 'desktop';
            } else {
                // 📱 FALLBACK
                deviceType = screenWidth > 768 ? 'desktop' : 'mobile';
            }

            // 📊 DETAILNÍ LOG PRO DEBUGGING
            window.DebugManager?.log('backgroundManager', `
╔════════════════════════════════════════════════════
║ 🔍 DETEKCE ZAŘÍZENÍ
╠════════════════════════════════════════════════════
║ 📱 Typ: ${deviceType.toUpperCase()}
║ 📐 Okno: ${screenWidth}×${screenHeight}px
║ 🖥️ UserAgent: ${userAgent.substring(0, 50)}...
║ 🎯 Android: ${isAndroid ? 'ANO' : 'NE'}
║ 🪟 Windows: ${isWindows ? 'ANO' : 'NE'}
╚════════════════════════════════════════════════════
            `.trim());

            return deviceType;
        }

        // ───────────────────────────────────────────────────────────────────
        // 🎨 APLIKACE TAPETY (VYLEPŠENÁ S VALIDACÍ)
        // ───────────────────────────────────────────────────────────────────
        applyBackground(deviceType, forceReload = false) {
            if (!this.bgElement) {
                window.DebugManager?.log('backgroundManager', '❌ Background element nenalezen!');
                return false;
            }

            const background = BACKGROUNDS[deviceType];
            if (!background) {
                window.DebugManager?.log('backgroundManager', `❌ Neznámý typ zařízení: ${deviceType}`);
                return false;
            }

            // 🔄 VYNUCENÉ NAČTENÍ (oprava cache problému)
            if (forceReload) {
                // Přidej timestamp pro vymazání cache
                const freshUrl = `${background.url}&t=${Date.now()}`;
                this.bgElement.src = freshUrl;
                
                window.DebugManager?.log('backgroundManager', `🔄 VYNUCENÉ OBNOVENÍ tapety (forceReload=true)`);
            } else {
                this.bgElement.src = background.url;
            }

            this.currentBackground = background;
            this.deviceType = deviceType;
            this.lastValidDeviceType = deviceType;

            // 🛡️ OCHRANA OBRÁZKU
            this.applyImageProtection(this.bgElement);

            // 📊 LOG
            window.DebugManager?.log('backgroundManager', `
╔════════════════════════════════════════════════════
║ 🖼️  TAPETA APLIKOVÁNA
╠════════════════════════════════════════════════════
║ 📱 Zařízení: ${deviceType.toUpperCase()}
║ 🎨 Tapeta: ${background.name}
║ 📐 Rozlišení: ${background.resolution}
║ 🔄 Force Reload: ${forceReload ? 'ANO' : 'NE'}
║ 🔗 URL: ${background.url.substring(0, 50)}...
╚════════════════════════════════════════════════════
            `.trim());

            return true;
        }

        // ───────────────────────────────────────────────────────────────────
        // 🛡️ OCHRANA OBRÁZKU (ANTI-KOPÍROVÁNÍ)
        // ───────────────────────────────────────────────────────────────────
        applyImageProtection(imgElement) {
            if (!imgElement) return;
            
            // Zákaz kontextového menu (pravé tlačítko)
            imgElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
            
            // Zákaz drag & drop
            imgElement.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
            
            // Zákaz selectování
            imgElement.addEventListener('selectstart', (e) => {
                e.preventDefault();
                return false;
            });
            
            // Ochrana na dotykových zařízeních
            imgElement.addEventListener('touchstart', (e) => {
                imgElement.style.webkitUserSelect = 'none';
                imgElement.style.userSelect = 'none';
            }, { passive: true });
            
            // Zákaz copy události
            imgElement.addEventListener('copy', (e) => {
                e.preventDefault();
                return false;
            });
            
            // CSS vlastnosti (záložní ochrana)
            imgElement.style.userSelect = 'none';
            imgElement.style.webkitUserSelect = 'none';
            imgElement.style.mozUserSelect = 'none';
            imgElement.style.msUserSelect = 'none';
            imgElement.style.webkitUserDrag = 'none';
            imgElement.style.webkitTouchCallout = 'none';
            imgElement.style.pointerEvents = 'none';

            window.DebugManager?.log('backgroundManager', '🛡️ Ochrana obrázku aktivována');
        }

        // ───────────────────────────────────────────────────────────────────
        // 💾 ULOŽENÍ DO FIREBASE (S VALIDACÍ)
        // ───────────────────────────────────────────────────────────────────
        async saveToFirebase() {
            if (!this.currentBackground || !this.deviceType) return;

            try {
                const data = {
                    deviceType: this.deviceType,
                    backgroundUrl: this.currentBackground.url,
                    backgroundName: this.currentBackground.name,
                    lastUpdated: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    screenResolution: `${window.screen.width}x${window.screen.height}`,
                    windowSize: `${window.innerWidth}x${window.innerHeight}`,
                    isOnline: navigator.onLine,
                    version: '1.1' // Pro budoucí migrace
                };

                // Uložení do localStorage (rychlý fallback)
                localStorage.setItem('background_manager_data', JSON.stringify(data));

                // Pokus o uložení do Firebase
                if (window.db && navigator.onLine) {
                    await window.db.collection('audioPlayerSettings')
                        .doc('backgroundSettings')
                        .set(data, { merge: true });
                    
                    window.DebugManager?.log('backgroundManager', '💾 Tapeta uložena do Firebase');
                } else {
                    window.DebugManager?.log('backgroundManager', '💾 Tapeta uložena jen do localStorage (offline nebo Firebase nedostupný)');
                }
            } catch (error) {
                window.DebugManager?.log('backgroundManager', `⚠️ Chyba při ukládání: ${error.message}`);
            }
        }

        // ───────────────────────────────────────────────────────────────────
        // 📥 NAČTENÍ Z FIREBASE (S VALIDACÍ)
        // ───────────────────────────────────────────────────────────────────
        async loadFromFirebase() {
            try {
                // Pokus o načtení z Firebase
                if (window.db && navigator.onLine) {
                    const doc = await window.db.collection('audioPlayerSettings')
                        .doc('backgroundSettings')
                        .get();
                    
                    if (doc.exists) {
                        const data = doc.data();
                        
                        // 🔍 VALIDACE DAT
                        if (this.validateCachedData(data)) {
                            window.DebugManager?.log('backgroundManager', '📥 Tapeta načtena z Firebase (validní)');
                            return data;
                        } else {
                            window.DebugManager?.log('backgroundManager', '⚠️ Firebase data nevalidní, používám detekci');
                            return null;
                        }
                    }
                }

                // Fallback na localStorage
                const localData = localStorage.getItem('background_manager_data');
                if (localData) {
                    const data = JSON.parse(localData);
                    
                    if (this.validateCachedData(data)) {
                        window.DebugManager?.log('backgroundManager', '📥 Tapeta načtena z localStorage (validní)');
                        return data;
                    } else {
                        window.DebugManager?.log('backgroundManager', '⚠️ localStorage data nevalidní, používám detekci');
                        return null;
                    }
                }
            } catch (error) {
                window.DebugManager?.log('backgroundManager', `⚠️ Chyba při načítání: ${error.message}`);
            }

            return null;
        }

        // ───────────────────────────────────────────────────────────────────
        // ✅ VALIDACE CACHOVANÝCH DAT (NOVÉ!)
        // ───────────────────────────────────────────────────────────────────
        validateCachedData(data) {
            if (!data || !data.deviceType) return false;

            // Zkontroluj, jestli se velikost okna výrazně nezměnila
            const currentWidth = window.innerWidth;
            const cachedWidth = data.windowSize ? parseInt(data.windowSize.split('x')[0]) : 0;
            
            // Pokud je rozdíl větší než 200px, cache je neplatná
            if (Math.abs(currentWidth - cachedWidth) > 200) {
                window.DebugManager?.log('backgroundManager', `⚠️ Cache neplatná: velikost okna se změnila (${cachedWidth}px → ${currentWidth}px)`);
                return false;
            }

            // Zkontroluj deviceType proti aktuální detekci
            const currentDeviceType = this.detectDeviceType();
            if (data.deviceType !== currentDeviceType) {
                window.DebugManager?.log('backgroundManager', `⚠️ Cache neplatná: deviceType se změnil (${data.deviceType} → ${currentDeviceType})`);
                return false;
            }

            return true;
        }

        // ───────────────────────────────────────────────────────────────────
        // 🔄 REFRESH (PŘI ROTACI/RESIZE) - VYLEPŠENÝ
        // ───────────────────────────────────────────────────────────────────
        refresh(forceReload = false) {
            const newDeviceType = this.detectDeviceType();
            
            // Pokud se změnil typ zařízení NEBO je vynucené obnovení
            if (newDeviceType !== this.deviceType || forceReload) {
                if (newDeviceType !== this.deviceType) {
                    window.DebugManager?.log('backgroundManager', `🔄 Změna zařízení: ${this.deviceType} → ${newDeviceType}`);
                }
                
                this.applyBackground(newDeviceType, forceReload);
                this.saveToFirebase();
            }
        }

        // ───────────────────────────────────────────────────────────────────
        // 🚀 INICIALIZACE (VYLEPŠENÁ)
        // ───────────────────────────────────────────────────────────────────
        async init() {
            if (this.initialized) {
                window.DebugManager?.log('backgroundManager', '⚠️ BackgroundManager již inicializován');
                return;
            }

            window.DebugManager?.log('backgroundManager', '🚀 Inicializuji BackgroundManager V1.1...');

            // Najdi background element
            this.bgElement = document.querySelector('.background-image-container img');
            if (!this.bgElement) {
                console.error('❌ Background element nenalezen! Hledám: .background-image-container img');
                return;
            }

            // 1️⃣ Vždy detekuj aktuální zařízení (priorita před cache)
            const currentDeviceType = this.detectDeviceType();

            // 2️⃣ Zkus načíst z cache
            const cachedData = await this.loadFromFirebase();
            
            if (cachedData && cachedData.deviceType === currentDeviceType && navigator.onLine) {
                // Cache je validní a máme internet
                this.applyBackground(cachedData.deviceType, false);
            } else {
                // Cache není validní NEBO jsme offline → použij fresh detekci
                this.applyBackground(currentDeviceType, true);
                await this.saveToFirebase();
            }

            // 3️⃣ Nastavení event listenerů
            this.setupEventListeners();

            this.initialized = true;
            window.DebugManager?.log('backgroundManager', '✅ BackgroundManager V1.1 připraven!');
        }

        // ───────────────────────────────────────────────────────────────────
        // 🎧 EVENT LISTENERS (VYLEPŠENÉ)
        // ───────────────────────────────────────────────────────────────────
        setupEventListeners() {
            // 🔄 Rotace obrazovky
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.refresh(true); // Vynucené obnovení při rotaci
                }, 300);
            });

            // 📐 Změna velikosti okna (s debounce + forced reload)
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.refresh(true); // Vynucené obnovení při resize
                }, 250);
            });

            window.DebugManager?.log('backgroundManager', '🎧 Event listeners nastaveny (s forced reload)');
        }

        // ───────────────────────────────────────────────────────────────────
        // 📊 INFO (PRO DEBUGGING)
        // ───────────────────────────────────────────────────────────────────
        getInfo() {
            return {
                initialized: this.initialized,
                deviceType: this.deviceType,
                lastValidDeviceType: this.lastValidDeviceType,
                currentBackground: this.currentBackground,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                userAgent: navigator.userAgent,
                isOnline: navigator.onLine
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🌐 GLOBÁLNÍ EXPORT
    // ═══════════════════════════════════════════════════════════════════════
    const backgroundManager = new BackgroundManager();
    window.BackgroundManager = backgroundManager;

    // ═══════════════════════════════════════════════════════════════════════
    // 📡 HLÍDAČ INTERNETOVÉHO PŘIPOJENÍ V1.1
    // ═══════════════════════════════════════════════════════════════════════
    // ✨ FUNKCE:
    // • Detekce offline/online stavu
    // • Automatické obnovení tapety při připojení
    // • Logování do DebugManageru
    // • Vynucené načtení pro vyřešení cache problémů
    // ═══════════════════════════════════════════════════════════════════════

    // ───────────────────────────────────────────────────────────────────
    // 🌐 OFFLINE HANDLER
    // ───────────────────────────────────────────────────────────────────
    window.addEventListener('offline', () => {
        window.DebugManager?.log('backgroundManager', `
╔════════════════════════════════════════════════════
║ 🖼️  TAPETA: OFFLINE REŽIM
╠════════════════════════════════════════════════════
║ 📡 Status: Bez internetového připojení
║ 🎨 Tapeta: Zobrazena z cache
║ ⏳ Čekám na obnovení spojení...
╚════════════════════════════════════════════════════
        `.trim());
    });

    // ───────────────────────────────────────────────────────────────────
    // 🌐 ONLINE HANDLER
    // ───────────────────────────────────────────────────────────────────
    window.addEventListener('online', async () => {
        window.DebugManager?.log('backgroundManager', `
╔════════════════════════════════════════════════════
║ 🖼️  TAPETA: ONLINE REŽIM
╠════════════════════════════════════════════════════
║ 📡 Status: Internetové spojení obnoveno!
║ 🔄 Akce: Zahajuji probuzení tapety...
╚════════════════════════════════════════════════════
        `.trim());

        // 🖖 OKAMŽITÉ OBNOVENÍ TAPETY S FORCED RELOAD
        if (window.BackgroundManager && window.BackgroundManager.initialized) {
            try {
                // Použij refresh s vynuceným načtením
                window.BackgroundManager.refresh(true); // forceReload = true
                
                window.DebugManager?.log('backgroundManager', `
╔════════════════════════════════════════════════════
║ ✅ TAPETA ÚSPĚŠNĚ OBNOVENA
╠════════════════════════════════════════════════════
║ 🎨 Zařízení: ${window.BackgroundManager.deviceType}
║ 🖼️  Tapeta: ${window.BackgroundManager.currentBackground?.name}
║ 📊 Status: Plně funkční
║ 🔄 Forced Reload: ANO
╚════════════════════════════════════════════════════
                `.trim());

            } catch (error) {
                window.DebugManager?.log('backgroundManager', `❌ Chyba při obnově tapety: ${error.message}`);
            }
        } else {
            // Pokud BackgroundManager ještě není inicializovaný, spusť init
            if (window.BackgroundManager) {
                await window.BackgroundManager.init();
                window.DebugManager?.log('backgroundManager', '✅ BackgroundManager inicializován po obnovení spojení');
            }
        }
    });

    // ───────────────────────────────────────────────────────────────────
    // 🎯 STARTOVNÍ CHECK
    // ───────────────────────────────────────────────────────────────────
    if (!navigator.onLine) {
        window.DebugManager?.log('backgroundManager', '⚠️ TAPETA: Spouštím v OFFLINE režimu');
    } else {
        window.DebugManager?.log('backgroundManager', '✅ TAPETA: Spouštím v ONLINE režimu');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 ZÁVĚREČNÁ ZPRÁVA
    // ═══════════════════════════════════════════════════════════════════════
    console.log(
        "%c🖼️ BackgroundManager V1.1 + Hlídač připojení", 
        "color: #00FF00; font-size: 14px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #00FF00;"
    );
    console.log(
        "%c   🔍 Auto-detekce | 🎨 Smart cache | 📡 Online/Offline hlídač", 
        "color: #FFCC00; font-size: 12px;"
    );
    console.log(
        "%c   🔧 OPRAVENO: Problém se špatnou tapetou při startu", 
        "color: #FF6600; font-size: 12px;"
    );
    console.log(
        "%c   Použití: await BackgroundManager.init()", 
        "color: #00CCFF; font-size: 11px;"
    );

})();
