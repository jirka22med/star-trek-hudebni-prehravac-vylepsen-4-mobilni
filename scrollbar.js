// ========================================
// 🌈 UNIVERSAL RAINBOW SCROLLBAR
// Podpora všech moderních prohlížečů
// ========================================

// Detekce prohlížeče
const browser = {
    isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    isEdge: /Edg/.test(navigator.userAgent),
    isBrave: navigator.brave !== undefined,
    isOpera: /OPR|Opera/.test(navigator.userAgent),
    isOperaGX: /OPRGX/.test(navigator.userAgent),
    isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
    isFirefox: /Firefox/.test(navigator.userAgent),
    isIE: /Trident/.test(navigator.userAgent)
};

// Zjisti, který prohlížeč se používá
function detectBrowser() {
    if (browser.isOperaGX) return 'Opera GX';
    if (browser.isOpera) return 'Opera';
    if (browser.isBrave) return 'Brave';
    if (browser.isEdge) return 'Edge';
    if (browser.isChrome) return 'Chrome';
    if (browser.isSafari) return 'Safari';
    if (browser.isFirefox) return 'Firefox';
    if (browser.isIE) return 'Internet Explorer';
    return 'Neznámý prohlížeč';
}

// Paleta barev
const rainbowColors = [
    { thumb: '#ff00ff', track: '#1a0033', glow: '255, 0, 255' },    // Magenta
    { thumb: '#8000ff', track: '#0d001a', glow: '128, 0, 255' },    // Fialová
    { thumb: '#0080ff', track: '#001a33', glow: '0, 128, 255' },    // Modrá
    { thumb: '#00ffff', track: '#001a1a', glow: '0, 255, 255' },    // Cyan
    { thumb: '#00ff80', track: '#001a0d', glow: '0, 255, 128' },    // Zelená
    { thumb: '#80ff00', track: '#0d1a00', glow: '128, 255, 0' },    // Žlutozelená
    { thumb: '#ffff00', track: '#1a1a00', glow: '255, 255, 0' },    // Žlutá
    { thumb: '#ff8000', track: '#1a0d00', glow: '255, 128, 0' },    // Oranžová
    { thumb: '#ff0080', track: '#1a000d', glow: '255, 0, 128' }     // Růžová
];

let currentColorIndex = 0;

// Aktualizace scrollbaru pro WEBKIT prohlížeče
function updateWebkitScrollbar(color) {
    let styleElement = document.getElementById('webkit-scrollbar-style');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'webkit-scrollbar-style';
        document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
        ::-webkit-scrollbar-track {
            background: ${color.track} !important;
        }
        
        ::-webkit-scrollbar-thumb {
            background: ${color.thumb} !important;
            box-shadow: 
                inset 0 0 10px rgba(255, 255, 255, 0.3),
                0 0 15px rgba(${color.glow}, 0.6) !important;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            box-shadow: 
                inset 0 0 20px rgba(255, 255, 255, 0.6),
                0 0 25px rgba(${color.glow}, 0.8),
                0 0 35px rgba(${color.glow}, 0.6) !important;
        }
        
        ::-webkit-scrollbar-thumb:active {
            box-shadow: 
                inset 0 0 25px rgba(255, 255, 255, 0.9),
                0 0 30px rgba(${color.glow}, 1),
                0 0 45px rgba(${color.glow}, 0.8) !important;
        }
        
        ::-webkit-scrollbar-button {
            background: ${color.track} !important;
            border: 1px solid rgba(${color.glow}, 0.3) !important;
        }
        
        ::-webkit-scrollbar-button:hover {
            background: ${color.thumb} !important;
            box-shadow: 0 0 10px rgba(${color.glow}, 0.6) !important;
        }
        
        ::-webkit-scrollbar-corner {
            background: ${color.track} !important;
        }
    `;
}

// Aktualizace scrollbaru pro FIREFOX
function updateFirefoxScrollbar(color) {
    let styleElement = document.getElementById('firefox-scrollbar-style');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'firefox-scrollbar-style';
        document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
        * {
            scrollbar-color: ${color.thumb} ${color.track} !important;
            scrollbar-width: thin !important;
        }
        
        html, body {
            scrollbar-color: ${color.thumb} ${color.track} !important;
        }
    `;
}

// Hlavní funkce pro aktualizaci barev
function updateScrollbarColors() {
    const color = rainbowColors[currentColorIndex];
    
    // Webkit prohlížeče (Chrome, Edge, Brave, Opera, Safari)
    if (browser.isChrome || browser.isEdge || browser.isBrave || 
        browser.isOpera || browser.isOperaGX || browser.isSafari) {
        updateWebkitScrollbar(color);
    }
    
    // Firefox
    if (browser.isFirefox) {
        updateFirefoxScrollbar(color);
    }
    
    // Další barva
    currentColorIndex = (currentColorIndex + 1) % rainbowColors.length;
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Zobraz info o prohlížeči (volitelné - můžeš smazat)
    console.log('🚀 Detekovaný prohlížeč:', detectBrowser());
    console.log('🌈 Rainbow scrollbar aktivován!');
    
    // Start animace
    updateScrollbarColors();
    setInterval(updateScrollbarColors, 2000); // Změna každé 2s
});

// Podpora pro dynamické změny (když se přidá nový obsah)
const observer = new MutationObserver(function() {
    updateScrollbarColors();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});