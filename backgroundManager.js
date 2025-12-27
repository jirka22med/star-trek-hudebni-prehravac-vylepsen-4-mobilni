// ═══════════════════════════════════════════════════════════════════════════
// 🖼️ BACKGROUND MANAGER V1.0 - PLNĚ AUTOMATICKÝ
// ═══════════════════════════════════════════════════════════════════════════
// Autor: Admirál Claude.AI
// Architekt projektu: Více admirál Jiřík
// Datum: 28.12.2025
// ═══════════════════════════════════════════════════════════════════════════
// ✨ FUNKCE:
// • Auto-detekce Windows/Android
// • Automatická změna tapety podle zařízení
// • Firebase persistence
// • Rotace obrazovky support
// • Anti-kopírování ochrana
// • Žádná tlačítka - vše automaticky!
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
        }

        // ───────────────────────────────────────────────────────────────────
        // 🔍 DETEKCE TYPU ZAŘÍZENÍ
        // ───────────────────────────────────────────────────────────────────
        detectDeviceType() {
            const userAgent = navigator.userAgent.toLowerCase();
            const screenWidth = window.innerWidth;
            
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
            if (isAndroid || (screenWidth <= 768 && userAgent.includes('mobile'))) {
                return 'mobile';
            } else if (isWindows || screenWidth > 768) {
                return 'desktop';
            }
            
            // 📱 FALLBACK (pokud nic nesedí, rozhodne šířka)
            return screenWidth > 768 ? 'desktop' : 'mobile';
        }

        // ───────────────────────────────────────────────────────────────────
        // 🎨 APLIKACE TAPETY
        // ───────────────────────────────────────────────────────────────────
        applyBackground(deviceType) {
            if (!this.bgElement) {
                window.DebugManager?.log('main', '❌ Background element nenalezen!');
                return false;
            }

            const background = BACKGROUNDS[deviceType];
            if (!background) {
                window.DebugManager?.log('main', `❌ Neznámý typ zařízení: ${deviceType}`);
                return false;
            }

            // 🖼️ NASTAVENÍ TAPETY
            this.bgElement.src = background.url;
            this.currentBackground = background;
            this.deviceType = deviceType;

            // 🛡️ OCHRANA OBRÁZKU
            this.applyImageProtection(this.bgElement);

            // 📊 LOG
            window.DebugManager?.log('main', `
╔════════════════════════════════════════════════════
║ 🖼️  TAPETA APLIKOVÁNA
╠════════════════════════════════════════════════════
║ 📱 Zařízení: ${deviceType.toUpperCase()}
║ 🎨 Tapeta: ${background.name}
║ 📐 Rozlišení: ${background.resolution}
║ 🔗 URL: ${background.url.substring(0, 60)}...
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

            window.DebugManager?.log('main', '🛡️ Ochrana obrázku aktivována');
        }

        // ───────────────────────────────────────────────────────────────────
        // 💾 ULOŽENÍ DO FIREBASE
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
                    screenResolution: `${window.screen.width}x${window.screen.height}`
                };

                // Uložení do localStorage (rychlý fallback)
                localStorage.setItem('background_manager_data', JSON.stringify(data));

                // Pokus o uložení do Firebase
                if (window.db) {
                    await window.db.collection('audioPlayerSettings')
                        .doc('backgroundSettings')
                        .set(data, { merge: true });
                    
                    window.DebugManager?.log('main', '💾 Tapeta uložena do Firebase');
                }
            } catch (error) {
                window.DebugManager?.log('main', `⚠️ Chyba při ukládání: ${error.message}`);
            }
        }

        // ───────────────────────────────────────────────────────────────────
        // 📥 NAČTENÍ Z FIREBASE
        // ───────────────────────────────────────────────────────────────────
        async loadFromFirebase() {
            try {
                // Pokus o načtení z Firebase
                if (window.db) {
                    const doc = await window.db.collection('audioPlayerSettings')
                        .doc('backgroundSettings')
                        .get();
                    
                    if (doc.exists) {
                        const data = doc.data();
                        window.DebugManager?.log('main', '📥 Tapeta načtena z Firebase');
                        return data;
                    }
                }

                // Fallback na localStorage
                const localData = localStorage.getItem('background_manager_data');
                if (localData) {
                    window.DebugManager?.log('main', '📥 Tapeta načtena z localStorage');
                    return JSON.parse(localData);
                }
            } catch (error) {
                window.DebugManager?.log('main', `⚠️ Chyba při načítání: ${error.message}`);
            }

            return null;
        }

        // ───────────────────────────────────────────────────────────────────
        // 🔄 REFRESH (PŘI ROTACI/RESIZE)
        // ───────────────────────────────────────────────────────────────────
        refresh() {
            const newDeviceType = this.detectDeviceType();
            
            // Pokud se změnil typ zařízení, aplikuj novou tapetu
            if (newDeviceType !== this.deviceType) {
                window.DebugManager?.log('main', `🔄 Změna zařízení: ${this.deviceType} → ${newDeviceType}`);
                this.applyBackground(newDeviceType);
                this.saveToFirebase();
            }
        }

        // ───────────────────────────────────────────────────────────────────
        // 🚀 INICIALIZACE
        // ───────────────────────────────────────────────────────────────────
        async init() {
            if (this.initialized) {
                window.DebugManager?.log('main', '⚠️ BackgroundManager již inicializován');
                return;
            }

            window.DebugManager?.log('main', '🚀 Inicializuji BackgroundManager...');

            // Najdi background element
            this.bgElement = document.querySelector('.background-image-container img');
            if (!this.bgElement) {
                console.error('❌ Background element nenalezen! Hledám: .background-image-container img');
                return;
            }

            // 1️⃣ Zkus načíst z cache
            const cachedData = await this.loadFromFirebase();
            
            if (cachedData) {
                // Pokud máme cache, použij ji
                this.applyBackground(cachedData.deviceType);
            } else {
                // Jinak detekuj a aplikuj
                const deviceType = this.detectDeviceType();
                this.applyBackground(deviceType);
                await this.saveToFirebase();
            }

            // 2️⃣ Nastavení event listenerů
            this.setupEventListeners();

            this.initialized = true;
            window.DebugManager?.log('main', '✅ BackgroundManager připraven!');
        }

        // ───────────────────────────────────────────────────────────────────
        // 🎧 EVENT LISTENERS
        // ───────────────────────────────────────────────────────────────────
        setupEventListeners() {
            // 🔄 Rotace obrazovky
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.refresh();
                }, 300);
            });

            // 📐 Změna velikosti okna (s debounce)
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.refresh();
                }, 250);
            });

            window.DebugManager?.log('main', '🎧 Event listeners nastaveny');
        }

        // ───────────────────────────────────────────────────────────────────
        // 📊 INFO (PRO DEBUGGING)
        // ───────────────────────────────────────────────────────────────────
        getInfo() {
            return {
                initialized: this.initialized,
                deviceType: this.deviceType,
                currentBackground: this.currentBackground,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                userAgent: navigator.userAgent
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🌐 GLOBÁLNÍ EXPORT
    // ═══════════════════════════════════════════════════════════════════════
    const backgroundManager = new BackgroundManager();
    window.BackgroundManager = backgroundManager;

    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 ZÁVĚREČNÁ ZPRÁVA
    // ═══════════════════════════════════════════════════════════════════════
    console.log(
        "%c🖼️ BackgroundManager V1.0", 
        "color: #00FF00; font-size: 14px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #00FF00;"
    );
    console.log(
        "%c   🔍 Auto-detekce Windows/Android | 🎨 Plně automatické měnění", 
        "color: #FFCC00; font-size: 12px;"
    );
    console.log(
        "%c   Použití: await BackgroundManager.init()", 
        "color: #00CCFF; font-size: 11px;"
    );

})();