/**
 * 🖖 STAR TREK PWA INSTALLER CONTROL
 * Propojuje UI tlačítko se Service Workerem
 */

let deferredPrompt;
const installBtn = document.getElementById('install-app-button');

// 1. Registrace Service Workeru
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('🚀 SW: Offline štíty aktivovány.', reg.scope))
            .catch(err => console.error('⚠️ SW: Selhání štítů:', err));
    });
}

// 2. Zachycení instalačního signálu
window.addEventListener('beforeinstallprompt', (e) => {
    // Zabráníme automatickému oknu
    e.preventDefault();
    // Uložíme signál
    deferredPrompt = e;
    
    // Tady tvůj buttonVisibilityManager.js uvidí, že systém je READY
    window.DebugManager?.log('main', "🛰️ PWA: Systém je připraven k instalaci.");
});

// 3. Akce po kliknutí na tvé tlačítko
installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) {
        window.showNotification?.('Instalace zatím není připravena nebo je již hotova.', 'warn');
        return;
    }
    
    // Vyvoláme systémové okno
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    window.DebugManager?.log('main', `🎬 PWA: Výsledek instalace: ${outcome}`);
    
    // Vyčistíme signál
    deferredPrompt = null;
});

// 4. Potvrzení o úspěšném zakotvení
window.addEventListener('appinstalled', () => {
    window.DebugManager?.log('main', "✅ PWA: Aplikace byla úspěšně nainstalována.");
    window.showNotification?.('Aplikace Star Trek přidána na plochu! 🖖', 'info', 5000);
});
