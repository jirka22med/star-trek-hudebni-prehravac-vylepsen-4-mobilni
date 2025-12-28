/**
 * 🖖 STAR TREK PWA INSTALLER CONTROL
 * Propojuje UI tlačítko se Service Workerem
 * VERZE: 2.1 - Vylepšený UX a diagnostika + Anti-kolizní timeouty
 */

let deferredPrompt;
const installBtn = document.getElementById('install-app-button');

// Čekáme na načtení DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWA);
} else {
  initPWA();
}

function initPWA() {
  console.log('🖖 PWA Installer: Inicializace...');
  
  // 1. Registrace Service Workeru
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => {
          console.log('🚀 SW: Offline štíty aktivovány.', reg.scope);
          
          // Kontrola aktualizací každých 30 sekund
          setInterval(() => {
            reg.update();
          }, 30000);
          
          // Posluchač na aktualizace SW
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 SW: Nová verze dostupná!');
                if (window.showNotification) {
                  setTimeout(() => {
                    window.showNotification('Nová verze aplikace je připravena k instalaci!', 'info', 5000);
                  }, 2600);
                }
              }
            });
          });
        })
        .catch(err => {
          console.error('⚠️ SW: Selhání štítů:', err);
          updateButtonState('error', 'Service Worker selhal');
        });
    });
  } else {
    console.warn('⚠️ PWA: Prohlížeč nepodporuje Service Workers');
    updateButtonState('unsupported', 'Prohlížeč nepodporuje PWA');
  }

  // 2. Kontrola, zda už je aplikace nainstalovaná
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ PWA: Aplikace již běží jako standalone');
    updateButtonState('installed', 'Aplikace je nainstalována');
    return;
  }

  // 3. Zachycení instalačního signálu
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🛰️ PWA: Systém je připraven k instalaci');
    
    // Zabráníme automatickému oknu
    e.preventDefault();
    
    // Uložíme signál
    deferredPrompt = e;
    
    // Aktivujeme tlačítko
    updateButtonState('ready', 'Klikněte pro instalaci');
    
    // Debug log
    if (window.DebugManager) {
      window.DebugManager.log('main', "🛰️ PWA: Systém je připraven k instalaci.");
    }
  });

  // 4. Akce po kliknutí na tlačítko
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        const msg = 'Instalace zatím není připravena nebo je již hotova.';
        console.warn('⚠️ PWA:', msg);
        if (window.showNotification) {
          setTimeout(() => {
            window.showNotification(msg, 'warn', 3000);
          }, 2600);
        }
        return;
      }
      
      console.log('🎬 PWA: Spouštím instalační dialog...');
      updateButtonState('installing', 'Instaluji...');
      
      // Vyvoláme systémové okno
      deferredPrompt.prompt();
      
      // Čekáme na odpověď uživatele
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`🎬 PWA: Výsledek instalace: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('✅ PWA: Uživatel akceptoval instalaci');
        updateButtonState('installing', 'Instalace probíhá...');
        if (window.showNotification) {
          setTimeout(() => {
            window.showNotification('Aplikace se instaluje...', 'info', 3000);
          }, 2600);
        }
      } else {
        console.log('❌ PWA: Uživatel odmítl instalaci');
        updateButtonState('ready', 'Instalace odmítnuta');
        if (window.showNotification) {
          setTimeout(() => {
            window.showNotification('Instalace byla zrušena', 'warn', 3000);
          }, 2600);
        }
      }
      
      // Debug log
      if (window.DebugManager) {
        window.DebugManager.log('main', `🎬 PWA: Výsledek instalace: ${outcome}`);
      }
      
      // Vyčistíme signál
      deferredPrompt = null;
    });
  } else {
    console.error('❌ PWA: Tlačítko #install-app-button nenalezeno!');
  }

  // 5. Potvrzení o úspěšném zakotvení
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA: Aplikace byla úspěšně nainstalována.');
    updateButtonState('installed', 'Instalováno! 🖖');
    
    if (window.showNotification) {
      setTimeout(() => {
        window.showNotification('Aplikace Star Trek přidána na plochu! 🖖', 'success', 5000);
      }, 2600);
    }
    
    if (window.DebugManager) {
      window.DebugManager.log('main', "✅ PWA: Aplikace byla úspěšně nainstalována.");
    }
  });

  // 6. Detekce standalone režimu
  window.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('🖖 PWA: Běžím v standalone režimu');
      document.body.classList.add('standalone-mode');
    }
  });
}

/**
 * Aktualizace vizuálního stavu tlačítka
 * @param {string} state - ready|installing|installed|error|unsupported
 * @param {string} text - Text tlačítka
 */
function updateButtonState(state, text) {
  if (!installBtn) return;
  
  // Odstraníme všechny stavy
  installBtn.classList.remove('ready', 'installing', 'installed', 'error', 'unsupported');
  
  // Přidáme nový stav
  installBtn.classList.add(state);
  
  // Nastavíme text a tooltip
  installBtn.textContent = text || installBtn.textContent;
  installBtn.title = text || installBtn.title;
  
  // Zakážeme tlačítko pro určité stavy
  if (state === 'installing' || state === 'installed' || state === 'unsupported') {
    installBtn.disabled = true;
  } else {
    installBtn.disabled = false;
  }
  
  console.log(`🎨 PWA: Tlačítko aktualizováno na stav: ${state}`);
}

// Export pro debugování
window.PWAInstaller = {
  getDeferredPrompt: () => deferredPrompt,
  getInstallButton: () => installBtn,
  forceInstall: async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('🎬 PWA Debug: Manuální instalace:', outcome);
      return outcome;
    }
    return 'not-ready';
  }
};

console.log('🖖 PWA Installer V2.1: Modul načten a připraven!');
