// ============================================
// 🖖 STAR TREK TIMER MODULE - Admirál Jiřík
// ============================================
// Univerzální časovač pro jakýkoliv čas
// Připojení: <script src="timer-module.js"></script>
// ============================================

(function() {
    'use strict';

    // ========== Globální proměnné časovače ==========
    let timerValueInSeconds = 0;
    let timerInterval = null;
    let isTimerRunning = false;

    // ========== DOM elementy ==========
    const DOM = {
        timer: {
            button: null,
            container: null,
            minutes: null,
            seconds: null,
            input: null,
            start: null,
            stop: null,
            reset: null
        }
    };

    // ========== Inicializace při načtení stránky ==========
    function initTimer() {
        // Načtení DOM elementů
        DOM.timer.button = document.getElementById('timer-button');
        DOM.timer.container = document.getElementById('timer-container');
        DOM.timer.minutes = document.getElementById('timer-minutes');
        DOM.timer.seconds = document.getElementById('timer-seconds');
        DOM.timer.input = document.getElementById('timer-input');
        DOM.timer.start = document.getElementById('timer-start');
        DOM.timer.stop = document.getElementById('timer-stop');
        DOM.timer.reset = document.getElementById('timer-reset');

        // Kontrola existence elementů
        if (!DOM.timer.container) {
            console.warn('⚠️ Timer container nenalezen!');
            return;
        }

        // Registrace event listenerů
        registerEventListeners();

        // Nastavení výchozího času
        const defaultMinutes = parseInt(DOM.timer.input?.value || 15);
        setTimerValue(defaultMinutes);

        console.log('🖖 Timer Module aktivován!');
    }

    // ========== Aktualizace zobrazení času ==========
    function updateTimerDisplay() {
        if (!DOM.timer.minutes || !DOM.timer.seconds) return;
        
        const minutes = Math.floor(timerValueInSeconds / 60);
        const seconds = timerValueInSeconds % 60;
        
        DOM.timer.minutes.textContent = String(minutes).padStart(2, '0');
        DOM.timer.seconds.textContent = String(seconds).padStart(2, '0');
    }

    // ========== Odpočítávání ==========
    function countdown() {
        if (timerValueInSeconds > 0) {
            timerValueInSeconds--;
            updateTimerDisplay();
        } else {
            // Časovač vypršel
            stopTimer();
            onTimerExpired();
        }
    }

    // ========== Nastavení hodnoty časovače ==========
    function setTimerValue(minutes) {
        timerValueInSeconds = minutes * 60;
        updateTimerDisplay();
    }

    // ========== Spuštění časovače ==========
    function startTimer() {
        const inputValue = parseInt(DOM.timer.input?.value || 0);
        
        if (inputValue <= 0) {
            showNotification("⚠️ Zadej platný počet minut!", 'warn');
            return;
        }
        
        if (!isTimerRunning) {
            setTimerValue(inputValue);
            clearInterval(timerInterval);
            timerInterval = setInterval(countdown, 1000);
            isTimerRunning = true;
            DOM.timer.button?.classList.add('active');
            showNotification(`⏱️ Časovač spuštěn na ${inputValue} minut!`, 'info');
        } else {
            showNotification("⚠️ Časovač již běží!", 'warn');
        }
    }

    // ========== Zastavení časovače ==========
    function stopTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        DOM.timer.button?.classList.remove('active');
    }

    // ========== Reset časovače ==========
    function resetTimer() {
        stopTimer();
        const inputValue = parseInt(DOM.timer.input?.value || 15);
        setTimerValue(inputValue);
        showNotification("🔄 Časovač resetován.", 'info');
    }

    // ========== Když časovač vyprší ==========
    function onTimerExpired() {
        // Zastavení audio přehrávače (pokud existuje)
        const audioPlayer = document.getElementById('audio-player') || 
                           document.querySelector('audio');
        if (audioPlayer) {
            audioPlayer.pause();
        }

        // Přehrání zvukové znělky
        const alertSound = new Audio('https://www.dropbox.com/scl/fi/l1oliluc949s1sviouuo0/odpocet-10-sekund.mp3?rlkey=yp6fc9llz7em9a7p4bjtsq6aw&st=5z2v667o&dl=1');
        alertSound.play().catch(e => {
            console.error('🔊 Chyba přehrání zvuku časovače:', e);
        });

        // Notifikace
        showNotification('🖖 Časovač vypršel! Přehrávání zastaveno.', 'info', 5000);

        // Aktualizace stavů tlačítek (pokud existuje globální funkce)
        if (typeof window.updateButtonActiveStates === 'function') {
            window.updateButtonActiveStates(false);
        }
    }

    // ========== Toggle zobrazení časovače ==========
    function toggleTimerDisplay() {
        if (!DOM.timer.container || !DOM.timer.button) return;
        
        const isVisible = DOM.timer.container.style.display !== 'none';
        DOM.timer.container.style.display = isVisible ? 'none' : 'flex';
        DOM.timer.button.classList.toggle('active', !isVisible);
    }

    // ========== Notifikace ==========
    function showNotification(message, type = 'info', duration = 3000) {
        // Použití globální funkce notifikací (pokud existuje)
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type, duration);
        } else {
            // Fallback na console
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // ========== Registrace event listenerů ==========
    function registerEventListeners() {
        // Toggle zobrazení časovače
        DOM.timer.button?.addEventListener('click', toggleTimerDisplay);

        // START tlačítko
        DOM.timer.start?.addEventListener('click', startTimer);

        // STOP tlačítko
        DOM.timer.stop?.addEventListener('click', () => {
            stopTimer();
            showNotification("⏹️ Časovač zastaven.", 'info');
        });

        // RESET tlačítko
        DOM.timer.reset?.addEventListener('click', resetTimer);

        // Enter key pro spuštění
        DOM.timer.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startTimer();
            }
        });
    }

    // ========== Veřejné API ==========
    window.TimerModule = {
        start: startTimer,
        stop: stopTimer,
        reset: resetTimer,
        toggle: toggleTimerDisplay, // <--- Toto propojí tvoji klávesu "T" s UI!
        setTime: setTimerValue,
        getTimeRemaining: () => timerValueInSeconds,
        isRunning: () => isTimerRunning
    };

    // ========== Auto-inicializace ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTimer);
    } else {
        initTimer();
    }

})();

// ============================================
// 🖖 Konec Timer Module

// ============================================
