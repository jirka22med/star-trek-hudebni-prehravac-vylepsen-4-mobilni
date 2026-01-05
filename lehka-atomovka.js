// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ MODUL: LEHKÁ ATOMOVKA V1 (Nouzová rekalibrace lokálních dat)
// ═══════════════════════════════════════════════════════════════════════════

(function() {
    const __lehka-atomovka0_START = performance.now();
 
    // 1. Čekáme na ID z vašeho UI
    const btnLehkaAtomovka = document.getElementById('lehka-atomovka');

    if (btnLehkaAtomovka) {
        btnLehkaAtomovka.addEventListener('click', async () => {
            
            // 4. Použití vašeho DebugManageru místo console.log
            window.DebugManager?.log('lehka-atomovka-v1', "🚀 Zahajuji proces Lehké atomovky...");

            // 5. Oznámení v UI o spuštění
            if (typeof window.showNotification === 'function') {
                window.showNotification('Zahajuji rekalibraci lokálních dat...', 'info', 2035);
            }

            try {
                // PROCES ČIŠTĚNÍ DUCHŮ (Bez smazání Cloudu)
                
                // A. Vymazání lokálních klíčů (přidat podle potřeby)
                window.DebugManager?.log('lehka-atomovka-v1', "🧹 Čistím localStorage...");
                localStorage.removeItem('playerSettings');
                localStorage.removeItem('firebase_current_version');
                // Smaže vše kromě kritických věcí, pokud byste chtěl vše: localStorage.clear();

                // B. Likvidace Service Workerů (Důležité proti duchům na GitHubu)
                if ('serviceWorker' in navigator) {
                    window.DebugManager?.log('lehka-atomovka-v1', "👻 Odstraňuji neviditelné Service Workery...");
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let registration of registrations) {
                        await registration.unregister();
                    }
                }

                // C. Vymazání cache prohlížeče (pokud to API dovolí)
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                }

                window.DebugManager?.log('lehka-atomovka-v1', "✅ Lokální duchové byli vypuštěni.");

                // 5. Závěrečné hlášení před resetem
                if (typeof window.showNotification === 'function') {
                    window.showNotification('Rekalibrace hotova. Restartuji loď...', 'success', 2035);
                }

                // Finální restart pro stažení čerstvých souborů
                setTimeout(() => {
                    window.location.reload(true);
                }, 1500);

            } catch (error) {
                window.DebugManager?.log('lehka-atomovka-v1', "❌ CHYBA: " + error.message);
                if (typeof window.showNotification === 'function') {
                    window.showNotification('Chyba při rekalibraci!', 'error', 2035);
                }
            }
        });

        window.DebugManager?.log('lehka-atomovka-v1', "💤 Modul spí a čeká na aktivaci přes ID: lehka-atomovka");
    } else {
        // Log, pokud tlačítko v index.html ještě neexistuje
        window.DebugManager?.log('lehka-atomovka-v1', "⚠️ Varování: ID 'lehka-atomovka' nebylo v UI nalezeno.");
    }
    console.log(`%c🚀 [lehka-atomovka0] Načteno za ${(performance.now() - __lehka-atomovka0_START).toFixed(2)} ms`, 'background: #000; color: #00ff00; font-weight: bold; padding: 2px;');
})();
