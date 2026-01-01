// ═══════════════════════════════════════════════════════════════════════════
// 🔇 CONSOLE SILENCER V1.0 - USS PROMETHEUS
// ═══════════════════════════════════════════════════════════════════════════
// Tento skript odchytává zprávy v konzoli a filtruje je podle blacklistu.
// Musí být načten jako PRVNÍ, aby fungoval na všechno.

(function() {
    // 🛑 SEZNAM ZAKÁZANÝCH FRÁZÍ (Blacklist)
    // Cokoliv, co obsahuje tento text, bude bez milosti smazáno.
    const BLACKLIST = [
        "Banner not shown",
        "beforeinstallpromptevent.preventDefault()",
        "The page must call beforeinstallpromptevent.prompt()",
        "DevTools failed to load source map" // Častá otravná hláška
    ];

    // Funkce pro kontrolu, zda text obsahuje zakázaná slova
    function shouldSilence(args) {
        // Převedeme všechny argumenty na jeden string
        const msg = args.map(arg => String(arg)).join(' ');
        
        // Pokud zpráva obsahuje cokoliv z blacklistu, vrátíme true (umlčet)
        return BLACKLIST.some(forbidden => msg.includes(forbidden));
    }

    // 1. OCHRANA CONSOLE.LOG
    const originalLog = console.log;
    console.log = function(...args) {
        if (!shouldSilence(args)) {
            originalLog.apply(console, args);
        }
    };

    // 2. OCHRANA CONSOLE.WARN (Tady se většinou skrývají ty PWA hlášky)
    const originalWarn = console.warn;
    console.warn = function(...args) {
        if (!shouldSilence(args)) {
            originalWarn.apply(console, args);
        }
    };

    // 3. OCHRANA CONSOLE.ERROR (Pro jistotu)
    const originalError = console.error;
    console.error = function(...args) {
        if (!shouldSilence(args)) {
            originalError.apply(console, args);
        }
    };

    // 4. OCHRANA CONSOLE.INFO
    const originalInfo = console.info;
    console.info = function(...args) {
        if (!shouldSilence(args)) {
            originalInfo.apply(console, args);
        }
    };

    // ✅ Hlášení o aktivaci štítu (použijeme originalLog, abychom se sami nefiltrovali)
    originalLog.apply(console, [
        `%c🔇 Console Silencer aktivován. Filtruji ${BLACKLIST.length} hrozeb.`,
        'color: gray; font-style: italic;'
    ]);

})();
