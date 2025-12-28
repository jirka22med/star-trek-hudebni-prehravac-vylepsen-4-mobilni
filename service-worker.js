const CACHE_NAME = 'st-player-v5-final';
const ASSETS_TO_CACHE = [
  'index.html',
  // --- CSS MODULY ---
  'style.css',
  'miniPlayer.css',
  'loadingScreen.css',
  'casovac.css',
  'tone-meter-star-trek-hudebni-prehravac.css',
  'browser-status.css',
  'scrollbar.css',
  'christmas.css',
  'zobrazit-panel-hlasitosti.css',
  // --- KRITICKÉ JS MODULY ---
  'audioFirebaseFunctions.js',
  'DebugManager.js',
  'script.js',
  'backgroundManager.js',
  'myPlaylist.js',
  // --- FEATURE JS MODULY ---
  'universalni-perfomens-monitor.js',
  'jirkuv-hlidac.js',
  'notificationFix.js',
  'autoFade.js',
  'playlistSettings.js',
  'playlistSync.js',
  'pokrocila-sprava-playlistu.js',
  'bluetoothDisconnectMonitor.js',
  'buttonVisibilityManager.js',
  'vyhledavac-skladeb.js',
  'sprava-rozhrani.js',
  'miniPlayer.js',
  'prednacitani-pisnicek.js',
  'scrollbar.js',
  'colorManager.js',
  'timer-module.js',
  'audio-upravovac.js',
  // --- EXTERNNÍ SDK ---
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🖖 SW: Archivuji skutečnou flotilu modulů...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
