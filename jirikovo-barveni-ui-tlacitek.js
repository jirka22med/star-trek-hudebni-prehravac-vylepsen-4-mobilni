// jirikovo-barveni-ui-tlacitek.js
// 🖖 JIŘÍKOVO BARVENÍ UI TLAČÍTEK - STAR TREK EDITION
// Verze: 1.0.0
// ═══════════════════════════════════════════════════════════════════════════════
// ✅ Více admirál Jiřík & Admirál Claude.AI
// 🎨 Modul pro pokročilé barvení UI tlačítek s moldar oknem
// ═══════════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    const __BARVENI_START = performance.now();

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 KONFIGURACE
    // ═══════════════════════════════════════════════════════════════════════════
    const VERSION_BARVENI = "1.0.0";
    const STORAGE_KEY = 'jirikovo-barveni-tlacitek';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 SEZNAM TLAČÍTEK (synchronizováno s buttonVisibilityManager.js)
    // ═══════════════════════════════════════════════════════════════════════════
    const TLACITKA = {
        // === PŘEHRÁVÁNÍ ===
        'play-button':              { nazev: '▶️ Přehrát', kategorie: 'Přehrávání' },
        'pause-button':             { nazev: '⏸️ Pauza', kategorie: 'Přehrávání' },
        'prev-button':              { nazev: '⏮️ Předchozí', kategorie: 'Přehrávání' },
        'next-button':              { nazev: '⏭️ Další', kategorie: 'Přehrávání' },
        'reset-button':             { nazev: '↻ Reset', kategorie: 'Přehrávání' },
        'loop-button':              { nazev: '🔁 Opakování', kategorie: 'Přehrávání' },
        'shuffle-button':           { nazev: '🔀 Náhodně', kategorie: 'Přehrávání' },
        // === ZVUK ===
        'mute-button':              { nazev: '🔇 Ztlumit', kategorie: 'Zvuk' },
        // === ZOBRAZENÍ ===
        'fullscreen-toggle':        { nazev: '🖥️ Celá obrazovka', kategorie: 'Zobrazení' },
        'toggle-info-button':       { nazev: 'ℹ️ Informace', kategorie: 'Zobrazení' },
        'toggle-playlist-button':   { nazev: '📋 Playlist', kategorie: 'Zobrazení' },
        'zobrazit-panel-hlasitosti':{ nazev: '🔊 Panel hlasitosti', kategorie: 'Zobrazení' },
        'uprava-barev-moldar-system':{ nazev: '🎨 Úprava barev (starý)', kategorie: 'Zobrazení' },
        // === POKROČILÉ ===
        'timer-button':             { nazev: '⏰ Časovač', kategorie: 'Pokročilé' },
        'timer-start':              { nazev: '▶️ Start časovač', kategorie: 'Pokročilé' },
        'timer-stop':               { nazev: '⏹️ Stop časovač', kategorie: 'Pokročilé' },
        'auto-fade-button':         { nazev: '🔄 Auto-fade', kategorie: 'Pokročilé' },
        'playlist-settings-button': { nazev: '⚙️ Nastavení playlistu', kategorie: 'Pokročilé' },
        'playlist-manager-button':  { nazev: '🎛️ Správa playlistu', kategorie: 'Pokročilé' },
        'favorites-button':         { nazev: '⭐ Oblíbené', kategorie: 'Pokročilé' },
        // === SYSTÉM ===
        'reload-button':            { nazev: '🔄 Reload', kategorie: 'Systém' },
        'clearAllDataBtn':          { nazev: '🗑️ Smazat vše', kategorie: 'Systém' },
        'install-app-button':       { nazev: '📥 Instalovat', kategorie: 'Systém' },
        'playlist-sync-button':     { nazev: '🔄 Synchronizace', kategorie: 'Systém' },
        'lehka-atomovka':           { nazev: '☢️ Lehká atomovka', kategorie: 'Systém' },
        'The-Constructor':          { nazev: 'Konvertor Playlistu', kategorie: 'Systém' },
        'indexator':                { nazev: 'Indexátor', kategorie: 'Systém' },
        'sekce':                    { nazev: 'Rekalibrace Sekcí', kategorie: 'Systém' },
        // === MINI PŘEHRÁVAČ ===
        'mini-mode-float':          { nazev: '🖼️ Float', kategorie: 'MiniPlayer' },
        'mini-mode-pip':            { nazev: '📺 PiP', kategorie: 'MiniPlayer' },
        'mini-mode-popup':          { nazev: '🪟 Popup', kategorie: 'MiniPlayer' },
        'toggle-mini-player':       { nazev: '🖼️ Mini přehrávač', kategorie: 'MiniPlayer' },
        // === DEBUG ===
        'debug-manager-button':     { nazev: '🛠️ Diagnostika', kategorie: 'Debug' },
        'perf-monitor-btn':         { nazev: '🔍📊 Perf Monitor', kategorie: 'Debug' },
        'jirik-manual-opener-btn':  { nazev: '🧾 Console Logger', kategorie: 'Debug' },
        'bluetooth-monitor-toggle': { nazev: '🛠️ Bluetooth Monitor', kategorie: 'Debug' },
        // === HLASOVÉ OVLÁDÁNÍ ===
        'voice-commands-help':      { nazev: 'V Hlasové PTT', kategorie: 'Hlasové ovládání' },
        'zobrazeni-manualu':        { nazev: '📋 Manuál hlasového', kategorie: 'Hlasové ovládání' },
        'wake-word-toggle':         { nazev: 'Hlídač hlasového', kategorie: 'Hlasové ovládání' },
        // === BARVENÍ UI ===
        'jirikovo-barveni-ui-tlacitek-otevrevi-moldar-okna': { nazev: '🎨 Barvení UI', kategorie: 'Barvení UI' },
        'openMissionLog':           { nazev: '📋 Archivní záznam mise', kategorie: 'Systém' },
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 VÝCHOZÍ NASTAVENÍ BAREV
    // ═══════════════════════════════════════════════════════════════════════════
    const DEFAULT_COLORS = {};
    Object.keys(TLACITKA).forEach(id => {
        DEFAULT_COLORS[id] = {
            backgroundColor: '',
            color: '',
            borderColor: '',
            aktivni: false // false = použij původní styl
        };
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 🗃️ STAV MODULU
    // ═══════════════════════════════════════════════════════════════════════════
    let barveniConfig = loadLocalConfig();
    let moldarOkno = null;
    let aktualneVybraneTlacitko = null; // ID právě editovaného tlačítka

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 LOKÁLNÍ UKLÁDÁNÍ / NAČÍTÁNÍ
    // ═══════════════════════════════════════════════════════════════════════════
    function loadLocalConfig() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn('[Barveni] Chyba při načítání lokální konfigurace:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_COLORS));
    }

    function saveLocalConfig() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(barveniConfig));
            localStorage.setItem(STORAGE_KEY + '_lastModified', new Date().toISOString());
        } catch (e) {
            console.error('[Barveni] Chyba při ukládání lokální konfigurace:', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 APLIKACE BAREV NA TLAČÍTKA
    // ═══════════════════════════════════════════════════════════════════════════
    function applyColors() {
        Object.keys(barveniConfig).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            const cfg = barveniConfig[id];
            if (cfg && cfg.aktivni) {
                if (cfg.backgroundColor) el.style.backgroundColor = cfg.backgroundColor;
                if (cfg.color) el.style.color = cfg.color;
                if (cfg.borderColor) el.style.borderColor = cfg.borderColor;
                // Přidáme třídu jako vizuální marker
                el.classList.add('jirik-barveni-aktivni');
            } else {
                // Reset - odstraníme inline styly nastavené tímto modulem
                el.style.backgroundColor = '';
                el.style.color = '';
                el.style.borderColor = '';
                el.classList.remove('jirik-barveni-aktivni');
            }
        });

        window.DebugManager?.log('buttons', `[Barveni] Barvy aplikovány na ${Object.keys(barveniConfig).length} tlačítek.`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ VYTVOŘENÍ MOLDAR OKNA
    // ═══════════════════════════════════════════════════════════════════════════
    function vytvorMoldarOkno() {
        if (moldarOkno) return;

        moldarOkno = document.createElement('div');
        moldarOkno.id = 'jirik-barveni-moldar';
        moldarOkno.innerHTML = `
            <div class="jirik-barveni-moldar-obsah">
                <!-- HEADER -->
                <div class="jirik-barveni-header">
                    <div class="jirik-barveni-header-title">
                        <span class="jirik-barveni-lcars-indikator"></span>
                        🎨 JIŘÍKOVO BARVENÍ UI TLAČÍTEK
                        <span class="jirik-barveni-verze">v${VERSION_BARVENI}</span>
                    </div>
                    <button id="jirik-barveni-close" class="jirik-barveni-close-btn" title="Zavřít (Esc)">✕</button>
                </div>

                <!-- HLAVNÍ TĚLO - DVOUPANELOVÉ -->
                <div class="jirik-barveni-body">

                    <!-- LEVÝ PANEL: seznam tlačítek -->
                    <div class="jirik-barveni-levy-panel">
                        <div class="jirik-barveni-panel-titulek">📋 SEZNAM TLAČÍTEK</div>
                        <input type="text" id="jirik-barveni-hledat" placeholder="🔍 Hledat tlačítko..." class="jirik-barveni-search">
                        <div id="jirik-barveni-seznam" class="jirik-barveni-seznam"></div>
                    </div>

                    <!-- PRAVÝ PANEL: editor barev -->
                    <div class="jirik-barveni-pravy-panel">
                        <div class="jirik-barveni-panel-titulek">🎨 EDITOR BAREV</div>

                        <div id="jirik-barveni-placeholder" class="jirik-barveni-placeholder">
                            ← Vyber tlačítko ze seznamu
                        </div>

                        <div id="jirik-barveni-editor" class="jirik-barveni-editor" style="display:none;">
                            <div class="jirik-barveni-vybrany-nazev" id="jirik-barveni-vybrany-nazev">-</div>

                            <!-- ZAPNUTÍ BARVENÍ -->
                            <label class="jirik-barveni-toggle-label">
                                <input type="checkbox" id="jirik-barveni-aktivni">
                                <span class="jirik-barveni-toggle-text">Aktivovat vlastní barvy</span>
                            </label>

                            <!-- BARVY -->
                            <div class="jirik-barveni-barvy-grid" id="jirik-barveni-barvy-grid">
                                <div class="jirik-barveni-barva-radek">
                                    <label>🎨 Pozadí</label>
                                    <input type="color" id="jirik-barveni-bg" value="#000000">
                                    <input type="text" id="jirik-barveni-bg-text" placeholder="#000000 nebo rgba(...)">
                                    <button class="jirik-barveni-reset-btn" data-reset="bg" title="Resetovat">✕</button>
                                </div>
                                <div class="jirik-barveni-barva-radek">
                                    <label>✏️ Písmo</label>
                                    <input type="color" id="jirik-barveni-color" value="#ffffff">
                                    <input type="text" id="jirik-barveni-color-text" placeholder="#ffffff nebo rgba(...)">
                                    <button class="jirik-barveni-reset-btn" data-reset="color" title="Resetovat">✕</button>
                                </div>
                                <div class="jirik-barveni-barva-radek">
                                    <label>🔲 Ohraničení</label>
                                    <input type="color" id="jirik-barveni-border" value="#c00000">
                                    <input type="text" id="jirik-barveni-border-text" placeholder="#c00000 nebo rgba(...)">
                                    <button class="jirik-barveni-reset-btn" data-reset="border" title="Resetovat">✕</button>
                                </div>
                            </div>

                            <!-- NÁHLED -->
                            <div class="jirik-barveni-nahled-label">👁️ NÁHLED</div>
                            <div class="jirik-barveni-nahled-wrapper">
                                <button id="jirik-barveni-nahled-btn" class="jirik-barveni-nahled-btn">🎨 Ukázka tlačítka</button>
                            </div>

                            <!-- AKCE PRO TOTO TLAČÍTKO -->
                            <div class="jirik-barveni-akce">
                                <button id="jirik-barveni-uloz-toto" class="jirik-barveni-btn jirik-barveni-btn-uloz">💾 Uložit</button>
                                <button id="jirik-barveni-reset-toto" class="jirik-barveni-btn jirik-barveni-btn-reset">🔄 Reset tlačítka</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="jirik-barveni-footer">
                    <div class="jirik-barveni-footer-leva">
                        <button id="jirik-barveni-uloz-vse" class="jirik-barveni-btn jirik-barveni-btn-uloz">💾 Uložit vše</button>
                        <button id="jirik-barveni-reset-vse" class="jirik-barveni-btn jirik-barveni-btn-reset">🔄 Reset vše</button>
                        <button id="jirik-barveni-uloz-cloud" class="jirik-barveni-btn jirik-barveni-btn-cloud">☁️ Uložit do cloudu</button>
                        <button id="jirik-barveni-nacti-cloud" class="jirik-barveni-btn jirik-barveni-btn-cloud">📥 Načíst z cloudu</button>
                    </div>
                    <div class="jirik-barveni-footer-prava">
                        <button id="jirik-barveni-cancel" class="jirik-barveni-btn jirik-barveni-btn-cancel">✕ Zavřít</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(moldarOkno);
        naplnSeznam();
        pridejEventListeners();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 NAPLNĚNÍ SEZNAMU TLAČÍTEK
    // ═══════════════════════════════════════════════════════════════════════════
    function naplnSeznam(filtr = '') {
        const seznam = document.getElementById('jirik-barveni-seznam');
        if (!seznam) return;

        seznam.innerHTML = '';

        // Skupinování po kategoriích
        const kategorie = {};
        Object.keys(TLACITKA).forEach(id => {
            const info = TLACITKA[id];
            const kat = info.kategorie || 'Ostatní';
            if (!kategorie[kat]) kategorie[kat] = [];
            kategorie[kat].push({ id, ...info });
        });

        Object.keys(kategorie).sort().forEach(kat => {
            const tlacitkaVKat = kategorie[kat].filter(t => {
                if (!filtr) return true;
                return t.nazev.toLowerCase().includes(filtr.toLowerCase()) ||
                       t.id.toLowerCase().includes(filtr.toLowerCase());
            });

            if (tlacitkaVKat.length === 0) return;

            const katHeader = document.createElement('div');
            katHeader.className = 'jirik-barveni-kategorie-header';
            katHeader.textContent = kat;
            seznam.appendChild(katHeader);

            tlacitkaVKat.forEach(t => {
                const item = document.createElement('div');
                item.className = 'jirik-barveni-seznam-item';
                item.dataset.id = t.id;

                const cfg = barveniConfig[t.id];
                const maBarveni = cfg && cfg.aktivni;

                item.innerHTML = `
                    <span class="jirik-barveni-item-indikator ${maBarveni ? 'aktivni' : ''}">●</span>
                    <span class="jirik-barveni-item-nazev">${t.nazev}</span>
                    <span class="jirik-barveni-item-id">${t.id}</span>
                `;

                if (t.id === aktualneVybraneTlacitko) {
                    item.classList.add('vybrane');
                }

                item.addEventListener('click', () => vyberTlacitko(t.id));
                seznam.appendChild(item);
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🖱️ VÝBĚR TLAČÍTKA
    // ═══════════════════════════════════════════════════════════════════════════
    function vyberTlacitko(id) {
        aktualneVybraneTlacitko = id;

        // Update aktivní stav v seznamu
        document.querySelectorAll('.jirik-barveni-seznam-item').forEach(el => {
            el.classList.toggle('vybrane', el.dataset.id === id);
        });

        const editor = document.getElementById('jirik-barveni-editor');
        const placeholder = document.getElementById('jirik-barveni-placeholder');
        const nazevEl = document.getElementById('jirik-barveni-vybrany-nazev');

        if (editor) editor.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';

        const info = TLACITKA[id];
        if (nazevEl) nazevEl.textContent = `${info?.nazev || id} — ID: ${id}`;

        // Načti aktuální konfiguraci
        const cfg = barveniConfig[id] || { backgroundColor: '', color: '', borderColor: '', aktivni: false };

        const aktivniEl = document.getElementById('jirik-barveni-aktivni');
        if (aktivniEl) aktivniEl.checked = !!cfg.aktivni;

        syncColorInputs('bg', cfg.backgroundColor || '#000000');
        syncColorInputs('color', cfg.color || '#ffffff');
        syncColorInputs('border', cfg.borderColor || '#c00000');

        aktualizujNahled();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 SYNCHRONIZACE COLOR PICKER <-> TEXT INPUT
    // ═══════════════════════════════════════════════════════════════════════════
    function syncColorInputs(typ, hodnota) {
        const picker = document.getElementById(`jirik-barveni-${typ}`);
        const text = document.getElementById(`jirik-barveni-${typ}-text`);
        if (!picker || !text) return;

        // Pokud je to validní hex barva, nastavíme picker
        if (/^#[0-9a-fA-F]{6}$/.test(hodnota)) {
            picker.value = hodnota;
        }
        text.value = hodnota || '';
    }

    function getColorValue(typ) {
        const text = document.getElementById(`jirik-barveni-${typ}-text`);
        const picker = document.getElementById(`jirik-barveni-${typ}`);
        // Text input má přednost (umožňuje rgba atd.)
        if (text && text.value.trim()) return text.value.trim();
        if (picker) return picker.value;
        return '';
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 👁️ NÁHLED
    // ═══════════════════════════════════════════════════════════════════════════
    function aktualizujNahled() {
        const btn = document.getElementById('jirik-barveni-nahled-btn');
        if (!btn) return;

        const aktivni = document.getElementById('jirik-barveni-aktivni')?.checked;

        if (aktivni) {
            btn.style.backgroundColor = getColorValue('bg');
            btn.style.color = getColorValue('color');
            btn.style.borderColor = getColorValue('border');
        } else {
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 ULOŽENÍ JEDNOHO TLAČÍTKA
    // ═══════════════════════════════════════════════════════════════════════════
    function ulozTlacitko() {
        if (!aktualneVybraneTlacitko) return;

        const aktivni = document.getElementById('jirik-barveni-aktivni')?.checked || false;

        barveniConfig[aktualneVybraneTlacitko] = {
            backgroundColor: getColorValue('bg'),
            color: getColorValue('color'),
            borderColor: getColorValue('border'),
            aktivni: aktivni
        };

        saveLocalConfig();
        applyColors();
        naplnSeznam(document.getElementById('jirik-barveni-hledat')?.value || '');

        // Obnovit výběr
        document.querySelectorAll('.jirik-barveni-seznam-item').forEach(el => {
            el.classList.toggle('vybrane', el.dataset.id === aktualneVybraneTlacitko);
        });

        window.showNotification && window.showNotification('Barvy tlačítka uloženy!', 'success');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 RESET JEDNOHO TLAČÍTKA
    // ═══════════════════════════════════════════════════════════════════════════
    function resetTlacitko() {
        if (!aktualneVybraneTlacitko) return;

        barveniConfig[aktualneVybraneTlacitko] = {
            backgroundColor: '',
            color: '',
            borderColor: '',
            aktivni: false
        };

        saveLocalConfig();
        applyColors();
        vyberTlacitko(aktualneVybraneTlacitko); // Překresli editor
        naplnSeznam(document.getElementById('jirik-barveni-hledat')?.value || '');

        window.showNotification && window.showNotification('Tlačítko resetováno!', 'info');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 ULOŽIT VŠE
    // ═══════════════════════════════════════════════════════════════════════════
    function ulozVse() {
        saveLocalConfig();
        applyColors();
        window.showNotification && window.showNotification('Všechny barvy uloženy!', 'success');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 RESET VŠE
    // ═══════════════════════════════════════════════════════════════════════════
    function resetVse() {
        if (!confirm('🔄 Opravdu resetovat všechna barvení? Tato akce nelze vrátit zpět.')) return;

        barveniConfig = JSON.parse(JSON.stringify(DEFAULT_COLORS));
        saveLocalConfig();
        applyColors();
        naplnSeznam('');

        if (aktualneVybraneTlacitko) {
            vyberTlacitko(aktualneVybraneTlacitko);
        }

        window.showNotification && window.showNotification('Všechna barvení resetována!', 'info');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ☁️ FIREBASE - ULOŽENÍ DO CLOUDU
    // ═══════════════════════════════════════════════════════════════════════════
    async function ulozDoCloud() {
        if (typeof window.jirikBarveniSaveToFirestore !== 'function') {
            window.showNotification && window.showNotification('Firebase modul není dostupný!', 'error');
            return;
        }

        try {
            window.showNotification && window.showNotification('Ukládám do cloudu...', 'info');
            const uspech = await window.jirikBarveniSaveToFirestore({
                config: barveniConfig,
                version: VERSION_BARVENI,
                lastModified: new Date().toISOString()
            });
            if (uspech) {
                window.showNotification && window.showNotification('Barvy uloženy do cloudu! ☁️', 'success');
            }
        } catch (e) {
            console.error('[Barveni] Chyba při ukládání do cloudu:', e);
            window.showNotification && window.showNotification('Chyba při ukládání do cloudu!', 'error');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📥 FIREBASE - NAČTENÍ Z CLOUDU
    // ═══════════════════════════════════════════════════════════════════════════
    async function nactiZCloud() {
        if (typeof window.jirikBarveniLoadFromFirestore !== 'function') {
            window.showNotification && window.showNotification('Firebase modul není dostupný!', 'error');
            return;
        }

        try {
            window.showNotification && window.showNotification('Načítám z cloudu...', 'info');
            const data = await window.jirikBarveniLoadFromFirestore();
            if (data && data.config) {
                barveniConfig = { ...JSON.parse(JSON.stringify(DEFAULT_COLORS)), ...data.config };
                saveLocalConfig();
                applyColors();
                naplnSeznam('');

                if (aktualneVybraneTlacitko) {
                    vyberTlacitko(aktualneVybraneTlacitko);
                }

                window.showNotification && window.showNotification('Barvy načteny z cloudu! 📥', 'success');
            } else {
                window.showNotification && window.showNotification('V cloudu nejsou žádná data.', 'info');
            }
        } catch (e) {
            console.error('[Barveni] Chyba při načítání z cloudu:', e);
            window.showNotification && window.showNotification('Chyba při načítání z cloudu!', 'error');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🖱️ EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════════
    function pridejEventListeners() {
        // Zavření
        document.getElementById('jirik-barveni-close')?.addEventListener('click', zavriMoldar);
        document.getElementById('jirik-barveni-cancel')?.addEventListener('click', zavriMoldar);

        // Klik mimo moldar
        moldarOkno?.addEventListener('click', (e) => {
            if (e.target === moldarOkno) zavriMoldar();
        });

        // ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && moldarOkno?.classList.contains('jirik-barveni-show')) {
                zavriMoldar();
            }
        });

        // Vyhledávání
        document.getElementById('jirik-barveni-hledat')?.addEventListener('input', (e) => {
            naplnSeznam(e.target.value);
        });

        // Color picker → text input sync
        ['bg', 'color', 'border'].forEach(typ => {
            const picker = document.getElementById(`jirik-barveni-${typ}`);
            const text = document.getElementById(`jirik-barveni-${typ}-text`);

            picker?.addEventListener('input', (e) => {
                if (text) text.value = e.target.value;
                aktualizujNahled();
            });
            text?.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                if (/^#[0-9a-fA-F]{6}$/.test(val) && picker) {
                    picker.value = val;
                }
                aktualizujNahled();
            });
        });

        // Aktivní checkbox → náhled
        document.getElementById('jirik-barveni-aktivni')?.addEventListener('change', aktualizujNahled);

        // Reset jednotlivých barev
        document.querySelectorAll('.jirik-barveni-reset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const typ = btn.dataset.reset;
                syncColorInputs(typ, '');
                aktualizujNahled();
            });
        });

        // Akce
        document.getElementById('jirik-barveni-uloz-toto')?.addEventListener('click', ulozTlacitko);
        document.getElementById('jirik-barveni-reset-toto')?.addEventListener('click', resetTlacitko);
        document.getElementById('jirik-barveni-uloz-vse')?.addEventListener('click', ulozVse);
        document.getElementById('jirik-barveni-reset-vse')?.addEventListener('click', resetVse);
        document.getElementById('jirik-barveni-uloz-cloud')?.addEventListener('click', ulozDoCloud);
        document.getElementById('jirik-barveni-nacti-cloud')?.addEventListener('click', nactiZCloud);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔓 OTEVŘENÍ / ZAVŘENÍ MOLDARU
    // ═══════════════════════════════════════════════════════════════════════════
    function otevriMoldar() {
        if (!moldarOkno) vytvorMoldarOkno();
        moldarOkno.classList.add('jirik-barveni-show');
        naplnSeznam('');
    }

    function zavriMoldar() {
        moldarOkno?.classList.remove('jirik-barveni-show');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INICIALIZACE
    // ═══════════════════════════════════════════════════════════════════════════
    function init() {
        // Napojení tlačítka z index.html
        const oteviraciBtn = document.getElementById('jirikovo-barveni-ui-tlacitek-otevrevi-moldar-okna');
        if (oteviraciBtn) {
            oteviraciBtn.addEventListener('click', otevriMoldar);
        } else {
            console.warn('[Barveni] Otvírací tlačítko nenalezeno! ID: jirikovo-barveni-ui-tlacitek-otevrevi-moldar-okna');
        }

        // Aplikuj barvy ze startu
        applyColors();

        // Observer pro případ dynamicky přidaných tlačítek
        const observer = new MutationObserver(() => {
            applyColors();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Globální API
        window.JirikBarveni = {
            otevri: otevriMoldar,
            zavri: zavriMoldar,
            aplikuj: applyColors,
            ulozVse,
            resetVse,
            getConfig: () => ({ ...barveniConfig }),
            setConfig: (cfg) => {
                barveniConfig = { ...JSON.parse(JSON.stringify(DEFAULT_COLORS)), ...cfg };
                saveLocalConfig();
                applyColors();
            }
        };

        console.log(`%c🎨 [Barveni] Jiříkovo barvení UI tlačítek v${VERSION_BARVENI} inicializováno!`, 'background: #000; color: #ff00ff; font-weight: bold; padding: 2px;');
        console.log(`%c🚀 [Barveni] Načteno za ${(performance.now() - __BARVENI_START).toFixed(2)} ms`, 'background: #000; color: #00ff00; font-weight: bold; padding: 2px;');
    }

    // Spuštění po načtení DOMu
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        setTimeout(init, 500);
    }

})();
