const CACHE_NAME = 'st-player-v5.4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  
  // --- CSS MODULY (POUZE AKTIVNÍ) ---
  './style.css',
  './miniPlayer.css',
  './loadingScreen.css',
  './casovac.css',
  './tone-meter-star-trek-hudebni-prehravac.css',
  './browser-status.css',
  './scrollbar.css',
  './christmas.css',
  './zobrazit-panel-hlasitosti.css',
  
  // --- KRITICKÉ JS MODULY (VŽDY AKTIVNÍ) ---
  './audioFirebaseFunctions.js',
  './DebugManager.js',
  './script.js',
  './backgroundManager.js',
  './myPlaylist.js',
  './pwa-installer.js',
  
  // --- FEATURE JS MODULY (POUZE AKTIVNÍ) ---
  './universalni-perfomens-monitor.js',
//  './jirkuv-hlidac.js',
  './notificationFix.js',
  './autoFade.js',
  './playlistSettings.js',
  './playlistSync.js',
  './pokrocila-sprava-playlistu.js',
  './bluetoothDisconnectMonitor.js',
  './buttonVisibilityManager.js',
  './vyhledavac-skladeb.js',
  './sprava-rozhrani.js',
  './miniPlayer.js',
  './prednacitani-pisnicek.js',
  './scrollbar.js',
  './colorManager.js',
  './timer-module.js',
  // './audio-upravovac.js', // ❌ DEAKTIVOVÁN V HTML
  
  // --- FIREBASE SDK (absolutní URL) ---
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js'
  
  // ❌ TYTO MODULY JSOU DEAKTIVOVÁNY V index.html:
  // - voiceControl.js
  // - pocitac.js
  // - pomocnik-hlasoveho-ovladani-pro-mobil.js
  // - loadingScreen.js
  // - audio-upravovac.js
];

// Instalace - cachování assetů
self.addEventListener('install', (event) => {
  console.log('🖖 SW V5.4: Spouštím instalaci (pouze aktivní moduly)...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 SW: Otevřen cache storage:', CACHE_NAME);
      // Robustnější metoda - každý soubor samostatně
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`⚠️ SW: Selhalo cachování ${url}:`, err);
            return null;
          });
        })
      ).then((results) => {
        const failed = results.filter(r => r.status === 'rejected');
        const success = results.filter(r => r.status === 'fulfilled');
        
        console.log(`✅ SW: Úspěšně cachováno: ${success.length}/${ASSETS_TO_CACHE.length} souborů`);
        
        if (failed.length > 0) {
          console.warn(`⚠️ SW: ${failed.length} souborů se nepodařilo cachovat`);
        }
        
        console.log('✅ SW V5.4: Instalace dokončena!');
      });
    })
  );
  // Okamžitá aktivace nové verze
  self.skipWaiting();
});

// Aktivace - vyčištění starých cache
self.addEventListener('activate', (event) => {
  console.log('🔄 SW V5.4: Aktivuji novou verzi...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ SW: Mažu starý cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ SW V5.4: Aktivace dokončena!');
      return self.clients.claim();
    })
  );
});

// Fetch - strategie Cache First s Network Fallback
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // KRITICKÁ OPRAVA: Ignorujeme non-http requesty
  if (!url.startsWith('http')) {
    return;
  }
  
  // KRITICKÁ OPRAVA: Ignorujeme POST/PUT/DELETE requesty (Firebase API)
  if (event.request.method !== 'GET') {
    // Tiché ignorování - bez zbytečného logování
    return;
  }
  
  // KRITICKÁ OPRAVA: Ignorujeme Firebase Firestore API volání
  if (url.includes('firestore.googleapis.com') || 
      url.includes('identitytoolkit.googleapis.com') ||
      url.includes('securetoken.googleapis.com')) {
    // Tiché ignorování Firebase API
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Pokud máme v cache, vrátíme to
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Jinak stáhneme ze sítě
      return fetch(event.request).then((networkResponse) => {
        // Pokud je odpověď OK a je to GET request, uložíme do cache
        if (networkResponse && 
            networkResponse.status === 200 && 
            event.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Další pojistka - cachujeme pouze naše assety
            if (url.startsWith(self.location.origin) || 
                url.includes('gstatic.com')) {
              cache.put(event.request, responseToCache).catch(err => {
                // Tiché selhání - POST requesty ignorujeme
                if (event.request.method === 'POST') return;
                console.warn('⚠️ SW: Cache put selhal:', err.message);
              });
            }
          });
        }
        return networkResponse;
      }).catch((error) => {
        console.error('❌ SW: Fetch selhal pro', url, error.message);
        // Fallback pro offline stav
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Message handler pro manuální refresh cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('🗑️ SW: Všechny cache vymazány!');
      })
    );
  }
});

console.log('🖖 SW V5.4: Service Worker načten a připraven k akci!');
