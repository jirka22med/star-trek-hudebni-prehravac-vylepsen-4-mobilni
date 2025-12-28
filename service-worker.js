const CACHE_NAME = 'st-player-v5.2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  // --- CSS MODULY ---
  './style.css',
  './miniPlayer.css',
  './loadingScreen.css',
  './casovac.css',
  './tone-meter-star-trek-hudebni-prehravac.css',
  './browser-status.css',
  './scrollbar.css',
  './christmas.css',
  './zobrazit-panel-hlasitosti.css',
  // --- KRITICKÉ JS MODULY ---
  './audioFirebaseFunctions.js',
  './DebugManager.js',
  './script.js',
  './backgroundManager.js',
  './myPlaylist.js',
  // --- FEATURE JS MODULY ---
  './universalni-perfomens-monitor.js',
  './jirkuv-hlidac.js',
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
  './audio-upravovac.js',
  './pwa-installer.js',
  './manifest.json',
  // --- FIREBASE SDK (absolutní URL) ---
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js'
];

// Instalace - cachování assetů
self.addEventListener('install', (event) => {
  console.log('🖖 SW V5.2: Spouštím instalaci...');
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
        if (failed.length > 0) {
          console.warn(`⚠️ SW: ${failed.length} souborů se nepodařilo cachovat`);
        }
        console.log('✅ SW V5.2: Instalace dokončena!');
      });
    })
  );
  // Okamžitá aktivace nové verze
  self.skipWaiting();
});

// Aktivace - vyčištění starých cache
self.addEventListener('activate', (event) => {
  console.log('🔄 SW V5.2: Aktivuji novou verzi...');
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
      console.log('✅ SW V5.2: Aktivace dokončena!');
      return self.clients.claim();
    })
  );
});

// Fetch - strategie Cache First s Network Fallback
self.addEventListener('fetch', (event) => {
  // Ignorujeme chrome-extension a jiné non-http requesty
  if (!event.request.url.startsWith('http')) {
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
        // Pokud je odpověď OK, uložíme do cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((error) => {
        console.error('❌ SW: Fetch selhal pro', event.request.url, error);
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

console.log('🖖 SW V5.2: Service Worker načten a připraven k akci!');
