
(function() {
    'use strict';
// ⏱️ LOG START
const __CORE_START = performance.now();
// ════════════════════════════════════════════════════════════════════════════════
// 🛸 STAR TREK AUDIO CORE - ARCHITECT EDITION (V 8.0 - CLOUD STALL FIX)
// ════════════════════════════════════════════════════════════════════════════════
// Autor úprav: Admirál Specialista Gemini.AI
// Architekt systému: Více Admirál Jiřík
// Protokol: Stabilita toku dat (Anti-Drop)
// ════════════════════════════════════════════════════════════════════════════════

// 📡 GLOBÁLNÍ STAV AUDIO JEDNOTKY
// Rozšířeno o stavy pro zotavení ze chyb (Recovery)
window.audioState = {
    isLoadingTrack: false,   // TRUE = probíhá prvotní načítání
    isPlaying: false,        // TRUE = hudba hraje
    canPreload: false,       // TRUE = systém je stabilní, můžeme přednahrávat
    isRecovering: false,     // TRUE = pokoušíme se o záchranu streamu (buffering fix)
    lastKnownTime: 0         // Paměť pro pozici při výpadku
};

 /**
 * PROTOKOL: INTERACTION SHIELD (EXPERIMENTÁLNÍ VERZE)
 * Nastaveno na variabilní warp faktor pro testování stability.
 */
function applyInteractionCooldown() {
    // --- NASTAVENÍ WARP FAKTORU (v milisekundách) ---
    const SHIELD_DURATION = 3000; // Zkusíme 3 sekundy pro vyšší stabilitu
    // -----------------------------------------------

    window.audioState.isLoadingTrack = true;
    
    // 🛡️ AKTIVACE ŠTÍTŮ
    if (DOM.playButton) {
        DOM.playButton.style.pointerEvents = 'none';
        DOM.playButton.classList.add('shield-active'); 
    }
    if (DOM.playlist) {
        DOM.playlist.style.pointerEvents = 'none';
        DOM.playlist.classList.add('shield-active'); 
    }
    
    // 📢 ZPĚTNÁ VAZBA PRO ADMIRÁLA
    const durationSec = (SHIELD_DURATION / 1000).toFixed(1);
    window.showNotification(`🛡️ Štíty nahoře na ${durationSec}s: Stabilizuji tok dat...`, "warn", SHIELD_DURATION);
     

    setTimeout(() => {
        window.audioState.isLoadingTrack = false;
        
        // 🔓 UVOLNĚNÍ KONZOLÍ
        if (DOM.playButton) {
            DOM.playButton.style.pointerEvents = 'auto';
            DOM.playButton.classList.remove('shield-active');
        }
        if (DOM.playlist) {
            DOM.playlist.style.pointerEvents = 'auto';
            DOM.playlist.classList.remove('shield-active');
        }
        
        window.showNotification("🔓 Štíty dole: Systém je připraven!", "success", 2000);
        window.DebugManager?.log('main', "🔓 INTERACTION SHIELD: Deaktivován.");
    }, SHIELD_DURATION); 
}
    
    
// --- Cachování DOM elementů (Bridge Controls) ---
const DOM = {
    audioPlayer: document.getElementById('audioPlayer'),
    audioSource: document.getElementById('audioSource'),
    trackTitle: document.getElementById('trackTitle'),
    progressBar: document.getElementById('progress-bar'),
    currentTime: document.getElementById('currentTime')?.querySelectorAll('.time-part'),
    duration: document.getElementById('duration')?.querySelectorAll('.time-part'),
    
    // Tlačítka ovládání
    playButton: document.getElementById('play-button'),
    pauseButton: document.getElementById('pause-button'),
    prevButton: document.getElementById('prev-button'),
    nextButton: document.getElementById('next-button'),
    loopButton: document.getElementById('loop-button'),
    shuffleButton: document.getElementById('shuffle-button'),
    resetButton: document.getElementById('reset-button'),
    
    // UI prvky
    fullscreenToggle: document.getElementById('fullscreen-toggle'),
    toggleInfo: document.getElementById('toggle-info-button'),
    reloadButton: document.getElementById('reload-button'),
    togglePlaylist: document.getElementById('toggle-playlist-button'),
    playlist: document.getElementById('playlist'),
    popisky: document.getElementById('popisky'),
    
    // Hlasitost
    volumeSlider: document.getElementById('volume-slider'),
    volumeValue: document.getElementById('volume-value'),
    muteButton: document.getElementById('mute-button'),
    
    // Hodiny a Sync
    clock: {
        hours: document.querySelector('.time .hours'),
        minutes: document.querySelector('.time .minutes'),
        seconds: document.querySelector('.time .seconds')
    },
    currentDate: document.getElementById('currentDate'),
    syncStatus: document.querySelector('.sync-status-container'),
     
    // Dynamické prvky
    favoritesButton: document.createElement('button'),
    favoritesMenu: document.createElement('div'),
    // 1. Nejprve přidej referenci do tvého objektu DOM (tam, kde definuješ ostatní prvky)
  
};
        DOM.currentYear = document.getElementById('currentYear');   
// ═══════════════════════════════════════════════════════════════════════════
// 🚀 NOVÝ KÓD - EXPORT DOM A INICIALIZACE PLAYLIST VÝŠKY
// ═══════════════════════════════════════════════════════════════════════════
window.DOM = DOM; // Export pro playlist-height.js

// Inicializace výšky playlistu (pokud existuje funkce z playlist-height.js)
if (typeof restorePreviousSettings === 'function') {
    restorePreviousSettings();
 //   window.DebugManager?.log('main', '✅ Playlist výška inicializována z script.js');
} else {
    // Pokud se playlist-height.js ještě nenačetl, počkáme na něj
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof restorePreviousSettings === 'function') {
            restorePreviousSettings();
          //  window.DebugManager?.log('main', '✅ Playlist výška inicializována po DOMContentLoaded');
        }
    });
}
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// 🛡️ INTEGRACE SE STREAM STABILIZEREM (nahrazuje StreamGuard)
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // Registrace audio elementu pro monitoring
    if (DOM.audioPlayer && window.StreamStabilizer_RegisterAudio) {
        window.StreamStabilizer_RegisterAudio(DOM.audioPlayer);
    }
});
 

// ═══════════════════════════════════════════════════════════════
// --- Globální proměnné a logika playlistu ---
// ═══════════════════════════════════════════════════════════════

let currentTrackIndex = 0;
let isShuffled = false;
let shuffledIndices = [];
window.favorites = [];
let originalTracks = Array.isArray(window.tracks) ? [...window.tracks] : [];
let currentPlaylist = [...originalTracks];
let playlistVisible = true;

// Debounce pro ukládání
let saveTimeout = null;
function debounceSaveAudioData() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveAudioData, 500);
}

// Inicializace pole skladeb
if (!Array.isArray(window.tracks)) {
    window.tracks = []; 
}

/// --- Notifikace ---
window.showNotification = function(message, type = 'info', duration = 3000) {
    window.DebugManager?.log('main', '[' + type.toUpperCase() + '] ' + message);
    
    if (!DOM.notification && document.getElementById('notification')) {
         DOM.notification = document.getElementById('notification');
    }
    if (!DOM.notification) {
        if (window.DebugManager?.isEnabled('main')) {
            console.warn('showNotification: #notification nenalezen. Zpráva:', message);
        }
        return;
    }
    DOM.notification.textContent = message;
    DOM.notification.style.display = 'block';
    
    // Barvy podle typu hlášení (Star Trek LCARS styl)
    if (type === 'error') DOM.notification.style.backgroundColor = '#dc3545'; // Red Alert
    else if (type === 'warn') DOM.notification.style.backgroundColor = '#ffc107'; // Yellow Alert
    else if (type === 'play') DOM.notification.style.backgroundColor = '#007bff'; // Blue (Info)
    else DOM.notification.style.backgroundColor = '#28a745'; // Green (Success)

    setTimeout(() => DOM.notification.style.display = 'none', duration);
};

// --- Oprava URL adres pro stabilní streamování ---
/**
 * Optimalizuje URL pro přímé streamování (verze 2026).
 */
function checkAndFixTracks(trackList) {
    if (!Array.isArray(trackList)) return;

    trackList.forEach(track => {
        if (track?.src?.includes("www.dropbox.com")) {
            let url = new URL(track.src);
            
            // === 2026 PROTOCOL ===
            // 1. Zajistíme raw=1 (přímý stream bez HTML wrapperu)
            if (url.searchParams.has("dl")) {
                url.searchParams.set("raw", "1");
                url.searchParams.delete("dl");
            }
            if (!url.searchParams.has("raw")) {
                url.searchParams.append("raw", "1");
            }

            // 2. Optimalizace domény (2026: HTTP/2 multiplexing preference)
            let finalSrc = url.toString()
                .replace("www.dropbox.com", "dl.dropboxusercontent.com")
                .replace("http://", "https://"); // Force HTTPS pro HTTP/2
            
            // 3. Anti-cache bypass (pro debug)
            if (window.FORCE_NOCACHE) {
                url.searchParams.set("_nc", Date.now());
                finalSrc = url.toString();
            }
            
            if (track.src !== finalSrc) {
                track.src = finalSrc;
               window.DebugManager?.log('main', '🔧 URL opravena: ' + track.title);
            }
        }
    });
}


// ════════════════════════════════════════════════════════════════════════════════
// 🔧 OPRAVA loadAudioData() PRO NOVÝ FIRESTORE SYSTÉM
// ════════════════════════════════════════════════════════════════════════════════
// Nahraď celou funkci loadAudioData() v script.js tímto kódem:
// ════════════════════════════════════════════════════════════════════════════════

// ============================================================================
// � ️ loadAudioData (V7.0 - BENDER EDITION - FUNKČNÍ ORIGINÁL)
// ============================================================================
// Vychází přesně z tvého 'loadAudioData-original.js'.
// Vrací zpět globální proměnné (aby se načítal myPlaylist).
// Opravuje přepisování názvů (aby zůstalo "hovno").

async function loadAudioData() {
    window.DebugManager?.log('main', "loadAudioData: Načítám data přehrávače...");

    // 🛡️ NOUZOVÁ POJISTKA: Detekce offline stavu před startem Cloudu
    if (!navigator.onLine) {
        window.DebugManager?.log('main', "📡 [Red Alert] Offline režim! Warp jádro nedostupné, aktivuji lokální databázi.");
        
        // Okamžitě načteme tvůj myPlaylist.js z paměti
        window.tracks = window.tracks ? [...window.tracks] : [];
        originalTracks = window.tracks;
        currentPlaylist = [...originalTracks];

        // Spustíme UI bez čekání na Firebase
        if (typeof populatePlaylist === 'function') populatePlaylist(window.tracks);
        if (typeof updateActiveTrackVisuals === 'function') updateActiveTrackVisuals();
        
        window.showNotification("📟 Nouzový režim: Načteno z lokální flotily", "warn");
        return; // UKONČÍME FUNKCI - nepokoušíme se o Cloud, aby nevznikly chyby
    }
     
    
    // 1. ZÁKLADNÍ NAČTENÍ Z myPlaylist.js
    const originalPlaylistFromFile = window.tracks ? [...window.tracks] : [];
    const originalFileCount = originalPlaylistFromFile.length;
    
    const originalFileHash = originalFileCount > 0 
        ? `${originalFileCount}-${originalPlaylistFromFile[0]?.title || ''}-${originalPlaylistFromFile[originalFileCount-1]?.title || ''}`
        : 'empty';
    
    window.DebugManager?.log('main', `🖖 loadAudioData: Původní playlist z myPlaylist.js má ${originalFileCount} skladeb`);
    window.DebugManager?.log('main', `🖖 loadAudioData: Hash lokálního playlistu: ${originalFileHash}`);
    
    // 🔥 TOTO JSEM MINULE VYNECHAL - PROTO TO NEJELO! 🔥
    // Inicializace globálních proměnných pro fungování přehrávače
    originalTracks = originalPlaylistFromFile;
    currentPlaylist = [...originalTracks];
    
    let firestoreLoaded = { playlist: false, favorites: false, settings: false };

    try {
        // 2. POKUS O NAČTENÍ Z CLOUDU
        const loadedPlaylist = await window.loadPlaylistFromFirestore?.();
        
        if (loadedPlaylist?.length > 0) {
            const cloudCount = loadedPlaylist.length;
            const cloudHash = `${cloudCount}-${loadedPlaylist[0]?.title || ''}-${loadedPlaylist[cloudCount-1]?.title || ''}`;
            
            window.DebugManager?.log('main', `☁️ loadAudioData: Cloud playlist má ${cloudCount} skladeb`);
            
            if (originalFileCount === 0) {
                // Lokál je prázdný -> Bereme Cloud
                window.DebugManager?.log('main', "⬇️ Lokál prázdný -> Beru Cloud.");
                window.tracks = loadedPlaylist;
                checkAndFixTracks(window.tracks);
                firestoreLoaded.playlist = true;
                
            } else if (originalFileHash === cloudHash) {
                // Jsou stejné -> Bereme Cloud
                window.DebugManager?.log('main', "✅ Playlisty jsou SHODNÉ.");
                window.tracks = loadedPlaylist; 
                checkAndFixTracks(window.tracks);
                firestoreLoaded.playlist = true;
                
            } else {
                // � ️ KONFLIKT (Tady se rozhoduje o "hovnu")
                window.DebugManager?.log('main', "🔄 Playlisty se liší.");
                
                // Pokud sedí počet skladeb, znamená to, že jsi jen PŘEJMENOVÁVAL.
                // V tom případě VĚŘÍME CLOUDU!
                if (originalFileCount === cloudCount) {
                    window.DebugManager?.log('main', "👑 Počet sedí -> POUŽÍVÁM CLOUD (zachovávám tvé názvy)");
                    window.tracks = loadedPlaylist; // <--- TOTO ZACHRÁNÍ NÁZEV
                    firestoreLoaded.playlist = true;
                } else {
                    // Pokud počet nesedí (přidal jsi skladbu), musíme vzít lokál
                    window.DebugManager?.log('main', "� ️ Nesedí počet -> Používám LOKÁL (čekám na sync)");
                    window.tracks = originalPlaylistFromFile;
                    window.PLAYLIST_NEEDS_SYNC = true;
                }
                
                checkAndFixTracks(window.tracks);
            }
            
        } else {
            // Cloud prázdný
            window.DebugManager?.log('main', "📁 Cloud prázdný -> Používám myPlaylist.js");
            window.tracks = originalPlaylistFromFile;
            checkAndFixTracks(window.tracks);
            window.PLAYLIST_NEEDS_SYNC = true;
        }
        
        // ═══════════════════════════════════════════════════════════════════════
        // ⭐ NAČTENÍ OBLÍBENÝCH (beze změny)
        // ═══════════════════════════════════════════════════════════════════════
        const loadedFavorites = await window.loadFavoritesFromFirestore?.();
        if (loadedFavorites?.length > 0) {
            favorites = [...loadedFavorites];
            firestoreLoaded.favorites = true;
        }
        
        // ═══════════════════════════════════════════════════════════════════════
        // ⚙️ NAČTENÍ NASTAVENÍ (beze změny)
        // ═══════════════════════════════════════════════════════════════════════
        const loadedSettings = await window.loadPlayerSettingsFromFirestore?.();
        if (loadedSettings) {
            isShuffled = loadedSettings.isShuffled ?? isShuffled;
            if (DOM.audioPlayer) {
                DOM.audioPlayer.loop = loadedSettings.loop ?? DOM.audioPlayer.loop;
                if (DOM.loopButton) {
                    const isLooping = DOM.audioPlayer.loop;
                    DOM.loopButton.classList.toggle('active', isLooping);
                    DOM.loopButton.title = isLooping ? "Opakování zapnuto" : "Opakování vypnuto";
                }
                if (DOM.shuffleButton) {
                    DOM.shuffleButton.classList.toggle('active', isShuffled);
                    DOM.shuffleButton.title = isShuffled ? "Náhodné zapnuto" : "Náhodné vypnuto";
                }
                DOM.audioPlayer.volume = loadedSettings.volume ?? DOM.audioPlayer.volume;
                DOM.audioPlayer.muted = loadedSettings.muted ?? DOM.audioPlayer.muted;
                if (DOM.volumeSlider) DOM.volumeSlider.value = DOM.audioPlayer.volume;
                if (DOM.volumeValue) DOM.volumeValue.textContent = Math.round(DOM.audioPlayer.volume * 100) + '%';
            }
            currentTrackIndex = loadedSettings.currentTrackIndex ?? currentTrackIndex;
            firestoreLoaded.settings = true;
        }
        
    } catch (error) {
        window.DebugManager?.log('main', "🔧 Chyba cloudu, jedu na lokál.", error);
        window.tracks = originalPlaylistFromFile;
        checkAndFixTracks(window.tracks);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 FALLBACKY (localStorage - už deaktivováno v tvém kódu)
    // ═══════════════════════════════════════════════════════════════════════════
    if (!firestoreLoaded.favorites) {
        const localFav = localStorage.getItem('favorites');
        if (localFav) favorites = JSON.parse(localFav);
    }
    if (!firestoreLoaded.settings) {
        const savedSettings = JSON.parse(localStorage.getItem('playerSettings') || '{}');
        if (DOM.audioPlayer && savedSettings.volume !== undefined) DOM.audioPlayer.volume = savedSettings.volume;
        isShuffled = savedSettings.isShuffled ?? isShuffled;
        currentTrackIndex = savedSettings.currentTrackIndex ?? currentTrackIndex;
    }

    // ═══════════════════════════════════════════════════════════════════════════
// ✅ FINALIZACE
// ═══════════════════════════════════════════════════════════════════════════
originalTracks = window.tracks; // ✅ Aktualizujeme lokální proměnnou
currentPlaylist = [...originalTracks];

window.DebugManager?.log('main', '🎵 HOTOVO: skladeb načteno:', window.tracks.length);

// Ověření, že src odkazy jsou OK
if (window.tracks.length > 0) {
    const firstTrack = window.tracks[0];
    if (!firstTrack.src || !firstTrack.src.includes('http')) {
        window.DebugManager?.log('main', "⚠️ VAROVÁNÍ: První skladba nemá platný src odkaz!", firstTrack, 'error');
        window.showNotification("Chyba: Odkazy na skladby chybí!", "error");
    } else {
        window.DebugManager?.log('main', '✅ Ověřeno: Skladby mají platné src odkazy (např.', firstTrack.src.substring(0, 50) + '...)');
    }
}
    
    if (typeof populatePlaylist === 'function') populatePlaylist(window.tracks);
    if (typeof updateActiveTrackVisuals === 'function') updateActiveTrackVisuals();

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 SYNC (pokud třeba)
    // ═══════════════════════════════════════════════════════════════════════════
    // 🛡️ OPRAVENÁ SYNC LOGIKA (USS PROMETHEUS - Fleet Registry Fix)
    // Už žádné setTimeout, synchronizujeme jen když je to nutné a bezpečné
    if (window.PLAYLIST_NEEDS_SYNC && firestoreLoaded.playlist) {
        // Máme Cloud (v1.3), ale lokál má víc skladeb -> aktualizujeme Cloud tvými novými daty
        window.DebugManager?.log('main', "🔄 [SYNC] Lokální změny zjištěny, aktualizuji Cloud...");
        if (typeof window.savePlaylistToFirestore === 'function') {
            await window.savePlaylistToFirestore(window.tracks);
        }
        window.PLAYLIST_NEEDS_SYNC = false;

    } else if (!firestoreLoaded.playlist && originalPlaylistFromFile.length > 0) {
        // Cloud byl prázdný, nahráváme lokální soubor poprvé
        window.DebugManager?.log('main', "📤 [SYNC] Cloud prázdný, nahrávám lokální databázi...");
        if (typeof debounceSaveAudioData === 'function') {
            await debounceSaveAudioData();
        }
    }
    
    // 🖖 Finální synchronizace vizuálu - Kapitán hlásí připravenost
    if (window.CaptainNotifyChange) {
        window.CaptainNotifyChange();
    }
}

// ════════════════════════════════════════════════════════════════════════════════
// ✅ KONEC ÚPRAV - Zbytek script.js ZŮSTÁVÁ BEZ ZMĚNY
// ════════════════════════════════════════════════════════════════════════════════

// --- Ukládání dat ---
async function saveAudioData() {
    window.DebugManager?.log('main', "saveAudioData: Ukládám data přehrávače.");
    //localStorage.setItem('currentPlaylist', JSON.stringify(window.tracks)); //toto je deaktivovano
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('playerSettings', JSON.stringify({
        currentTrackIndex,
        isShuffled,
        loop: DOM.audioPlayer?.loop ?? false,
        volume: DOM.audioPlayer?.volume ?? 0.5,
        muted: DOM.audioPlayer?.muted ?? false
    }));

    try {
       // await window.savePlaylistToFirestore?.(window.tracks);
        await window.saveFavoritesToFirestore?.(favorites);
        await window.savePlayerSettingsToFirestore?.({
            currentTrackIndex,
            isShuffled,
            loop: DOM.audioPlayer?.loop ?? false,
            volume: DOM.audioPlayer?.volume ?? 0.5,
            muted: DOM.audioPlayer?.muted ?? false
        });
    } catch (error) {
        window.DebugManager?.log('main', "Chyba při ukládání do cloudu", error);
    }
}

// --- Mazání dat ---
window.clearAllAudioPlayerData = async function() {
    if (!confirm('⚠️ OPRAVDU chcete smazat VŠECHNA data přehrávače?')) return;
    if (!confirm('⚠️ JSTE SI ABSOLUTNĚ JISTI? Data budou nenávratně ztracena!')) return;

     localStorage.removeItem('currentPlaylist'); //toto je deaktivovano
    localStorage.removeItem('favorites');
    localStorage.removeItem('playerSettings');
    
    try {
        await window.clearAllAudioFirestoreData?.();
    } catch (error) {
        console.error(error);
    }

    currentTrackIndex = 0;
    isShuffled = false;
    shuffledIndices = [];
    favorites = [];
    originalTracks = Array.isArray(window.tracks) ? [...window.tracks] : [];
    currentPlaylist = [...originalTracks];

    populatePlaylist(currentPlaylist);
    updateVolumeDisplayAndIcon();
    updateButtonActiveStates(false);
    updateActiveTrackVisuals();
    window.showNotification('Všechna data přehrávače smazána!', 'info', 2035);
};

 

// 2. Upravená funkce updateClock s tvým klíčovým prvkem
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if (DOM.clock.hours) DOM.clock.hours.textContent = hours;
    if (DOM.clock.minutes) DOM.clock.minutes.textContent = minutes;
    if (DOM.clock.seconds) DOM.clock.seconds.textContent = seconds;

    // --- INTEGRACE TVÉHO PRVKU ---
    // Kontrolujeme, zda prvek existuje a zda je prázdný, abychom neprováděli zbytečné zápisy 
    // do DOM každou vteřinu (optimalizace pro tvůj systém setin).
    if (DOM.currentYear && DOM.currentYear.textContent === "") {
        DOM.currentYear.textContent = now.getFullYear();
    }
    // ----------------------------

    if (DOM.currentDate) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' };
        DOM.currentDate.textContent = now.toLocaleDateString('cs-CZ', options);
    }
}

// Spouštění smyčky (pro tvůj systém setin můžeš interval snížit, např. na 10 nebo 16ms)
setInterval(updateClock, 1000);

// --- Hlasitost ---
function logarithmicVolume(value) {
    return Math.pow(parseFloat(value), 3.0);
}

function updateVolumeDisplayAndIcon() {
    if (!DOM.audioPlayer || !DOM.volumeSlider || !DOM.muteButton || !DOM.volumeValue) return;
    const volume = DOM.audioPlayer.volume;
    const sliderValue = parseFloat(DOM.volumeSlider.value);
    if (DOM.audioPlayer.muted || volume === 0) {
        DOM.muteButton.textContent = '🔇';
        DOM.volumeValue.textContent = '0';
    } else {
        DOM.volumeValue.textContent = Math.round(sliderValue * 100);
        DOM.muteButton.textContent = sliderValue <= 0.01 ? '🔇' : sliderValue <= 0.2 ? '🔈' : sliderValue <= 0.5 ? '🔉' : '🔊';
    }
}

// --- Formátování času ---
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return {
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
    };
}

function updateTrackTimeDisplay() {
    if (!DOM.audioPlayer || !DOM.progressBar || !DOM.currentTime || !DOM.duration) return;
    const currentTime = DOM.audioPlayer.currentTime;
    const duration = DOM.audioPlayer.duration || 0;
    const formattedCurrent = formatTime(currentTime);
    const formattedDuration = formatTime(duration);
    
    if (DOM.currentTime[0]) DOM.currentTime[0].textContent = formattedCurrent.hours;
    if (DOM.currentTime[1]) DOM.currentTime[1].textContent = formattedCurrent.minutes;
    if (DOM.currentTime[2]) DOM.currentTime[2].textContent = formattedCurrent.seconds;
    
    if (DOM.duration[0]) DOM.duration[0].textContent = formattedDuration.hours;
    if (DOM.duration[1]) DOM.duration[1].textContent = formattedDuration.minutes;
    if (DOM.duration[2]) DOM.duration[2].textContent = formattedDuration.seconds;
    
    if (!isNaN(duration) && duration > 0) {
        DOM.progressBar.value = (currentTime / duration) * 100;
    } else {
        DOM.progressBar.value = 0;
    }
}

// --- Vykreslení playlistu ---
function populatePlaylist(listToDisplay) {
    if (!DOM.playlist) return;
    
    if (!DOM.playlist.classList.contains('hidden')) DOM.playlist.classList.add('hidden');
    DOM.playlist.innerHTML = '';
    
    if (!listToDisplay?.length) {
        DOM.playlist.innerHTML = '<div class="playlist-item" style="justify-content: center;">Žádné skladby</div>';
    } else {
        const fragment = document.createDocumentFragment();
        
        // 🆕 STICKY HEADER - vytvoř na začátku
        const stickyHeader = document.createElement('div');
        stickyHeader.id = 'sticky-section-header';
        stickyHeader.className = 'playlist-section-header';
        stickyHeader.textContent = '🎧 Načítání...';
        stickyHeader.style.cssText = `
    position: sticky;
    top: 0;
    z-index: 200;
    padding: 8px 12px;
    margin: 0;
    background: linear-gradient(135deg, rgba(0, 120, 215, 0.4), rgba(0, 212, 255, 0.2));
    color: #00d4ff;
    font-weight: bold;
    font-size: 11px;
    text-align: center;
    border-radius: 0;
    border-left: 3px solid #00d4ff;
    cursor: default;
    box-shadow: 0 3px 12px #000000;  /* 🆕 100% černý stín */
`;
        fragment.appendChild(stickyHeader);
        
        listToDisplay.forEach((track, index) => {
            const originalIndex = originalTracks.findIndex(ot => ot.title === track.title && ot.src === track.src);

            // Sekce (nadpisy) - normální headery
            if (window.playlistSections && originalIndex !== -1) {
                const section = window.playlistSections.find(s => s.start === originalIndex);
                if (section) {
                    const header = document.createElement('div');
                    header.className = 'playlist-section-header';
                    header.dataset.sectionName = section.name; // 🆕 Pro detekci
                    header.textContent = section.name;
                    header.style.cssText = `
                        padding: 8px 12px;
                        background: linear-gradient(135deg, rgba(0, 120, 215, 0.4), rgba(0, 212, 255, 0.2));
                        color: #00d4ff;
                        font-weight: bold;
                        font-size: 10px;
                        text-align: center;
                        margin: 5px 0;
                        border-radius: 8px;
                        border-left: 4px solid #00d4ff;
                        cursor: default;
                    `;
                    fragment.appendChild(header);
                }
            }

            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.dataset.originalSrc = track.src;
            
            if (originalIndex === currentTrackIndex && DOM.audioPlayer && !DOM.audioPlayer.paused) {
                item.classList.add('active');
            }
            
            const trackNumber = document.createElement('span');
            trackNumber.className = 'track-number';
            trackNumber.textContent = (index + 1) + '.';
            item.appendChild(trackNumber);
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'track-title';
            titleSpan.textContent = track.title;
            item.appendChild(titleSpan);
            
            const favButton = document.createElement('button');
            favButton.className = 'favorite-button';
            favButton.textContent = favorites.includes(track.title) ? '⭐' : '☆';
            favButton.onclick = async e => {
                e.stopPropagation();
                await toggleFavorite(track.title);
            };
            item.appendChild(favButton);
            
            item.addEventListener('click', () => {
                if (window.audioState.isLoadingTrack) {
                    window.DebugManager?.log('main', "⚠️ SYSTÉM BUSY: Kliknutí na playlist blokováno štítem.");
                    return;
                }
                if (originalIndex !== -1) playTrack(originalIndex);
            });
            
            fragment.appendChild(item);
        });
        
        DOM.playlist.appendChild(fragment);
        
        // 🆕 AKTIVACE SCROLL LISTENERU
        activateStickyHeaderUpdater();
    }
    
    updateActiveTrackVisuals();

    if (window.applyEverything) {
        window.applyEverything();
    }

    setTimeout(() => {
        DOM.playlist.classList.remove('hidden');
        if (DOM.playlist.style.display === 'none') DOM.playlist.style.display = 'block';
    }, 50);
}

// 🆕 STICKY HEADER UPDATER - Aktualizuje název sekce při scrollování
function activateStickyHeaderUpdater() {
    const stickyHeader = document.getElementById('sticky-section-header');
    if (!stickyHeader || !DOM.playlist) return;
    
    // Odstranění starého listeneru (pokud existuje)
    if (DOM.playlist._stickyScrollListener) {
        DOM.playlist.removeEventListener('scroll', DOM.playlist._stickyScrollListener);
    }
    
    // Nový scroll listener
    const scrollListener = () => {
        const headers = DOM.playlist.querySelectorAll('.playlist-section-header[data-section-name]');
        let currentSection = '🎧 Načítání...';
        
        // Najdi první viditelný header
        for (let header of headers) {
            const rect = header.getBoundingClientRect();
            const playlistRect = DOM.playlist.getBoundingClientRect();
            
            // Pokud je header viditelný v playlistu (nebo těsně nad ním)
            if (rect.top <= playlistRect.top + 60) {
                currentSection = header.dataset.sectionName;
            }
        }
        
        // Aktualizuj sticky header
        if (stickyHeader.textContent !== currentSection) {
            stickyHeader.textContent = currentSection;
        }
    };
    
    // Uložíme listener do DOM elementu pro pozdější odstranění
    DOM.playlist._stickyScrollListener = scrollListener;
    
    // Připojíme listener
    DOM.playlist.addEventListener('scroll', scrollListener, { passive: true });
    
    // Inicializace - nastav první sekci
    scrollListener();
}


// ============================================================================
// ▶️ playTrack (S INTEGRACÍ STREAM GUARDU)
// ============================================================================
async function playTrack(originalIndex) {
    applyInteractionCooldown();

    window.audioState.isLoadingTrack = true;
    window.dispatchEvent(new Event('track-loading-start'));
    
    if (!originalTracks || originalIndex < 0 || originalIndex >= originalTracks.length) {
        window.DebugManager?.log('main', '⚠️ Neplatný index skladby', null, 'error');
        return;
    }
    
    currentTrackIndex = originalIndex;
    const track = originalTracks[currentTrackIndex];
    
    if (!DOM.audioSource || !DOM.trackTitle || !DOM.audioPlayer) return;
    
    // === CACHE LOGIC ===
    let audioUrl = track.src;
    if (window.audioPreloader?.isCached(track.src)) {
        const cachedUrl = window.audioPreloader.createObjectURL(track.src);
        if (cachedUrl) {
            audioUrl = cachedUrl;
            window.DebugManager?.log('main', '⚡ Cache hit:', track.title);
        }
    }
    
    // === CLEAN STATE (2026: Force stop před novým loadem) ===
    DOM.audioPlayer.pause();
    DOM.audioPlayer.currentTime = 0; // Reset pozice
    DOM.audioSource.src = audioUrl;
    DOM.trackTitle.textContent = track.title;

    setTimeout(() => {
        window.showNotification('▶️ Hraje: ' + track.title, 'play', 2034);
    }, 2500);

    DOM.audioPlayer.load();
    
    // === 2026 PLAY PROTOCOL (s timeout guard) ===
    try {
        const playPromise = DOM.audioPlayer.play();
        
        if (playPromise !== undefined) {
            // Timeout protection (10s max wait)
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('PLAY_TIMEOUT')), 10000)
            );
            
            await Promise.race([playPromise, timeoutPromise]);
            
            // === SUCCESS PROTOCOL ===
            window.audioState.isLoadingTrack = false;
            window.audioState.isPlaying = true;
            window.audioState.canPreload = true;
            
            window.dispatchEvent(new CustomEvent('track-loaded-success', {
                detail: { src: track.src, title: track.title }
            }));
           
            window.DebugManager?.log('main', "✅ Přehrávání:", track.title);
            updateButtonActiveStates(true);
            updateActiveTrackVisuals();
            
            // Preload next tracks
            if (window.audioPreloader) {
                window.preloadTracks(originalTracks, currentTrackIndex, isShuffled, shuffledIndices)
                    .catch(err => window.DebugManager?.log('main', '⚠️ Preload:', err));
            }
            
            await debounceSaveAudioData();
        }
    } catch (error) {
        window.audioState.isLoadingTrack = false;
        window.audioState.canPreload = false;
        
        // === ERROR CLASSIFICATION (2026) ===
        if (error.name === 'AbortError') {
            // Normální přerušení (skip track) - TICHÝ LOG
            window.DebugManager?.log('main', '⏭️ Track skipped');
        } else if (error.message === 'PLAY_TIMEOUT') {
            // Timeout - možná síťový problém
            window.DebugManager?.log('main', '⏱️ Play timeout, retry...', null, 'warn');
            if (window.StreamStabilizer) {
                window.StreamStabilizer.handleError(DOM.audioPlayer);
            }
        } else {
            // Skutečná chyba
            console.error('❌ Play error:', error);
            if (window.StreamStabilizer) {
                window.StreamStabilizer.handleError(DOM.audioPlayer);
            }
        }
    }
}


function updateActiveTrackVisuals() {
    if (!DOM.playlist || !originalTracks?.length) return;
    const items = DOM.playlist.getElementsByClassName('playlist-item');
    const currentTrackData = originalTracks[currentTrackIndex];
    Array.from(items).forEach(item => {
        const isActive = item.dataset.originalSrc === currentTrackData?.src;
        item.classList.toggle('active', isActive);
        if (isActive && DOM.playlist.style.display !== 'none' && DOM.playlist.offsetParent !== null) {
            setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }), 100);
        }
    });
}

function playNextTrack() {
    if (!originalTracks?.length) return;
    let nextIndex;
    if (isShuffled) {
        if (!shuffledIndices.length) generateShuffledIndices();
        nextIndex = shuffledIndices.pop() ?? generateShuffledIndices().pop();
    } else {
        nextIndex = (currentTrackIndex + 1) % originalTracks.length;
    }
    playTrack(nextIndex);
}

function playPrevTrack() {
    if (!originalTracks?.length) return;
    let prevIndex;
    if (isShuffled) {
        if (!shuffledIndices.length) generateShuffledIndices();
        prevIndex = shuffledIndices.pop() ?? generateShuffledIndices().pop();
    } else {
        prevIndex = (currentTrackIndex - 1 + originalTracks.length) % originalTracks.length;
    }
    playTrack(prevIndex);
}

function generateShuffledIndices() {
    if (!originalTracks?.length) return;
    shuffledIndices = Array.from({ length: originalTracks.length }, (_, i) => i).filter(i => i !== currentTrackIndex);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
}

function updateButtonActiveStates(isPlaying) {
    if (DOM.playButton) DOM.playButton.classList.toggle('active', isPlaying);
    if (DOM.pauseButton) DOM.pauseButton.classList.toggle('active', !isPlaying);
}

window.toggleFavorite = async function(trackTitle) {
    const indexInFavorites = favorites.indexOf(trackTitle);
    let message = '';

    if (indexInFavorites === -1) {
        favorites.push(trackTitle);
        message = 'Přidáno do oblíbených ⭐';
    } else {
        favorites.splice(indexInFavorites, 1);
        message = 'Odebráno z oblíbených 🗑️';
    }
    
    window.showNotification(message, 'info', 2031); 
    await debounceSaveAudioData();
    populatePlaylist(currentPlaylist);
    updateFavoritesMenu();
};

// ============================================================================
// 🎮 EVENT LISTENERY (BRIDGE CONTROLS)
// ============================================================================
function addEventListeners() {
    // 1. Ošetření Play tlačítka v addEventListeners()
DOM.playButton?.addEventListener('click', () => {
    if (window.audioState.isLoadingTrack) return; // Blokace při stahování
    
    if (DOM.audioPlayer && DOM.audioSource.src && DOM.audioSource.src !== window.location.href) {
        DOM.audioPlayer.play().then(() => {
            window.audioState.isPlaying = true;
            updateButtonActiveStates(true);
        }).catch(e => console.error(e));
    } else if (originalTracks.length > 0) {
        playTrack(currentTrackIndex);
    }
});

    DOM.pauseButton?.addEventListener('click', () => {
        if (DOM.audioPlayer) DOM.audioPlayer.pause();
        window.audioState.isPlaying = false;
        window.dispatchEvent(new Event('player-paused'));
        window.showNotification('Pauza', 'info', 2029);
        updateButtonActiveStates(false);
    });

    DOM.prevButton?.addEventListener('click', () => {
        window.dispatchEvent(new Event('track-changed'));
        playPrevTrack();
    });
    
    DOM.nextButton?.addEventListener('click', () => {
        window.dispatchEvent(new Event('track-changed'));
        playNextTrack();
    });

    // Režim opakování
    // ============================================================================
// 🔄 ARCHITECT EDITION: LOOP CONTROL (FULL LOGIC)
// ============================================================================
DOM.loopButton?.addEventListener('click', async () => {
    if (!DOM.audioPlayer) {
        window.DebugManager?.log('main', "⚠️ CHYBA: audioPlayer nenalezen při přepínání smyčky.", null, 'error');
        return;
    }

    // Přepnutí stavu smyčky
    DOM.audioPlayer.loop = !DOM.audioPlayer.loop;
    const isLooping = DOM.audioPlayer.loop;

    // Aktualizace vizuálního stavu tlačítka
    DOM.loopButton.classList.toggle('active', isLooping);
    DOM.loopButton.title = isLooping ? "Opakování zapnuto" : "Opakování vypnuto";

    // Komunikační protokol pro uživatele
    window.showNotification(isLooping ? 'Opakování zapnuto' : 'Opakování vypnuto', 'info', 2028);

     

    // Uložení stavu do Cloudu a lokální paměti
    await debounceSaveAudioData();
});

    // Náhodné přehrávání
    DOM.shuffleButton?.addEventListener('click', async () => {
        isShuffled = !isShuffled;
        DOM.shuffleButton.classList.toggle('active', isShuffled);
        DOM.shuffleButton.title = isShuffled ? "Náhodné zapnuto" : "Náhodné vypnuto";
        window.showNotification(isShuffled ? 'Náhodné přehrávání zapnuto 🔀' : 'Náhodné přehrávání vypnuto ➡️', 'info', 2027);
        if (isShuffled) generateShuffledIndices();
        await debounceSaveAudioData();
    });

    // Reset skladby
    DOM.resetButton?.addEventListener('click', async () => {
        if (DOM.audioPlayer) {
            DOM.audioPlayer.currentTime = 0;
            if (!DOM.audioPlayer.paused) DOM.audioPlayer.play();
            window.showNotification('Skladba vrácena na začátek ⏮️', 'info', 2001);
        }
        await debounceSaveAudioData();
    });

    // UI interakce
    DOM.fullscreenToggle?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        DOM.fullscreenToggle?.classList.toggle('active', !!document.fullscreenElement);
        adjustPlaylistHeight(!!document.fullscreenElement);
    });

    DOM.toggleInfo?.addEventListener('click', () => {
        if (DOM.popisky) {
            if (!DOM.popisky.innerHTML.includes('SYSTÉM:')) {
                // Přidání hlavičky pro Admirála
                DOM.popisky.innerHTML = `
                    <div style="color: #00E61B; border-bottom: 2px solid #00E61B; margin-bottom: 10px; padding: 5px; font-family: monospace;">
                        🛰️ SYSTÉM: V8.0 | PROTOKOL STREAM-GUARD AKTIVNÍ
                    </div>
                ` + DOM.popisky.innerHTML;
            }
            DOM.popisky.style.display = DOM.popisky.style.display === 'none' ? 'block' : 'none';
        }
    });

    DOM.reloadButton?.addEventListener('click', () => window.location.reload());

    DOM.togglePlaylist?.addEventListener('click', () => {
        playlistVisible = !playlistVisible;
        DOM.playlist.style.display = playlistVisible ? 'block' : 'none';
        DOM.togglePlaylist.classList.toggle('active', playlistVisible);
        
        const msg = playlistVisible ? 'Playlist zobrazen 📂' : 'Playlist skryt 📁';
        window.showNotification(msg, 'info', 1963);

        if (playlistVisible) updateActiveTrackVisuals();
    });

    // Slidery
    DOM.progressBar?.addEventListener('input', () => {
        if (DOM.audioPlayer?.duration) {
            DOM.audioPlayer.currentTime = DOM.audioPlayer.duration * (DOM.progressBar.value / 100);
        }
    });

    DOM.volumeSlider?.addEventListener('input', async e => {
        if (DOM.audioPlayer) DOM.audioPlayer.volume = logarithmicVolume(e.target.value);
        updateVolumeDisplayAndIcon();
        await debounceSaveAudioData();
    });

    DOM.muteButton?.addEventListener('click', async () => {
        if (!DOM.audioPlayer || !DOM.volumeSlider) return;
        DOM.audioPlayer.muted = !DOM.audioPlayer.muted;
        
        if (DOM.audioPlayer.muted) {
            DOM.muteButton.dataset.previousVolume = DOM.volumeSlider.value;
            DOM.volumeSlider.value = 0;
        } else {
            const prevSliderVol = DOM.muteButton.dataset.previousVolume || '0.1';
            DOM.volumeSlider.value = prevSliderVol;
            DOM.audioPlayer.volume = logarithmicVolume(prevSliderVol);
        }
        updateVolumeDisplayAndIcon();
        const msg = DOM.audioPlayer.muted ? 'Zvuk ztlumen 🔇' : 'Zvuk zapnut 🔊';
        window.showNotification(msg, 'info', 1958);
        await debounceSaveAudioData();
    });

    // ═══════════════════════════════════════════════════════════════════
    // 🛡️ ANTI-STALL & ERROR LISTENERY (JÁDRO ÚPRAVY PRO ADMIRÁLA)
    // ═══════════════════════════════════════════════════════════════════

    if (DOM.audioPlayer) {
        // 1. Standardní aktualizace UI
        DOM.audioPlayer.addEventListener('volumechange', updateVolumeDisplayAndIcon);
        DOM.audioPlayer.addEventListener('timeupdate', updateTrackTimeDisplay);
        DOM.audioPlayer.addEventListener('loadedmetadata', updateTrackTimeDisplay);
        
        // 2. Play/Pause stavy
        DOM.audioPlayer.addEventListener('play', () => {
            updateButtonActiveStates(true);
            window.audioState.isRecovering = false; // Pokud hrajeme, nejsme v recovery
        });
        DOM.audioPlayer.addEventListener('pause', () => updateButtonActiveStates(false));
        
        // 3. Detekce "Zamrznutí" (Stalled/Waiting)
        DOM.audioPlayer.addEventListener('waiting', () => {
            // "Waiting" se spouští často i při běžném seekování, takže hned nepanikaříme
            window.DebugManager?.log('StreamGuard', "⏳ Bufferuji data...");
        });

        DOM.audioPlayer.addEventListener('stalled', () => {
            // "Stalled" znamená, že data přestala téct. To je signál pro zásah!
            if (!DOM.audioPlayer.paused) {
                 StreamGuard.attemptRecovery('STALLED_DATA');
            }
        });

      // 4. Hlavní Error Handler - Stream Stabilizer převzal kontrolu
DOM.audioPlayer.addEventListener('error', (e) => {
    // Stabilizer už to řeší automaticky přes event listener
    // Zde jen logujeme pro debug
    window.DebugManager?.log('main', '⚠️ Error event - Stabilizer aktivován');
});

        // 5. Konec skladby (Looping vs Next)
       // 5. Konec skladby (Looping vs Next) - ARCHITECT EDITION (ZERO COMPRESSION)
DOM.audioPlayer.addEventListener('ended', async () => {
    // ✅ OPRAVENO: Název funkce bez překlepu
    updateButtonActiveStates(false);
     

    if (DOM.audioPlayer.loop) {
        // Smyčka: tvůj původní funkční reload
        playTrack(currentTrackIndex);
    } else {
        playNextTrack();
    }
    
    await debounceSaveAudioData();
});
    }

    // --- Klávesové zkratky ---
    document.addEventListener('keydown', async e => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        let preventDefault = true;
        switch (e.code) {
            case 'Space':
            case 'KeyP':
                if (DOM.audioPlayer?.paused) DOM.playButton?.click();
                else DOM.pauseButton?.click();
                break;
            case 'ArrowLeft': DOM.prevButton?.click(); break;
            case 'ArrowRight': DOM.nextButton?.click(); break;
            case 'KeyM': DOM.muteButton?.click(); break;
            case 'KeyL': DOM.loopButton?.click(); break;
            case 'KeyS':
                if (DOM.audioPlayer) {
                    DOM.audioPlayer.pause();
                    DOM.audioPlayer.currentTime = 0;
                    updateButtonActiveStates(false);
                }
                break;
            case 'KeyR': DOM.resetButton?.click(); break;
            case 'KeyF': DOM.fullscreenToggle?.click(); break;
            case 'KeyA':
                if (DOM.volumeSlider) {
                    DOM.volumeSlider.value = Math.max(0, parseFloat(DOM.volumeSlider.value) - 0.05);
                    DOM.volumeSlider.dispatchEvent(new Event('input'));
                }
                break;
            case 'KeyD':
                if (DOM.volumeSlider) {
                    DOM.volumeSlider.value = Math.min(1, parseFloat(DOM.volumeSlider.value) + 0.05);
                    DOM.volumeSlider.dispatchEvent(new Event('input'));
                }
                break;
            case 'KeyB': DOM.favoritesButton?.click(); break;
            case 'ArrowUp': DOM.playlist.scrollTop -= 50; break;
            case 'ArrowDown': DOM.playlist.scrollTop += 50; break;
            
            // Preloader Debug
            case 'KeyC':
                if (window.audioPreloader) {
                    window.audioPreloader.logStats();
                    window.showNotification('Cache statistiky v konzoli', 'info', 2000);
                }
                break;
            case 'KeyX':
                if (window.audioPreloader && confirm('Vymazat cache?')) {
                    window.audioPreloader.clearCache();
                    window.showNotification('Cache vymazána!', 'info', 2000);
                }
                break;
            case 'KeyZ': 
                if (window.audioPreloader) {
                    const novyStav = !window.audioPreloader.isEnabled;
                    window.audioPreloader.setEnabled(novyStav);
                    window.showNotification(`Preloader ${novyStav ? 'ZAPNUT' : 'VYPNUT'}`, 'info', 2000);
                }
                break;
                  
            default: preventDefault = false;
        }
        if (preventDefault) e.preventDefault();
    });
}

// --- Menu Oblíbených ---
DOM.favoritesButton.id = 'favorites-button';
DOM.favoritesButton.className = 'control-button';
DOM.favoritesButton.title = 'Oblíbené skladby (B)';
DOM.favoritesButton.textContent = '⭐';
if (document.querySelector('#control-panel .controls')) {
    document.querySelector('#control-panel .controls').appendChild(DOM.favoritesButton);
}

DOM.favoritesMenu.className = 'favorites-menu';
DOM.favoritesMenu.innerHTML = '<h3>Oblíbené skladby</h3><div id="favorites-list" class="playlist"></div>';
document.body.appendChild(DOM.favoritesMenu);

function updateFavoritesMenu() {
    const favoritesList = DOM.favoritesMenu.querySelector('#favorites-list');
    if (!favoritesList) return;
    favoritesList.innerHTML = '';
    if (!favorites.length) {
        favoritesList.innerHTML = '<div class="playlist-item" style="justify-content: center;">Žádné oblíbené</div>';
        return;
    }
    const fragment = document.createDocumentFragment();
    favorites.forEach(title => {
        const originalTrack = originalTracks.find(t => t.title === title);
        if (!originalTrack) return;
        const item = document.createElement('div');
        item.className = 'playlist-item';
        const titleSpan = document.createElement('span');
        titleSpan.textContent = title;
        item.appendChild(titleSpan);
        const removeBtn = document.createElement('button');
        removeBtn.className = 'favorite-remove favorite-button';
        removeBtn.textContent = '🗑️';
        removeBtn.onclick = async e => {
            e.stopPropagation();
            await toggleFavorite(title);
        };
        item.appendChild(removeBtn);
        item.addEventListener('click', () => {
            const idx = originalTracks.indexOf(originalTrack);
            if (idx !== -1) {
                playTrack(idx);
                DOM.favoritesMenu.style.display = 'none';
                DOM.favoritesButton.classList.remove('active');
            }
        });
        fragment.appendChild(item);
    });
    favoritesList.appendChild(fragment);
}

DOM.favoritesButton?.addEventListener('click', async e => {
    e.stopPropagation();
    if (DOM.favoritesMenu.style.display === 'none' || !DOM.favoritesMenu.style.display) {
        await updateFavoritesMenu();
        DOM.favoritesMenu.style.display = 'block';
        DOM.favoritesButton.classList.add('active');
    } else {
        DOM.favoritesMenu.style.display = 'none';
        DOM.favoritesButton.classList.remove('active');
    }
});

document.addEventListener('click', e => {
    if (DOM.favoritesMenu && !DOM.favoritesMenu.contains(e.target) && e.target !== DOM.favoritesButton) {
        DOM.favoritesMenu.style.display = 'none';
        DOM.favoritesButton?.classList.remove('active');
    }
});

// --- Inicializace systému ---
if (DOM.syncStatus) setTimeout(() => DOM.syncStatus.style.display = 'none', 6000);

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Firebase
    const firebaseInitialized = await window.initializeFirebaseAppAudio?.();
    if (!firebaseInitialized) {
        window.showNotification("Kritická chyba: Nelze se připojit k databázi.", 'error');
    }
    
    // 2. Background Manager
    if (window.BackgroundManager) await window.BackgroundManager.init();
    
    // 3. Načtení dat (čeká na myPlaylist.js a cloud)
    await loadAudioData();
    
    // 4. Preloader start
    if (window.audioPreloader && currentPlaylist.length > 0) {
        try {
            await window.preloadTracks(currentPlaylist, currentTrackIndex, isShuffled, shuffledIndices);
        } catch (e) { console.error(e); }
    }
    
    // 5. UI Finalizace
    if (DOM.playlist) DOM.playlist.classList.add('hidden');
    populatePlaylist(currentPlaylist);
    updateVolumeDisplayAndIcon();
    updateButtonActiveStates(false);
    
    if (currentPlaylist.length > 0 && DOM.audioPlayer && DOM.audioSource && DOM.trackTitle) {
        DOM.audioSource.src = currentPlaylist[currentTrackIndex].src;
        DOM.trackTitle.textContent = currentPlaylist[currentTrackIndex].title;
        DOM.audioPlayer.load();
    } else if (DOM.trackTitle) {
        DOM.trackTitle.textContent = "Playlist je prázdný";
    }
    
    updateActiveTrackVisuals();
    // restorePreviousSettings(); <--- TOTO ZDE UŽ NENÍ (Řídí to nový modul)
    addEventListeners();
    
    setTimeout(() => {
        if (DOM.playlist) {
            DOM.playlist.classList.remove('hidden');
            if (DOM.playlist.style.display === 'none') DOM.playlist.style.display = 'block';
        }
    }, 100);
    
    // Browser Info
    if(document.getElementById('browser-info')) {
        document.getElementById('browser-info').textContent = detectBrowser(); // před Star Trek OS v8.0
    }
    const status = document.getElementById('browser-status');
    if(status) {
        status.style.transform = 'translateX(-300px)';
        setTimeout(() => status.style.transform = 'translateX(0)', 100);
    }
});

// Indikátor preloaderu (Blesk)
window.addEventListener('track-preloaded', (e) => {
    const { src } = e.detail;
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        if (item.dataset.originalSrc === src) {
            const titleSpan = item.querySelector('.track-title');
            if (!titleSpan) return;
            const old = titleSpan.querySelectorAll('.preload-indicator');
            old.forEach(ind => ind.remove());
            
            const indicator = document.createElement('span');
            indicator.className = 'preload-indicator';
            indicator.textContent = '⚡';
            indicator.style.color = '#00ff00';
            indicator.style.marginLeft = '5px';
            indicator.style.fontSize = '0.8em';
            titleSpan.appendChild(indicator);
            
            setTimeout(() => indicator.remove(), 3000);
        }
    });
});

// Performance Monitor
let frameCount = 0;
let lastFpsUpdate = Date.now();
function monitorPerformance() {
    frameCount++;
    const now = Date.now();
    if (now - lastFpsUpdate > 5000) {
        const fps = Math.round((frameCount / 5) * 10) / 10;
        const perfEl = document.getElementById('perfMode');
        if (perfEl) perfEl.textContent = '⚡ Stabilita  | ' + fps + ' FPS';
        frameCount = 0;
        lastFpsUpdate = now;
    }
    requestAnimationFrame(monitorPerformance);
}
monitorPerformance();

// Export funkcí pro Voice Control
window.playTrack = playTrack;
window.playNextTrack = playNextTrack;
window.playPrevTrack = playPrevTrack;
window.populatePlaylist = populatePlaylist; 
window.updateActiveTrackVisuals = updateActiveTrackVisuals;
 
 
     // ⏱️ LOG END
console.log(`%c🚀 [CORE] Načteno za ${(performance.now() - __CORE_START).toFixed(2)} ms`, 'background: #000; color: #00ff00; font-weight: bold; padding: 2px;');
})();








