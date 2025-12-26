(function() {
    'use strict';

// 🔇 Starý přepínač odstraněn - nyní řízeno přes DebugManager (klíč 'main')
// const DEBUG_MODE = false; 

// --- Cachování DOM elementů ---
const DOM = {
    audioPlayer: document.getElementById('audioPlayer'),
    audioSource: document.getElementById('audioSource'),
    trackTitle: document.getElementById('trackTitle'),
    progressBar: document.getElementById('progress-bar'),
    currentTime: document.getElementById('currentTime')?.querySelectorAll('.time-part'),
    duration: document.getElementById('duration')?.querySelectorAll('.time-part'),
    playButton: document.getElementById('play-button'),
    pauseButton: document.getElementById('pause-button'),
    prevButton: document.getElementById('prev-button'),
    nextButton: document.getElementById('next-button'),
    loopButton: document.getElementById('loop-button'),
    shuffleButton: document.getElementById('shuffle-button'),
    resetButton: document.getElementById('reset-button'),
    fullscreenToggle: document.getElementById('fullscreen-toggle'),
    toggleInfo: document.getElementById('toggle-info-button'),
    reloadButton: document.getElementById('reload-button'),
    togglePlaylist: document.getElementById('toggle-playlist-button'),
    playlist: document.getElementById('playlist'),
    popisky: document.getElementById('popisky'),
    volumeSlider: document.getElementById('volume-slider'),
    volumeValue: document.getElementById('volume-value'),
    muteButton: document.getElementById('mute-button'),
    clock: {
        hours: document.querySelector('.time .hours'),
        minutes: document.querySelector('.time .minutes'),
        seconds: document.querySelector('.time .seconds')
    },
    currentDate: document.getElementById('currentDate'),
    syncStatus: document.querySelector('.sync-status-container'),
     
    favoritesButton: document.createElement('button'),
    favoritesMenu: document.createElement('div')
};

// --- Globální proměnné ---
let currentTrackIndex = 0;
let isShuffled = false;
let shuffledIndices = [];
window.favorites = [];
let originalTracks = Array.isArray(window.tracks) ? [...window.tracks] : [];
let currentPlaylist = [...originalTracks];
let playlistVisible = true;
let timerInterval = null;
let timerValueInSeconds = 15 * 60;
let isTimerRunning = false;

// --- Debouncing pro saveAudioData ---
let saveTimeout = null;
function debounceSaveAudioData() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveAudioData, 500);
}

// --- Inicializace window.tracks ---
if (!Array.isArray(window.tracks)) {
    // Logování přes DebugManager, pokud by bylo potřeba
    // window.DebugManager?.log('main', "audioPlayer.js: window.tracks není pole. Inicializuji jako prázdné.");
    window.tracks = []; 
}

// --- showNotification ---
window.showNotification = function(message, type = 'info', duration = 3000) {
    window.DebugManager?.log('main', `[${type.toUpperCase()}] ${message}`);
    
    if (!DOM.notification) {
        // Použijeme standardní console.warn jen pokud je DebugManager zapnutý pro main
        if (window.DebugManager?.isEnabled('main')) {
            console.warn(`showNotification: #notification nenalezen. Zpráva: ${message}`);
        }
        return;
    }
    DOM.notification.textContent = message;
    DOM.notification.style.display = 'block';
    DOM.notification.style.backgroundColor = type === 'error' ? '#dc3545' : type === 'warn' ? '#ffc107' : '#28a745';
    setTimeout(() => DOM.notification.style.display = 'none', duration);
};

// --- checkAndFixTracks ---
function checkAndFixTracks(trackList) {
    let fixedUrls = 0;
    if (!Array.isArray(trackList)) {
        if (window.DebugManager?.isEnabled('main')) {
            console.error("checkAndFixTracks: trackList není pole.");
        }
        return;
    }
    trackList.forEach(track => {
        if (track?.src?.includes("dl=0")) {
            track.src = track.src.replace("dl=0", "dl=1");
            fixedUrls++;
        }
    });
    if (fixedUrls > 0) {
        window.DebugManager?.log('main', `checkAndFixTracks: Opraveno ${fixedUrls} URL adres.`);
    }
}

// ============================================================================
// 🛠️ loadAudioData (V7.0 - BENDER EDITION - FUNKČNÍ ORIGINÁL)
// ============================================================================
// Vychází přesně z tvého 'loadAudioData-original.js'.
// Vrací zpět globální proměnné (aby se načítal myPlaylist).
// Opravuje přepisování názvů (aby zůstalo "hovno").

async function loadAudioData() {
    window.DebugManager?.log('main', "loadAudioData: Načítám data přehrávače...");
    
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
                // ⚠️ KONFLIKT (Tady se rozhoduje o "hovnu")
                window.DebugManager?.log('main', "🔄 Playlisty se liší.");
                
                // Pokud sedí počet skladeb, znamená to, že jsi jen PŘEJMENOVÁVAL.
                // V tom případě VĚŘÍME CLOUDU!
                if (originalFileCount === cloudCount) {
                    window.DebugManager?.log('main', "👑 Počet sedí -> POUŽÍVÁM CLOUD (zachovávám tvé názvy)");
                    window.tracks = loadedPlaylist; // <--- TOTO ZACHRÁNÍ NÁZEV
                    firestoreLoaded.playlist = true;
                } else {
                    // Pokud počet nesedí (přidal jsi skladbu), musíme vzít lokál
                    window.DebugManager?.log('main', "⚠️ Nesedí počet -> Používám LOKÁL (čekám na sync)");
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
        
        // 3. OBLÍBENÉ & NASTAVENÍ (Standardní rutina)
        const loadedFavorites = await window.loadFavoritesFromFirestore?.();
        if (loadedFavorites?.length > 0) {
            favorites = [...loadedFavorites];
            firestoreLoaded.favorites = true;
        }
        
        const loadedSettings = await window.loadPlayerSettingsFromFirestore?.();
        if (loadedSettings) {
            isShuffled = loadedSettings.isShuffled ?? isShuffled;
            if (DOM.audioPlayer) {
                DOM.audioPlayer.loop = loadedSettings.loop ?? DOM.audioPlayer.loop;
                DOM.audioPlayer.volume = loadedSettings.volume ?? DOM.audioPlayer.volume;
                DOM.audioPlayer.muted = loadedSettings.muted ?? DOM.audioPlayer.muted;
                if (DOM.volumeSlider) DOM.volumeSlider.value = DOM.audioPlayer.volume;
                if (DOM.volumeValue) DOM.volumeValue.textContent = Math.round(DOM.audioPlayer.volume * 100) + '%';
            }
            currentTrackIndex = loadedSettings.currentTrackIndex ?? currentTrackIndex;
            firestoreLoaded.settings = true;
        }
        
    } catch (error) {
        window.DebugManager?.log('main', "🔧 Chyba cloudu, jedu na lokál.");
        window.tracks = originalPlaylistFromFile;
        checkAndFixTracks(window.tracks);
    }

    // 4. FALLBACKY PRO CLOUD (Když selže připojení)
    if (!firestoreLoaded.playlist && originalFileCount === 0) {
        const savedPlaylist = JSON.parse(localStorage.getItem('currentPlaylist') || '[]');
        if (savedPlaylist.length > 0) window.tracks = [...savedPlaylist];
    }
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

    // 🔥 AKTUALIZACE GLOBÁLNÍCH PROMĚNNÝCH PO VŠECH KONTROLÁCH 🔥
    originalTracks = window.tracks;
    currentPlaylist = [...originalTracks];

    // 5. FINÁLNÍ VYKRESLENÍ UI
    window.DebugManager?.log('main', `🎵 HOTOVO: ${window.tracks.length} skladeb.`);
    
    if (typeof populatePlaylist === 'function') populatePlaylist(window.tracks);
    if (typeof updateActiveTrackVisuals === 'function') updateActiveTrackVisuals();
    if (typeof updateShuffleButtonVisual === 'function') updateShuffleButtonVisual();
    if (typeof updateLoopButtonVisual === 'function') updateLoopButtonVisual();
    if (typeof updateTimerDisplay === 'function') updateTimerDisplay();

    // 6. SYNC A NOTIFY
    if (window.PLAYLIST_NEEDS_SYNC) {
        if (window.PlaylistSyncManager && window.PlaylistSyncManager.autoCheckOnLoad) {
             setTimeout(() => { window.PlaylistSyncManager.autoCheckOnLoad(); }, 1000);
        } else {
             setTimeout(async () => {
                 if(window.savePlaylistToFirestore) await window.savePlaylistToFirestore(window.tracks);
                 window.PLAYLIST_NEEDS_SYNC = false;
             }, 2000);
        }
    } else if (!firestoreLoaded.playlist) {
        if(typeof debounceSaveAudioData === 'function') await debounceSaveAudioData();
    }
    
    if (window.CaptainNotifyChange) window.CaptainNotifyChange();
}

// --- saveAudioData ---
async function saveAudioData() {
    window.DebugManager?.log('main', "saveAudioData: Ukládám data přehrávače.");
    localStorage.setItem('currentPlaylist', JSON.stringify(window.tracks));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('playerSettings', JSON.stringify({
        currentTrackIndex,
        isShuffled,
        loop: DOM.audioPlayer?.loop ?? false,
        volume: DOM.audioPlayer?.volume ?? 0.5,
        muted: DOM.audioPlayer?.muted ?? false
    }));

    try {
        await window.savePlaylistToFirestore?.(window.tracks);
        await window.saveFavoritesToFirestore?.(favorites);
        await window.savePlayerSettingsToFirestore?.({
            currentTrackIndex,
            isShuffled,
            loop: DOM.audioPlayer?.loop ?? false,
            volume: DOM.audioPlayer?.volume ?? 0.5,
            muted: DOM.audioPlayer?.muted ?? false
        });
        window.DebugManager?.log('main', "saveAudioData: Data uložena do Firestore.");
    } catch (error) {
        if (window.DebugManager?.isEnabled('main')) {
            console.error("saveAudioData: Chyba při ukládání do Firestore:", error);
        }
        window.showNotification("Chyba při ukládání dat do cloudu!", 'error');
    }
}

// --- clearAllAudioPlayerData ---
window.clearAllAudioPlayerData = async function() {
    window.DebugManager?.log('main', "clearAllAudioPlayerData: Spouštím mazání dat.");
    if (!confirm('⚠️ OPRAVDU chcete smazat VŠECHNA data přehrávače?')) {
        window.DebugManager?.log('main', "clearAllAudioPlayerData: Mazání zrušeno (1. fáze).");
        return;
    }
    if (!confirm('⚠️ JSTE SI ABSOLUTNĚ JISTI? Data budou nenávratně ztracena!')) {
        window.DebugManager?.log('main', "clearAllAudioPlayerData: Mazání zrušeno (2. fáze).");
        return;
    }

    localStorage.removeItem('currentPlaylist');
    localStorage.removeItem('favorites');
    localStorage.removeItem('playerSettings');
    try {
        await window.clearAllAudioFirestoreData?.();
        window.DebugManager?.log('main', "clearAllAudioPlayerData: Data smazána z Firestore.");
    } catch (error) {
        if (window.DebugManager?.isEnabled('main')) {
            console.error("clearAllAudioPlayerData: Chyba při mazání z Firestore:", error);
        }
        window.showNotification("Chyba při mazání dat z cloudu!", 'error');
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
    if (currentPlaylist.length > 0 && DOM.audioPlayer && DOM.audioSource && DOM.trackTitle) {
        DOM.audioSource.src = currentPlaylist[currentTrackIndex].src;
        DOM.trackTitle.textContent = currentPlaylist[currentTrackIndex].title;
        DOM.audioPlayer.load();
    } else if (DOM.trackTitle) {
        DOM.trackTitle.textContent = "Playlist je prázdný";
    }
    updateActiveTrackVisuals();
    window.showNotification('Všechna data přehrávače smazána!', 'info', 3000);
};

// --- Pomocné funkce ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (DOM.clock.hours && DOM.clock.hours.textContent !== hours) DOM.clock.hours.textContent = hours;
    if (DOM.clock.minutes && DOM.clock.minutes.textContent !== minutes) DOM.clock.minutes.textContent = minutes;
    if (DOM.clock.seconds && DOM.clock.seconds.textContent !== seconds) DOM.clock.seconds.textContent = seconds;
    if (DOM.currentDate) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' };
        DOM.currentDate.textContent = now.toLocaleDateString('cs-CZ', options);
    }
}
setInterval(updateClock, 1000);

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
    DOM.currentTime[0].textContent = formattedCurrent.hours;
    DOM.currentTime[1].textContent = formattedCurrent.minutes;
    DOM.currentTime[2].textContent = formattedCurrent.seconds;
    DOM.duration[0].textContent = formattedDuration.hours;
    DOM.duration[1].textContent = formattedDuration.minutes;
    DOM.duration[2].textContent = formattedDuration.seconds;
    if (!isNaN(duration) && duration > 0) {
        DOM.progressBar.value = (currentTime / duration) * 100;
    } else {
        DOM.progressBar.value = 0;
    }
}

function populatePlaylist(listToDisplay) {
    if (!DOM.playlist) {
        if (window.DebugManager?.isEnabled('main')) {
            console.warn("populatePlaylist: Playlist nenalezen.");
        }
        return;
    }
    if (!DOM.playlist.classList.contains('hidden')) DOM.playlist.classList.add('hidden');
    DOM.playlist.innerHTML = '';
    
    if (!listToDisplay?.length) {
        DOM.playlist.innerHTML = '<div class="playlist-item" style="justify-content: center; cursor: default;">Žádné skladby v playlistu</div>';
    } else {
        const fragment = document.createDocumentFragment();
        
        listToDisplay.forEach((track, index) => {
            // 1. Získání indexu (z globální proměnné originalTracks - řádek 46 tvého scriptu)
            const originalIndex = originalTracks.findIndex(ot => ot.title === track.title && ot.src === track.src);

            // =================================================================
            // 🎯 NOVÁ SEKCE: VLOŽENÍ NADPISU KAPITOLY
            // =================================================================
            if (window.playlistSections && originalIndex !== -1) {
                const section = window.playlistSections.find(s => s.start === originalIndex);
                
                if (section) {
                    const header = document.createElement('div');
                    header.className = 'playlist-section-header';
                    header.textContent = section.name;
                    header.style.cssText = `
                        padding: 12px 15px;
                        background: linear-gradient(135deg, rgba(0, 120, 215, 0.4), rgba(0, 212, 255, 0.2));
                        color: #00d4ff;
                        font-weight: bold;
                        font-size: 1.1em;
                        text-align: center;
                        margin: 8px 0;
                        border-radius: 8px;
                        border-left: 4px solid #00d4ff;
                        cursor: default;
                        user-select: none;
                        text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    `;
                    fragment.appendChild(header);
                }
            }
            // =================================================================

            // 2. Vytvoření položky skladby (Originální kód)
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.dataset.originalSrc = track.src;
            
            if (originalIndex === currentTrackIndex && DOM.audioPlayer && !DOM.audioPlayer.paused) {
                item.classList.add('active');
            }
            
            const trackNumber = document.createElement('span');
            trackNumber.className = 'track-number';
            trackNumber.textContent = `${index + 1}.`;
            item.appendChild(trackNumber);
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'track-title';
            titleSpan.textContent = track.title;
            item.appendChild(titleSpan);
            
            if (track.duration) {
                const durationSpan = document.createElement('span');
                durationSpan.className = 'track-duration';
                durationSpan.textContent = track.duration;
                item.appendChild(durationSpan);
            }
            
            const favButton = document.createElement('button');
            favButton.className = 'favorite-button';
            favButton.title = 'Přidat/Odebrat z oblíbených';
            favButton.textContent = favorites.includes(track.title) ? '⭐' : '☆';
            favButton.onclick = async e => {
                e.stopPropagation();
                window.DebugManager?.log('main', `populatePlaylist: Favorite button clicked for "${track.title}".`);
                await toggleFavorite(track.title);
            };
            item.appendChild(favButton);
            
            item.addEventListener('click', () => {
                window.DebugManager?.log('main', `populatePlaylist: Playlist item clicked for "${track.title}".`);
                if (originalIndex !== -1) playTrack(originalIndex);
            });
            
            fragment.appendChild(item);
        });
        
        DOM.playlist.appendChild(fragment);
    }
    
    // UI aktualizace (původní logika)
    updateActiveTrackVisuals();

    // 🚀 KAPITÁNSKÝ ROZKAZ: Barevná synchronizace
    if (window.applyEverything) {
        window.applyEverything();
    }

    setTimeout(() => {
        DOM.playlist.classList.remove('hidden');
        if (DOM.playlist.style.display === 'none') DOM.playlist.style.display = 'block';
    }, 50);
}

function playTrack(originalIndex) {
    if (!originalTracks || originalIndex < 0 || originalIndex >= originalTracks.length) {
        if (window.DebugManager?.isEnabled('main')) {
            console.error("playTrack: Neplatný index nebo prázdný playlist.", originalIndex);
        }
        return;
    }
    currentTrackIndex = originalIndex;
    const track = originalTracks[currentTrackIndex];
    if (!DOM.audioSource || !DOM.trackTitle || !DOM.audioPlayer) {
        if (window.DebugManager?.isEnabled('main')) {
            console.error("playTrack: Chybí HTML elementy.");
        }
        return;
    }
    
    // 🚀 PRELOADER - Použij cache, pokud existuje
    let audioUrl = track.src;
    if (window.audioPreloader?.isCached(track.src)) {
        const cachedUrl = window.audioPreloader.createObjectURL(track.src);
        if (cachedUrl) {
            audioUrl = cachedUrl;
            window.DebugManager?.log('main', '⚡ Použita cached verze:', track.title);
        }
    }
    
    DOM.audioSource.src = audioUrl;
    DOM.trackTitle.textContent = track.title;
    DOM.audioPlayer.load();
    
    DOM.audioPlayer.play().then(async () => {
        window.DebugManager?.log('main', "playTrack: Přehrávání:", track.title);
        updateButtonActiveStates(true);
        updateActiveTrackVisuals();
        
        // 🚀 PRELOADER - Přednahraj další skladby
        if (window.audioPreloader) {
            window.preloadTracks(
                originalTracks, 
                currentTrackIndex, 
                isShuffled, 
                shuffledIndices
            ).catch(err => console.warn('⚠️ Preload error:', err));
        }
        
        await debounceSaveAudioData();
    }).catch(error => {
        if (window.DebugManager?.isEnabled('main')) {
            console.error('playTrack: Chyba při přehrávání:', error);
        }
        window.showNotification(`Chyba při přehrávání: ${track.title}.`, 'error');
        updateButtonActiveStates(false);
    });
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
    if (!originalTracks?.length) {
        if (window.DebugManager?.isEnabled('main')) {
            console.warn("playNextTrack: Playlist je prázdný.");
        }
        window.showNotification("Nelze přehrát další skladbu, playlist je prázdný.", 'warn');
        return;
    }
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
    if (!originalTracks?.length) {
        if (window.DebugManager?.isEnabled('main')) {
            console.warn("playPrevTrack: Playlist je prázdný.");
        }
        window.showNotification("Nelze přehrát předchozí skladbu, playlist je prázdný.", 'warn');
        return;
    }
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
    if (!originalTracks?.length) {
        shuffledIndices = [];
        if (window.DebugManager?.isEnabled('main')) {
            console.warn("generateShuffledIndices: Playlist je prázdný.");
        }
        return;
    }
    shuffledIndices = Array.from({ length: originalTracks.length }, (_, i) => i).filter(i => i !== currentTrackIndex);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    
    // 🚀 PRELOADER - Přednahraj při shuffle
    if (window.audioPreloader && isShuffled) {
        window.preloadTracks(
            originalTracks, 
            currentTrackIndex, 
            true, 
            shuffledIndices
        ).catch(err => console.warn('⚠️ Preload error:', err));
    }
}

function updateButtonActiveStates(isPlaying) {
    if (DOM.playButton) DOM.playButton.classList.toggle('active', isPlaying);
    if (DOM.pauseButton) DOM.pauseButton.classList.toggle('active', !isPlaying);
}

window.toggleFavorite = async function(trackTitle) {
    const indexInFavorites = favorites.indexOf(trackTitle);
    if (indexInFavorites === -1) {
        favorites.push(trackTitle);
    } else {
        favorites.splice(indexInFavorites, 1);
    }
    await debounceSaveAudioData();
    populatePlaylist(currentPlaylist);
    updateFavoritesMenu();
};

// --- Event Listenery ---
function addEventListeners() {
    DOM.playButton?.addEventListener('click', () => {
        if (DOM.audioPlayer && DOM.audioSource.src && DOM.audioSource.src !== window.location.href) {
            DOM.audioPlayer.play().then(() => updateButtonActiveStates(true)).catch(e => {
                if (window.DebugManager?.isEnabled('main')) {
                    console.error("Play error:", e);
                }
            });
        } else if (originalTracks.length > 0) {
            playTrack(currentTrackIndex);
        } else {
            window.showNotification("Nelze přehrát, playlist je prázdný.", 'warn');
        }
    });

    DOM.pauseButton?.addEventListener('click', () => {
        if (DOM.audioPlayer) DOM.audioPlayer.pause();
        updateButtonActiveStates(false);
    });

    DOM.prevButton?.addEventListener('click', playPrevTrack);
    DOM.nextButton?.addEventListener('click', playNextTrack);

    DOM.loopButton?.addEventListener('click', async () => {
        if (DOM.audioPlayer) DOM.audioPlayer.loop = !DOM.audioPlayer.loop;
        DOM.loopButton.classList.toggle('active', DOM.audioPlayer?.loop);
        DOM.loopButton.title = DOM.audioPlayer?.loop ? "Opakování zapnuto" : "Opakování vypnuto";
        await debounceSaveAudioData();
    });

    DOM.shuffleButton?.addEventListener('click', async () => {
        isShuffled = !isShuffled;
        DOM.shuffleButton.classList.toggle('active', isShuffled);
        DOM.shuffleButton.title = isShuffled ? "Náhodné přehrávání zapnuto" : "Náhodné přehrávání vypnuto";
        if (isShuffled) generateShuffledIndices();
        await debounceSaveAudioData();
    });

    DOM.resetButton?.addEventListener('click', async () => {
        if (DOM.audioPlayer) {
            DOM.audioPlayer.currentTime = 0;
            if (!DOM.audioPlayer.paused) DOM.audioPlayer.play().catch(e => {
                if (window.DebugManager?.isEnabled('main')) {
                    console.error("Play error on reset:", e);
                }
            });
        }
        await debounceSaveAudioData();
    });

    DOM.fullscreenToggle?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                if (window.DebugManager?.isEnabled('main')) {
                    console.error("Fullscreen error:", err);
                }
            });
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        DOM.fullscreenToggle?.classList.toggle('active', !!document.fullscreenElement);
        DOM.fullscreenToggle.title = document.fullscreenElement ? "Ukončit celou obrazovku (F)" : "Celá obrazovka (F)";
        adjustPlaylistHeight(!!document.fullscreenElement);
    });

    DOM.toggleInfo?.addEventListener('click', () => {
        if (DOM.popisky) DOM.popisky.style.display = DOM.popisky.style.display === 'none' ? 'block' : 'none';
    });

    DOM.reloadButton?.addEventListener('click', () => window.location.reload());

    DOM.togglePlaylist?.addEventListener('click', () => {
        playlistVisible = !playlistVisible;
        DOM.playlist.style.display = playlistVisible ? 'block' : 'none';
        DOM.togglePlaylist.classList.toggle('active', playlistVisible);
        DOM.togglePlaylist.title = playlistVisible ? "Skrýt playlist" : "Zobrazit playlist";
        if (playlistVisible) updateActiveTrackVisuals();
    });

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
        await debounceSaveAudioData();
    });

    // ═══════════════════════════════════════════════════════════════════
// 🚀 KOMPLETNÍ AUDIO LISTENER SEKCE - READY TO PASTE
// Autor opravy: Admirál Claude.AI
// Architekt projektu: Více admirál Jiřík
// Verze: 2.0 - Auto-Recovery Edition
// ═══════════════════════════════════════════════════════════════════
// ⚠️ INSTRUKCE:
// 1. Najdi v script.js tento blok (cca řádek 790):
//    DOM.audioPlayer.addEventListener('play', () => ...
//    ...až po závěrečnou })
// 2. SMAŽ celou tu sekci (včetně if (DOM.audioPlayer) { ... })
// 3. Zkopíruj VŠECHNO odtud dolů a vlož na to místo
// ═══════════════════════════════════════════════════════════════════

// 🔧 Globální proměnné pro retry mechanismus (musí být PŘED if blokem!)
let audioErrorCount = 0;
let lastErrorTime = 0;
let currentRetryAttempt = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000;

// ═══════════════════════════════════════════════════════════════════
// 🎧 HLAVNÍ BLOK AUDIO LISTENERŮ
// ═══════════════════════════════════════════════════════════════════

if (DOM.audioPlayer) {
    // ═══════════════════════════════════════════════════════════════
    // 📢 VOLUME CHANGE LISTENER (původní)
    // ═══════════════════════════════════════════════════════════════
    DOM.audioPlayer.addEventListener('volumechange', updateVolumeDisplayAndIcon);
    
    // ═══════════════════════════════════════════════════════════════
    // ⏱️ TIME UPDATE LISTENERS (původní)
    // ═══════════════════════════════════════════════════════════════
    DOM.audioPlayer.addEventListener('timeupdate', updateTrackTimeDisplay);
    DOM.audioPlayer.addEventListener('loadedmetadata', updateTrackTimeDisplay);
    
    // ═══════════════════════════════════════════════════════════════
    // ⏹️ ENDED LISTENER (původní)
    // ═══════════════════════════════════════════════════════════════
    DOM.audioPlayer.addEventListener('ended', async () => {
        updateButtonActiveStates(false);
        
        if (!DOM.audioPlayer.loop) {
            playNextTrack();
            
            // 🚀 PRELOADER - Přednahraj při konci skladby
            if (window.audioPreloader) {
                setTimeout(() => {
                    window.preloadTracks(
                        originalTracks, 
                        currentTrackIndex, 
                        isShuffled, 
                        shuffledIndices
                    ).catch(err => console.warn('⚠️ Preload error:', err));
                }, 500);
            }
        }
        
        await debounceSaveAudioData();
    });
    
    // ═══════════════════════════════════════════════════════════════
    // ▶️ PLAY LISTENER (původní)
    // ═══════════════════════════════════════════════════════════════
    DOM.audioPlayer.addEventListener('play', () => updateButtonActiveStates(true));
    
    // ═══════════════════════════════════════════════════════════════
    // ⏸️ PAUSE LISTENER (původní)
    // ═══════════════════════════════════════════════════════════════
    DOM.audioPlayer.addEventListener('pause', () => updateButtonActiveStates(false));
    
    // ═══════════════════════════════════════════════════════════════
    // 🔴 ERROR LISTENER (NOVÝ - VYLEPŠENÝ)
    // ═══════════════════════════════════════════════════════════════
    DOM.audioPlayer.addEventListener('error', async (e) => {
        const audio = e.target;
        const error = audio.error;
        const currentTime = Date.now();
        
        // 📊 Detekce typu chyby
        let errorType = "UNKNOWN";
        let errorMessage = "Neznámá chyba";
        let canRetry = false;
        
        if (error) {
            switch(error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    errorType = "ABORTED";
                    errorMessage = "Přehrávání přerušeno";
                    canRetry = false;
                    break;
                    
                case MediaError.MEDIA_ERR_NETWORK:
                    errorType = "NETWORK";
                    errorMessage = "Ztráta síťového spojení";
                    canRetry = true;
                    break;
                    
                case MediaError.MEDIA_ERR_DECODE:
                    errorType = "DECODE";
                    errorMessage = "Poškozený audio soubor";
                    canRetry = true;
                    break;
                    
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorType = "NOT_SUPPORTED";
                    errorMessage = "Nepodporovaný formát nebo chybí soubor";
                    canRetry = false;
                    break;
            }
        }
        
        // 📍 Info o aktuální skladbě
        const currentTrack = originalTracks[currentTrackIndex];
        const trackInfo = currentTrack ? currentTrack.title : 'neznámá skladba';
        const trackUrl = DOM.audioSource?.src || 'neznámá URL';
        
        // 🔍 Detailní log
        window.DebugManager?.log('main', `
╔═══════════════════════════════════════════════════════════════
║ 🔴 AUDIO CHYBA DETEKOVÁNA
╠═══════════════════════════════════════════════════════════════
║ 🎵 Skladba: ${trackInfo}
║ 🔢 Index: ${currentTrackIndex + 1}/${originalTracks.length}
║ ⚠️  Typ: ${errorType} (kod: ${error?.code || 'N/A'})
║ 💬 Zpráva: ${errorMessage}
║ 🔗 URL: ${trackUrl.substring(0, 80)}...
║ 🔄 Pokus: ${currentRetryAttempt + 1}/${MAX_RETRY_ATTEMPTS}
║ 🕐 Čas: ${new Date().toLocaleTimeString('cs-CZ')}
╚═══════════════════════════════════════════════════════════════
        `);
        
        // 🛡️ ANTI-SPAM OCHRANA
        if (currentTime - lastErrorTime < 1000) {
            audioErrorCount++;
            if (audioErrorCount > 5) {
                window.DebugManager?.log('main', '⛔ KRITICKÁ CHYBA: Příliš mnoho chyb za sebou!');
                window.showNotification('⛔ Kritická chyba přehrávače. Zkuste reload stránky.', 'error', 8000);
                if (DOM.audioPlayer) DOM.audioPlayer.pause();
                updateButtonActiveStates(false);
                return;
            }
        } else {
            audioErrorCount = 0;
        }
        lastErrorTime = currentTime;
        
        // 🔄 RETRY MECHANISMUS
        if (canRetry && currentRetryAttempt < MAX_RETRY_ATTEMPTS) {
            currentRetryAttempt++;
            
            window.showNotification(
                `⏳ Obnova spojení... (pokus ${currentRetryAttempt}/${MAX_RETRY_ATTEMPTS})`,
                'warn',
                RETRY_DELAY
            );
            
            window.DebugManager?.log('main', `🔄 Zkouším znovu načíst skladbu za ${RETRY_DELAY/1000}s...`);
            
            setTimeout(() => {
                if (!DOM.audioPlayer || !DOM.audioSource) return;
                
                window.DebugManager?.log('main', `🔄 Reload skladby od začátku`);
                
                DOM.audioSource.src = trackUrl;
                DOM.audioPlayer.load();
                
                DOM.audioPlayer.play()
                    .then(() => {
                        window.DebugManager?.log('main', '✅ Přehrávání úspěšně obnoveno!');
                        window.showNotification('✅ Spojení obnoveno!', 'info', 2000);
                        currentRetryAttempt = 0;
                        audioErrorCount = 0;
                        updateButtonActiveStates(true);
                    })
                    .catch(retryError => {
                        window.DebugManager?.log('main', `❌ Retry selhal: ${retryError.message}`);
                    });
                    
            }, RETRY_DELAY);
            
        } else {
            if (currentRetryAttempt >= MAX_RETRY_ATTEMPTS) {
                window.showNotification(
                    `⏭️ Skladba "${trackInfo}" nedostupná. Přeskakuji...`,
                    'error',
                    3000
                );
                window.DebugManager?.log('main', '⏭️ Retry vyčerpány, přeskakuji na další skladbu...');
            } else {
                window.showNotification(
                    `❌ ${errorMessage}: "${trackInfo}"`,
                    'error',
                    3000
                );
            }
            
            currentRetryAttempt = 0;
            audioErrorCount = 0;
            
            setTimeout(() => {
                window.DebugManager?.log('main', '▶️ Přehrávám další skladbu...');
                if (typeof playNextTrack === 'function') {
                    playNextTrack();
                }
            }, 2000);
        }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // ✅ CANPLAY LISTENER (NOVÝ - pro retry monitoring)
    // ═══════════════════════════════════════════════════════════════
    DOM.audioPlayer.addEventListener('canplay', () => {
        if (currentRetryAttempt > 0) {
            window.DebugManager?.log('main', '✅ Skladba úspěšně načtena po retry!');
            currentRetryAttempt = 0;
            audioErrorCount = 0;
        }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 🎵 LOADSTART LISTENER (NOVÝ - reset retry counteru)
    // ═══════════════════════════════════════════════════════════════
    DOM.audioPlayer.addEventListener('loadstart', () => {
        currentRetryAttempt = 0;
        window.DebugManager?.log('main', '🎵 Nová skladba - retry counter resetován');
    });
}

// ═══════════════════════════════════════════════════════════════════
// 📡 MONITORING SÍŤOVÉHO STAVU (MIMO if blok!)
// ═══════════════════════════════════════════════════════════════════

window.addEventListener('online', () => {
    window.DebugManager?.log('main', '🌐 Internetové spojení obnoveno!');
    window.showNotification('🌐 Internetové spojení obnoveno', 'info', 2000);
    
    if (DOM.audioPlayer?.paused && DOM.audioSource?.src) {
        setTimeout(() => {
            DOM.audioPlayer.play().catch(e => {
                window.DebugManager?.log('main', `⚠️ Auto-play po reconnect selhal: ${e.message}`);
            });
        }, 500);
    }
});

window.addEventListener('offline', () => {
    window.DebugManager?.log('main', '⚠️ Ztráta internetového spojení!');
    window.showNotification('⚠️ Ztráta internetového spojení', 'warn', 3000);
});

// ═══════════════════════════════════════════════════════════════════
// 🖖 KONEC AUDIO LISTENER SEKCE
// ═══════════════════════════════════════════════════════════════════

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
                    await debounceSaveAudioData();
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
            case 'KeyT': DOM.timer.button?.click(); break;
            case 'ArrowUp': DOM.playlist.scrollTop -= 50; break;
            case 'ArrowDown': DOM.playlist.scrollTop += 50; break;
            
            // 🚀 PRELOADER - Debug statistiky (klávesa C)
            case 'KeyC':
                if (window.audioPreloader) {
                    window.audioPreloader.logStats();
                    window.showNotification('Cache statistiky v konzoli', 'info', 2000);
                }
                break;
            
            // 🚀 PRELOADER - Vyčistit cache (klávesa X)
            case 'KeyX':
                if (window.audioPreloader && confirm('Vymazat cache přednahraných skladeb?')) {
                    window.audioPreloader.clearCache();
                    window.showNotification('Cache vymazána!', 'info', 2000);
                }
                break;
            
               case 'KeyZ': // Fyzická klávesa vlevo dole (u tebe "y")
    if (window.audioPreloader) {
        // Tady je to kouzlo: obrátíme aktuální stav isEnabled
        const novyStav = !window.audioPreloader.isEnabled;
        
        // Zavoláme metodu, která v preloaderu už existuje
        window.audioPreloader.setEnabled(novyStav);
        
        window.showNotification(
            `Preloader ${novyStav ? '✅ ZAPNUT' : '⏸️ VYPNUT'}`,
            'info',
            2000
        );
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
if (DOM.controlsDiv = document.querySelector('#control-panel .controls')) {
    DOM.controlsDiv.appendChild(DOM.favoritesButton);
} else if (window.DebugManager?.isEnabled('main')) {
    console.error("Element .controls nenalezen pro tlačítko oblíbených.");
}

DOM.favoritesMenu.className = 'favorites-menu';
DOM.favoritesMenu.innerHTML = '<h3>Oblíbené skladby</h3><div id="favorites-list" class="playlist"></div>';
document.body.appendChild(DOM.favoritesMenu);

function updateFavoritesMenu() {
    const favoritesList = DOM.favoritesMenu.querySelector('#favorites-list');
    if (!favoritesList) return;
    favoritesList.innerHTML = '';
    if (!favorites.length) {
        favoritesList.innerHTML = '<div class="playlist-item" style="justify-content: center; cursor: default;">Žádné oblíbené skladby</div>';
        return;
    }
    const fragment = document.createDocumentFragment();
    favorites.forEach(title => {
        const originalTrack = originalTracks.find(t => t.title === title);
        if (!originalTrack) return;
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.dataset.originalSrc = originalTrack.src;
        if (currentTrackIndex === originalTracks.indexOf(originalTrack) && DOM.audioPlayer && !DOM.audioPlayer.paused) {
            item.classList.add('active');
        }
        const titleSpan = document.createElement('span');
        titleSpan.textContent = title;
        item.appendChild(titleSpan);
        const removeBtn = document.createElement('button');
        removeBtn.className = 'favorite-remove favorite-button';
        removeBtn.title = 'Odebrat z oblíbených';
        removeBtn.textContent = '🗑️';
        removeBtn.onclick = async e => {
            e.stopPropagation();
            await toggleFavorite(title);
        };
        item.appendChild(removeBtn);
        item.addEventListener('click', () => {
            const trackToPlayIndex = originalTracks.indexOf(originalTrack);
            if (trackToPlayIndex !== -1) {
                playTrack(trackToPlayIndex);
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

// --- Device Detection a UI Adjustments ---
// ═══════════════════════════════════════════════════════════
// 🚀 ADAPTIVNÍ VÝŠKA PLAYLISTU - FINÁLNÍ VERZE 🚀
// Škálovací matice pro všechny lodní systémy
// Autor: Admirál claude.ai
// Architek projektu: Více admirál Jiřík
// Datum: 24.12.2025
// Čas:   15:10:00
// ═══════════════════════════════════════════════════════════

/**
 * Detekce typu zařízení - Opravené senzory
 */
function detectDeviceType() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // 🎯 KRITICKÁ DETEKCE
    const isWindowsDesktop = (
        userAgent.includes('windows') && 
        !userAgent.includes('mobile') && 
        !userAgent.includes('android')
    );
    
    const isAndroidMobile = (
        userAgent.includes('android') && 
        userAgent.includes('mobile')
    );
    
    const deviceInfo = {
        // 💻 LENOVO NOTEBOOK - Detekce podle Windows + rozlišení
        isLenovoNotebook: (
            isWindowsDesktop && 
            window.screen.width >= 1366 &&  // ⬅️ SNÍŽENÝ LIMIT pro laptopy
            window.screen.width <= 1920
        ),
        
        // 📱 INFINIX NOTE 30 - Tvůj mobil
        isInfinixNote30: (
            isAndroidMobile &&
            screenWidth <= 420 && 
            screenHeight >= 800
        ),
        
        // 📱 OBECNÉ MOBILNÍ ZAŘÍZENÍ
        isMobile: (
            isAndroidMobile || 
            (screenWidth <= 768 && userAgent.includes('mobile'))
        ),
        
        // 🖥️ VELKÉ DESKTOPOVÉ MONITORY
        isLargeDesktop: (
            isWindowsDesktop && 
            window.screen.width > 1920
        ),
        
        // 📊 Debug info
        windowWidth: screenWidth,
        windowHeight: screenHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        userAgent: userAgent,
        isWindowsDesktop: isWindowsDesktop,
        isAndroidMobile: isAndroidMobile
    };
    
    return deviceInfo;
}

/**
 * Nastavení výšky playlistu podle zařízení
 */
function adjustPlaylistHeight(isFullscreen = false) {
    if (!DOM.playlist) {
        console.warn('⚠️ Playlist element nenalezen!');
        return;
    }
    
    const device = detectDeviceType();
    let newHeight = '150px';
    let deviceName = '❓ Neznámé zařízení';
    let expectedTracks = 0;
    
    // ═══════════════════════════════════════════════════════
    // 🎯 PRIORITA #1: LENOVO NOTEBOOK (1366-1920px Windows)
    // ═══════════════════════════════════════════════════════
    if (device.isLenovoNotebook) {
        if (isFullscreen) {
            newHeight = '366px';  // 7 skladeb × 65px
            expectedTracks = 8;
        } else {
            newHeight = '240px';  // 5 skladeb × 65px
            expectedTracks = 5;
        }
        deviceName = '💻 Lenovo Notebook';
    }
    
    // ═══════════════════════════════════════════════════════
    // 📱 PRIORITA #2: INFINIX NOTE 30
    // ═══════════════════════════════════════════════════════
    else if (device.isInfinixNote30) {
        newHeight = '50px';  // 4 skladby
        expectedTracks = 4;
        deviceName = '📱 Mobilní zařízení'; //📱 Infinix Note 30
    }
    
    // ═══════════════════════════════════════════════════════
    // 📱 PRIORITA #3: OSTATNÍ MOBILNÍ ZAŘÍZENÍ
    // ═══════════════════════════════════════════════════════
    else if (device.isMobile) {
        if (isFullscreen) {
            newHeight = '296px';  // 6 skladeb
            expectedTracks = 6;
        } else {
            newHeight = '184px';  // 4 skladby
            expectedTracks = 5;
        }
        deviceName = '📱 Infinix Note 30'; //📱 Mobilní zařízení
    }
    
    // ═══════════════════════════════════════════════════════
    // 🖥️ PRIORITA #4: VELKÉ DESKTOPY (>1920px)
    // ═══════════════════════════════════════════════════════
    else if (device.isLargeDesktop) {
        if (isFullscreen) {
            newHeight = '420px';  // 8 skladeb
            expectedTracks = 7;
        } else {
            newHeight = '390px';  // 6 skladeb
            expectedTracks = 6;
        }
        deviceName = '🖥️ Velký desktop (>1920px)';
    }
    
    // ═══════════════════════════════════════════════════════
    // ⚠️ FALLBACK: Pokud nic nesedí
    // ═══════════════════════════════════════════════════════
    else {
        if (device.isWindowsDesktop) {
            // Windows, ale neznámé rozlišení → odhad podle šířky
            if (isFullscreen) {
                newHeight = '390px';  // 6 skladeb
                expectedTracks = 6;
            } else {
                newHeight = '260px';  // 4 skladby
                expectedTracks = 4;
            }
            deviceName = '💻 Windows desktop (fallback)';
        } else {
            // Úplně neznámé zařízení
            newHeight = '260px';
            expectedTracks = 4;
            deviceName = '❓ Neidentifikované zařízení';
        }
    }
    
    // 🎨 Aplikace výšky
    DOM.playlist.style.maxHeight = newHeight;
    
    // 📡 Detailní debug log
    const logMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📏 VÝŠKA PLAYLISTU UPRAVENA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  Zařízení: ${deviceName}
📐 Okno: ${device.windowWidth}×${device.windowHeight}px
📺 Monitor: ${device.screenWidth}×${device.screenHeight}px
🎬 Fullscreen: ${isFullscreen ? 'ANO ✅' : 'NE ❌'}
📏 Výška: ${newHeight}
🎵 Viditelné skladby: ~${expectedTracks}
🪟 Windows Desktop: ${device.isWindowsDesktop ? 'ANO' : 'NE'}
🤖 Android Mobile: ${device.isAndroidMobile ? 'ANO' : 'NE'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    if (window.DebugManager) {
        window.DebugManager.log('main', logMessage.trim());
    } else {
        console.log(logMessage);
    }
}

/**
 * Inicializace při načtení
 */
function restorePreviousSettings() {
    if (!DOM.playlist) {
        console.warn('⚠️ Playlist není dostupný při inicializaci.');
        return;
    }
    
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    adjustPlaylistHeight(isCurrentlyFullscreen);
    
    console.log('✅ Playlist inicializován podle aktuálního režimu.');
}

// ═══════════════════════════════════════════════════════════
// 🎧 EVENT LISTENERY
// ═══════════════════════════════════════════════════════════

document.addEventListener('fullscreenchange', () => {
    adjustPlaylistHeight(document.fullscreenElement !== null);
});

document.addEventListener('webkitfullscreenchange', () => {
    adjustPlaylistHeight(document.webkitFullscreenElement !== null);
});

document.addEventListener('mozfullscreenchange', () => {
    adjustPlaylistHeight(document.mozFullScreenElement !== null);
});

// Při změně velikosti okna (s debounce)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        adjustPlaylistHeight(document.fullscreenElement !== null);
    }, 250);
});

// ═══════════════════════════════════════════════════════════
// 🚀 AUTOMATICKÁ INICIALIZACE
// ═══════════════════════════════════════════════════════════
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restorePreviousSettings);
} else {
    restorePreviousSettings();
}
// ═══════════════════════════════════════════════════════════
// 🚀 TADY KONČÍ NASTAVENÍ PLALISTU
// ═══════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════════════════
// ═ Dynamické nastavení pro obrázky.                                            ═
// ═ Autor původního kódu: Více admirál Jiřík.                                   ═
// ═ Autor úprav: Admirál Claude.AI.                                             ═
// ═ Datum úpravy: 25.12.2025.                                                   ═
// ═ Podpis: Claude.AI 🖖.                                                       ═
// ═══════════════════════════════════════════════════════════════════════════════

function setBackgroundForDevice() {
    const deviceInfo = detectDeviceType();
    const backgrounds = {
        desktop: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_1920x1080_2.jpg?ver=0',
        infinix: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_1024x1792.jpg?ver=0'
    };
    let backgroundUrl = deviceInfo.isInfinixNote30 ? backgrounds.infinix : backgrounds.desktop;
    const bgContainer = document.querySelector('.background-image-container img');
    if (bgContainer) {
        bgContainer.src = backgroundUrl;
        
        // 🛡️ OCHRANNÝ PROTOKOL - AKTIVOVÁN
        applyImageProtection(bgContainer);
    }
    localStorage.setItem('background_url', backgroundUrl);
}

function restorePreviousBackground() {
    const savedBackgroundUrl = localStorage.getItem('background_url');
    const bgContainerImg = document.querySelector('.background-image-container img');
    if (!bgContainerImg) return;
    if (savedBackgroundUrl) {
        bgContainerImg.src = savedBackgroundUrl;
        
        // 🛡️ OCHRANNÝ PROTOKOL - AKTIVOVÁN
        applyImageProtection(bgContainerImg);
    } else {
        setBackgroundForDevice();
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// 🛡️ OCHRANNÁ FUNKCE - BLOKUJE KOPÍROVÁNÍ A PŘESOUVÁNÍ OBRÁZKŮ
// ══════════════════════════════════════════════════════════════════════════════
function applyImageProtection(imgElement) {
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
    
    // Ochrana na dotykových zařízeních (dlouhé podržení)
    imgElement.addEventListener('touchstart', (e) => {
        // Povolíme touchstart pro scroll, ale zabráníme výběru
        imgElement.style.webkitUserSelect = 'none';
        imgElement.style.userSelect = 'none';
    }, { passive: true });
    
    // Zákaz copy události
    imgElement.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Nastavení CSS vlastností přímo v JS (záložní ochrana)
    imgElement.style.userSelect = 'none';
    imgElement.style.webkitUserSelect = 'none';
    imgElement.style.mozUserSelect = 'none';
    imgElement.style.msUserSelect = 'none';
    imgElement.style.webkitUserDrag = 'none';
    imgElement.style.webkitTouchCallout = 'none';
    imgElement.style.pointerEvents = 'none';
}

window.addEventListener('orientationchange', () => setTimeout(() => {
    adjustPlaylistHeight(!!document.fullscreenElement);
    setBackgroundForDevice();
}, 300));

window.addEventListener('resize', () => {
    if (window.resizeTimer) clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        adjustPlaylistHeight(!!document.fullscreenElement);
        setBackgroundForDevice();
    }, 250);
});

// ═══════════════════════════════════════════════════════════
// 🚀 TADY KONČÍ NASTAVENÍ pro obrázek 
// ═══════════════════════════════════════════════════════════


// --- Skrytí sync status ---
if (DOM.syncStatus) {
    setTimeout(() => {
        DOM.syncStatus.style.display = 'none';
    }, 6000);
}

// --- Inicializace ---
document.addEventListener('DOMContentLoaded', async () => {
    const firebaseInitialized = await window.initializeFirebaseAppAudio?.();
    if (!firebaseInitialized) {
        if (window.DebugManager?.isEnabled('main')) {
            console.error("DOMContentLoaded: Nepodařilo se inicializovat Firebase.");
        }
        window.showNotification("Kritická chyba: Nelze se připojit k databázi.", 'error');
    }
    
    await loadAudioData();
    
    // 🚀 PRELOADER - První přednahrání skladeb
    if (window.audioPreloader && currentPlaylist.length > 0) {
        window.DebugManager?.log('main', '🖖 Spouštím první přednahrání skladeb...');
        try {
            await window.preloadTracks(
                currentPlaylist, 
                currentTrackIndex, 
                isShuffled, 
                shuffledIndices
            );
        } catch (error) {
            console.error('⚠️ Chyba při prvním přednahrání:', error);
        }
    }
    
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
    restorePreviousSettings();
    restorePreviousBackground();
    //updateTimerDisplay();
    addEventListeners();
    setTimeout(() => {
        if (DOM.playlist) {
            DOM.playlist.classList.remove('hidden');
            if (DOM.playlist.style.display === 'none') DOM.playlist.style.display = 'block';
        }
    }, 100);
});

// 🚀 PRELOADER - Vizuální indikátor načtených skladeb (OPRAVENO)
window.addEventListener('track-preloaded', (e) => {
    const { src, title } = e.detail;
    
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        if (item.dataset.originalSrc === src) {
            const titleSpan = item.querySelector('.track-title');
            if (!titleSpan) return;
            
            // Odstraň všechny staré indikátory z této skladby
            const oldIndicators = titleSpan.querySelectorAll('.preload-indicator, .preload-lightning');
            oldIndicators.forEach(ind => ind.remove());
            
            // Přidej nový zelený indikátor
            if (!titleSpan.querySelector('.preload-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'preload-indicator';
                indicator.textContent = '⚡';
                indicator.title = 'Přednahráno';
                indicator.style.marginLeft = '5px';
                indicator.style.color = '#00ff00';
                indicator.style.fontSize = '0.8em';
                titleSpan.appendChild(indicator);
                
                // Automaticky odstraň po 3 sekundách
                setTimeout(() => {
                    if (indicator.parentElement) {
                        indicator.remove();
                    }
                }, 3000);
            }
        }
    });
    
    // Vyčisti všechny staré blesky z jiných skladeb
    document.querySelectorAll('.preload-lightning').forEach(lightning => {
        lightning.remove();
    });
});

//===========řádek 1161=========//
// Performance monitoring (pouze pro debug)
let frameCount = 0;
let lastFpsUpdate = Date.now();

function monitorPerformance() {
    frameCount++;
    const now = Date.now();
    if (now - lastFpsUpdate > 5000) {
        const fps = Math.round((frameCount / 5) * 10) / 10;
        const perfEl = document.getElementById('perfMode');
        if (perfEl) perfEl.textContent = `⚡ monitorPerformance  | ${fps} FPS`;
        frameCount = 0;
        lastFpsUpdate = now;
    }
    requestAnimationFrame(monitorPerformance);
}

monitorPerformance();


// =================================================================
// 🖖 EXPORT FUNKCÍ PRO HLASOVÉ OVLÁDÁNÍ (Komunikační můstek)
// =================================================================
// Tímto zpřístupníme vnitřní funkce přehrávače pro voiceControl.js
window.playTrack = playTrack;
window.playNextTrack = playNextTrack;
window.playPrevTrack = playPrevTrack;
// 🔥 PŘIDEJ TENTO KLÍČOVÝ ŘÁDEK 🔥
window.populatePlaylist = populatePlaylist; 
// 🔥 A PRO JISTOTU I TENTO (pro barvičky a scroll) 🔥
window.updateActiveTrackVisuals = updateActiveTrackVisuals;
window.DebugManager?.log('main', "🚀 script.js: Funkce přehrávače jsou nyní přístupné pro hlasové ovládání.");




})(); // KONEC IIFE - Vše je izolované
