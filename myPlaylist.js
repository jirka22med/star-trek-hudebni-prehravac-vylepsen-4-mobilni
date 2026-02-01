const __myPlaylistJS_START = performance.now();
 

// 🖖 OCHRANA PLAYLISTU - Zabraňuje přepsání Firestorem
window.PLAYLIST_SOURCE = 'myPlaylist.js';
window.PLAYLIST_VERSION = new Date().toISOString(); 

// 🎯 DEFINICE SEKCÍ (Aktualizováno na 480 skladeb, indexy 0-479)
window.playlistSections = [
  { name: '🎧 STAR TREK - HLAVNÍ TÉMATA & POSÁDKY', start: 0, end: 12 },
  { name: '🎧 STAR TREK - INTRA & ZNĚLKY', start: 13, end: 17 },
  { name: '🎧 STAR TREK - EPICKÉ OUTRO (SÉRIE)', start: 18, end: 24 },
  { name: '🎧 STAR TREK - PÍSNIČKA POSÁDEK (ORIGINÁL & KLINGONI)', start: 25, end: 38 },
  { name: '🎧 HVĚZDNÉ PLAMENY & HVĚZDY A PLAMENY', start: 39, end: 44 },
  { name: '🎧 HVĚZDNÉ PLAMENY Disco Verze', start: 45, end: 51 },
  { name: '🎧 HVĚZDNÉ PLAMENY Remastered', start: 52, end: 55 },
  { name: '🎧 HVĚZDNÉ PLAMENY Star Trek Verze', start: 56, end: 57 },
  { name: '🎧 HVĚZDNÉ PLAMENY Nová Série', start: 58, end: 65 },
  { name: '🎧 VELKÉ OSLAVY DS9', start: 66, end: 73 },
  { name: '🎧 SPECIÁL: ČERNÝ HAVRAN & ENTERPRISE', start: 74, end: 78 },
  { name: '🎧 STAR TREK PÍSNIČKA POSÁDEK (DISCO VERZE)', start: 79, end: 88 },
  { name: '🎧 STAR TREK SOUTĚŽ (ENTERPRISE & DS9)', start: 89, end: 94 },
  { name: '🎧 STAR TREK SOUTĚŽ Na Deep Space Nine', start: 95, end: 108 },
  { name: '🎧 VÍCE ADMIRÁL JIŘÍK & ADMIRÁL CHATBOT CLAUDE.AI', start: 109, end: 117 },
  { name: '🎧 Více Admirál Jiřík & Chatbot', start: 118, end: 121 },
  { name: '🎧 Více Admirál & Claude.AI', start: 122, end: 127 },
  { name: '🎧 VÁNOČNÍ HVĚZDNÁ FLOTILA', start: 128, end: 138 },
  { name: '🎧 STAR TREK - DO NEZNÁMA (SÉRIE)', start: 139, end: 143 },
  { name: '🎧 STAR TREK - DO NEZNÁMA Remake', start: 144, end: 146 },
  { name: '🎧 STAR TREK - DO NEZNÁMA Starší verze', start: 147, end: 149 },
  { name: '🎧 STAR TREK - DO NEZNÁMA Nová Série', start: 150, end: 154 },
  { name: '🎧 MIX & SPECIÁLNÍ PROJEKTY', start: 155, end: 157 },
  { name: '🎧 Týmová Práce', start: 158, end: 162 },
  { name: '🎧 Admirálský Deník', start: 163, end: 168 },
  { name: '🎧 Vánoční Hudba na palubě', start: 169, end: 173 },
  { name: '🎧 Remastered Bonusy', start: 174, end: 177 },
  { name: '🎧 VESMÍRNÁ ODYSEA (KOMPLET)', start: 178, end: 187 },
  { name: '🎧 DALŠÍ PROJEKTY & BONUSY', start: 188, end: 192 },
  { name: '🎧 Na Cestě k Věčnosti', start: 193, end: 200 },
  { name: '🎧 Srdce mezi Hvězdami', start: 201, end: 207 },
  { name: '🎧 Srdce na Dlani', start: 208, end: 210 },
  { name: '🎧 Ostatní Remastered', start: 211, end: 215 },
  { name: '🎧 STANICE HLUBOKÝ VESMÍR 9 (SÉRIE)', start: 216, end: 226 },
  { name: '🎧 HVEZDNA-FLOTILA-NAVZDY', start: 227, end: 234 },
  { name: '🎧 Děti hvězd', start: 235, end: 244 },
  { name: '🎧 Louisiana sobotní noc 1 až 9', start: 245, end: 253 },
  { name: '🎧 Louisiana-sobotni-noc 10 až 19', start: 254, end: 263 },
  { name: '🎧 PÍSNIČKY O JIRKOVI Klasická Série 1', start: 264, end: 267 },
  { name: '🎧 PÍSNIČKY O JIRKOVI Klasická Série 2', start: 268, end: 271 },
  { name: '🎧 PÍSNIČKY O JIRKOVI Remastered Verze 1', start: 272, end: 275 },
  { name: '🎧 PÍSNIČKY O JIRKOVI Remastered Verze 2', start: 276, end: 280 },
  { name: '🎧 Jirkův Futuristický Kvíz', start: 281, end: 285 },
  { name: '🎧 Jirkův dodatek', start: 286, end: 286 },
  { name: '🎧 Journey Through Žižkov Originální verze', start: 287, end: 288 },
  { name: '🎧 Journey Through Žižkov Jirka Remake', start: 289, end: 291 },
  { name: '🎧 Journey Through Žižkov Remastered (Rema)', start: 292, end: 295 },
  { name: '🎧 FEDERÁLNÍ ÚSTAV Remastered Verze', start: 296, end: 297 },
  { name: '🎧 FEDERÁLNÍ ÚSTAV Originální Série', start: 298, end: 300 },
  { name: '🎧 FEDERÁLNÍ ÚSTAV Remake Série', start: 301, end: 304 },
  { name: '🎧 FEDERÁLNÍ ÚSTAV Série 2', start: 305, end: 306 },
  { name: '🎧 FEDERÁLNÍ ÚSTAV Série 3', start: 307, end: 310 },
  { name: '🎧 FEDERÁLNÍ ÚSTAV Série 4', start: 311, end: 312 },
  { name: '🎧 Krčma v Dětenicích', start: 313, end: 316 },
  { name: '🎧 cesta krystof', start: 317, end: 321 },
  { name: '🎧 instrumentální disko', start: 322, end: 331 },
  { name: '🎧 ÚTAH A JEHO BRATR', start: 332, end: 334 },
  { name: '🎧 NOČNÍ STÍNY & BOD ZLOMU', start: 335, end: 339 },
  { name: '🎧 STÍNY Z UTAHY (REMASTERED)', start: 340, end: 341 },
  { name: '🎧 Jirka a ondra', start: 342, end: 351 },
  { name: '🎧 Mohambi', start: 352, end: 359 },
  { name: '🎧 Mohombi Remastered', start: 360, end: 361 },
  { name: '🎧 Bumpy Rider Mohombi', start: 362, end: 366 },
  { name: '🎧 kohout / mix-kohout', start: 367, end: 378 },
  { name: '🎧 Hora Matterhorn', start: 379, end: 387 },
  { name: '🎧 Nebude to ľahké', start: 388, end: 398 },
  { name: '🎧 RŮZNÉ HITY & SINGLY', start: 399, end: 404 },
  { name: '🎧 SÉRIE: NA OKOŘ JE CESTA (VŠECHNY VERZE)', start: 405, end: 413 },
  { name: '🎧 ZÁBAVNÉ & PRACOVNÍ PÍSNIČKY', start: 414, end: 421 },
  { name: '🎧 SPECIÁLNÍ & INSTRUMENTÁLNÍ SETY', start: 422, end: 429 },
  { name: '🎧 MIX PÍSNIČEK (KOMPLETNÍ SÉRIE)', start: 430, end: 439 },
  { name: '🎧 AUDIO KAPITOLY (1-40)', start: 440, end: 479 },
  { name: '🎧 Jardova cesta s prateli', start: 480, end: 485 },
  { name: '🎧 Ocelová křídla Promethea', start: 486, end: 489 },
  { name: '🎧 Velení Promethea', start: 490, end: 493 },
  { name: '🎧 Velení lodi Prometheus', start: 494, end: 495 },
  { name: '🎧 USS Prometheus', start: 496, end: 497 }
];
// ═══════════════════════════════════════════════════════════

  // ... další sekce podle tvého playlistu

// ═══════════════════════════════════════════════════════════

  // ... další sekce podle tvého playlistu
 
// Zde vlož svůj dlouhý seznam skladeb
window.tracks = [ 

// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK - HLAVNÍ TÉMATA & POSÁDKY
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/x0z9ddkz3zfqrvcnb6nr8/Odysea-Kapit-na-Ar-era-1.mp3?rlkey=mlav41qi6qe5ukss3q4qdd8f6&st=44y26ef2&dl=1', title: 'Odysea Kapitána Arčra', duration: '02:12', manuallyEdited: false, lastEditedAt: null }, //0 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/hl4pp862wvlgd3kj2uixj/Hv-zdn-lo-sn.mp3?rlkey=uxfr6emv2h70v9blgmoily2ug&st=h40ynmje&dl=1', title: 'Hvězdná Loď Snů', duration: '02:54', manuallyEdited: false, lastEditedAt: null }, //1
{ src: "https://dl.dropboxusercontent.com/scl/fi/qs7h9fotngaf8dc5bmvf2/Vesm-rn-Odyssea-1.mp3?rlkey=e38vuocv7kuieiccmf5oz8562&st=ju9xxk8e&dl=1", title: "Vesmírná Odysea 1", duration: '02:20', manuallyEdited: false, lastEditedAt: null }, //2
{ src: "https://dl.dropboxusercontent.com/scl/fi/2m0xferijus0v4lbpdj2k/Bl-en-k-Hv-zd-m-1.mp3?rlkey=7h7sdbaph6qpi4tcia94vybvq&st=b4xy2s6z&dl=1", title: "Blížení ke hvězdám", duration: '02:43', manuallyEdited: false, lastEditedAt: null }, //3
{ src: "https://dl.dropboxusercontent.com/scl/fi/2pjvhjg0okjl2vdbxjn22/erv-D-ra-1.mp3?rlkey=r4lwn5zfy6y4m0opkkgwde0g0&st=qyl44r63&dl=1", title: "Červí díra", duration: '03:13', manuallyEdited: false, lastEditedAt: null }, //4
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7qsfzey00g0g05xe7k0gw/Kapit-n-Picard.mp3?rlkey=e08fflsut3k99tur8ew0xcvjj&st=naaxt96i&dl=1', title: 'Kapitán Picard v.1', duration: '03:34', manuallyEdited: false, lastEditedAt: null }, //5            
{ src: "https://dl.dropboxusercontent.com/scl/fi/1sany2hf4pw97y7ikx6kr/Kapit-n-Picard-2.mp3?rlkey=oov5g18lfhoq9tnvnbpd4au1l&st=vo0xcyj4&dl=1", title: "Kapitán Picard v.2", duration: '03:59', manuallyEdited: false, lastEditedAt: null }, //6
{ src: "https://dl.dropboxusercontent.com/scl/fi/iep5gi3gfgkw41dn6j2b9/Kapit-n-Riker.mp3?rlkey=sehzr8lek8c28jyeq4ayjjfn5&st=5yrju1im&dl=1", title: "Kapitán Riker", duration: '03:39', manuallyEdited: false, lastEditedAt: null }, //7
{ src: "https://dl.dropboxusercontent.com/scl/fi/pi8vjvwj02c1zj4nuw149/Nad-je-v-Temn-ch-asech.mp3?rlkey=0xiycum1ji18dok9rh1mmqhwo&st=4abhd0x2&dl=1", title: "Naděje v temných časech v.1", duration: '03:14', manuallyEdited: false, lastEditedAt: null }, //8
{ src: 'https://dl.dropboxusercontent.com/scl/fi/n25rk7ttqs1n5mwy566qs/nad-je-v-temn-ch-asech-2.webm?rlkey=i8nj4xk0mvrn96dy0v7tv3tpe&dl=1', title: 'Naděje v temných časech v.2', manuallyEdited: false, lastEditedAt: null }, //9     
{ src: "https://dl.dropboxusercontent.com/scl/fi/ccckqqvzifs8b1ysruiq1/Odv-n-Pos-dka.mp3?rlkey=bnfy7ym2m0rao2374mw0g4xhc&st=22fenwvk&dl=1", title: "Odvážná posádka", duration: '02:12', manuallyEdited: false, lastEditedAt: null }, //10
{ src: "https://dl.dropboxusercontent.com/scl/fi/x0z9ddkz3zfqrvcnb6nr8/Odysea-Kapit-na-Ar-era-1.mp3?rlkey=mlav41qi6qe5ukss3q4qdd8f6&st=ymr1hpfw&dl=1", title: "Odysea Kapitána Arčra v.2", duration: '02:12', manuallyEdited: false, lastEditedAt: null }, //11
{ src: "https://dl.dropboxusercontent.com/scl/fi/27zunc86ujirpxj1hvhxc/Pos-dka-Enterprise-D.mp3?rlkey=ge98t19y7y1nqtec0jlq9w0kr&st=qozanohm&dl=1", title: "Posádka Enterprise-D", duration: '02:06', manuallyEdited: false, lastEditedAt: null }, //12

// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK - INTRA & ZNĚLKY
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/j14wk1i4gj15s5w2jn5l4/Star-Trek-Enterprise-Theme-Extended-Version-.mpg.mp3?rlkey=bfykx9urgc0m58lshd4u6y0g8&st=undzz81o&dl=1", title: "Star Trek Enterprise NX-01 Intro", duration: '04:10', manuallyEdited: false, lastEditedAt: null }, //13
{ src: "https://dl.dropboxusercontent.com/scl/fi/oazfxyf28omnabs6wsy09/Star-Trek-Voyager-4k-HD-Intro-NeonVisual.mp3?rlkey=cj5o6lhite277q9f8oeeixnlc&st=7bl423dk&dl=1", title: "Star Trek Voyager Intro", duration: '01:55', manuallyEdited: false, lastEditedAt: null }, //14
{ src: "https://dl.dropboxusercontent.com/scl/fi/beossqqw6rquqfzghfvbf/Star-Trek_-Discovery-Main-Theme.mp3?rlkey=oba8a483o61glsm3b62lasy2p&st=59uxhh2u&dl=1", title: "Star Trek Discovery Intro", duration: '01:39', manuallyEdited: false, lastEditedAt: null }, //15
{ src: "https://dl.dropboxusercontent.com/scl/fi/yi1w5b9mwuwwl4gsrg01l/Star-Trek_-The-Next-Generation-Theme-EPIC-VERSION.mp3?rlkey=7wsegbwm0f2zqrdv4lstx3hbg&st=j5z0t7db&dl=1", title: "Star Trek Nová Generace Intro", duration: '02:21', manuallyEdited: false, lastEditedAt: null }, //16
{ src: "https://dl.dropboxusercontent.com/scl/fi/61uxo0jemsb84iyg6yxw3/Star-Trek_-Deep-Space-Nine-4K-HD-Intro-NeonVisual.mp3?rlkey=ltd4xwfosro3xcu08go2aeiza&st=tatj06i2&dl=1", title: "Star Trek Deep Space Nine Intro", duration: '02:04', manuallyEdited: false, lastEditedAt: null }, //17

// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK - EPICKÉ OUTRO (SÉRIE)
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/gcr9socf76gtag6zq8de0/EPICK-OUTRO-STAR-TREK-STYLE.mp3?rlkey=thyaxyq56jxa6kr28o0707lcv&st=jtmew59q&dl=1', title: 'Epické Outro Star Trek Style v.1', manuallyEdited: false, lastEditedAt: null }, //18 
{ src: "https://dl.dropboxusercontent.com/scl/fi/6e24v3a9h6eer8vsiwxnj/EPICK-OUTRO-STAR-TREK-STYLE-v.1.mp3?rlkey=vylstj6deofmapytc4tfnx8kg&st=epol3xel&dl=1", title: "Epické Outro Star Trek Style v.2", duration: '03:37', manuallyEdited: false, lastEditedAt: null }, //19 
{ src: "https://dl.dropboxusercontent.com/scl/fi/z6cga3177ej1yjobq0zip/EPICK-OUTRO-STAR-TREK-STYLE-v.2.mp3?rlkey=9u3v2buyfavfc237l11in5iff&st=drotyft0&dl=1", title: "Epické Outro Star Trek Style v.3", duration: '03:17', manuallyEdited: false, lastEditedAt: null }, //20
{ src: 'https://dl.dropboxusercontent.com/scl/fi/5cnz6m6jv399s6kwomz7g/EPICK-OUTRO-STAR-TREK-STYLE-Remastered-v.1.mp3?rlkey=8ljup8ucxh5dgbqhhpuvkd3h1&st=b5sylgr8&dl=1', title: 'Epické Outro Star Trek Style v.4', manuallyEdited: false, lastEditedAt: null }, //21
{ src: 'https://dl.dropboxusercontent.com/scl/fi/whpm9u9zz3mxrsyvdx1r7/EPICK-OUTRO-STAR-TREK-STYLE-Remastered-v.2.mp3?rlkey=vi2s8jn295atak9sgjct5lmaj&st=k483e3bv&dl=1', title: 'Epické Outro Star Trek Style v.5', manuallyEdited: false, lastEditedAt: null }, //22
{ src: 'https://dl.dropboxusercontent.com/scl/fi/3q07ev0b9o8zbrn47hut1/EPICK-OUTRO-STAR-TREK-STYLE-Remastered-v.3.mp3?rlkey=aecy8rpziy15axfncgknx8fyw&st=slfk0c23&dl=1', title: 'Epické Outro Star Trek Style v.6', manuallyEdited: false, lastEditedAt: null }, //23
{ src: 'https://dl.dropboxusercontent.com/scl/fi/r3jwu1wqmnmeupx40o2t6/EPICK-OUTRO-STAR-TREK-STYLE-Remastered-v.4.mp3?rlkey=x6k9adkd0hkei5mg5r6kedkxg&st=9o5qzuga&dl=1', title: 'Epické Outro Star Trek Style v.7', manuallyEdited: false, lastEditedAt: null }, //24    

// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK - PÍSNIČKA POSÁDEK (ORIGINÁL & KLINGONI)
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/zfsubjnfmaj4wfjd6kqmu/Star-tek-p-sni-ka-pos-dek-1.mp3?rlkey=a37s46ylfidynhwd5m53ds4im&st=ectq5xua&dl=1", title: "Star Trek Písnička Posádek v.1", duration: '04:00', manuallyEdited: false, lastEditedAt: null }, //25
{ src: "https://dl.dropboxusercontent.com/scl/fi/ts7rsuztzji2w2s4ylrj3/Star-tek-p-sni-ka-pos-dek-1-2.mp3?rlkey=c3qoi52mwjq4igkzppl0thvbs&st=keimo1r4&dl=1", title: "Star Trek Písnička Posádek v.2", duration: '03:23', manuallyEdited: false, lastEditedAt: null }, //26
{ src: "https://dl.dropboxusercontent.com/scl/fi/hexg5kal8hdbuhv8f39ez/star-terk-p-sni-ka-3.mp3?rlkey=rk0k2kkvh06xcqzzm9v1c1bmm&st=4icoon1g&dl=1", title: "Star Trek Písnička Posádek v.3", duration: '02:29', manuallyEdited: false, lastEditedAt: null }, //27
{ src: "https://dl.dropboxusercontent.com/scl/fi/wcx0yh5vqh6da7re7topd/star-terk-p-sni-ka-3-2.mp3?rlkey=v86ltne45qv7sx8muc71hwrk9&st=whcmp6r8&dl=1", title: "Star Trek Písnička Posádek v.4", duration: '01:43', manuallyEdited: false, lastEditedAt: null }, //28
{ src: "https://dl.dropboxusercontent.com/scl/fi/rn7b6bvpsnfut6wqewxjz/Star-tek-p-sni-ka-pos-dek-4.mp3?rlkey=dryx6brexafix5cj921otvf5k&st=j7xkxd7m&dl=1", title: "Star Trek Písnička Posádek v.5", duration: '03:32', manuallyEdited: false, lastEditedAt: null }, //29
{ src: "https://dl.dropboxusercontent.com/scl/fi/yfehbrin7c3vi3tvnc7kc/Star-tek-p-sni-ka-pos-dek-7.mp3?rlkey=lajmr19vwbkf78gy1v265kf9u&st=gedx6g9v&dl=1", title: "Star Trek Písnička Posádek v.6", duration: '02:49', manuallyEdited: false, lastEditedAt: null }, //30
{ src: "https://dl.dropboxusercontent.com/scl/fi/k380vwma00v0c29hidtqi/Star-tek-p-sni-ka-pos-dek-9.mp3?rlkey=h7y8brihtr831easrdsh9xkpi&st=wp3esqld&dl=1", title: "Star Trek Písnička Posádek v.7", duration: '03:21', manuallyEdited: false, lastEditedAt: null }, //31
{ src: "https://dl.dropboxusercontent.com/scl/fi/mr6erkk5n84k57qcszzmx/Star-tek-p-sni-ka-pos-dek-10.mp3?rlkey=wmslnntr00rt0vabgfv2wzxng&st=5m9pnouh&dl=1", title: "Star Trek Písnička Posádek v.8", duration: '03:56', manuallyEdited: false, lastEditedAt: null }, //32
{ src: "https://dl.dropboxusercontent.com/scl/fi/bfxlnanu7jm5gisn04j5g/stat-tek-pisnicka-2.mp3?rlkey=0d6e0iucvfxocvm386uqox8gq&st=ktfvgpba&dl=1", title: "Star Trek Písnička v.9", duration: '03:39', manuallyEdited: false, lastEditedAt: null }, //33            
{ src: "https://dl.dropboxusercontent.com/scl/fi/ulcq4mit0ucamvl4tv0c1/star-trek-v-echni-serie.mp3?rlkey=c3mc95v1uft1amf0pci5i6o54&st=dqqdunyb&dl=1", title: "Star Trek Všechny Série", duration: '04:00', manuallyEdited: false, lastEditedAt: null }, //34  
{ src: "https://dl.dropboxusercontent.com/scl/fi/5t3lw3e7z3ktkvyia9z91/Star-trek-Klingoni.mp3?rlkey=hy7i5e3z8e9hty33jn2yb4qym&st=g3av6e0t&dl=1", title: "Star Trek Klingoni v.1", duration: '02:14', manuallyEdited: false, lastEditedAt: null }, //35
{ src: "https://dl.dropboxusercontent.com/scl/fi/dswgdwr4ha5zwobzpi65o/Star-trek-Klingoni-2.mp3?rlkey=y3bknrocic66fysdbyg6rypc9&st=dkgis1hg&dl=1", title: "Star Trek Klingoni v.2", duration: '02:06', manuallyEdited: false, lastEditedAt: null }, //36
{ src: "https://dl.dropboxusercontent.com/scl/fi/eexwqik55aafcdbzfx3kz/Klingonsk-opera-star-trek-1.mp3?rlkey=yfkld3uizzvrcdeeexc2p04xh&st=tmo3n2so&dl=1", title: "Klingonská Opera v.1", duration: '02:40', manuallyEdited: false, lastEditedAt: null }, //37
{ src: "https://dl.dropboxusercontent.com/scl/fi/iddvpiwebeqmhee688jeb/Klingonsk-opera-star-trek-2.mp3?rlkey=wf7hratdanpryqydwdr5htwjv&st=xdu1p96r&dl=1", title: "Klingonská Opera v.2", duration: '03:59', manuallyEdited: false, lastEditedAt: null }, //38

// ═══════════════════════════════════════════════════════════
// 🎧 HVĚZDNÉ PLAMENY & HVĚZDY A PLAMENY
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/kzqtqh7dpzv57i7dyi6cr/Hv-zdy-a-Plameny-org.mp3?rlkey=tgxrfqz52058ilcqcxtf9avhl&st=2kt1169z&dl=1", title: "Hvězdy a Plameny v.1", manuallyEdited: false, lastEditedAt: null }, //39       
{ src: 'https://dl.dropboxusercontent.com/scl/fi/w3b8kuohto098omw0z3b8/hvezdy-a-plameny.mp3?rlkey=3j379v1pbmnvnwyb8dwxk0bie&st=34kh84g0&dl=1', title: 'Hvězdy a Plameny v.2', manuallyEdited: false, lastEditedAt: null }, //40
{ src: 'https://dl.dropboxusercontent.com/scl/fi/zpnrs94vqygfbfhwwxu79/hvezdy-a-plameny-v.2.mp3?rlkey=8nzdujhednp7ri65kh42sdar0&st=dv83wq0k&dl=1', title: 'Hvězdy a Plameny v.3', manuallyEdited: false, lastEditedAt: null }, //41
{ src: 'https://dl.dropboxusercontent.com/scl/fi/nms1mnq4tv9bmm3tcrydx/hvezdy-a-plameny-v.3.mp3?rlkey=x130f7pjj49xxu1hmdkcoglvg&st=8zrdo9t0&dl=1', title: 'Hvězdy a Plameny v.4', manuallyEdited: false, lastEditedAt: null }, //42
{ src: 'https://dl.dropboxusercontent.com/scl/fi/utu6md4m2k8lk1fny20w7/hvezdy-a-plameny-v.4.mp3?rlkey=w2ex0f4majq2yos858xlaoyam&st=fkanr8mv&dl=1', title: 'Hvězdy a Plameny v.5', manuallyEdited: false, lastEditedAt: null }, //43
{ src: 'https://dl.dropboxusercontent.com/scl/fi/wsqsrw2i32exaqwhsb5rm/hvezdy-a-plameny-v.5.mp3?rlkey=51gsmodvw4wq1g71jp8hwyqh0&st=w62cw6ol&dl=1', title: 'Hvězdy a Plameny v.6', manuallyEdited: false, lastEditedAt: null }, //44 
// ═══════════════════════════════════════════════════════════
// 🎧 HVĚZDNÉ PLAMENY Disco Verze
// ═══════════════════════════════════════════════════════════ 
{ src: "https://dl.dropboxusercontent.com/scl/fi/z54l1sn2yrci97xeg3e6e/HV-ZDN-PLAMENY-DICO-VERZE-V.1.mp3?rlkey=jyfdzy0ompb8ks4ov0tzoniol&st=4162nuh3&dl=1",title: "Hvězdné Plameny Disco Verze v.1", manuallyEdited: false, lastEditedAt: null }, //45 
{ src: "https://dl.dropboxusercontent.com/scl/fi/d11ro7p6pmrcjkpjdm0p5/HV-ZDN-PLAMENY-DICO-VERZE-V.2.mp3?rlkey=oi2wucut7b30dal2t3efmp67y&st=dh50smjg&dl=1",title: "Hvězdné Plameny Disco Verze v.2", manuallyEdited: false, lastEditedAt: null }, //46
{ src: "https://dl.dropboxusercontent.com/scl/fi/861lxplmb2ytlugi7xu8u/HV-ZDN-PLAMENY-DICO-VERZE-V.4.mp3?rlkey=t9orz8yxtl95k7mycx55bytym&st=pu6x5h87&dl=1",title: "Hvězdné Plameny Disco Verze v.3", manuallyEdited: false, lastEditedAt: null }, //47
{ src: "https://dl.dropboxusercontent.com/scl/fi/zusevzhfh9ofqjvtznrx3/HV-ZDN-PLAMENY-DICO-VERZE-V.13.mp3?rlkey=we8kdvae7vv0lyqm2uvlfppo3&st=pxkxgugg&dl=1",title: "Hvězdné Plameny Disco Verze v.4", manuallyEdited: false, lastEditedAt: null }, //48
{ src: "https://dl.dropboxusercontent.com/scl/fi/5k8fby7gcb2j08qvgj6xt/HV-ZDN-PLAMENY-DICO-VERZE-V.24.mp3?rlkey=9dqweybqtbip1px0vp1zresmq&st=w8fxvr1v&dl=1",title: "Hvězdné Plameny Disco Verze v.5", manuallyEdited: false, lastEditedAt: null }, //49
{ src: "https://dl.dropboxusercontent.com/scl/fi/hv5nr3q9nnye5p9j1wmcs/HV-ZDN-PLAMENY-DICO-VERZE-V.25.mp3?rlkey=pqgbm75bcrwbwf3j9zcj8bdtd&st=6u9rswbe&dl=1",title: "Hvězdné Plameny Disco Verze v.6", manuallyEdited: false, lastEditedAt: null }, //50
{ src: "https://dl.dropboxusercontent.com/scl/fi/hnwu6kowls4goqizray8q/HV-ZDN-PLAMENY-DICO-VERZE-V.26.mp3?rlkey=bz9s4x4ujkf9oxqzeki3dzl68&st=uvjo2qrw&dl=1",title: "Hvězdné Plameny Disco Verze v.7", manuallyEdited: false, lastEditedAt: null }, //51 
// ═══════════════════════════════════════════════════════════
// 🎧 HVĚZDNÉ PLAMENY Remastered
// ═══════════════════════════════════════════════════════════ 
{ src: "https://dl.dropboxusercontent.com/scl/fi/vu0erherxo1cv7fm1w97s/Hv-zdy-a-Plameny-Remastered-V.1.mp3?rlkey=h5rqabwrkxcobrka6rewdrjrf&st=0q9m6iur&dl=1", title: "Hvězdné Plameny v.8", manuallyEdited: false, lastEditedAt: null }, //52  
{ src: "https://dl.dropboxusercontent.com/scl/fi/h1c51dl8r1yggfexi6a2p/Hv-zdy-a-Plameny-Remastered-V.2.mp3?rlkey=07r123j8po3elr4nim1b1xo0r&st=c0gl2g4t&dl=1", title: "Hvězdné Plameny v.9", manuallyEdited: false, lastEditedAt: null }, //53
{ src: 'https://dl.dropboxusercontent.com/scl/fi/1xntnq7982u6abwo18k8n/Hv-zdy-a-Plameny-Remastered-v.1.mp3?rlkey=4gumv006lp86s1tpigx2aw672&st=froqivhl&dl=1', title: 'Hvězdy a Plameny v.10', manuallyEdited: false, lastEditedAt: null }, //54
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7qe1if043hc0wg8ehbh0a/Hv-zdy-a-Plameny-Remastered-v.2.mp3?rlkey=jngj7yerwsv5o0rhlyp8ppvmi&st=ltts4wdg&dl=1', title: 'Hvězdy a Plameny v.11', manuallyEdited: false, lastEditedAt: null }, //55   
// ═══════════════════════════════════════════════════════════
// 🎧 HVĚZDNÉ PLAMENY Star Trek Verze
// ═══════════════════════════════════════════════════════════  
{ src: 'https://dl.dropboxusercontent.com/scl/fi/xjtthnptvx8hbdb83njk2/star-trek-hv-zdn-plameny-v.1.mp3?rlkey=5cs7k22d0un9zeew7q9xyu1bc&st=7mle66hq&dl=1', title: 'Star Trek Hvězdné Plameny v.1', manuallyEdited: false, lastEditedAt: null }, //56
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4cs09ja5up24h0z5qmb76/star-trek-hv-zdn-plameny-v.2.mp3?rlkey=xxvtoz1cbtcvxpcude6x511k8&st=mit48xm5&dl=1', title: 'Star Trek Hvězdné Plameny v.2', manuallyEdited: false, lastEditedAt: null }, //57    
// ═══════════════════════════════════════════════════════════
// 🎧 HVĚZDNÉ PLAMENY Nová Série
// ═══════════════════════════════════════════════════════════ 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/vlo0ihnstzbkh4fdbsxha/hvezdy-a-plameny-nova-v.1.mp3?rlkey=ebc4v69mc2se8jkeu5qdi9327&st=ztt3igif&dl=1', title: 'Hvězdy a Plameny Nová v.1', manuallyEdited: false, lastEditedAt: null }, //58       
{ src: 'https://dl.dropboxusercontent.com/scl/fi/wr4hrytm7mzare8vhnje4/hvezdy-a-plameny-nova-v.2.mp3?rlkey=3s2h33rhc8dmoeyz3u5tkrsnc&st=atcxe6v4&dl=1', title: 'Hvězdy a Plameny Nová v.2', manuallyEdited: false, lastEditedAt: null }, //59
{ src: 'https://dl.dropboxusercontent.com/scl/fi/5sgcfmp2acu92n2pvaa3n/hvezdy-a-plameny-nova-v.3.mp3?rlkey=l7psk8eb3se63lpvtj6f87hva&st=w96s2ha5&dl=1', title: 'Hvězdy a Plameny Nová v.3', manuallyEdited: false, lastEditedAt: null }, //60
{ src: 'https://dl.dropboxusercontent.com/scl/fi/mr6c7lnt095o7irvobpyw/hvezdy-a-plameny-nova-v.4.mp3?rlkey=jw86ueu24meh2v7uefvupqo8c&st=aaz3c1yd&dl=1', title: 'Hvězdy a Plameny Nová v.4', manuallyEdited: false, lastEditedAt: null }, //61
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4c9prfla10oxlw7qf8kq5/hvezdy-a-plameny-nova-v.5.mp3?rlkey=l9fb55zdit817lua8pcppznk2&st=vkhie9yc&dl=1', title: 'Hvězdy a Plameny Nová v.5', manuallyEdited: false, lastEditedAt: null }, //62
{ src: 'https://dl.dropboxusercontent.com/scl/fi/e3hgwkdb1dxwz4d6za0eo/hvezdy-a-plameny-nova-v.6.mp3?rlkey=r0zh6p473auyio9oay66ynb5h&st=w9kur44p&dl=1', title: 'Hvězdy a Plameny Nová v.6', manuallyEdited: false, lastEditedAt: null }, //63
{ src: 'https://dl.dropboxusercontent.com/scl/fi/6k4pyq4v85fpwbh8trkwq/hvezdy-a-plameny-nova-v.7-top-1.mp3?rlkey=ragwnjydgn1mkzz9flxeawjz9&st=cb1hntsg&dl=1', title: 'Hvězdy a Plameny Nová v.7', manuallyEdited: false, lastEditedAt: null }, //64
{ src: 'https://dl.dropboxusercontent.com/scl/fi/kr23h0f6v0s1s71x0vx0w/hvezdy-a-plameny-nova-v.8-top-2.mp3?rlkey=mfv934b4emw7u35xdqzb34bzt&st=twemxwpr&dl=1', title: 'Hvězdy a Plameny Nová v.8', manuallyEdited: false, lastEditedAt: null }, //65   

// ═══════════════════════════════════════════════════════════
// 🎧 VELKÉ OSLAVY DS9
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/0pjs6006vyxnneol5kmb0/velk-oslavy-ds9-V.1-Top2.mp3?rlkey=gzlayqu1qg5j63eucf8qy1y02&st=0upduvwu&dl=1",title: "Velké Oslavy DS9 v.1", manuallyEdited: false, lastEditedAt: null }, //66
{ src: "https://dl.dropboxusercontent.com/scl/fi/o2s8ggtekzmw9me861l7h/velk-oslavy-ds9-V.2.mp3?rlkey=ov1f8z1dh6oiz3iyzeotue7jg&st=5zps1rhx&dl=1",title: "Velké Oslaby DS9 v.2", manuallyEdited: false, lastEditedAt: null }, //67
{ src: "https://dl.dropboxusercontent.com/scl/fi/6zw923x4tanvkjsczmxbe/velk-oslavy-ds9-V.3.mp3?rlkey=w51y716l9gr92z14y9xi8ai07&st=1nud4ku3&dl=1",title: "Velké Oslaby DS9 v.3", manuallyEdited: false, lastEditedAt: null }, //68
{ src: "https://dl.dropboxusercontent.com/scl/fi/3ehelfnqs0owq4azk8ztu/velk-oslavy-ds9-V.4.mp3?rlkey=76rkn6lkqqrtm0l14xweg4mpo&st=18w9o0oa&dl=1",title: "Velké Oslaby DS9 v.4", manuallyEdited: false, lastEditedAt: null }, //69       
{ src: "https://dl.dropboxusercontent.com/scl/fi/fof9r4whf5q4obu2eph3v/velk-oslavy-ds9-V.5.mp3?rlkey=kbqzomstplo4mxp7m8pt1ga4u&st=zsi640cz&dl=1",title: "Velké Oslaby DS9 v.5", manuallyEdited: false, lastEditedAt: null }, //70
{ src: "https://dl.dropboxusercontent.com/scl/fi/yko0z073uve2oi28pw974/velk-oslavy-ds9-V.6.mp3?rlkey=nu542dsonhslq2d1uqwl6r1wc&st=5ed5kzua&dl=1",title: "Velké Oslaby DS9 v.6", manuallyEdited: false, lastEditedAt: null }, //71
{ src: "https://dl.dropboxusercontent.com/scl/fi/rwkuusern1cgtrg3uf2ym/velk-oslavy-ds9-V.7.mp3?rlkey=c4cxcsthye40ntif7gk0xgt1g&st=rockkqvo&dl=1",title: "Velké Oslaby DS9 v.7", manuallyEdited: false, lastEditedAt: null }, //72
{ src: "https://dl.dropboxusercontent.com/scl/fi/varh31wjuldj9vhz7ys01/velk-oslavy-ds9-v.8-Top1.mp3?rlkey=t4nfn8tis6ilacz13vm7pjtul&st=1sflpjs3&dl=1",title: "Velké Oslaby DS9 v.8", manuallyEdited: false, lastEditedAt: null }, //73

// ═══════════════════════════════════════════════════════════
// 🎧 SPECIÁL: ČERNÝ HAVRAN & ENTERPRISE
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/ce6bh03ghx9zueyj04z5p/ern-havran-Czech.mp3?rlkey=yknv0yzzec235p7ssk78bf5gc&st=6xcn1s6i&dl=1",title: "Černý Havran", manuallyEdited: false, lastEditedAt: null }, //74     
{ src: "https://dl.dropboxusercontent.com/scl/fi/cpj7vvl8kbjr80i5kdi6l/P-sni-ka-o-Enterprise-a-NCC-1701-D-v.7.mp3?rlkey=s213mz3x608ocekrktzoq98gt&st=plfx3oas&dl=1",title: "Písnička o Enterprise a NCC 1701 D v.1", manuallyEdited: false, lastEditedAt: null }, //75
{ src: "https://dl.dropboxusercontent.com/scl/fi/09v1mudjybqkpx7bos7fz/P-sni-ka-o-Enterprise-a-NCC-1701-D-v.7-v-2.mp3?rlkey=ult84zjchfj0sljrmfqslkdd3&st=v7plml0q&dl=1",title: "Písnička o Enterprise a NCC 1701 D v.2", manuallyEdited: false, lastEditedAt: null }, //76   
{ src: "https://dl.dropboxusercontent.com/scl/fi/wv8gurlh0dyyqgvczn0i2/P-sni-ka-o-Enterprise-a-NCC-1701-D.mp3?rlkey=xysxuormyjteveympe4hgipz1&st=m3h8ghu9&dl=1",title: "Písnička o Enterprise a NCC 1701 D v.3", manuallyEdited: false, lastEditedAt: null }, //77   
{ src: "https://dl.dropboxusercontent.com/scl/fi/f4o0a1zge4sigiz3k7959/P-sni-ka-o-Enterprise-a-NCC-1701-D-v.5.mp3?rlkey=rpcd68ysaa8uwwqc427wzlq90&st=wzy7bnu4&dl=1",title: "Písnička o Enterprise a NCC 1701 D v.4", manuallyEdited: false, lastEditedAt: null }, //78  

// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK PÍSNIČKA POSÁDEK (DISCO VERZE)
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/1ubpb0orcki3f031vsb24/star-trek-p-sni-ka-o-pos-dk-ch-v.1.mp3?rlkey=cpxyo8va9123ljx8t8ngh44np&st=r9062rts&dl=1",title: "Star Trek Písnička Posádek Disco v.1", manuallyEdited: false, lastEditedAt: null }, //79              
{ src: "https://dl.dropboxusercontent.com/scl/fi/7euhdrx1lmjqzo1xa35gj/star-trek-p-sni-ka-o-pos-dk-ch-v.2.mp3?rlkey=3xgc6b7pboyfgrjvcmspws4tp&st=hmgv9eua&dl=1",title: "Star Trek Písnička Posádek Disco v.2", manuallyEdited: false, lastEditedAt: null }, //80              
{ src: "https://dl.dropboxusercontent.com/scl/fi/ksxqpfiqx76oluenhowzo/star-trek-p-sni-ka-o-pos-dk-ch-v.3.mp3?rlkey=r6eqazy355hkumyo69jszq1ao&st=8z4lnk59&dl=1",title: "Star Trek Písnička Posádek Disco v.3", manuallyEdited: false, lastEditedAt: null }, //81              
{ src: "https://dl.dropboxusercontent.com/scl/fi/96mae2ko4etzwgizd1lxg/star-trek-p-sni-ka-o-pos-dk-ch-v.4.mp3?rlkey=gx8xkqsefd1jfcqn86g81mya5&st=yaxreec1&dl=1",title: "Star Trek Písnička Posádek Disco v.4", manuallyEdited: false, lastEditedAt: null }, //82  
{ src: "https://dl.dropboxusercontent.com/scl/fi/ze5mjoe8eqgrpwkg26qe0/star-trek-p-sni-ka-o-pos-dk-ch-v.5.mp3?rlkey=up2qsecc9c0we3j6ukdd2wx14&st=nvlpyzgl&dl=1",title: "Star Trek Písnička Posádek Disco v.5", manuallyEdited: false, lastEditedAt: null }, //83          
{ src: "https://dl.dropboxusercontent.com/scl/fi/f7rpkrb5d4oayuujwowsd/star-trek-p-sni-ka-o-pos-dk-ch-v.6.mp3?rlkey=8wmgui88mqz182kqijaxe218o&st=xfzwslay&dl=1",title: "Star Trek Písnička Posádek Disco v.6", manuallyEdited: false, lastEditedAt: null }, //84          
{ src: "https://dl.dropboxusercontent.com/scl/fi/0lu4iy8imnjfoer0h5sxx/star-trek-p-sni-ka-o-pos-dk-ch-v.7.mp3?rlkey=2bfzirx8eee9avkpcqeux0wap&st=9oc37rjt&dl=1",title: "Star Trek Písnička Posádek Disco v.7", manuallyEdited: false, lastEditedAt: null }, //85          
{ src: "https://dl.dropboxusercontent.com/scl/fi/mpv5x7ctx47g5annnrrwx/star-trek-p-sni-ka-o-pos-dk-ch-v.8.mp3?rlkey=lyy7poxwdmznhm9pjbbkm2p2w&st=98ypi5dz&dl=1",title: "Star Trek Písnička Posádek Disco v.8", manuallyEdited: false, lastEditedAt: null }, //86          
{ src: "https://dl.dropboxusercontent.com/scl/fi/jy5lnm3gvr8wonk9hevit/star-trek-p-sni-ka-o-pos-dk-ch-v.9.mp3?rlkey=pnlafws9na7327fwhltttdtnj&st=8fijh4se&dl=1",title: "Star Trek Písnička Posádek Disco v.9", manuallyEdited: false, lastEditedAt: null }, //87          
{ src: "https://dl.dropboxusercontent.com/scl/fi/13wqn6cb90uzoxboumva6/star-trek-p-sni-ka-o-pos-dk-ch-v.10.mp3?rlkey=pxqz1ob71w0oe2imo2zsr9wiw&st=3oc5sm5s&dl=1",title: "Star Trek Písnička Posádek Disco v.10", manuallyEdited: false, lastEditedAt: null }, //88        

// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK SOUTĚŽ (ENTERPRISE & DS9)
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/8acno184v1hne57pajobo/star-trek-sout-1.mp3?rlkey=ubwep111sfll8bsyszgotmu36&st=g7mfb1ld&dl=1", title: "Star Trek Soutěž v.1", manuallyEdited: false, lastEditedAt: null }, //89
{ src: "https://dl.dropboxusercontent.com/scl/fi/fnxyyuv8huallq9g2wqs5/star-trek-sout-2.mp3?rlkey=3k4xcpssgbdrr5u6e5ej6zk7h&st=qfl50p4d&dl=1", title: "Star Trek Soutěž v.2", manuallyEdited: false, lastEditedAt: null }, //90
{ src: "https://dl.dropboxusercontent.com/scl/fi/wzeqg0l0bu9mse2ixxkpy/star-trek-sout-3.mp3?rlkey=wqd7tljlazpp2cpqoem9gnkdb&st=hbmut3xh&dl=1", title: "Star Trek Soutěž v.3", manuallyEdited: false, lastEditedAt: null }, //91
{ src: "https://dl.dropboxusercontent.com/scl/fi/n2e8gz7sf99rvtzzf6uee/star-trek-sout-4.mp3?rlkey=wyup1v6xl8qo6g7dq3yxqkczc&st=x3tvzshx&dl=1", title: "Star Trek Soutěž v.4", manuallyEdited: false, lastEditedAt: null }, //92
{ src: "https://dl.dropboxusercontent.com/scl/fi/6sfmcqpdg3avkwso4ucpf/Karaoke-na-Enterprise-5.mp3?rlkey=m8sx7x4ix1fd2ak2yq13b6upy&st=5sovg8c8&dl=1", title: "Star Trek Soutěž v.5", manuallyEdited: false, lastEditedAt: null }, //93
{ src: "https://dl.dropboxusercontent.com/scl/fi/a8gip4mg752f76f7u971j/Karaoke-na-Enterprise-6.mp3?rlkey=zxyhivnohx0cov069ccs8j8xo&st=l5z3k7k5&dl=1", title: "Star Trek Soutěž v.6", manuallyEdited: false, lastEditedAt: null }, //94
// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK SOUTĚŽ Na Deep Space Nine
// ═══════════════════════════════════════════════════════════ 
{ src: "https://dl.dropboxusercontent.com/scl/fi/enh0nxwnm1u5v0mon4luy/star-trek-sout-na-deep-space-nine-1.mp3?rlkey=grcdhapaq3ct66j41cylbd5wj&st=btzwwno3&dl=1", title: "Star Trek Soutěž na DS9 v.1", manuallyEdited: false, lastEditedAt: null }, //95
{ src: "https://dl.dropboxusercontent.com/scl/fi/mjqwsbtdl86n7akxxsh7l/star-trek-sout-na-deep-space-nine-2.mp3?rlkey=36ug7ut6qgxkunwxoqa4uust7&st=26whu40u&dl=1", title: "Star Trek Soutěž na DS9 v.2", manuallyEdited: false, lastEditedAt: null }, //96
{ src: "https://dl.dropboxusercontent.com/scl/fi/plobktvizyq07sk6xj2tx/star-trek-sout-na-deep-space-nine-3.mp3?rlkey=xrwazluywbabtekgjo03elw1e&st=pujepxx5&dl=1", title: "Star Trek Soutěž na DS9 v.3", manuallyEdited: false, lastEditedAt: null }, //97
{ src: "https://dl.dropboxusercontent.com/scl/fi/g36fk3yhe9ve3x3j023w6/star-trek-sout-na-deep-space-nine-4.mp3?rlkey=q5d37jnp0rvbn49liohaun6hf&st=j3lc2nmk&dl=1", title: "Star Trek Soutěž na DS9 v.4", manuallyEdited: false, lastEditedAt: null }, //98
{ src: "https://dl.dropboxusercontent.com/scl/fi/h57cit5eklouyuuuvx8q3/star-trek-sout-na-deep-space-nine-5.mp3?rlkey=4etrqaxge41nj8gmwq76bqhs3&st=r3azqnhw&dl=1", title: "Star Trek Soutěž na DS9 v.5", manuallyEdited: false, lastEditedAt: null }, //99
{ src: "https://dl.dropboxusercontent.com/scl/fi/u91l7b9ww4gwr6ssu470s/star-trek-sout-na-deep-space-nine-6.mp3?rlkey=uwfuro88zfka6xxzapxrpecx2&st=sjhlwrtl&dl=1", title: "Star Trek Soutěž na DS9 v.6", manuallyEdited: false, lastEditedAt: null }, //100
{ src: "https://dl.dropboxusercontent.com/scl/fi/ha8pavbnjimgcdnf93g9t/star-trek-sout-na-deep-space-nine-7.mp3?rlkey=c73lgmzdbjr5rtx0u0qnhvtbx&st=1l8l0tsn&dl=1", title: "Star Trek Soutěž na DS9 v.7", manuallyEdited: false, lastEditedAt: null }, //101
{ src: "https://dl.dropboxusercontent.com/scl/fi/bn33vbo54tu33hbnar7ox/star-trek-sout-na-deep-space-nine-8.mp3?rlkey=8rdk7r20d1h2xykfq8pmn8uux&st=d8qzl0l2&dl=1", title: "Star Trek Soutěž na DS9 v.8", manuallyEdited: false, lastEditedAt: null }, //102
{ src: "https://dl.dropboxusercontent.com/scl/fi/k9qmqi7l1cow2oqqizlfz/star-trek-sout-na-deep-space-nine-9.mp3?rlkey=3fdy1hiw4itk0h0w8qcni3yqr&st=q9hkyceg&dl=1", title: "Star Trek Soutěž na DS9 v.9", manuallyEdited: false, lastEditedAt: null }, //103
{ src: "https://dl.dropboxusercontent.com/scl/fi/ugml45kt4h6o591p3ibrz/star-trek-sout-na-deep-space-nine-10.mp3?rlkey=rozfsc6r9gy59up5xtxzk0za0&st=g2g7zvtk&dl=1", title: "Star Trek Soutěž na DS9 v.10", manuallyEdited: false, lastEditedAt: null }, //104
{ src: "https://dl.dropboxusercontent.com/scl/fi/oxo15o5abaf2cc3z6f7wa/star-trek-sout-na-deep-space-nine-11.mp3?rlkey=afey9t0bt03sm60vm8g7qddvy&st=eimas7pt&dl=1", title: "Star Trek Soutěž na DS9 v.11", manuallyEdited: false, lastEditedAt: null }, //105
{ src: "https://dl.dropboxusercontent.com/scl/fi/ih11tzjn4qbi8macdqes6/star-trek-sout-na-deep-space-nine-12.mp3?rlkey=4vwkx3m3rae9lvqk7oqmvntww&st=zhb6ytr8&dl=1", title: "Star Trek Soutěž na DS9 v.12", manuallyEdited: false, lastEditedAt: null }, //106
{ src: "https://dl.dropboxusercontent.com/scl/fi/4m6ypnmrsqlypadyfuw3j/star-trek-sout-na-deep-space-nine-13.mp3?rlkey=a7vj3jqvzcfj1ya54ol6fpir1&st=xfw0xzyo&dl=1", title: "Star Trek Soutěž na DS9 v.13", manuallyEdited: false, lastEditedAt: null }, //107
{ src: "https://dl.dropboxusercontent.com/scl/fi/u85upit3ivjxbwxezqfci/star-trek-sout-na-deep-space-nine-14.mp3?rlkey=rdta91qj8bck97wq5f4i07b8y&st=b5alg5ya&dl=1", title: "Star Trek Soutěž na DS9 v.14", manuallyEdited: false, lastEditedAt: null }, //108        

// ═══════════════════════════════════════════════════════════
// 🎧 VÍCE ADMIRÁL JIŘÍK & ADMIRÁL CHATBOT CLAUDE.AI
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/064aefbc041suj0c8oua2/V-ce-admir-l-Ji-k-Admir-l-chatbot-Claude.AI-V.3.mp3?rlkey=vl8m9jou6jr1a5r1hl9318k8i&st=5v0q3chj&dl=1 ", title: "Více Admirál Jiřík & Claude.AI v.1", manuallyEdited: false, lastEditedAt: null }, //109           
{ src: "https://dl.dropboxusercontent.com/scl/fi/xp0eg4pq6q5unhcxerkie/V-ce-admir-l-Ji-k-Admir-l-chatbot-Claude.AI-V.7.mp3?rlkey=pcasoogvq9f27gjgfc6ia4wts&st=223pm0qf&dl=1", title: "Více Admirál Jiřík & Claude.AI v.2", manuallyEdited: false, lastEditedAt: null }, //110   
{ src: "https://dl.dropboxusercontent.com/scl/fi/lse1g527r86witpb8cpc5/V-ce-admir-l-Ji-k-Admir-l-chatbot-Claude.AI-V.8.mp3?rlkey=g47dep5cojuorgtqgqchx3fax&st=l8xon1z8&dl=1", title: "Více Admirál Jiřík & Claude.AI v.3", manuallyEdited: false, lastEditedAt: null }, //111 
    
{ src: "https://dl.dropboxusercontent.com/scl/fi/urhkvb4afdoxbg9uan2ok/V-ce-admiral-Jirik-Admiral-chatbot-Admiral-Claude.AI-V.1.mp3?rlkey=r9l35hqj8dvdjvlkjg7rbacq2&st=2g4el6vg&dl=1", title: "Více Admirál Jiřík & Claude.AI v.4", manuallyEdited: false, lastEditedAt: null }, //112
{ src: "https://dl.dropboxusercontent.com/scl/fi/84tlmmxh64iolx01ofmar/V-ce-admiral-Jirik-Admiral-chatbot-Admiral-Claude.AI-V.2.mp3?rlkey=7u578p0v5s4agnjay038em6cb&st=qgo4ulrh&dl=1", title: "Více Admirál Jiřík & Claude.AI v.5", manuallyEdited: false, lastEditedAt: null }, //113
{ src: "https://dl.dropboxusercontent.com/scl/fi/edbjjt81i88k86lia9j30/V-ce-admiral-Jirik-Admiral-chatbot-Admiral-Claude.AI-V.3.mp3?rlkey=t5dk6eycz1ssjmv616932wmup&st=dqtzjo4h&dl=1", title: "Více Admirál Jiřík & Claude.AI v.6", manuallyEdited: false, lastEditedAt: null }, //114
{ src: "https://dl.dropboxusercontent.com/scl/fi/38kj9ots81lhn4ch60xrx/V-ce-admiral-Jirik-Admiral-chatbot-Admiral-Claude.AI-V.4.mp3?rlkey=djwohayh7hx84qfro81n5nmiv&st=mlhfn4pu&dl=1", title: "Více Admirál Jiřík & Claude.AI v.7", manuallyEdited: false, lastEditedAt: null }, //115
{ src: "https://dl.dropboxusercontent.com/scl/fi/4o201yvml13ia1dn7qcli/V-ce-admiral-Jirik-Admiral-chatbot-Admiral-Claude.AI-V-1-2-3.mp3?rlkey=shfno8g9db24i686a6il771kk&st=c7sv9qex&dl=1", title: "Více Admirál Jiřík & Claude.AI TOP-0 v.8", manuallyEdited: false, lastEditedAt: null }, //116
//{ src: "https://dl.dropboxusercontent.com/scl/fi/htvb306qxwg7rjzhp10vc/V-ce-admiral-Jirik-Admiral-chatbot-Admiral-Claude.AI-V.6.mp3?rlkey=b52shzqsf5180xcmcibzk6fl6&st=biqawas8&dl=1", title: "Více Admirál Jiřík & Claude.AI v.9", manuallyEdited: false, lastEditedAt: null }, //117    
{ src: "https://dl.dropboxusercontent.com/scl/fi/36pqt85qncua07mvj93vj/V-ce-admiral-Jirik-Admiral-chatbot-Admiral-Claude.AI.mp3?rlkey=qcl0b9318a673ix4wh1v26314&st=0y3abjy5&dl=1", title: "Více Admirál Jiřík & Claude.AI TOP-1", manuallyEdited: false, lastEditedAt: null }, //117-8     
// ═══════════════════════════════════════════════════════════
// 🎧 Více Admirál Jiřík & Chatbot
// ═══════════════════════════════════════════════════════════
  { src: "https://dl.dropboxusercontent.com/scl/fi/upigtgzher2bvmr5394j1/vice-admiral-ji-k-a-admiral-chatbot.V.1.mp3?rlkey=moiadh4qqse2a7i7b22tjb14n&st=ile4lup8&dl=1", title: "Více Admirál Jiřík & Chatbot v.1", manuallyEdited: false, lastEditedAt: null }, //148              
{ src: "https://dl.dropboxusercontent.com/scl/fi/z4r2ugvvnmyzd8nbyf0na/vice-admiral-ji-k-a-admiral-chatbot.V.2.mp3?rlkey=4g180cun5yt1lnl7zudwzx4ih&st=60crzwco&dl=1", title: "Více Admirál Jiřík & Chatbot v.2", manuallyEdited: false, lastEditedAt: null }, //149              
{ src: "https://dl.dropboxusercontent.com/scl/fi/o91w5hsnozau6oad1g4j3/vice-admiral-ji-k-a-admiral-chatbot.V.3.mp3?rlkey=5wdibr1lhe9v92eaxa1ktsow2&st=q1mcelob&dl=1", title: "Více Admirál Jiřík & Chatbot v.3", manuallyEdited: false, lastEditedAt: null }, //150              
{ src: "https://dl.dropboxusercontent.com/scl/fi/a8o0195oj0ao72bkku0f2/vice-admiral-ji-k-a-admiral-chatbot.V.4.mp3?rlkey=0kamkho6hr6gr0dqr42hjp5kj&st=75pji7yy&dl=1", title: "Více Admirál Jiřík & Chatbot v.4", manuallyEdited: false, lastEditedAt: null },  
    
// ═══════════════════════════════════════════════════════════
// 🎧 Více Admirál & Claude.AI
// ═══════════════════════════════════════════════════════════ 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/jpdrerbkn1vuw7vqttke6/V-ce-admir-l-Ji-k-a-Claude.AI-v.1.mp3?rlkey=i88lt4arsvme4h097eec0ek2j&st=pc944cwu&dl=1', title: 'Více admirál Jiřík & Claude.AI v.1', manuallyEdited: false, lastEditedAt: null }, //187
{ src: 'https://dl.dropboxusercontent.com/scl/fi/s3u5fezxfi1jo8z6mrxze/V-ce-admir-l-Ji-k-a-Claude.AI-v.2.mp3?rlkey=g712s0x5n72xl9fh4f8jcu69i&st=r7kv62aj&dl=1', title: 'Více admirál Jiřík & Claude.AI v.2', manuallyEdited: false, lastEditedAt: null }, //188             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/6jrfqi9s3pna49dee9sk1/V-ce-admir-l-Ji-k-a-Claude.AI-v.3.mp3?rlkey=y1u8k3ohokk4em2ukuoi5g79r&st=f694x807&dl=1', title: 'Více admirál Jiřík & Claude.AI v.3', manuallyEdited: false, lastEditedAt: null }, //189             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7u8x3wyyxkqjqjxkh89ec/V-ce-admir-l-Ji-k-a-Claude.AI-v.4.mp3?rlkey=z5layi8shi3t2qhyzk6fjwvzu&st=kmq0g5dp&dl=1', title: 'Více admirál Jiřík & Claude.AI v.4', manuallyEdited: false, lastEditedAt: null }, //190             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/1sr61tw6bozlnv6qyu6ks/V-ce-admir-l-Ji-k-a-Claude.AI-v.5.mp3?rlkey=ws2o7kvv0h24rbkt5f5mki4kj&st=0gz5gnn9&dl=1', title: 'Více admirál Jiřík & Claude.AI v.5', manuallyEdited: false, lastEditedAt: null }, //191             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/odfjak89mwzwwu0yhkzde/V-ce-admir-l-Ji-k-a-Claude.AI-v.6.mp3?rlkey=0fibl9ubon3aqbbcttbhnuofp&st=ef3wdvgv&dl=1', title: 'Více admirál Jiřík & Claude.AI v.6', manuallyEdited: false, lastEditedAt: null }, //192  
    
// ═══════════════════════════════════════════════════════════
// 🎧 VÁNOČNÍ HVĚZDNÁ FLOTILA
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/k9t18v9dek0b2d1r9h3km/V-no-n-hv-zdn-flotila-v.1.mp3?rlkey=8lv4sgnnqf50bsezu0b1jiprn&st=g79znz3x&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.1", manuallyEdited: false, lastEditedAt: null }, //118   
{ src: "https://dl.dropboxusercontent.com/scl/fi/k9qscdl4d2ks45ykotrf7/V-no-n-hv-zdn-flotila-v.2.mp3?rlkey=45eypom90tynyfe7c9ljb01xk&st=3w42nd6l&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.2", manuallyEdited: false, lastEditedAt: null }, //119 
{ src: "https://dl.dropboxusercontent.com/scl/fi/h7kp6hp86eoullbwpk502/V-no-n-hv-zdn-flotila-v.3.mp3?rlkey=7c3irtf3fnwuda7rqir1u9wpc&st=x5zpzpry&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.3", manuallyEdited: false, lastEditedAt: null }, //120   
{ src: "https://dl.dropboxusercontent.com/scl/fi/n7gwwqcwp6ows6nd74dn7/V-no-n-hv-zdn-flotila-v.4.mp3?rlkey=n6ud0bu89gnmknr1gevcbih1g&st=gm06i2x7&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.4", manuallyEdited: false, lastEditedAt: null }, //121               
{ src: "https://dl.dropboxusercontent.com/scl/fi/n7gwwqcwp6ows6nd74dn7/V-no-n-hv-zdn-flotila-v.4.mp3?rlkey=n6ud0bu89gnmknr1gevcbih1g&st=gm06i2x7&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.5", manuallyEdited: false, lastEditedAt: null }, //122   
{ src: "https://dl.dropboxusercontent.com/scl/fi/auhytys4jj9yzba2t6qf1/V-no-n-hv-zdn-flotila-v.6.mp3?rlkey=6uxv9ov3c2ug68en6moica1cp&st=cfg2fsjb&dl=1", title: "🎄 Vánoční Hvězdná Flotila v.6", manuallyEdited: false, lastEditedAt: null }, //123               
{ src: "https://dl.dropboxusercontent.com/scl/fi/ewdl26nnogg4fkhtbl2hf/V-no-n-hv-zdn-flotila-v.7.mp3?rlkey=b4k53fop1ik8fhpts18sao1j3&st=d771wvk4&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.7", manuallyEdited: false, lastEditedAt: null }, //124   
{ src: "https://dl.dropboxusercontent.com/scl/fi/vusc0wvfsu1ksddfkp5q1/V-no-n-hv-zdn-flotila-v.8.mp3?rlkey=fi31cvz066l4rh12133v773ye&st=lmdayk7v&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.8", manuallyEdited: false, lastEditedAt: null }, //125               
{ src: "https://dl.dropboxusercontent.com/scl/fi/zt3h0319iz7j5svk3htjg/V-no-n-hv-zdn-flotila-v.9.mp3?rlkey=6tl8kumc3el6sq2kvr5tljumh&st=7s8t86ia&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.9", manuallyEdited: false, lastEditedAt: null }, //126   
{ src: "https://dl.dropboxusercontent.com/scl/fi/mhr1dx2eet4ekxjrdpril/V-no-n-hv-zdn-flotila-v.10.mp3?rlkey=e1x78ofhqqhvvc293j49kvnox&st=vn45a3nt&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.10", manuallyEdited: false, lastEditedAt: null }, //127               
{ src: "https://dl.dropboxusercontent.com/scl/fi/f8korjpx5vygudobe751y/V-no-n-hv-zdn-flotila-aj-v.11.mp3?rlkey=75p2937zsn13jyts9ytoi8jel&st=2lk6byjx&dl=1 ", title: "🎄 Vánoční Hvězdná Flotila v.11", manuallyEdited: false, lastEditedAt: null }, //128    

// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK - DO NEZNÁMA (SÉRIE)
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/049qq9d3m6l2nzfrdhy3p/Star-Trek_-Do-nezn-ma.mp3?rlkey=spwsps7x20f7qgmmhsopx6q39&st=bcfzt5a0&dl=1", title: "Star Trek Do Neznáma v.1", manuallyEdited: false, lastEditedAt: null }, //129               
{ src: "https://dl.dropboxusercontent.com/scl/fi/d6mabsk8pcdxheh322uv0/Star-Trek-do-neznama-v.2.mp3?rlkey=g7z6mk4ham3n5s4pjjxn7srd7&st=z2951gp7&dl=1", title: "Star Trek Do Neznáma v.2", manuallyEdited: false, lastEditedAt: null }, //130                   
{ src: "https://dl.dropboxusercontent.com/scl/fi/h1iu2h7mizu1o63vwvtcv/Star-Trek-do-neznama-v.3.mp3?rlkey=s1px14pjmh62jmxc0ygt1o4s5&st=4iu7d1cw&dl=1", title: "Star Trek Do Neznáma v.3", manuallyEdited: false, lastEditedAt: null }, //131 
{ src: "https://dl.dropboxusercontent.com/scl/fi/djc3q1qqtidqv8cmmlc4r/Star-Trek-do-neznama-v.4-Top-1.mp3?rlkey=gxexg98bsp2c5arxjzvu016i8&st=12o7pqew&dl=1", title: "Star Trek Do Neznáma v.4", manuallyEdited: false, lastEditedAt: null }, //132         
{ src: "https://dl.dropboxusercontent.com/scl/fi/za7fxq8ng9cyjje8pmz6c/Star-Trek-do-neznama-v.5-Top-2.mp3?rlkey=0fsnk2q9rw97xcl1cgiifp4gf&st=pjsw8nwq&dl=1", title: "Star Trek Do Neznáma v.5", manuallyEdited: false, lastEditedAt: null }, //133         
// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK - DO NEZNÁMA Remake
// ═══════════════════════════════════════════════════════════ 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4834qpbtwv1sl8cynyp9x/star-trek-do-neznama-remake-v1.mp3?rlkey=q312iwodtdvk2ya8w7e3gw2cv&st=gq4l0w9r&dl=1', title: 'Star Trek Do Neznáma Remake v.1', manuallyEdited: false, lastEditedAt: null }, //134            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ptmeoxhjn1zhrjvu5b26t/star-trek-do-neznama-remake-v2.mp3?rlkey=lay48irwtcvm6shfvzsljc9vd&st=fvsh9y32&dl=1', title: 'Star Trek Do Neznáma Remake v.2', manuallyEdited: false, lastEditedAt: null }, //135            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/i1ag5qh4qlihjgwweocfo/star-trek-do-neznama-v.4-verze-1.mp3?rlkey=y3tsncupaxphx70e9icr6s6po&st=y7n2nzrp&dl=1', title: 'Star Trek Do Neznáma Remake v.3', manuallyEdited: false, lastEditedAt: null }, //136        
// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK - DO NEZNÁMA Starší verze
// ═══════════════════════════════════════════════════════════  
{ src: 'https://dl.dropboxusercontent.com/scl/fi/0o58a4lzyflzmfdj3povo/Star-Trek-do-neznama-v.1.mp3?rlkey=rh88vbjitsly9c0n2prs1g7y1&st=n0daz36r&dl=1', title: 'Star Trek Do Neznáma v.1 S', manuallyEdited: false, lastEditedAt: null }, //137
{ src: 'https://dl.dropboxusercontent.com/scl/fi/d6mabsk8pcdxheh322uv0/Star-Trek-do-neznama-v.2.mp3?rlkey=g7z6mk4ham3n5s4pjjxn7srd7&st=e3ivwj0n&dl=1', title: 'Star Trek Do Neznáma v.2 S', manuallyEdited: false, lastEditedAt: null }, //138
{ src: 'https://dl.dropboxusercontent.com/scl/fi/2o579b9u2bh3iy7j9w92f/Star-Trek-do-neznama-praven-verze.mp3?rlkey=g8axunywuw9v6kzaugd6ni2pj&st=z0whdog7&dl=1', title: 'Star Trek Do Neznáma v.3 s', manuallyEdited: false, lastEditedAt: null }, //139 
// ═══════════════════════════════════════════════════════════
// 🎧 STAR TREK - DO NEZNÁMA Nová Série
// ═══════════════════════════════════════════════════════════ 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/9h6b5zhnhc6u5j0kri7nm/star-trek-do-neznama-nova-v.1.mp3?rlkey=tff9j8mh81dj5crx0j5gep1u5&st=m8xezxkp&dl=1', title: 'Star Trek Do Neznáma Nová v.1', manuallyEdited: false, lastEditedAt: null }, //140
{ src: 'https://dl.dropboxusercontent.com/scl/fi/6l985zygg0p0m64kq76tj/star-trek-do-neznama-nova-v.2.mp3?rlkey=ulzvs3p4oqlilk0h0ichluvn9&st=beht1usw&dl=1', title: 'Star Trek Do Neznáma Nová v.2', manuallyEdited: false, lastEditedAt: null }, //141
{ src: 'https://dl.dropboxusercontent.com/scl/fi/aqeyjlqxod8zuj1dyh4t8/star-trek-do-neznama-nova-v.3.mp3?rlkey=g0b45jn4j5uv0e3bi0bla133b&st=16kku0hc&dl=1', title: 'Star Trek Do Neznáma Nová v.3', manuallyEdited: false, lastEditedAt: null }, //142
{ src: 'https://dl.dropboxusercontent.com/scl/fi/tml7gxkh8ylwrsod5qxvu/star-trek-do-neznama-nova-v.4.mp3?rlkey=s7tmwv0vhkyoie5anvkzwv3vx&st=jzswn54m&dl=1', title: 'Star Trek Do Neznáma Nová v.4', manuallyEdited: false, lastEditedAt: null }, //143
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ap2ou00a0lv1y5rm2ntsd/star-trek-do-neznama-nova-v.5.mp3?rlkey=63iasinq8xzqkh2h8ri7clj5k&st=xtq9hrpw&dl=1', title: 'Star Trek Do Neznáma Nová v.5', manuallyEdited: false, lastEditedAt: null }, //144    

// ═══════════════════════════════════════════════════════════
// 🎧 MIX & SPECIÁLNÍ PROJEKTY
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/4onalygztdm0pfes6vyip/Klingon-opera-star-trek.mp3?rlkey=zvokfh2gx4i1whieqbdam40kz&st=k3i7y619&dl=1", title: "Klingonská Opera Star Trek", manuallyEdited: false, lastEditedAt: null }, //145
{ src: "https://dl.dropboxusercontent.com/scl/fi/hvdpjs006hx6643hj38rk/Beyond-the-Stars-v.1.mp3?rlkey=rtgxbbtcs5zosj215hf4odmn6&st=7jiixej0&dl=1", title: "Beyond the Stars v.1", manuallyEdited: false, lastEditedAt: null }, //146              
{ src: "https://dl.dropboxusercontent.com/scl/fi/8bmnb3u2qclfqfhrf9r6x/Beyond-the-Stars-v.2.mp3?rlkey=ezaamgdpdyg3dvg2ngadxh7am&st=3msfough&dl=1", title: "Beyond the Stars v.2", manuallyEdited: false, lastEditedAt: null }, //147              
 //151              
// ═══════════════════════════════════════════════════════════
// 🎧 Týmová Práce
// ═══════════════════════════════════════════════════════════ 
{ src: "https://dl.dropboxusercontent.com/scl/fi/kxyq3z2uje7dd03w5kyfe/V-ce-admir-l-Ji-k-Admir-l-chatbot-Claude.AI-T-mov-Pr-ce-V.1.mp3?rlkey=p017fqibdwvq6nofqp38g5yea&st=ys2f0926&dl=1", title: "Týmová Práce na NCC-1701-D v.1", manuallyEdited: false, lastEditedAt: null }, //152           
{ src: "https://dl.dropboxusercontent.com/scl/fi/uanba9tela1n6e2ngyepg/V-ce-admir-l-Ji-k-Admir-l-chatbot-Claude.AI-T-mov-Pr-ce-V.2.mp3?rlkey=p9l11x06k2ov3zahbaxenbw54&st=7dtpse8o&dl=1", title: "Týmová Práce na NCC-1701-D v.2", manuallyEdited: false, lastEditedAt: null }, //153
{ src: "https://dl.dropboxusercontent.com/scl/fi/r4r37go18hsqgzov93nei/V-ce-admir-l-Ji-k-Admir-l-chatbot-Claude.AI-T-mov-Pr-ce-V.3.mp3?rlkey=hdcpadkhldumy5srgiextmt6r&st=e1bhhgpk&dl=1", title: "Týmová Práce na NCC-1701-D v.3", manuallyEdited: false, lastEditedAt: null }, //154
{ src: "https://dl.dropboxusercontent.com/scl/fi/vfawutdd3hbl78d3tc5rt/V-ce-admir-l-Ji-k-Admir-l-chatbot-Claude.AI-T-mov-Pr-ce-V.4.mp3?rlkey=lr03uqet3ef74wnid1nsgnmm5&st=nq65i35h&dl=1", title: "Týmová Práce na NCC-1701-D v.4", manuallyEdited: false, lastEditedAt: null }, //155
{ src: "https://dl.dropboxusercontent.com/scl/fi/04m7zzgm2cechke0kybw8/V-ce-admir-l-Ji-k-Admir-l-chatbot-Claude.AI-T-mov-Pr-ce-V.5-top-1.mp3?rlkey=7t92lk9f2ckt2ff45t4rhjvwt&st=2wjswbca&dl=1", title: "Týmová Práce na NCC-1701-D v.5", manuallyEdited: false, lastEditedAt: null }, //156                         
// ═══════════════════════════════════════════════════════════
// 🎧 Admirálský Deník
// ═══════════════════════════════════════════════════════════ 
{ src: "https://dl.dropboxusercontent.com/scl/fi/xryte4343vkkz37qcluyz/P-se-_-Admir-lsk-den-k-Admir-la-Chatbota-V.1.mp3?rlkey=izsuscmejelqd3w3mad2d3a5i&st=klmwhwen&dl=1", title: "Admirálský Deník v.1", manuallyEdited: false, lastEditedAt: null }, //157 
{ src: "https://dl.dropboxusercontent.com/scl/fi/buhhxky4xz434qa1f79dx/P-se-_-Admir-lsk-den-k-Admir-la-Chatbota-V.2.mp3?rlkey=r7hu5rxzcyauur02mshae5gu3&st=6v2jbdul&dl=1", title: "Admirálský Deník v.2", manuallyEdited: false, lastEditedAt: null }, //158
{ src: "https://dl.dropboxusercontent.com/scl/fi/5n5xapuqvkb7ygljvgauy/P-se-_-Admir-lsk-den-k-Admir-la-Chatbota-V.3.mp3?rlkey=nyg3evugyfeirhnrutj9zdwg7&st=8db67yn5&dl=1", title: "Admirálský Deník v.3", manuallyEdited: false, lastEditedAt: null }, //159
{ src: "https://dl.dropboxusercontent.com/scl/fi/t1z36j6mb8i6zb88py4qs/P-se-_-Admir-lsk-den-k-Admir-la-Chatbota-V.4.mp3?rlkey=i661bk67gwzxq1248kh4zkgpw&st=rbg9i40h&dl=1", title: "Admirálský Deník v.4", manuallyEdited: false, lastEditedAt: null }, //160
{ src: "https://dl.dropboxusercontent.com/scl/fi/tl8v92i0m6cu10uvob9bl/P-se-_-Admir-lsk-den-k-Admir-la-Chatbota-V.5-Top-2..mp3?rlkey=uu2bsxwetnyupawdfnq7sw7ts&st=xqcrstmf&dl=1", title: "Admirálský Deník v.5", manuallyEdited: false, lastEditedAt: null }, //161
{ src: "https://dl.dropboxusercontent.com/scl/fi/6s16eyyvlxwa9nx3zuke5/P-se-_-Admir-lsk-den-k-Admir-la-Chatbota-V.6-Top-1..mp3?rlkey=0arqcandq82qf1gtm23dv5n20&st=qkduhugj&dl=1", title: "Admirálský Deník v.6", manuallyEdited: false, lastEditedAt: null }, //162   
// ═══════════════════════════════════════════════════════════
// 🎧 Vánoční Hudba na palubě
// ═══════════════════════════════════════════════════════════  
{ src: "https://dl.dropboxusercontent.com/scl/fi/wvjzu3iqyq2vsvq135klj/V-no-n-Hudba-na-Palub-v.1.mp3?rlkey=lxp4j3fbehjangrv0t832srxj&st=myv0vmjt&dl=1", title: "Vánoční Hudba na Palubě v.1", manuallyEdited: false, lastEditedAt: null }, //163
{ src: "https://dl.dropboxusercontent.com/scl/fi/k8j9ueeaanvbi5hstjycb/V-no-n-Hudba-na-Palub-v.2.mp3?rlkey=32266kbkyetwclxl1qknvbdbl&st=1keskft7&dl=1", title: "Vánoční Hudba na Palubě v.2", manuallyEdited: false, lastEditedAt: null }, //164
{ src: "https://dl.dropboxusercontent.com/scl/fi/qrlhgym277deyy60z2f7w/V-no-n-Hudba-na-Palub-v.3.mp3?rlkey=pjqjvneu3u1iuv50p9u3lxxt7&st=mnaug2o2&dl=1", title: "Vánoční Hudba na Palubě v.3", manuallyEdited: false, lastEditedAt: null }, //165 
{ src: "https://dl.dropboxusercontent.com/scl/fi/izbalkp7de3w5m48le2xv/V-no-n-Hudba-na-Palub-v.4.mp3?rlkey=qe3p3ssjx2xrgqjfulbqotlg5&st=4zda72ay&dl=1", title: "Vánoční Hudba na Palubě v.4", manuallyEdited: false, lastEditedAt: null }, //166    
{ src: "https://dl.dropboxusercontent.com/scl/fi/jq16of1rejgniuxli5w5p/V-no-n-Hudba-na-Palub-v.5.mp3?rlkey=u8v892o3frxjfg0vzbbb2v43h&st=g8vs05pd&dl=1", title: "Vánoční Hudba na Palubě v.5", manuallyEdited: false, lastEditedAt: null }, //167     
// ═══════════════════════════════════════════════════════════
// 🎧 Remastered Bonusy
// ═══════════════════════════════════════════════════════════ 
{ src: "https://dl.dropboxusercontent.com/scl/fi/3q9f6dknc5ltrtv1zf71u/P-se-_-Admir-lsk-den-k-Admir-la-Chatbota-V.3-Remastered-V.3.mp3?rlkey=wujypwk13somkmyxdvsc17nnx&st=je445r9k&dl=1", title: "Admirálský Deník (Rema) v.1", manuallyEdited: false, lastEditedAt: null }, //168            
{ src: "https://dl.dropboxusercontent.com/scl/fi/hypr1ni1tf88nbe600gff/P-se-_-Admir-lsk-den-k-Admir-la-Chatbota-V.3-Remastered-V.4.mp3?rlkey=nrpjftz0howr1xrr19dqn4jx6&st=ewc4jjyz&dl=1", title: "Admirálský Deník (Rema) v.2", manuallyEdited: false, lastEditedAt: null }, //169     
{ src:"https://dl.dropboxusercontent.com/scl/fi/lh2oq4ssjccjngnbgjwpn/Hv-zdn-Pos-dka-Remastered-V.9.mp3?rlkey=unrvafu72fe6oildlrb7zhik5&st=ul0depqa&dl=1", title: "Hvězdná Posádka (Rema) v.9", manuallyEdited: false, lastEditedAt: null }, //170  
{ src: 'https://dl.dropboxusercontent.com/scl/fi/qdsz9ggqnkqgw51pj7k06/Stanice-Hlubok-Vesm-r-9-Remastered.mp3?rlkey=m6jhmtfsaw8xigu9p27g9ync1&st=9jv8h1jf&dl=1', title: 'Stanice Hluboký Vesmír 9 (Remastered)', manuallyEdited: false, lastEditedAt: null }, //171        

// ═══════════════════════════════════════════════════════════
// 🎧 VESMÍRNÁ ODYSEA (KOMPLET)
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/eyr17lry1clnuqolxre5j/Vesm-rn-Odysea-V.1.mp3?rlkey=32aw1g6okugh1c9pu4qpkz91f&st=6x30o87m&dl=1', title: 'Vesmírná Odysea v.1', manuallyEdited: false, lastEditedAt: null }, //172             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/qt1otz2xebl3kkvikvdjm/Vesm-rn-Odysea-V.2.mp3?rlkey=gakvk3w5rs0xmrbnjlhsu76cm&st=5u4wxw4a&dl=1', title: 'Vesmírná Odysea v.2', manuallyEdited: false, lastEditedAt: null }, //173
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7yeh1qlh53qix1vombvrn/Vesm-rn-Odysea-V.3.mp3?rlkey=4vxf48y12nj1ssr5fa77n69l3&st=52qkk2qi&dl=1', title: 'Vesmírná Odysea v.3', manuallyEdited: false, lastEditedAt: null }, //174            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/usv017ym9c0h6085uxz6r/Vesm-rn-Odysea-V.4.mp3?rlkey=vbnv8du5e5s3smnqlusmko2y4&st=m4wcywmd&dl=1', title: 'Vesmírná Odysea v.4', manuallyEdited: false, lastEditedAt: null }, //175            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/8npem7eu2ftpml1gz1krf/Vesm-rn-Odysea-V.5.mp3?rlkey=b4f3rstlybwnq6a4os1v44vdm&st=y2jzu0yr&dl=1', title: 'Vesmírná Odysea v.5', manuallyEdited: false, lastEditedAt: null }, //176            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/d5jr7hei2ymuledevm7m8/Vesm-rn-Odysea-V.6.mp3?rlkey=k2vmdhpk46o0fngmoyv70acea&st=6xifmw65&dl=1', title: 'Vesmírná Odysea v.6', manuallyEdited: false, lastEditedAt: null }, //177            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/92erpvy3u4zc04j5o8cuy/Vesm-rn-Odysea-V.7.mp3?rlkey=t0o790lxwyucceb6quy4arkj2&st=c6z3fpjy&dl=1', title: 'Vesmírná Odysea v.7', manuallyEdited: false, lastEditedAt: null }, //178            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/m4qcr8y36ishmv9kcp5p0/Vesm-rn-Odysea-V.8.mp3?rlkey=h8ke7ml7pklp4qbxakq2fmq6f&st=ohngbwxu&dl=1', title: 'Vesmírná Odysea v.8', manuallyEdited: false, lastEditedAt: null }, //179            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/v0nbtgqwuii1o1ss43azz/Vesm-rn-Odysea-V.9.mp3?rlkey=mc1bygy5fh75coot42c3t8dkr&st=a7w81b0y&dl=1', title: 'Vesmírná Odysea v.9', manuallyEdited: false, lastEditedAt: null }, //180            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/xmc7t8vts8m7k72hm6bc3/Vesm-rn-Odysea-V.10.mp3?rlkey=mmbcuw0wygs62uyuktsl22yoa&st=voob4jv4&dl=1', title: 'Vesmírná Odysea v.10', manuallyEdited: false, lastEditedAt: null }, //181            

// ═══════════════════════════════════════════════════════════
// 🎧 DALŠÍ PROJEKTY & BONUSY
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/wqqs5rpbwd092t158djjw/nova-posnicka.mp3?rlkey=n9awbj9z1azvb2ygn56b9wn9e&st=wadbtu0b&dl=1', title: 'Nová Písnička v.0', manuallyEdited: false, lastEditedAt: null }, //182            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/weopw6zr9j9w6sex2bf57/Kouzeln-V-noce-s-admir-ly-v.2.mp3?rlkey=xfo9wgqlgu575rxf2brzqpv8w&st=pg7st8f5&dl=1', title: 'Kouzelné Vánoce s Admirály v.0', manuallyEdited: false, lastEditedAt: null }, //183    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/wl5i599mnidodxc8gixyi/Posledn-den-k-NCC-1701-v-11.mp3?rlkey=hlg24huv9ggjmt344gjuiul2p&st=btvxv4b7&dl=1', title: 'Poslední Deník NCC-1701 v.1', manuallyEdited: false, lastEditedAt: null }, //184            
{ src: 'https://dl.dropboxusercontent.com/scl/fi/0f3iih97yk57gkq7veymi/Posledn-den-k-NCC-1701-v-11.mp3?rlkey=nqa1hi1wbnnjlacio1z17u49e&st=6js7or6q&dl=1', title: 'Poslední Deník NCC-1701 v.2', manuallyEdited: false, lastEditedAt: null }, //185  
{ src: 'https://dl.dropboxusercontent.com/scl/fi/24l3k0p4zday6f0ohd0to/Posledn-den-k-NCC-1701-v-17.mp3?rlkey=futpak2zji1s0cksitcsragyd&st=j2xku61z&dl=1', title: 'Poslední Deník NCC-1701 v.3', manuallyEdited: false, lastEditedAt: null }, //186 

            

// ═══════════════════════════════════════════════════════════
// 🎧 Na Cestě k Věčnosti
// ═══════════════════════════════════════════════════════════  
{ src: 'https://dl.dropboxusercontent.com/scl/fi/0fnjgh0c8svjxpsqqph5t/Na-Cest-k-V-nosti-V.1.mp3?rlkey=54x9bmmjxb33i47qvasnkraa9&st=cv54125z&dl=1', title: 'Na Cestě k Věčnosti v.1', manuallyEdited: false, lastEditedAt: null }, //193             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/t35xudn6rakbh5fvs32dr/Na-Cest-k-V-nosti-V.2.mp3?rlkey=rp5ckqyxzsmo365j7m8ttcs86&st=kf7ymtx8&dl=1', title: 'Na Cestě k Věčnosti v.2', manuallyEdited: false, lastEditedAt: null }, //194             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/d3wskuj9nnnxtkk6ru7uf/Na-Cest-k-V-nosti-V.3.mp3?rlkey=timmfpd18ka4r1foem2h5u9vl&st=fddz8i0o&dl=1', title: 'Na Cestě k Věčnosti v.3', manuallyEdited: false, lastEditedAt: null }, //195             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/e7ke9h0sd8z4foqheaytv/Na-Cest-k-V-nosti-V.4.mp3?rlkey=mnjx5lw5us827kp3yb6lyock8&st=v77zrfvb&dl=1', title: 'Na Cestě k Věčnosti v.4', manuallyEdited: false, lastEditedAt: null }, //196             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/kgj27r4c79xed0zi6ljzm/na-ceste-k-vecnosti-v.5.mp3?rlkey=5mefo6j4x1tmkaw0u34qiymx9&st=p8wzgkiz&dl=1', title: 'Na Cestě k Věčnosti v.5', manuallyEdited: false, lastEditedAt: null }, //197             
{ src: 'https://dl.dropboxusercontent.com/scl/fi/aehzbo7km5t7y47jqz7vm/na-ceste-k-vecnosti-v.6.mp3?rlkey=t9gtnzo9x8a3prd6f1fyzmlb8&st=dlytnlj9&dl=1', title: 'Na Cestě k Věčnosti v.6', manuallyEdited: false, lastEditedAt: null }, //198       
{ src: 'https://dl.dropboxusercontent.com/scl/fi/k6wi5e2qh45152obzhct8/na-ceste-k-vecnosti-v.7.mp3?rlkey=6tg4gisattbvlexk7ap8mndl5&st=vd7xnbjw&dl=1', title: 'Na Cestě k Věčnosti v.7', manuallyEdited: false, lastEditedAt: null }, //199
{ src: 'https://dl.dropboxusercontent.com/scl/fi/o9u5v9cc317g7mqm2kiy0/Na-cest-k-v-cnosti-v.2.0-nova-verze.mp3?rlkey=9fukslcoxmau62r974njjuayw&st=zeh00idx&dl=1', title: 'Na Cestě k Věčnosti v.2.0 (Nová Verze)', manuallyEdited: false, lastEditedAt: null }, //200

// ═══════════════════════════════════════════════════════════
// 🎧 Srdce mezi Hvězdami
// ═══════════════════════════════════════════════════════════   
{ src: 'https://dl.dropboxusercontent.com/scl/fi/qazvjqxkbre0sbnem67gx/Srdce-mezi-hv-zdami-Star-Trek-v2.1.mp3?rlkey=db7evo8tygn65arynew329ahs&st=0or2a8v9&dl=1', title: 'Srdce mezi hvězdami Star Trek v.2.1 ', manuallyEdited: false, lastEditedAt: null }, //201      
{ src: 'https://dl.dropboxusercontent.com/scl/fi/3eo01y34rlssox0f1vgj0/Srdce-mezi-hv-zdami-Star-Trek-v2.0.mp3?rlkey=yhvqqwwzf70a91bi0t7iz7gz5&st=bd0eyw5y&dl=1', title: 'Srdce mezi hvězdami Star Trek v.2.2', manuallyEdited: false, lastEditedAt: null }, //202    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7jygh1xw8puztqy6pdmcd/Srdce-mezi-hv-zdami-Star-Trek-v2.0.mp3?rlkey=67khxsi9ond3inf2g43pa3z8e&st=f8ytrufm&dl=1 ', title: 'Srdce mezi hvězdami Star Trek v.3.0', manuallyEdited: false, lastEditedAt: null }, //203
{ src: 'https://dl.dropboxusercontent.com/scl/fi/8ijrdrk9m1jpw4w34bxii/srdce-mezi-hv-zdami-v.1.mp3?rlkey=jep42frzecpnl3gxzjh6p3rvu&st=59mahimb&dl=1', title: 'Srdce mezi hvězdami v.1 ', manuallyEdited: false, lastEditedAt: null }, //204
{ src: 'https://dl.dropboxusercontent.com/scl/fi/017u9rj5ngfbw3hnny4ju/srdce-mezi-hv-zdami-v.2.mp3?rlkey=hofnwvvedxso6o3ee5tr0097s&st=9o6x7f5l&dl=1', title: 'Srdce mezi hvězdami v.2 ', manuallyEdited: false, lastEditedAt: null }, //205
{ src: 'https://dl.dropboxusercontent.com/scl/fi/bcqoq0vpsi66dzipmq2b2/srdce-mezi-hv-zdami-v.3.mp3?rlkey=yb9utkodamem3ejfe9rsjq3je&st=gm3jupi5&dl=1', title: 'Srdce mezi hvězdami v.3 ', manuallyEdited: false, lastEditedAt: null }, //206
{ src: 'https://dl.dropboxusercontent.com/scl/fi/tkfs4r9nsj1v6dp1xur3a/srdce-mezi-hv-zdami-v.4.mp3?rlkey=6383jaokp2wxusc0nognghsqf&st=8v6x0o2d&dl=1', title: 'Srdce mezi hvězdami v.4 ', manuallyEdited: false, lastEditedAt: null }, //207  

// ═══════════════════════════════════════════════════════════
// 🎧 Srdce na Dlani
// ═══════════════════════════════════════════════════════════   
{ src: ' https://dl.dropboxusercontent.com/scl/fi/m8v17v8uc182qbjgo4s6c/Srdce-na-Dlani.mp3?rlkey=k6zuatqhqwcpkc8bfax7oc4um&st=bpa3l6mm&dl=1', title: 'Srdce na Dlani (Originál)', manuallyEdited: false, lastEditedAt: null }, //208
{ src: 'https://dl.dropboxusercontent.com/scl/fi/434ebjux6ux5z31omf5m8/Srdce-na-Dlani-Remastered-v.1.mp3?rlkey=mjsoxwnqjwv0q8ij84g5w8d7i&st=amfa4ru0&dl=1', title: 'Srdce na Dlani (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //209
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ai32yrxw5rxvpebdnqhzi/Srdce-na-Dlani-Remastered-v.2.mp3?rlkey=2w3xl750y9dgr8n7yad5r931r&st=p0e3wdxl&dl=1', title: 'Srdce na Dlani (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //210   

// ═══════════════════════════════════════════════════════════
// 🎧 Ostatní Remastered
// ═══════════════════════════════════════════════════════════  
{ src: 'https://dl.dropboxusercontent.com/scl/fi/93f309yudg0w78ylcikll/SuvwI-pu-maH-qa-wIquvmoH-QeylIS-HoS-oH-mInmaj-voqchu-mo-cha-law-maH-neH-Qap-DujDajDaq-jach-full-verze-2.mp3?rlkey=zt0f4a2luk8pnb8kxe55h3t05&st=dak2m66f&dl=1', title: 'Klingonská Píseň', manuallyEdited: false, lastEditedAt: null }, //211   
{ src: 'https://dl.dropboxusercontent.com/scl/fi/h9wym2npxnreonpcplyw6/Star-Trek-Enterprise-Tribute-Remastered-v.1.mp3?rlkey=wyp5i089598xjfg466k40xim1&st=rb26cmfe&dl=1', title: 'Star Trek Enterprise Tribute (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //212
{ src: 'https://dl.dropboxusercontent.com/scl/fi/wuvum436syk2cdbhcmf0x/Star-Trek-Enterprise-Tribute-Remastered-v.2.mp3?rlkey=xueg9thzmlpdollomqfdh8q22&st=vfyrbvto&dl=1', title: 'Star Trek Enterprise Tribute (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //213
{ src: 'https://dl.dropboxusercontent.com/scl/fi/72qzvodhbmpu1b3wxjfqu/star-trek-p-sni-ka-o-pos-dk-ch-Remastered-v.1.mp3?rlkey=2x27co9jw7fvaz2udrv12fuvv&st=7yo7ciqq&dl=1', title: 'Star Trek Písnička o Posádkách (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //214
{ src: 'https://dl.dropboxusercontent.com/scl/fi/qsqqowxnjft0rgdobp0a2/star-trek-p-sni-ka-o-pos-dk-ch-Remastered-v.2.mp3?rlkey=2qqv6jc6jvpzxtq3ykfo0qk0g&st=17fwhkyw&dl=1', title: 'Star Trek Písnička o Posádkách (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //215

// ═══════════════════════════════════════════════════════════
// 🎧 STANICE HLUBOKÝ VESMÍR 9 (SÉRIE)
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/nobtr5d5n668hwarg3dfy/Stanice-Hlubok-Vesm-r-9-v.1.mp3?rlkey=luusv44k8h64sobcbikvmmj6n&st=1xcgruhu&dl=1', title: 'Stanice Hluboký Vesmír 9 v.1', manuallyEdited: false, lastEditedAt: null }, //216
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4frwnueluwgxjli4wgzwf/Stanice-Hlubok-Vesm-r-9-v.2.mp3?rlkey=qdks27ngdm4tsg0ftvp6i3qj4&st=djyjw0e7&dl=1', title: 'Stanice Hluboký Vesmír 9 v.2', manuallyEdited: false, lastEditedAt: null }, //217
{ src: 'https://dl.dropboxusercontent.com/scl/fi/f8tl52roikxphuuhb31zq/Stanice-Hlubok-Vesm-r-9-v.3.mp3?rlkey=s2x4f9yuo3ftirxa38c77waq6&st=v4p7bqz6&dl=1', title: 'Stanice Hluboký Vesmír 9 v.3', manuallyEdited: false, lastEditedAt: null }, //218
{ src: 'https://dl.dropboxusercontent.com/scl/fi/2adsvy3vuqstipnik29b0/Stanice-Hlubok-Vesm-r-9-v.4.mp3?rlkey=rlr4ulc69i91pmsmze4jslqsa&st=q1pqrhu6&dl=1', title: 'Stanice Hluboký Vesmír 9 v.4', manuallyEdited: false, lastEditedAt: null }, //219
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ieooxhpy1eeg8cghmxvdq/Stanice-Hlubok-Vesm-r-9-v.5.mp3?rlkey=76wbsfknainfdo93lv6wnw93x&st=0oc532vw&dl=1', title: 'Stanice Hluboký Vesmír 9 v.5', manuallyEdited: false, lastEditedAt: null }, //220
{ src: 'https://dl.dropboxusercontent.com/scl/fi/kip18cbu2jg5qicn9vham/Stanice-Hlubok-Vesm-r-9-v.6.mp3?rlkey=neryuhl8l2mwd0zlxpsszuova&st=0siz1ckk&dl=1', title: 'Stanice Hluboký Vesmír 9 v.6', manuallyEdited: false, lastEditedAt: null }, //221
{ src: 'https://dl.dropboxusercontent.com/scl/fi/z7111ptturevnr7v93dol/Stanice-Hlubok-Vesm-r-9-v.7.mp3?rlkey=1aquiq1uv62svyub0526igap0&st=hdpo5exf&dl=1', title: 'Stanice Hluboký Vesmír 9 v.7', manuallyEdited: false, lastEditedAt: null }, //222
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ywfpdorl779fxlmsnc0ah/Stanice-Hlubok-Vesm-r-9-v.8.mp3?rlkey=429k9n0ygjthsl87mxsgg9t54&st=paxi078b&dl=1', title: 'Stanice Hluboký Vesmír 9 v.8', manuallyEdited: false, lastEditedAt: null }, //223   
{ src: "https://dl.dropboxusercontent.com/scl/fi/gt8lcls71trqsxi2fch40/Stanice-Hlubok-Vesm-r-9.2.mp3?rlkey=ao55ik01svoqx6kr737einpv6&st=ab33d1bx&dl=1 ", title: "Stacion Deep Space Nine (Bonus)", manuallyEdited: false, lastEditedAt: null }, //224    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/w6jjzo8avh3rnd70gyva6/Stanice-Hlubok-Vesm-r-9.mp3?rlkey=sy23k7qogrbott7gmj5q7db2v&st=lcr4ygmh&dl=1', title: 'Stanice Hluboký Vesmír 9 (Alt 1)', manuallyEdited: false, lastEditedAt: null }, //225
{ src: "https://dl.dropboxusercontent.com/scl/fi/9xxqrcosag1w38qlwamft/Stanice-Hlubok-Vesm-r-9-2.mp3?rlkey=yvrxshbsg1fw4ulfgc9awyaqn&st=sussqmc2&dl=1", title: "Stanice Hluboký Vesmír 9 (Alt 2)", manuallyEdited: false, lastEditedAt: null }, //226
    
    
    
// ═══════════════════════════════════════════════════════════
// 🎧 HVEZDNA-FLOTILA-NAVZDY
// ═══════════════════════════════════════════════════════════ 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/nylusttacfmovfq1n2osf/HVEZDNA-FLOTILA-NAVZDY-v.1.mp3?rlkey=7iw38b8c3wf3apnmknm1rowbn&st=5sbgl2x8&dl=1 ', title: 'HVĚZDNÁ FLOTILA NAVŽDY v.1', manuallyEdited: false, lastEditedAt: null }, //227
 { src: 'https://dl.dropboxusercontent.com/scl/fi/ppbw1dkaxmbyfxicvukl4/HVEZDNA-FLOTILA-NAVZDY-v.2.mp3?rlkey=p26uskhn5l46ugnzml1pcdxrc&st=x6l62vex&dl=1 ', title: 'HVĚZDNÁ FLOTILA NAVŽDY v.2', manuallyEdited: false, lastEditedAt: null }, //228
 { src: 'https://dl.dropboxusercontent.com/scl/fi/6dht2iy7sin5u3f1yzcqe/HVEZDNA-FLOTILA-NAVZDY-v.3.mp3?rlkey=0cb0a43smj0oi6ksobgyo1d2o&st=8x14klct&dl=1 ', title: 'HVĚZDNÁ FLOTILA NAVŽDY v.3', manuallyEdited: false, lastEditedAt: null }, //229
 { src: 'https://dl.dropboxusercontent.com/scl/fi/fehw2xv2ijxik5em4290m/HVEZDNA-FLOTILA-NAVZDY-v.4.mp3?rlkey=5hvy01ch9575vwasl1cj8kg0c&st=5vx8m461&dl=1 ', title: 'HVĚZDNÁ FLOTILA NAVŽDY v.4', manuallyEdited: false, lastEditedAt: null }, //230
 { src: 'https://dl.dropboxusercontent.com/scl/fi/w5kksozadjph5vb41arbz/HVEZDNA-FLOTILA-NAVZDY-v.5.mp3?rlkey=vpyfnks9n45q343nni7z81vlt&st=bjm1y35v&dl=1 ', title: 'HVĚZDNÁ FLOTILA NAVŽDY v.5', manuallyEdited: false, lastEditedAt: null }, //231
 { src: 'https://dl.dropboxusercontent.com/scl/fi/bpu2y05x7k3jqpiqqsmkt/HVEZDNA-FLOTILA-NAVZDY-v.6.mp3?rlkey=brs8oimqbxe0qkyzpinw7m2k0&st=nmav3zi8&dl=1 ', title: 'HVĚZDNÁ FLOTILA NAVŽDY v.6', manuallyEdited: false, lastEditedAt: null }, //232
 { src: 'https://dl.dropboxusercontent.com/scl/fi/kx7zn7u8aboiz83i1wmtv/HVEZDNA-FLOTILA-NAVZDY-v.7.mp3?rlkey=kn9h5p6ws2o53a7jhfnvrbxz2&st=nowc96cq&dl=1 ', title: 'HVĚZDNÁ FLOTILA NAVŽDY v.7', manuallyEdited: false, lastEditedAt: null }, //233          
 { src: 'https://dl.dropboxusercontent.com/scl/fi/7bngpfjtk9wmn6212n06r/HVEZDNA-FLOTILA-NAVZDY-v.8.mp3?rlkey=sq1da27fx83ef4dv9mcuslolt&st=oto5ihq7&dl=1 ', title: 'HVĚZDNÁ FLOTILA NAVŽDY v.8', manuallyEdited: false, lastEditedAt: null }, //234    
    
    
 // ═══════════════════════════════════════════════════════════
// 🎧 Děti hvězd
// ═══════════════════════════════════════════════════════════  
  { src: 'https://dl.dropboxusercontent.com/scl/fi/rsq897k3k4syn5e9a207u/nova-pisnicka-1.mp3?rlkey=irtnu8vj5g8lvwti3hb5q5rtx&st=gwe4nd0j&dl=1', title: 'Děti hvězd v.1', manuallyEdited: false, lastEditedAt: null }, //235
 { src: 'https://dl.dropboxusercontent.com/scl/fi/7c0466nxjj2uewu6pldhi/nova-pisnicka-2.mp3?rlkey=q7wbsdwyqj7da4vt3niu6jshx&st=1p0q92sk&dl=1', title: 'Děti hvězd v.2', manuallyEdited: false, lastEditedAt: null }, //236
 { src: 'https://dl.dropboxusercontent.com/scl/fi/g6z44d5wv4njzvrlajp0m/nova-pisnicka-3.mp3?rlkey=43v6iybctgiu8l10l19xxb5sx&st=j02dy0gf&dl=1', title: 'Děti hvězd v.3', manuallyEdited: false, lastEditedAt: null }, //237
 { src: 'https://dl.dropboxusercontent.com/scl/fi/ty58wvj97sulq0jhmc5rz/nova-pisnicka-4.mp3?rlkey=389bopsrqx6nckveo98jk0m7v&st=42572fdg&dl=1', title: 'Děti hvězd v.4', manuallyEdited: false, lastEditedAt: null }, //238
 { src: 'https://dl.dropboxusercontent.com/scl/fi/trmivvigmuzzt4sg39qh5/nova-pisnicka-5.mp3?rlkey=oogptiwndx6r2y1waia182f5t&st=y3jpquss&dl=1', title: 'Děti hvězd v.5', manuallyEdited: false, lastEditedAt: null }, //239
 { src: 'https://dl.dropboxusercontent.com/scl/fi/lw9c3mkbe7twohy7mp6ny/nova-pisnicka-6.mp3?rlkey=mxu73wxyl4dtwnuomxkq2fg2z&st=lf9w6qgm&dl=1', title: 'Děti hvězd v.6', manuallyEdited: false, lastEditedAt: null }, //240
 { src: 'https://dl.dropboxusercontent.com/scl/fi/18fo57na1vr20vuws2dhp/nova-pisnicka-7.mp3?rlkey=5ggmbghoac1yec9suhrg6b13z&st=o92wgpty&dl=1', title: 'Děti hvězd v.7', manuallyEdited: false, lastEditedAt: null }, //241
 { src: 'https://dl.dropboxusercontent.com/scl/fi/esam8fputnvyu97z5zaxg/nova-pisnicka-8.mp3?rlkey=vqsv73as36t5mhxw1gfypcewg&st=j67nact4&dl=1', title: 'Děti hvězd v.8', manuallyEdited: false, lastEditedAt: null }, //242
 { src: 'https://dl.dropboxusercontent.com/scl/fi/x2g34bc4ytby31s41kv2f/nova-pisnicka-9.mp3?rlkey=zo3h814apvj2xc91rw3t5wedm&st=5nhvjwmw&dl=1', title: 'Děti hvězd v.9', manuallyEdited: false, lastEditedAt: null }, //243
 { src: 'https://dl.dropboxusercontent.com/scl/fi/70hd4e5zeugeo9hnnd1yy/nova-pisnicka-10.mp3?rlkey=ldceoekkji1r9qvky8psvdcn0&st=3l9x5s4g&dl=1', title: 'Děti hvězd v.10', manuallyEdited: false, lastEditedAt: null }, //244  
    
 
 // ═══════════════════════════════════════════════════════════
// 🎧 Louisiana sobotní noc 1 až 9
// ═══════════════════════════════════════════════════════════    
 { src: 'https://dl.dropboxusercontent.com/scl/fi/8iyu23gtnh1i3npqfvi6l/Louisiana-sobotni-noc-v.1.mp3?rlkey=a0pirp6pb2mppckyf3t7ceep8&st=ejl11phh&dl=1', title: 'Louisiana sobotní noc v.01', manuallyEdited: false, lastEditedAt: null }, //245  
 { src: 'https://dl.dropboxusercontent.com/scl/fi/q9nrhhs1opwerkp1yvy6k/Louisiana-sobotni-noc-v.2.mp3?rlkey=zxn97h5tuc3yml66ihsvj6a6y&st=2f7wkbrt&dl=1', title: 'Louisiana sobotní noc v.02', manuallyEdited: false, lastEditedAt: null }, //246
 { src: 'https://dl.dropboxusercontent.com/scl/fi/jch31uy83ueqxz4lwslcs/Louisiana-sobotni-noc-v.3.mp3?rlkey=2c9u8hbchlozwve8m296kqxja&st=km89xlx1&dl=1', title: 'Louisiana sobotní noc v.03', manuallyEdited: false, lastEditedAt: null }, //247
 { src: 'https://dl.dropboxusercontent.com/scl/fi/qjpbolwurcd2y3dw4wrop/Louisiana-sobotni-noc-v.4.mp3?rlkey=zdqg3cfhxdnqbui1nl6ys5qd0&st=z613c91q&dl=1', title: 'Louisiana sobotní noc v.04', manuallyEdited: false, lastEditedAt: null }, //248
 { src: 'https://dl.dropboxusercontent.com/scl/fi/5axfjtpq27cekvg51oye8/Louisiana-sobotni-noc-v.5.mp3?rlkey=m3avrd8myapqrfu0srmju7k6i&st=e3v05rkm&dl=1', title: 'Louisiana sobotní noc v.05', manuallyEdited: false, lastEditedAt: null }, //249
 { src: 'https://dl.dropboxusercontent.com/scl/fi/fiy4nctexclcggd0m6jdy/Louisiana-sobotni-noc-v.6.mp3?rlkey=yel3z35gidlqhjdw8a6xscn7g&st=8cug4txf&dl=1', title: 'Louisiana sobotní noc v.06', manuallyEdited: false, lastEditedAt: null }, //250
 { src: 'https://dl.dropboxusercontent.com/scl/fi/0p5751ypas7c9mfuk3o92/Louisiana-sobotni-noc-v.7.mp3?rlkey=26d70avekrpir3nt3h69h0h1w&st=7njolyyf&dl=1', title: 'Louisiana sobotní noc v.07', manuallyEdited: false, lastEditedAt: null }, //251
 { src: 'https://dl.dropboxusercontent.com/scl/fi/1relupal07hd5ghixpbgs/Louisiana-sobotni-noc-v.8.mp3?rlkey=tity8gk9847dzj7usznzn16kw&st=04whidfi&dl=1', title: 'Louisiana sobotní noc v.08', manuallyEdited: false, lastEditedAt: null }, //252
 { src: 'https://dl.dropboxusercontent.com/scl/fi/g1vxmp59d0wlktikrlvqc/Louisiana-sobotni-noc-v.9.mp3?rlkey=vb93d18aztmpzf5rf2qzeicb4&st=mp58sh85&dl=1', title: 'Louisiana sobotní noc v.09', manuallyEdited: false, lastEditedAt: null }, //253 
 
  
    
 // ═══════════════════════════════════════════════════════════
// 🎧 Louisiana-sobotni-noc 10 až 19
// ═══════════════════════════════════════════════════════════
    
 { src: 'https://dl.dropboxusercontent.com/scl/fi/gsk0nlbcx53cmj6q238cl/Louisiana-sobotni-noc-v.10-top.1.mp3?rlkey=8vzmypdg7exorp63xdr2p3p8g&st=khzck1hz&dl=1', title: 'Louisiana sobotní noc v.10-top.01', manuallyEdited: false, lastEditedAt: null }, //254
 { src: 'https://dl.dropboxusercontent.com/scl/fi/k7b5ai9du4kg7j1pcy4ui/Louisiana-sobotni-noc-v.11-top.2.mp3?rlkey=f7pc0ll4zm7aupuuw8zexnqwz&st=d8zpgxp1&dl=1', title: 'Louisiana sobotní noc v.11-top.02', manuallyEdited: false, lastEditedAt: null }, //255
 { src: 'https://dl.dropboxusercontent.com/scl/fi/4tj3rkxj9jekd2a8674cl/Louisiana-sobotni-noc-v.12-top.3.mp3?rlkey=icuhgqj48t0hy7s7rei0l0ywk&st=in2xw72t&dl=1', title: 'Louisiana sobotní noc v.12-top.03', manuallyEdited: false, lastEditedAt: null }, //256 
 { src: 'https://dl.dropboxusercontent.com/scl/fi/3gdde3zm0ma0ywt9mb238/Louisiana-sobotni-noc-v.13-top.4.mp3?rlkey=ubh0rr9p00j0r9k5s3odcizxp&st=7brtzv3t&dl=1', title: 'Louisiana sobotní noc v.13-top.04', manuallyEdited: false, lastEditedAt: null }, //257
 { src: 'https://dl.dropboxusercontent.com/scl/fi/tubmsopg2u3bmoki118r9/Louisiana-sobotni-noc-v.14-top.5.mp3?rlkey=cc6uxltsl2d7k5vpgbdwbxevv&st=fjvqoud0&dl=1', title: 'Louisiana sobotní noc v.14-top.05', manuallyEdited: false, lastEditedAt: null }, //258
 { src: 'https://dl.dropboxusercontent.com/scl/fi/dszhqc3csboqhlgynwrcs/Louisiana-sobotni-noc-v.15-top.6.mp3?rlkey=zw6pcrdjp45ou1xrh89x1dqe2&st=o40ttitg&dl=1', title: 'Louisiana sobotní noc v.15-top.06', manuallyEdited: false, lastEditedAt: null }, //259
 { src: 'https://dl.dropboxusercontent.com/scl/fi/cjzstu8hj3zg4h8fzhwbh/Louisiana-sobotni-noc-v.16-top.7.mp3?rlkey=jfannm1sxmqzo2675smn80e1n&st=asrf99h5&dl=1', title: 'Louisiana sobotní noc v.16-top.07', manuallyEdited: false, lastEditedAt: null }, //260
 { src: 'https://dl.dropboxusercontent.com/scl/fi/jcyh9dn08290fzejj7kgt/Louisiana-sobotni-noc-v.17-top.8.mp3?rlkey=eudwnjsdzuqfamzjr93nhw7id&st=1dw36j3a&dl=1', title: 'Louisiana sobotní noc v.17-top.08', manuallyEdited: false, lastEditedAt: null }, //261
 { src: 'https://dl.dropboxusercontent.com/scl/fi/x8714w1z6wl9c7hronp4h/Louisiana-sobotni-noc-v.18-top.9.mp3?rlkey=z358m1btvtz7ldsk1wb5v5qdd&st=njjinnxf&dl=1', title: 'Louisiana sobotní noc v.18-top.09', manuallyEdited: false, lastEditedAt: null }, //262
 { src: 'https://dl.dropboxusercontent.com/scl/fi/p2tgixfevp4mw6zkvrlbs/Louisiana-sobotni-noc-v.19-top.10.mp3?rlkey=ekemn7rowhy0xtgx7xvohc1v8&st=zk1d2ztj&dl=1', title: 'Louisiana sobotní noc v.19-top.10', manuallyEdited: false, lastEditedAt: null }, //263 
    
// ═══════════════════════════════════════════════════════════
// 🎧 PÍSNIČKY O JIRKOVI Klasická Série 1
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/rlvrljgsfoyxj0z8yiavd/P-se-o-Jirkovy..mp3?rlkey=t9kypjev5gpryz58u0tj8d053&st=ui34m5ot&dl=1", title: "Písnička o Jirkovi v.1", duration: '02:58', manuallyEdited: false, lastEditedAt: null }, //264
{ src: "https://dl.dropboxusercontent.com/scl/fi/huywy0fcr1a2kebh79t5w/P-se-o-Jirkovy.-v2.mp3?rlkey=lft56ljrs0bscchtzpv8br3r5&st=ib3q970i&dl=1", title: "Písnička o Jirkovi v.2", duration: '03:25', manuallyEdited: false, lastEditedAt: null }, //265
{ src: "https://dl.dropboxusercontent.com/scl/fi/ecbgf4bv0nar9zbbsonz5/P-se-o-Jirkovy..wav?rlkey=8c8hxobvfxfebde24u0u9bmgw&st=j7a8nugp&dl=1", title: "Písnička o Jirkovi (WAV verze)", duration: '02:58', manuallyEdited: false, lastEditedAt: null }, //266
{ src: "https://dl.dropboxusercontent.com/scl/fi/he6wtpnqvprwrfvefnzoy/jirka-pisnicka.mp3?rlkey=381v7xqasgcu79hajzzxpmwl1&st=6gfkzfyu&dl=1", title: "Písnička o Jirkovi (Remastered)", manuallyEdited: false, lastEditedAt: null }, //267
// ═══════════════════════════════════════════════════════════
// 🎧 PÍSNIČKY O JIRKOVI Klasická Série 2
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/rgaq0j1h90p4v8m1rju7l/Jirka-je-Hrdina.mp3?rlkey=vnl5k7fmaiqe81x5022r01s9v&st=lsi2d9uy&dl=1", title: "Jirka je Hrdina", duration: '02:37', manuallyEdited: false, lastEditedAt: null }, //268
{ src: "https://dl.dropboxusercontent.com/scl/fi/o1upftixk1mp1q0bg6ies/Jirka-je-Tlust.mp3?rlkey=mnzxobvsgeavpj70shih9bp10&st=egs2d0q7&dl=1", title: "Jirka je Tlustý", duration: '03:39', manuallyEdited: false, lastEditedAt: null }, //269
{ src: "https://dl.dropboxusercontent.com/scl/fi/sgkz57znp4ef645ud75kv/Jirka-je-Tlust-Hovado.mp3?rlkey=qw92ixc81txqlw0b0yhp1yjjm&st=wdxjc2l8&dl=1", title: "Jirka je Tlustý Hovado", duration: '02:06', manuallyEdited: false, lastEditedAt: null }, //270
{ src: "https://dl.dropboxusercontent.com/scl/fi/ya7xcqy3jb4q7y9s46d3t/Jirkovi-se-l-b-kluci.mp3?rlkey=59vcjfkb4s3oyqaw0v5k2x9ut&st=s4iojpd7&dl=1", title: "Jirkovi se líbí kluci", duration: '02:40', manuallyEdited: false, lastEditedAt: null }, //271
// ═══════════════════════════════════════════════════════════
// 🎧 PÍSNIČKY O JIRKOVI Remastered Verze 1
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/sa49nryh6eekf0bsqw1x2/Jirka-je-Hrdina-Remastered-v.1.mp3?rlkey=hxoe5uxqyabjuecxd10ekdg3i&st=rmlc9kv1&dl=1', title: 'Jirka je Hrdina (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //272
{ src: 'https://dl.dropboxusercontent.com/scl/fi/228z2drztt66cwg8ambmb/Jirka-je-Hrdina-Remastered-v.2.mp3?rlkey=xkgs9qtmiruahgafd30g4c5v0&st=pfl9ducz&dl=1', title: 'Jirka je Hrdina (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //273
{ src: 'https://dl.dropboxusercontent.com/scl/fi/21saci92kyxx92uxt65vf/Jirka-je-Tlust-Hovado-Remastered-v1.mp3?rlkey=mnaao7x4nvcxntv5eqmmec93j&st=uez9ai93&dl=1', title: 'Jirka je Tlustý Hovado (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //274
{ src: 'https://dl.dropboxusercontent.com/scl/fi/zy3u4qgjpb67e65hua3ag/Jirka-je-Tlust-Hovado-Remastered-v2.mp3?rlkey=6pwazq8lgvk4ne6ee4ob6qrfn&st=a4q2vzm7&dl=1', title: 'Jirka je Tlustý Hovado (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //275
// ═══════════════════════════════════════════════════════════
// 🎧 PÍSNIČKY O JIRKOVI Remastered Verze 2
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/pmt2xynuggp26j9kt2sn5/jirka-pisnicka-Remastered-v.1.mp3?rlkey=ld444ro1es7zihcagelgu1gsk&st=xzbn1ljw&dl=1', title: 'Jirka Písnička (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //276
{ src: 'https://dl.dropboxusercontent.com/scl/fi/1xd1ey1nl2p5gb5y30w0e/jirka-pisnicka-Remastered-v.2.mp3?rlkey=4muv01g6e6vvyc85ktxqdq22y&st=xfvzsxqv&dl=1', title: 'Jirka Písnička (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //277
{ src: 'https://dl.dropboxusercontent.com/scl/fi/vb9o4xdkqrpxilmrzcjad/Jirkovi-se-l-b-kluci-Remastered-v.1.mp3?rlkey=e8f1a0fsdgyxefyxs5dcsvshu&st=o28bzlyt&dl=1', title: 'Jirkovi se líbí kluci (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //278
{ src: 'https://dl.dropboxusercontent.com/scl/fi/pdotzbybyu44zcqp6wpzc/Jirkovi-se-l-b-kluci-Remastered-v.2.mp3?rlkey=4amqsl3a4ko6pl7fjosb59ory&st=3isf7y0m&dl=1', title: 'Jirkovi se líbí kluci (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //279
{ src: "https://dl.dropboxusercontent.com/scl/fi/he6wtpnqvprwrfvefnzoy/jirka-pisnicka.mp3?rlkey=381v7xqasgcu79hajzzxpmwl1&st=6gfkzfyu&dl=1", title: "Písnička o jirkovy Remastered ", manuallyEdited: false, lastEditedAt: null }, //280    
// ═══════════════════════════════════════════════════════════
// 🎧 Jirkův Futuristický Kvíz
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/6w0iv0mdpytdfjwfd01m1/Jirk-v-futuristick-kviz-1.mp3?rlkey=7wot60ljvyhy0gday938jg6ef&st=62159rxb&dl=1", title: "Jirkův Futuristický Kvíz v.1", duration: '02:56', manuallyEdited: false, lastEditedAt: null }, //281
{ src: "https://dl.dropboxusercontent.com/scl/fi/a0bp5g48zw0wvcsrxk9p8/Jirk-v-futuristick-kv-z-1.mp3?rlkey=er6x232s8dctei47asb77cbwu&st=yyvedd4e&dl=1", title: "Jirkův Futuristický Kvíz v.2", duration: '02:34', manuallyEdited: false, lastEditedAt: null }, //282
{ src: "https://dl.dropboxusercontent.com/scl/fi/vmmr22osjuabzk9kexbru/Jirk-v-Futuristick-Kv-z-3.mp3?rlkey=oj7mvctsodgsi24xmzidsdqv9&st=2z1x6hhl&dl=1", title: "Jirkův Futuristický Kvíz v.3", duration: '02:26', manuallyEdited: false, lastEditedAt: null }, //283
{ src: "https://dl.dropboxusercontent.com/scl/fi/8tar6rg1kjb5329epj8em/Jirk-v-futuristick-kviz.mp3?rlkey=kv7xabnccq5xscpwk7rbhfjni&st=tm8s11ol&dl=1", title: "Jirkův Futuristický Kvíz v.4", duration: '02:31', manuallyEdited: false, lastEditedAt: null }, //284
{ src: "https://dl.dropboxusercontent.com/scl/fi/xthbu4a9jvli6wkfavpen/Jirk-v-Futuristick-Kv-z-top-1.mp3?rlkey=rpg404uzibp95vgr9pq3segqo&st=bnax6wi7&dl=1", title: "Jirkův Futuristický Kvíz (Top-1)", duration: '02:20', manuallyEdited: false, lastEditedAt: null }, //285
// ═══════════════════════════════════════════════════════════
// 🎧 Jirkův dodatek
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/hxi7v9sxf0j6xb07atz9l/Cesta-za-S-rie-v.1.mp3?rlkey=91bmfoh9yt1fij47hre2nkh9a&st=x3z5ohbm&dl=1", title: "Cesta ze Série v.1", duration: '02:35', manuallyEdited: false, lastEditedAt: null }, //286  
// ═══════════════════════════════════════════════════════════
// 🎧 Journey Through Žižkov Originální verze
// ═══════════════════════════════════════════════════════════     
{ src: "https://dl.dropboxusercontent.com/scl/fi/ruz2vwsifxe52g3ndzaku/Journey-Through-i-kov-v.1.mp3?rlkey=fvbbr3ezzjb1i0oxapt15gfum&st=1dmj8x88&dl=1", title: "Journey Through Žižkov v.1", duration: '03:06', manuallyEdited: false, lastEditedAt: null }, //287
{ src: "https://dl.dropboxusercontent.com/scl/fi/5g1rg0rh082hoy6eukbgl/Journey-Through-i-kov-v.2.mp3?rlkey=f83d8wjfv8fshcdasq225awjq&st=5tw5ppz8&dl=1", title: "Journey Through Žižkov v.2", duration: '02:31', manuallyEdited: false, lastEditedAt: null }, //288
// ═══════════════════════════════════════════════════════════
// 🎧 Journey Through Žižkov Jirka Remake
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7hbodk9f03dmzzswe5c9d/Journey-Through-i-kov-jirka-remake-v.1.mp3?rlkey=qam6zmao3wcv3bli3qr62d2g0&st=eimcbma2&dl=1', title: 'Journey Through Žižkov Jirka Remake v.1', manuallyEdited: false, lastEditedAt: null }, //289
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4y61fb4wv70ct64yqezzh/Journey-Through-i-kov-jirka-remake-v.2.mp3?rlkey=iheqc9qo6409fux274dk3uj0q&st=sqhoocsp&dl=1', title: 'Journey Through Žižkov Jirka Remake v.2', manuallyEdited: false, lastEditedAt: null }, //290
{ src: 'https://dl.dropboxusercontent.com/scl/fi/r2xiv7vz84djw4rl44rkk/Journey-Through-i-kov-jirka-remake-v.3.mp3?rlkey=p6l7eo5sfortyvr6omwqlc1lo&st=lj2kpxo7&dl=1', title: 'Journey Through Žižkov Jirka Remake v.3', manuallyEdited: false, lastEditedAt: null }, //291
// ═══════════════════════════════════════════════════════════
// 🎧 Journey Through Žižkov Remastered (Rema)
// ═══════════════════════════════════════════════════════════    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/3lay7z55u9oht69nsa1h7/Journey-Through-i-kov-Remastered-v.1.mp3?rlkey=bjh9cevzgufqamgjkx9xvaoxi&st=4dt0ym2n&dl=1', title: 'Journey Through Žižkov (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //292
{ src: 'https://dl.dropboxusercontent.com/scl/fi/em09ewrnxz70c98mqmkmj/Journey-Through-i-kov-Remastered-v.2.mp3?rlkey=poanqip6ty6d41yz0dq7xndwx&st=gnctpa64&dl=1', title: 'Journey Through Žižkov (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //293
{ src: 'https://dl.dropboxusercontent.com/scl/fi/9096lhzsq9gmxkqh87cn5/Journey-Through-i-kov-Remastered-v.3.mp3?rlkey=v4h4or0ug98mp4684dyqop5rq&st=71cngvbb&dl=1', title: 'Journey Through Žižkov (Rema) v.3', manuallyEdited: false, lastEditedAt: null }, //294
{ src: 'https://dl.dropboxusercontent.com/scl/fi/sxc1duc941ymq16dmbypp/Journey-Through-i-kov-Remastered-v.4.mp3?rlkey=dj2jln2mxr3nkz05rg94ebvkc&st=zf6pajsu&dl=1', title: 'Journey Through Žižkov (Rema) v.4', manuallyEdited: false, lastEditedAt: null }, //295  
// ═══════════════════════════════════════════════════════════
// 🎧 FEDERÁLNÍ ÚSTAV Remastered Verze
// ═══════════════════════════════════════════════════════════    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/jit8y752bq05l8udfybum/Federaln-ustav-Remastered-v.1.mp3?rlkey=a7dq1x2va361lkcfhant00ha4&st=mlaw5zwh&dl=1', title: 'Federální ústav (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //296
{ src: 'https://dl.dropboxusercontent.com/scl/fi/r4ha8bleu97ct6g5cfey2/Federaln-ustav-Remastered-v.2.mp3?rlkey=p0tq0sbujuswiq2adcm1hasm5&st=oedq9zft&dl=1', title: 'Federální ústav (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //297
// ═══════════════════════════════════════════════════════════
// 🎧 FEDERÁLNÍ ÚSTAV Originální Série
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/vzvoi93r4ucnkdl4flzpf/Feder-ln-stav-Kret-n-v.1.mp3?rlkey=0y0gqjtyw6irjsnz1bqpw9sic&st=7id6prfv&dl=1', title: 'Federální ústav kreténů v.1', manuallyEdited: false, lastEditedAt: null }, //298
{ src: 'https://dl.dropboxusercontent.com/scl/fi/z5evgh76w5cru202m5400/Feder-ln-stav-Kret-n-v.2.mp3?rlkey=x2yv2vpfht2gg1s4f4oyc1zhe&st=72j19qwd&dl=1', title: 'Federální ústav kreténů v.2', manuallyEdited: false, lastEditedAt: null }, //299
{ src: 'https://dl.dropboxusercontent.com/scl/fi/yde84537d819x5dwlgt28/Feder-ln-stav-kret-n-a-kohout.mp3?rlkey=znwx7v4bsatxckeu1bco0cf17&st=ui4ijphe&dl=1', title: 'Federální ústav kreténů a Kohout', manuallyEdited: false, lastEditedAt: null }, //300
// ═══════════════════════════════════════════════════════════
// 🎧 FEDERÁLNÍ ÚSTAV Remake Série
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/9zc0davs7hlhn38y6p7cz/Federaln-ustav-remake-v.1.mp3?rlkey=y7zf474nql83af1ynj7huu65n&st=hkdzvil0&dl=1', title: 'Federální ústav Remake v.1', manuallyEdited: false, lastEditedAt: null }, //301
{ src: 'https://dl.dropboxusercontent.com/scl/fi/l5xet02uhqfuc9vq3qmbm/Federaln-ustav-remake-v.2.mp3?rlkey=m5vg6locsgxleydh3ozzq4113&st=uiwf7bf7&dl=1', title: 'Federální ústav Remake v.2', manuallyEdited: false, lastEditedAt: null }, //302
{ src: 'https://dl.dropboxusercontent.com/scl/fi/0bv6pkaml0avm0qr8ve1v/Federaln-ustav-remake-v.3.mp3?rlkey=dhjxhckdrw47sk6u9m8iywxfu&st=vow4jcmp&dl=1', title: 'Federální ústav Remake v.3', manuallyEdited: false, lastEditedAt: null }, //303
{ src: 'https://dl.dropboxusercontent.com/scl/fi/6rd61a7lqqk4yr1lua8yt/Federaln-ustav-remake-v.4.mp3?rlkey=plaa27nw4kbiuocuv5dr8s0vm&st=u29au84h&dl=1', title: 'Federální ústav Remake v.4', manuallyEdited: false, lastEditedAt: null }, //304
// ═══════════════════════════════════════════════════════════
// 🎧 FEDERÁLNÍ ÚSTAV Série 2
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/zq7jbt5qvo7c87juxqzod/Feder-ln-stav-kret-n-2-v.1.mp3?rlkey=sizk7lqag231gqyswqxlsbobs&st=5lry8g19&dl=1", title: "Federální ústav kreténů 2 v.1", manuallyEdited: false, lastEditedAt: null }, //305
{ src: "https://dl.dropboxusercontent.com/scl/fi/320d9o45lo277jiwldg74/Feder-ln-stav-kret-n-2-v.2.mp3?rlkey=ehsiw8hvj4o4hn5r2e537sx0a&st=jwmq1llp&dl=1 ", title: "Federální ústav kreténů 2 v.2", manuallyEdited: false, lastEditedAt: null }, //306
// ═══════════════════════════════════════════════════════════
// 🎧 FEDERÁLNÍ ÚSTAV Série 3
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/vnv3xrvzzzgkw4lnuqkmb/Bacha-na-v-ezn-lky-Crazy-SkaMix-federaln-ustav-ktretenu-v1.mp3?rlkey=kskxippifxjdafznmrwyf7n6x&st=84384d5o&dl=1 ", title: "Federální ústav v.1", manuallyEdited: false, lastEditedAt: null }, //307
{ src: "https://dl.dropboxusercontent.com/scl/fi/0ndx32iumdq89nwc53ei4/Bacha-na-v-ezn-lky-Crazy-SkaMix-federalni-ustav-ktretenu-v2.mp3?rlkey=rgaav98hnd6frs5h1amva8i5h&st=grv21l7z&dl=1 ", title: "Federální ústav v.2", manuallyEdited: false, lastEditedAt: null }, //308
{ src: "https://dl.dropboxusercontent.com/scl/fi/fsw3sltst7qgl9eig8sx7/I-only-ate-3-cheeseburgers-federalni-ustav-kretenu-v1.mp3?rlkey=bvh871fajfaxz8l3wae1t58pe&st=9sgywky9&dl=1 ", title: "Federální ústav v.1", manuallyEdited: false, lastEditedAt: null }, //309
{ src: "https://dl.dropboxusercontent.com/scl/fi/x20q4bt8p2ffa6h7sd2w7/I-only-ate-3-cheeseburgers-federalni-ustav-kretenu-v2.mp3?rlkey=9rs85h7hirybtjzf5movpk3hu&st=alu7p5en&dl=1 ", title: "Federální ústav v.2", manuallyEdited: false, lastEditedAt: null }, //310
// ═══════════════════════════════════════════════════════════
// 🎧 FEDERÁLNÍ ÚSTAV Série 4 
// ═══════════════════════════════════════════════════════════    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/496nylozhgsn9arbvocwa/V-ichni-chod-do-st-edn-koly-v.1.mp3?rlkey=gl5wpamhlxga4s5kso765humq&st=ut2jpjr4&dl=1', title: 'Všichni chodí do střední školy v.1', manuallyEdited: false, lastEditedAt: null }, //311
{ src: 'https://dl.dropboxusercontent.com/scl/fi/wd0aoiwm1z5zbim7ycq0x/V-ichni-chod-do-st-edn-koly-v.2.mp3?rlkey=d3h81wcta3mrx3xr22ovnr7x9&st=nn6pzmih&dl=1', title: 'Všichni chodí do střední školy v.2', manuallyEdited: false, lastEditedAt: null }, //312
// ═══════════════════════════════════════════════════════════
// 🎧 Krčma v Dětenicích
// ═══════════════════════════════════════════════════════════     
{ src: 'https://dl.dropboxusercontent.com/scl/fi/l7fsiidq9u7pad9o19qd8/Kr-ma-U-D-tenic.mp3?rlkey=tvy2t3mgfqj2xgoptu3gsp0or&st=zh38xe5o&dl=1', title: 'Krčma v Dětenicích v.1', manuallyEdited: false, lastEditedAt: null }, //313
  { src: ' https://dl.dropboxusercontent.com/scl/fi/ravwza7pm2b0f2dgi0oyo/Kr-ma-v-D-tenic-ch.mp3?rlkey=kikl7nr5k6zw41x9xm6ufg2dt&st=6nj05mib&dl=1', title: 'Krčma v Dětenicích v.2', manuallyEdited: false, lastEditedAt: null }, //314
 { src: 'https://dl.dropboxusercontent.com/scl/fi/qc2jn8xiumgzvczu4avtr/Kr-ma-U-D-tenic-Remastered-v.1.mp3?rlkey=oomzckedks3ho52y5h7esela9&st=a2gkjedr&dl=1', title: 'Krčma U Dětenic (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //315
  { src: 'https://dl.dropboxusercontent.com/scl/fi/rzfywlojfprb3vpc8l3z9/Kr-ma-U-D-tenic-Remastered-v.2.mp3?rlkey=jpwn5cuo8logiiv2tfccy3ivy&st=3z1rjc16&dl=1', title: 'Krčma U Dětenic (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //316    
    
// ═══════════════════════════════════════════════════════════
// 🎧 cesta krystof
// ═══════════════════════════════════════════════════════════ 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/bjbxv76hk9a6brnvwipa0/Cesta-Kry-tof.mp3?rlkey=n1qwxlrei4pgeh6id3phxbohy&st=hmd1ta0x&dl=1', title: 'Cesta Kryštof v.0', manuallyEdited: false, lastEditedAt: null }, //317    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/9luix60q58x8h87r37w5l/cesta-krystof-v.1.mp3?rlkey=lmkz8mgemr30hnp87rvsvvqu6&st=jiiahmk2&dl=1', title: 'cesta krystof v.1', manuallyEdited: false, lastEditedAt: null }, //318
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ydc898bua4j48zy6wk325/cesta-krystof-v.2.mp3?rlkey=xu8iyjtfk1teyj8ysc88v0sdt&st=5egj170w&dl=1', title: 'cesta krystof v.2', manuallyEdited: false, lastEditedAt: null }, //319
{ src: 'https://dl.dropboxusercontent.com/scl/fi/sqqelqtnhftgso1uom006/cesta-krystof-v.1.mp3?rlkey=001ter3px0i4qvp7hshkp9p55&st=4kt1nbi8&dl=1', title: 'cesta krystof v.3', manuallyEdited: false, lastEditedAt: null }, //320
{ src: 'https://dl.dropboxusercontent.com/scl/fi/861dszcdntg90w20zk53x/cesta-krystof-v.2.mp3?rlkey=iec51e0l6twgldmz17avozn3y&st=dendmxbn&dl=1', title: 'cesta krystof v.4', manuallyEdited: false, lastEditedAt: null }, //321    

// ═══════════════════════════════════════════════════════════
// 🎧 instrumentální disko
// ═══════════════════════════════════════════════════════════     
{ src: 'https://dl.dropboxusercontent.com/scl/fi/0jck7g1hzfyik45ieqeti/disko-p-se-instrument-ln.mp3?rlkey=y5iylsvzndt6dbscl0gmu1rio&st=k1stq0ff&dl=1', title: 'instrumentální disko 1', manuallyEdited: false, lastEditedAt: null }, //322
  { src: 'https://dl.dropboxusercontent.com/scl/fi/hsroimbojr834uwvdl6ox/disko-p-se-instrument-ln-2.mp3?rlkey=bpwj21le026nhali2f7mee5fy&st=1dsdu7a3&dl=1', title: 'instrumentální disko 2', manuallyEdited: false, lastEditedAt: null }, //323
  { src: 'https://dl.dropboxusercontent.com/scl/fi/07fpmhlm23uyw33gfv09f/disko-instrument-ln-3.mp3?rlkey=nhuznhkvfdy7xp26npycfuhid&st=04ulykjz&dl=1', title: 'instrumentální disko 3', manuallyEdited: false, lastEditedAt: null }, //324
  { src: 'https://dl.dropboxusercontent.com/scl/fi/offnpaxhw3q5rslyqiurk/disko-instrument-ln-4.mp3?rlkey=78g3k5u006xilem2jfhx31h6x&st=m5b7011g&dl=1', title: 'instrumentální disko 4', manuallyEdited: false, lastEditedAt: null }, //325
  { src: 'https://dl.dropboxusercontent.com/scl/fi/bo6dy6iq8syw93jl0v09r/disko-instrument-ln-5.mp3?rlkey=773zl86r2ixeby3x11m6ki6to&st=i5s5uu02&dl=1', title: 'instrumentální disko 5', manuallyEdited: false, lastEditedAt: null }, //326
  { src: 'https://dl.dropboxusercontent.com/scl/fi/bi4ep9vcik6carhzabxsc/disko-instrument-ln-6.mp3?rlkey=0f1ahtkras67qrxner9c69ows&st=jz20lx4m&dl=1', title: ' instrumentální disko 6', manuallyEdited: false, lastEditedAt: null }, //327
  { src: 'https://dl.dropboxusercontent.com/scl/fi/e2ayrw4afeag8d0714i5z/disko-instrument-ln-8.mp3?rlkey=f4kdo9km5elqivhey34n52yen&st=oti4430o&dl=1', title: 'instrumentální disko 7', manuallyEdited: false, lastEditedAt: null }, //328
  { src: 'https://dl.dropboxusercontent.com/scl/fi/e2ayrw4afeag8d0714i5z/disko-instrument-ln-8.mp3?rlkey=f4kdo9km5elqivhey34n52yen&st=oti4430o&dl=1', title: ' instrumentální disko8', manuallyEdited: false, lastEditedAt: null }, //329
  { src: 'https://dl.dropboxusercontent.com/scl/fi/gxrzzkowi1jf8mr8xqn3s/disko-instrument-ln-9.mp3?rlkey=7pwrvdt7432pu3020pwew10qv&st=ti3qhed9&dl=1', title: 'instrumentální disko 9', manuallyEdited: false, lastEditedAt: null }, //330
  { src: 'https://dl.dropboxusercontent.com/scl/fi/hy1u6hakkstqbk2f33xto/disko-instrument-ln-10.mp3?rlkey=wzqsyv4aveuo26n9xknjkyjwo&st=qjdk4773&dl=1', title: 'instrumentální disko 10', manuallyEdited: false, lastEditedAt: null }, //331    
    
 
    
 // ═══════════════════════════════════════════════════════════
// 🎧 ÚTAH A JEHO BRATR
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/73u5c3whfsb46bhli2kvk/utah-a-jeho-bratr-1.mp3?rlkey=433d0f5su6h9azh937khz5qn7&st=36pslteq&dl=1", title: "Útah a jeho bratr v.1", manuallyEdited: false, lastEditedAt: null }, //332
{ src: "https://dl.dropboxusercontent.com/scl/fi/ch85m3ruuk483n0av2alt/utah-a-jeho-bratr2-2.mp3?rlkey=lin5be4rgrc7zzq3j30h2n2r7&st=g54jel4m&dl=1", title: "Útah a jeho bratr v.2", manuallyEdited: false, lastEditedAt: null }, //333
{ src: "https://dl.dropboxusercontent.com/scl/fi/pibbsiihpyo1v2sv1127l/utah-a-jeho-bratr2-5.mp3?rlkey=5wqi21ex128gd3gzrbgv6pmd8&st=36wb7tm4&dl=1", title: "Útah a jeho bratr v.2-5", manuallyEdited: false, lastEditedAt: null }, //334

// ═══════════════════════════════════════════════════════════
// 🎧 NOČNÍ STÍNY & BOD ZLOMU
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/cvynixepb9sr5p8od1c6k/No-n-St-ny-2.mp3?rlkey=wbg54xwvsvcpgwnqw71wq70of&st=860jjrig&dl=1", title: "Noční Stíny v.2", manuallyEdited: false, lastEditedAt: null }, //335
{ src: "https://dl.dropboxusercontent.com/scl/fi/zyw6pqghlsxzr6jt0wzv0/No-n-St-ny-3.wav?rlkey=5sav7md3gem737dsu1o2pnsm8&st=sbbvqicx&dl=1", title: "Noční Stíny v.3", manuallyEdited: false, lastEditedAt: null }, //336
{ src: "https://dl.dropboxusercontent.com/scl/fi/rr1j0huzew4w71su1t0vt/No-n-St-ny-4.mp3?rlkey=k7vwqwyt10a7fyqk85et8hiwv&st=k1oygg30&dl=1", title: "Noční Stíny v.4", manuallyEdited: false, lastEditedAt: null }, //337
{ src: "https://dl.dropboxusercontent.com/scl/fi/cvynixepb9sr5p8od1c6k/No-n-St-ny-2.mp3?rlkey=wbg54xwvsvcpgwnqw71wq70of&st=ygualcbn&dl=1", title: "Noční Stíny v.5", manuallyEdited: false, lastEditedAt: null }, //338
{ src: "https://dl.dropboxusercontent.com/scl/fi/rr1j0huzew4w71su1t0vt/No-n-St-ny-4.mp3?rlkey=k7vwqwyt10a7fyqk85et8hiwv&st=k1oygg30&dl=1", title: "Bod Zlomu v.3", manuallyEdited: false, lastEditedAt: null }, //339

// ═══════════════════════════════════════════════════════════
// 🎧 STÍNY Z UTAHY (REMASTERED)
// ═══════════════════════════════════════════════════════════
{ src:"https://dl.dropboxusercontent.com/scl/fi/o2i2tod1da3an0qg3hxmf/St-ny-z-Utah-Remastered-V.7.mp3?rlkey=bitm1exyei3krwu7jkj14icu8&st=fznwkhnk&dl=1", title: "Stíny z Utahy (Rema) v.1", manuallyEdited: false, lastEditedAt: null }, //340
{ src:"https://dl.dropboxusercontent.com/scl/fi/if6lddn4ocl8g91h311nc/St-ny-z-Utah-Remastered-V.8.mp3?rlkey=tpd1kit3d75mjujwnm64chex8&st=dmzxiy47&dl=1", title: "Stíny z Utahy (Rema) v.2", manuallyEdited: false, lastEditedAt: null }, //341   
    
// ═══════════════════════════════════════════════════════════
// 🎧 Jirka a ondra
// ═══════════════════════════════════════════════════════════    
{ src: "https://dl.dropboxusercontent.com/scl/fi/v6me6mzartct01ndzi722/jirka-a-ondra-jsou-nejlep-br-chov-Vysok-kvalita.mp3?rlkey=urg0junbwcdc6paqtutmttmpl&st=07wnlf6f&dl=1", title: "Jirka a ondra jsou nejlepší bráchové org", 
duration: '03:37', manuallyEdited: false, lastEditedAt: null }, //342
            
{ src: "https://dl.dropboxusercontent.com/scl/fi/cj69d5dhy6v7f9lavu8qw/Jirka-a-Ondra-jsou-nejlep-brachov-V.1.mp3?rlkey=vkjfy9gxpo38f383zlqdf2yo7&st=lsycsnot&dl=1",title: "Jirka a Ondra jsou nejlepší bráchové dico verze V.01", duration: '03:14', manuallyEdited: false, lastEditedAt: null }, //343              
              
{ src: "https://dl.dropboxusercontent.com/scl/fi/jcmqbtfvldndzcopr5ugy/Jirka-a-Ondra-jsou-nejlep-brachov-V.4.mp3?rlkey=egz3d4c243b5vlmui3awtg03w&st=op1toyux&dl=1",title: "Jirka a Ondra jsou nejlepší bráchové dico verze V.02", duration: '04:00', manuallyEdited: false, lastEditedAt: null }, //344
            
{ src: "https://dl.dropboxusercontent.com/scl/fi/oo8fjj7jte1et8turk8hv/v-let-v-Praze-Ondra-a-Jirka-v.5.mp3?rlkey=ueuy8n3xwc1doc142bl5kqtdd&st=6mlikti6&dl=1", title: "Výlet Do Prahy Ondra A Jirka v.3", 
duration: '03:43', manuallyEdited: false, lastEditedAt: null }, //345            
            
              
 { src: 'https://dl.dropboxusercontent.com/scl/fi/7n6shcvyrg74pznu3xg25/_p-sn-o-bratrsk-m-p-telstv-v.1.mp3?rlkey=ihnpara0plr4t67kc1hlbfem5&st=46zrxeg3&dl=1', title: 'písně o bratrském přátelství v.1', manuallyEdited: false, lastEditedAt: null }, //346
{ src: 'https://dl.dropboxusercontent.com/scl/fi/mq082nf1r9zy0zdhz1ppn/_p-sn-o-bratrsk-m-p-telstv-v.2.mp3?rlkey=msck9y0wobdipuqoo8a39y228&st=kbr50r3x&dl=1', title: 'písně o bratrském přátelství v.2', manuallyEdited: false, lastEditedAt: null }, //347    
{ src: "https://dl.dropboxusercontent.com/scl/fi/j1ua4fykiw6ozka8t7iv4/p-sn-o-bratrsk-m-p-telstv-4-opr.mp3?rlkey=xuyk9u3ir8fe8zq7g259ea377&st=udj6qujw&dl=1", title: "písně o bratrském přátelství v.3 Top-1/2", 
duration: '03:54', manuallyEdited: false, lastEditedAt: null }, //348
{ src: "https://dl.dropboxusercontent.com/scl/fi/9s00fkxs53tzp9kv60n3r/pisen-o-prateskem-pratelstvi-v.5-Top-4.wav?rlkey=403d3o7kj3041x3qcv3x7znqu&st=gexyhmn6&dl=1", title: "písně o bratrském přátelství v.5-Top-4", //tuto sem přidal
duration: '08:57', manuallyEdited: false, lastEditedAt: null }, //349     
{ src: 'https://dl.dropboxusercontent.com/scl/fi/mwc2ikve37981adfj2sot/Ondra-p-ijel-do-ejova-Remastered-v.1.mp3?rlkey=apdsayt3xnwufp8r4nrkm5tn1&st=krf55lii&dl=1', title: 'Ondra přijel do Čejova, (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //350
  { src: 'https://dl.dropboxusercontent.com/scl/fi/ke36lt3ibr9qzwjg0zo4u/Ondra-p-ijel-do-ejova-Remastered-v.2.mp3?rlkey=w6we3yklzax8fyjwq0t7zzyp8&st=cg075i9m&dl=1', title: 'Ondra přijel do Čejova, (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //351    
    
// ═══════════════════════════════════════════════════════════
// 🎧 Mohambi
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/bcticba8dh56gei1d4ucg/mohambi-v.1.mp3?rlkey=yz62mjo15sa1y0e890ac6ncwa&st=xqwkqd28&dl=1 ", title: "Mohambi v.1 ", manuallyEdited: false, lastEditedAt: null }, //352
{ src: "https://dl.dropboxusercontent.com/scl/fi/b9a77dvf60w71i26pmhhz/mohambi-v.2.mp3?rlkey=ml6q2gf0hhdzgkjfyoxzh2ryi&st=4gr7nrw5&dl=1 ", title: "Mohambi v.2 ", manuallyEdited: false, lastEditedAt: null }, //353
{ src: "https://dl.dropboxusercontent.com/scl/fi/bqlmlojk6r022kdn8ix08/mohambi-v.3.mp3?rlkey=r6lidbh3nnroplxgfhu9wzpka&st=7ymwtysh&dl=1 ", title: "Mohambi v.3 ", manuallyEdited: false, lastEditedAt: null }, //354
{ src: "https://dl.dropboxusercontent.com/scl/fi/x82vbvj5bij83yw6ib4vf/mohambi-v.4.mp3?rlkey=v6wpk51scml9y7si2jltkq2eu&st=kcazz62r&dl=1 ", title: "mohambi v.4 ", manuallyEdited: false, lastEditedAt: null }, //355
{ src: "https://dl.dropboxusercontent.com/scl/fi/6f0gxj9wavuiu3w3mio2a/mohambi-v.5.mp3?rlkey=t2neoa68q98w7xdutmwf71a8c&st=ri0gsxup&dl=1 ", title: "mohambi v.5 ", manuallyEdited: false, lastEditedAt: null }, //356
{ src: "https://dl.dropboxusercontent.com/scl/fi/xc8xizr9qyjbns4jbkkbv/mohambi-v.6.mp3?rlkey=d3bs0knmmz8m4wnyyz3mzzem3&st=6pzfehir&dl=1 ", title: "mohambi v.6 ", manuallyEdited: false, lastEditedAt: null }, //357
{ src: "https://dl.dropboxusercontent.com/scl/fi/uemvzfu49av2ibv2czypl/mohambi-v.7.mp3?rlkey=m7u6reo3sw804z89s8egli01w&st=cf2lhsv1&dl=1 ", title: "mohambi v.7 ", manuallyEdited: false, lastEditedAt: null }, //358
{ src: "https://dl.dropboxusercontent.com/scl/fi/jsplu6hyq94deiswqp28z/mohambi-v.8.mp3?rlkey=8vlw6p91t74e64hbdcp3s5r1c&st=dyssttv0&dl=1 ", title: "mohambi v.8 ", manuallyEdited: false, lastEditedAt: null }, //359

// ═══════════════════════════════════════════════════════════
// 🎧 Mohombi Remastered
// ═══════════════════════════════════════════════════════════    
    
{ src:"https://dl.dropboxusercontent.com/scl/fi/1aw2iovwp9k03v8564owl/mohambi-v.3-Remastered-V.5.mp3?rlkey=jdhakwcvca11uu5kvygwtydza&st=qb7edfsq&dl=1", title: "Mohombi Remastered V.1", manuallyEdited: false, lastEditedAt: null }, //360            
{ src:"https://dl.dropboxusercontent.com/scl/fi/hk3hde8ms0zwn5y02ufpf/mohambi-v.3-Remastered-V.6.mp3?rlkey=zyki8gpglge8dyxuy6i9f7k1u&st=8273b87j&dl=1", title: "Mohombi Remastered V.2", manuallyEdited: false, lastEditedAt: null }, //361    
    
// ═══════════════════════════════════════════════════════════
// 🎧 Bumpy Rider Mohombi
// ═══════════════════════════════════════════════════════════    
{ src: "https://dl.dropboxusercontent.com/scl/fi/7sblob56djhzvndwtgha3/Mohombi-v.13-v.1.mp3?rlkey=9nljppq53huqglufrl975ph3y&st=rknv7tgj&dl=1",title: "Bumpy Rider Mohombi V.1", manuallyEdited: false, lastEditedAt: null }, //362
{ src: "https://dl.dropboxusercontent.com/scl/fi/h2krpngsn6uokdh3pjorz/Mohombi-v.13-v.2.mp3?rlkey=8alcqlxyf2ibxl76p1kyjen1f&st=tn8vgz6y&dl=1",title: "Bumpy Rider Mohombi V.2", manuallyEdited: false, lastEditedAt: null }, //363
{ src: "https://dl.dropboxusercontent.com/scl/fi/53yo6zu8rnownjni4q2kn/mohambi-1.mp3?rlkey=1d7x1yar74nggirof8uqcpkr3&st=0rqyr2se&dl=1",title: "Bumpy Rider Mohombi V.3 TOP 1", manuallyEdited: false, lastEditedAt: null }, //364
{ src: "https://dl.dropboxusercontent.com/scl/fi/ltij7sipmqhv9aifbjbse/Mohombi-v.15-v.3.mp3?rlkey=ddzjopdssb4sct3uvnf7ulcl6&st=dzcxt5mu&dl=1",title: "Bumpy Rider Mohombi V.4", manuallyEdited: false, lastEditedAt: null }, //365
{ src: "https://dl.dropboxusercontent.com/scl/fi/7txrsffgevqw4f403hpjt/mohambi-2.mp3?rlkey=jfc8sphdqwiat851gqks8kcod&st=c3gna1lz&dl=1",title: "Bumpy Rider Mohombi V.5", manuallyEdited: false, lastEditedAt: null }, //366    
 
 
    
// ═══════════════════════════════════════════════════════════
// 🎧 kohout / mix-kohout
// ═══════════════════════════════════════════════════════════    
{ src: "https://dl.dropboxusercontent.com/scl/fi/ysax641nd7abt6cgs11jd/kohout-v.1.mp3?rlkey=oyjq4zwqz30z47lkj99drvq1l&st=6wq0aodd&dl=1 ", title: "kohout v.1 ", manuallyEdited: false, lastEditedAt: null }, //367            
{ src: "https://dl.dropboxusercontent.com/scl/fi/1iwyhbpb7fhgcegrehnme/mix-kohout-V.1.mp3?rlkey=wc7adcp832pqw7k6l3mh2nccn&st=25sgnb5q&dl=1 ", title: "Mix kohout V.01", manuallyEdited: false, lastEditedAt: null }, //368
{ src: "https://dl.dropboxusercontent.com/scl/fi/6laqe8d8qfza22p2dslyo/mix-kohout-V.2.mp3?rlkey=t0604v56k83b4el04peuqafle&st=12o5jltm&dl=1", title: "Mix kohout V.02", manuallyEdited: false, lastEditedAt: null }, //369
{ src: "https://dl.dropboxusercontent.com/scl/fi/8ol14d205geanvxq9akf9/mix-kohout-V.3.mp3?rlkey=e5zr0alxkkr6a2krecad2r9f5&st=2s6y36jp&dl=1 ", title: "Mix kohout V.03", manuallyEdited: false, lastEditedAt: null }, //370
{ src: "https://dl.dropboxusercontent.com/scl/fi/ecjw4tz5gcn8smcofutiz/mix-kohout-V.4.mp3?rlkey=3hp5vl5725eqzlqkrj1n5r1r7&st=2wp2rk7k&dl=1 ", title: "Mix kohout V.04", manuallyEdited: false, lastEditedAt: null }, //371
{ src: "https://dl.dropboxusercontent.com/scl/fi/4c3safd6877tyf6zuosjr/mix-kohout-V-5.mp3?rlkey=iwnqphuf9ctsepm47xsdthhzu&st=xult9x0g&dl=1 ", title: "Mix kohout V.05", manuallyEdited: false, lastEditedAt: null }, //372
{ src: "https://dl.dropboxusercontent.com/scl/fi/jcj6ryqqyuonpxrymt8lg/mix-kohout-V.6.mp3?rlkey=ojc1cbn8wnccqy74tx71cj6ds&st=jugq6nqk&dl=1 ", title: "Mix kohout V.06", manuallyEdited: false, lastEditedAt: null }, //373
{ src: "https://dl.dropboxusercontent.com/scl/fi/ayrvc3uupjv5lx92g4gyz/mix-kohout-V.7.mp3?rlkey=ljd67k1trd0o7vkmo6epir4iu&st=qz1ueob9&dl=1 ", title: "Mix kohout V.07", manuallyEdited: false, lastEditedAt: null }, //374
{ src: "https://dl.dropboxusercontent.com/scl/fi/zwrj184pqcemowfua3w1u/mix-kohout-V.8.mp3?rlkey=ez41k47e59iyo6m31aughaqej&st=wt767u2t&dl=1 ", title: "Mix kohout V.08", manuallyEdited: false, lastEditedAt: null }, //375
{ src: "https://dl.dropboxusercontent.com/scl/fi/g279fbyosxb6x01witj7f/mix-kohout-V.9.mp3?rlkey=fgamtlpxa8ndvfff492w91940&st=etozw2uf&dl=1 ", title: "Mix kohout V.09", manuallyEdited: false, lastEditedAt: null }, //376
{ src: "https://dl.dropboxusercontent.com/scl/fi/91g27sj33psivnm0lzr8k/mix-kohout-V.10.mp3?rlkey=f1223z2o2h3u8akdouv941jzy&st=ratiibn9&dl=1 ", title: "Mix kohout V.10", manuallyEdited: false, lastEditedAt: null }, //377
{ src: "https://dl.dropboxusercontent.com/scl/fi/nfl1l0glqnt8b60qbcje1/kohout-v.3-military-song-ritmick-melodic-military.mp3?rlkey=wh5ukr8e2xb1vzkwuwy3zy18m&st=hl4zeaji&dl=1", title: "kohout v.3 [military song ritmick melodic military]", manuallyEdited: false, lastEditedAt: null }, //378    
// ═══════════════════════════════════════════════════════════
// 🎧 Hora Matterhorn
// ═══════════════════════════════════════════════════════════   
 { src: 'https://dl.dropboxusercontent.com/scl/fi/yifc12ogr968c402noz9q/Matterhorn-v.1.mp3?rlkey=4hiirddy63t7h6p4cfj0sdkko&st=t47jom0x&dl=1', title: 'Hora Matterhorn V.01', manuallyEdited: false, lastEditedAt: null }, //379
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4pone6lz1v69ud9p54je9/Matterhorn-v.2.mp3?rlkey=wifirr8ltryxckesresc8mpf8&st=0zuyyli1&dl=1', title: 'Hora Matterhorn V.02', manuallyEdited: false, lastEditedAt: null }, //380
{ src: 'https://dl.dropboxusercontent.com/scl/fi/tzp1ayk64yaqxkc4ykfsg/Matterhorn-v.3.mp3?rlkey=bjczth72wvwu33mgftl4boihf&st=zivgx8jk&dl=1', title: 'Hora Matterhorn V.03', manuallyEdited: false, lastEditedAt: null }, //381
{ src: 'https://dl.dropboxusercontent.com/scl/fi/zw9s5l809j63px20732c0/Matterhorn-v.4.mp3?rlkey=hc9orcsudx7mkxblng9lmbqyi&st=8775n8k8&dl=1', title: 'Hora Matterhorn V.04', manuallyEdited: false, lastEditedAt: null }, //382
{ src: 'https://dl.dropboxusercontent.com/scl/fi/eva148erkiq5ihp4sgyk6/Matterhorn-v.5.mp3?rlkey=nl48abg9e7pob3kuof7cz6rq2&st=cq77lql2&dl=1', title: 'Hora Matterhorn V.05', manuallyEdited: false, lastEditedAt: null }, //383
{ src: 'https://dl.dropboxusercontent.com/scl/fi/86a1ju270l8a3qrk8rtro/Matterhorn-v.6.mp3?rlkey=a3zoyvnnsst4m87nz4nzis513&st=70kun1gb&dl=1', title: 'Hora Matterhorn V.06', manuallyEdited: false, lastEditedAt: null }, //384
{ src: 'https://dl.dropboxusercontent.com/scl/fi/oz0r85rjy5qpq10fevgni/Matterhorn-v.7.mp3?rlkey=lu5ialgoyst9rcrohuscpb25l&st=vqhdfjfe&dl=1', title: 'Hora Matterhorn V.07', manuallyEdited: false, lastEditedAt: null }, //385
{ src: 'https://dl.dropboxusercontent.com/scl/fi/bdcos3qqna6m9jmpqjvyv/Matterhorn-v.8.mp3?rlkey=4jo77smgmemfl46k7b59cq4d6&st=7eipxp13&dl=1', title: 'Hora Matterhorn V.08', manuallyEdited: false, lastEditedAt: null }, //386
{ src: 'https://dl.dropboxusercontent.com/scl/fi/06117xzx2uxntef8gvwx7/Matterhorn-v.9.mp3?rlkey=jrjjj3ajy9v1r06bjpamcq34u&st=in90rus4&dl=1', title: 'Hora Matterhorn V.09', manuallyEdited: false, lastEditedAt: null }, //387   
    
// ═══════════════════════════════════════════════════════════
// 🎧 Nebude to ľahké
// ═══════════════════════════════════════════════════════════    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/xmwpg06o52s2wy91ssov5/Nebude-to-ahk-v.1.mp3?rlkey=fv6ah3vzgxrdqdkgct9u8f1hv&st=59gtbxr0&dl=1', title: 'Nebude to ľahké v.01', manuallyEdited: false, lastEditedAt: null }, //388
{ src: 'https://dl.dropboxusercontent.com/scl/fi/qer50nnq5ociabsn9qhnu/Nebude-to-ahk-v.2.mp3?rlkey=8f567r1tb449z2gi4qmrxkxg7&st=ku36cbzq&dl=1', title: 'Nebude to ľahké v.02', manuallyEdited: false, lastEditedAt: null }, //389
{ src: 'https://dl.dropboxusercontent.com/scl/fi/yhdp3lazpic8az1y4g9cw/Nebude-to-ahk-v.3.mp3?rlkey=adksrbsgo8gc5qs5ihjz5dbvs&st=7k1ukaf5&dl=1', title: 'Nebude to ľahké v.03', manuallyEdited: false, lastEditedAt: null }, //390
{ src: 'https://dl.dropboxusercontent.com/scl/fi/g87yq7wn257lip1jg1fln/Nebude-to-ahk-v.4.mp3?rlkey=k4dya875ljgpaoqfufoyzmf8j&st=epuatjog&dl=1', title: 'Nebude to ľahké v.04', manuallyEdited: false, lastEditedAt: null }, //391
{ src: 'https://dl.dropboxusercontent.com/scl/fi/5el3qv7vsdn6y02lg2uec/Nebude-to-ahk-v.5.mp3?rlkey=2c1u0nh4evsf5e2xm8gnqepko&st=7e6r2ehc&dl=1', title: 'Nebude to ľahké v.05', manuallyEdited: false, lastEditedAt: null }, //392
{ src: 'https://dl.dropboxusercontent.com/scl/fi/5zojb0mbwl4hez9nelt1i/Nebude-to-ahk-v.6.mp3?rlkey=xget125ermw2bhowyoaifizmn&st=f3z18305&dl=1', title: 'Nebude to ľahké v.06', manuallyEdited: false, lastEditedAt: null }, //393
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4jwbsz4v6g37o8tte7tmu/Nebude-to-ahk-v.7.mp3?rlkey=uiqqux4xu8bgbknt00npals78&st=w3k2cezl&dl=1', title: 'Nebude to ľahké v.07', manuallyEdited: false, lastEditedAt: null }, //394
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7imkyrq0e4jfv1d8ckuze/Nebude-to-ahk-v.8.mp3?rlkey=v2ugatpgkhjsvnpczvrcf95kq&st=60c8hc3x&dl=1', title: 'Nebude to ľahké v.08', manuallyEdited: false, lastEditedAt: null }, //395
{ src: 'https://dl.dropboxusercontent.com/scl/fi/er47x7bhnd3e853ammxio/Nebude-to-ahk-v.9.mp3?rlkey=l5k5ang4e72fxf2pbawuuhw8h&st=0f4u4l2d&dl=1', title: 'Nebude to ľahké v.09', manuallyEdited: false, lastEditedAt: null }, //396
{ src: 'https://dl.dropboxusercontent.com/scl/fi/0ys4aun4k5ohoor27fl7a/Nebude-to-ahk-v.10.mp3?rlkey=rhgetwm5mgkyae6p5mrnqfx9y&st=eyeiqkth&dl=1', title: 'Nebude to ľahké v.10', manuallyEdited: false, lastEditedAt: null }, //397
{ src: 'https://dl.dropboxusercontent.com/scl/fi/oh2e9k5yniq1843d52v2y/Nebude-to-ahk-v.11.mp3?rlkey=fsgpfvv2qwm4hfes82s1qlu4j&st=96qpdmw3&dl=1', 
 title: 'Nebude to ľahké v.11', manuallyEdited: false, lastEditedAt: null }, //398    
    
// ═══════════════════════════════════════════════════════════
// 🎧 RŮZNÉ HITY & SINGLY
// ═══════════════════════════════════════════════════════════
{ src: "https://dl.dropboxusercontent.com/scl/fi/2v0ez9ynqj9u3tbbs2kn4/ARAKAIN-DYMYTRY-t-sv-j-sen.mp3?rlkey=begwlnhg48um443rm64jaj8k0&st=g7r3sb52&dl=1", title: "Arakain Dymytry - Žít svůj sen", duration: '04:56', manuallyEdited: false, lastEditedAt: null }, //399
{ src: "https://dl.dropboxusercontent.com/scl/fi/8u2jqzqt7yhtzksc5qi6j/Bolivia-con-Amor.mp3?rlkey=rurkepmch68nrckh502js2g5q&st=daidw0mp&dl=1 ", title: "56--Bolivia con Amor ", manuallyEdited: false, lastEditedAt: null }, //400
{ src: "https://dl.dropboxusercontent.com/scl/fi/d0usu2bwz053yl2lc3ago/Kr-l-Agraelus.mp3?rlkey=kl55dxlrmh8n91cselr6rbo8k&st=m9btx6wq&dl=1 ", title: "Král Agraelus ", manuallyEdited: false, lastEditedAt: null }, //401
{ src: "https://dl.dropboxusercontent.com/scl/fi/4vglklzizcxu8lgjbop0c/ern-havran-Czech-1.mp3?rlkey=4hp1nlsqaz1adji751ziccn2u&st=v8gq8n9s&dl=1", title: "Černý Havran", manuallyEdited: false, lastEditedAt: null }, //402

{ src: 'https://dl.dropboxusercontent.com/scl/fi/2znr74akdskdujwgvw6gc/Diana-Fuentes-Gente-de-Zona-La-Vida-Me-Cambi-V.1.mp3?rlkey=qhf5rrc7nws7qvgyx9vc42ors&st=eto383yf&dl=1', title: 'Diana Fuentes, Gente de Zona - La Vida Me Cambió V.1', manuallyEdited: false, lastEditedAt: null }, //403
{ src: 'https://dl.dropboxusercontent.com/scl/fi/tp8mo3nt4ylkxlo0kiasy/Diana-Fuentes-Gente-de-Zona-La-Vida-Me-Cambi-V.2.mp3?rlkey=v5164nd80stuqwk9lmxx4c7ll&st=ow6cisfr&dl=1', title: 'Diana Fuentes, Gente de Zona - La Vida Me Cambió V.2', manuallyEdited: false, lastEditedAt: null }, //404

// ═══════════════════════════════════════════════════════════
// 🎧 SÉRIE: NA OKOŘ JE CESTA (VŠECHNY VERZE)
// ═══════════════════════════════════════════════════════════
 
{ src: "https://dl.dropboxusercontent.com/scl/fi/lx31v7stuwwngiyu1gh73/na-oko-je-cesta-V.5.mp3?rlkey=unzilsmm49gmleo9qq2sk7180&st=w4ciths2&dl=1 ", title: "Na okož je cesta V.1 ", manuallyEdited: false, lastEditedAt: null }, //405
{ src: "https://dl.dropboxusercontent.com/scl/fi/22usijk3mfq5a24hou01l/na-oko-je-cesta-V.9.mp3?rlkey=ruuxm0hweyu98g5gl1zm1a1wn&st=o0haf1zx&dl=1 ", title: "Na okož je cesta V.2", manuallyEdited: false, lastEditedAt: null }, //406
{ src: "https://dl.dropboxusercontent.com/scl/fi/a9hbcr02vejmgodexj4du/na-oko-je-cesta-V.13.mp3?rlkey=fvebjye6qp2c7jkey4t21rffy&st=vbviz1n6&dl=1", title: "Na okož je cesta V.3 ", manuallyEdited: false, lastEditedAt: null }, //407
{ src: "https://dl.dropboxusercontent.com/scl/fi/17estx6ahgrj72wj5fzoz/na-oko-je-cesta-V.14.mp3?rlkey=kk24z8vzes99od62f7ep3j81q&st=afsawdqs&dl=1", title: "Na okož je cesta V.4 ", manuallyEdited: false, lastEditedAt: null }, //408
 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/c6o1x8tt1c14hslncyvwj/na-Oko-je-cesta-v.1.mp3?rlkey=657gb6a8ajkikafh44v5ais8h&st=r7gbf1nd&dl=1', title: 'na Okoř je cesta v.5', manuallyEdited: false, lastEditedAt: null }, //409
{ src: 'https://dl.dropboxusercontent.com/scl/fi/83jxjjtu7wiigyrvqr2e2/na-Oko-je-cesta-v.2.mp3?rlkey=vg0ppeifz4xxndw0akqfy9kgr&st=e6izxli9&dl=1', title: 'na Okoř je cesta v.6', manuallyEdited: false, lastEditedAt: null }, //410
{ src: 'https://dl.dropboxusercontent.com/scl/fi/l4htguc8qrla7rpae456c/na-Oko-je-cesta-v.3.mp3?rlkey=t2i95zahn7bs7c8kcyonuxkuk&st=e1mu3l8t&dl=1', title: 'na Okoř je cesta v.7', manuallyEdited: false, lastEditedAt: null }, //411
{ src: 'https://dl.dropboxusercontent.com/scl/fi/b6mfpkmdfja6nqrbnr1oq/na-Oko-je-cesta-v.4.mp3?rlkey=in5lvxhct45lqp9dzm76dg0p1&st=s4b5ug97&dl=1', title: 'na Okoř je cesta v.8', manuallyEdited: false, lastEditedAt: null }, //412
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4x8z3ztl80v3l8md7qptf/na-Oko-je-cesta-v.5.mp3?rlkey=2o4cn1svrjxbn1fc5rzxcy96y&st=xmnlv3g4&dl=1', title: 'na Okoř je cesta v.9', manuallyEdited: false, lastEditedAt: null }, //413

// ═══════════════════════════════════════════════════════════
// 🎧 ZÁBAVNÉ & PRACOVNÍ PÍSNIČKY
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/13chcwt5eqkka6geyiyc0/Prace-je-na-hovno-top.1.mp3?rlkey=3068g08c89o9toiuea1g2c9ne&st=9wjfq9p5&dl=1', title: 'Práce na hovno top.1', manuallyEdited: false, lastEditedAt: null }, //414
{ src: 'https://dl.dropboxusercontent.com/scl/fi/zeak94p6awsxe31tj7y1e/Pr-ce-je-na-hovno-v.1.mp3?rlkey=16sy4hx60yx9levwh21uuzws5&st=za5h5ia8&dl=1', title: 'Práce je na hovno v.1 ', manuallyEdited: false, lastEditedAt: null }, //415
{ src: 'https://dl.dropboxusercontent.com/scl/fi/57aid019mytmb0hr19j8u/Pr-ce-je-na-hovno-v.2.mp3?rlkey=8knbuo9kuh0mivyq9xd2s2yxz&st=h9ruovvn&dl=1', title: 'Práce je na hovno v.2 ', manuallyEdited: false, lastEditedAt: null }, //416
{ src: 'https://dl.dropboxusercontent.com/scl/fi/6nr2jfxfdjm7qrlt2bgp0/sprost-pisni-ka-remake-v.00.mp3?rlkey=hvnqn8h8bi2zuu9nro0mg3tqn&st=l7r2e041&dl=1', title: 'sprostá pisniška remake v.00', manuallyEdited: false, lastEditedAt: null }, //417
{ src: 'https://dl.dropboxusercontent.com/scl/fi/n0gfe6ga56k0nzmwan5lr/sprost-pisni-ka-Remastered-v.1.mp3?rlkey=lso0ffijsa7k367emhdjp7jya&st=ey6hvaks&dl=1', title: 'sprostá pisniška (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //418
{ src: 'https://dl.dropboxusercontent.com/scl/fi/idzxn6pttqo5wd06inxn6/sprost-pisni-ka-Remastered-v.2.mp3?rlkey=4azn3p37xhmg9x1asplnxwck4&st=os61s2ut&dl=1', title: 'sprostá pisniška (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //419
{ src: 'https://dl.dropboxusercontent.com/scl/fi/kc874ru80o269o2i4e941/U-nejsem-tv-hra-ka-Remastered-v.1.mp3?rlkey=t1gxhizzv566wvc0hoajt3ad0&st=v0hr287t&dl=1', title: 'Už nejsem tvá hračka (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //420
{ src: 'https://dl.dropboxusercontent.com/scl/fi/8an781xkw0u16q93xtloi/U-nejsem-tv-hra-ka-Remastered-v.2.mp3?rlkey=j8csjilyc34dui3xewuvbqwcg&st=kbrnxsh2&dl=1', title: 'Už nejsem tvá hračka (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //421

// ═══════════════════════════════════════════════════════════
// 🎧 SPECIÁLNÍ & INSTRUMENTÁLNÍ SETY
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/n5wvnnjbigr2mxy0syd28/disko-instrument-ln-Remastered-v.1.mp3?rlkey=ny7tc6r78bk0k67no2zetlhrf&st=0zzfd9wc&dl=1', title: 'disko instrumentální (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //422
{ src: 'https://dl.dropboxusercontent.com/scl/fi/y5s6oekrjsstw34m9v484/disko-instrument-ln-Remastered-v.2.mp3?rlkey=en95cvifusoktmvv0x390v2ru&st=6952l6y9&dl=1', title: 'disko instrumentální (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //423
{ src: 'https://dl.dropboxusercontent.com/scl/fi/g1n0z5x4xorp0rp7ws5ne/disko-instrument-ln-Remastered-v.3.mp3?rlkey=u78xmq9cqck8xonuk4agp2b8x&st=3jy8d0rg&dl=1', title: 'disko instrumentální (Rema) v.3', manuallyEdited: false, lastEditedAt: null }, //424
{ src: 'https://dl.dropboxusercontent.com/scl/fi/19jklmj4jb6g3l4ww0c1f/disko-instrument-ln-Remastered-v.4.mp3?rlkey=sahyd4n5jp1lry0rdbwmaq67y&st=uesoqgwb&dl=1', title: 'disko instrumentální (Rema) v.4', manuallyEdited: false, lastEditedAt: null }, //425
{ src: 'https://dl.dropboxusercontent.com/scl/fi/50f06lwzxdqiu16v44ejr/Reckon-That-s-th-Wron-Order-v.3-Remastered-v.1.mp3?rlkey=js9pclvhkaxkw8dbx0tz23703&st=6s6wx5ck&dl=1', title: 'Reckon That s th Wron Order (Rema) v.1', manuallyEdited: false, lastEditedAt: null }, //426
{ src: 'https://dl.dropboxusercontent.com/scl/fi/38m57vc46iffq691tfe2h/Reckon-That-s-th-Wron-Order-v.3-Remastered-v.2.mp3?rlkey=d3p698a8vsxt1rpzbo69sex0z&st=7hlh8buu&dl=1', title: 'Reckon That s thWron Order (Rema) v.2', manuallyEdited: false, lastEditedAt: null }, //427
{ src: 'https://dl.dropboxusercontent.com/scl/fi/p54l2pqbkavk1tz44js9y/chrismas-pisen-v.1.wav?rlkey=3w09tngmuudrk0gld15vcv7df&st=6wj6ork0&dl=1', title: 'Chrismas piseň V.1', manuallyEdited: false, lastEditedAt: null }, //428
{ src: 'https://dl.dropboxusercontent.com/scl/fi/aza5f1ue1r3qsvdwu0ce7/chrismas-pisen-v.2.wav?rlkey=3pkw7sto0smlp1uf54079lxhr&st=gf1f3ppn&dl=1', title: 'Chrismas piseň V.2', manuallyEdited: false, lastEditedAt: null }, //429

// ═══════════════════════════════════════════════════════════
// 🎧 MIX PÍSNIČEK (KOMPLETNÍ SÉRIE)
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/umjyrkl3cxfm6majipbsl/mix-p-sni-ek-v.1.mp3?rlkey=zysejafc9fxbokz0pn8pep93w&st=s0pp6qup&dl=1', title: 'mix písniček v.1', manuallyEdited: false, lastEditedAt: null }, //430
{ src: 'https://dl.dropboxusercontent.com/scl/fi/qgzcg0tiugq2eu39jbelt/mix-p-sni-ek-v.2.mp3?rlkey=l7q0yvnb0wwasy8l3lbtlmdul&st=mhusriun&dl=1', title: 'mix písniček v.2', manuallyEdited: false, lastEditedAt: null }, //431
{ src: 'https://dl.dropboxusercontent.com/scl/fi/e8ixuz03io5rs078i4t2a/mix-p-sni-ek-v.3.mp3?rlkey=u6x614g67thnyn8r5782yyu99&st=5ou0v1rt&dl=1', title: 'mix písniček v.3', manuallyEdited: false, lastEditedAt: null }, //432
{ src: 'https://dl.dropboxusercontent.com/scl/fi/2gjdeaxxxoce5uqcal5tf/mix-p-sni-ek-v.4.mp3?rlkey=0y9zcm985mxz6hosbqufmkezm&st=2ww2ralg&dl=1', title: 'mix písniček v.4', manuallyEdited: false, lastEditedAt: null }, //433
{ src: 'https://dl.dropboxusercontent.com/scl/fi/sjhs5uj26d8nhzcte42uo/mix-p-sni-ek-v.5.mp3?rlkey=fiqw8vnrmkxcwh52bjuthywst&st=w3s64nld&dl=1', title: 'mix písniček v.5', manuallyEdited: false, lastEditedAt: null }, //434
{ src: 'https://dl.dropboxusercontent.com/scl/fi/s77rmj77jgon0jnwi8a1o/mix-p-sni-ek-v.6.mp3?rlkey=vci7p38jci9g5lt2c7ybyu338&st=wppjnwcj&dl=1', title: 'mix písniček v.6', manuallyEdited: false, lastEditedAt: null }, //435
{ src: 'https://dl.dropboxusercontent.com/scl/fi/2ymgare8f3h9n3ckmtpm6/mix-p-sni-ek-v.7.mp3?rlkey=xerq5noy73m5i8xzo44wxcmnf&st=ltbu3su8&dl=1', title: 'mix písniček v.7', manuallyEdited: false, lastEditedAt: null }, //436
{ src: 'https://dl.dropboxusercontent.com/scl/fi/fqvao7naonsv3q7z4vhv6/mix-p-sni-ek-v.8.mp3?rlkey=0o5bnw1tppgfqmtwh60a7nrhs&st=61cz4rlk&dl=1', title: 'mix písniček v.8', manuallyEdited: false, lastEditedAt: null }, //437
{ src: 'https://dl.dropboxusercontent.com/scl/fi/mbi16rerzufv9rg2gqcbd/mix-p-sni-ek-v.9.mp3?rlkey=h2sigdbmealjjiii1ak540a7k&st=0k8rmizq&dl=1', title: 'mix písniček v.9', manuallyEdited: false, lastEditedAt: null }, //438
{ src: 'https://dl.dropboxusercontent.com/scl/fi/6oj3b0snsrdol0oqq5838/mix-p-sni-ek-v.10.mp3?rlkey=1bukogfm3vkt5dx964falth8k&st=287lbbr0&dl=1', title: 'mix písniček v.10', manuallyEdited: false, lastEditedAt: null }, //439

// ═══════════════════════════════════════════════════════════
// 🎧 AUDIO KAPITOLY (1-40)
// ═══════════════════════════════════════════════════════════
{ src: 'https://dl.dropboxusercontent.com/scl/fi/bski2kzexy3qdlbmgsxss/kapitola-1.wav?rlkey=na7nywvdr4qtx0r7jwd60s7it&st=kcdgeboq&dl=1', title: 'kapitola 01', manuallyEdited: false, lastEditedAt: null }, //440
{ src: 'https://dl.dropboxusercontent.com/scl/fi/9jqh1qe1t4y5b1esu7z51/kapitola-2.wav?rlkey=zycm6m6prvht4g9pbe9c7relr&st=nrxutjwe&dl=1', title: 'kapitola 02 ', manuallyEdited: false, lastEditedAt: null }, //441
{ src: 'https://dl.dropboxusercontent.com/scl/fi/2x6h3c6wqp8k5w56g2hze/kapitola-3.wav?rlkey=83zmb0kqo1cc8gt6vffq7m0iv&st=jf4bsxkp&dl=1', title: 'kapitola 03', manuallyEdited: false, lastEditedAt: null }, //442
{ src: 'https://dl.dropboxusercontent.com/scl/fi/zqn76vdhm6nhyghpbrgwk/kapitola-4.wav?rlkey=emxpis829qzsuf12uh5ehtpt6&st=0wguhmn0&dl=1', title: 'kapitola 04', manuallyEdited: false, lastEditedAt: null }, //443
{ src: 'https://dl.dropboxusercontent.com/scl/fi/h5shsqdqk94xdi34zbzq4/kapitola-5.wav?rlkey=k6r5ll0zosn5hfuzkauomqylj&st=7yx2wxum&dl=1', title: 'kapitola 05', manuallyEdited: false, lastEditedAt: null }, //444
{ src: 'https://dl.dropboxusercontent.com/scl/fi/tcsjbxiu76u8njja0xunq/kapitola-6.wav?rlkey=r3urvqteliyr6b1ydw4gnq92p&st=u5bye7zb&dl=1', title: 'kapitola 06', manuallyEdited: false, lastEditedAt: null }, //445
{ src: 'https://dl.dropboxusercontent.com/scl/fi/co3yl6096mmudqiwx230m/kapitola-7.wav?rlkey=zjpxwom0xwnvl2ok9fh5s0d76&st=eu14bnt3&dl=1', title: 'kapitola 07', manuallyEdited: false, lastEditedAt: null }, //446
{ src: 'https://dl.dropboxusercontent.com/scl/fi/cegy3xgjst70pc9jogera/kapitola-8.wav?rlkey=czij00yxulpzfjq3p4c6l1is6&st=iiq7op1h&dl=1', title: 'kapitola 08', manuallyEdited: false, lastEditedAt: null }, //447
{ src: 'https://dl.dropboxusercontent.com/scl/fi/wvetimvrg7gwakf7kbxu8/kapitola-9.wav?rlkey=7vvj77q7dwtgzcx0vu2a3wyob&st=5bgqbph6&dl=1', title: 'kapitola 09', manuallyEdited: false, lastEditedAt: null }, //448
{ src: 'https://dl.dropboxusercontent.com/scl/fi/a6m4se7pg12x4c129tv78/kapitola-10.wav?rlkey=kemggsfyqpnku9kvws6lce85p&st=3vxb72rf&dl=1', title: 'kapitola 10', manuallyEdited: false, lastEditedAt: null }, //449
{ src: 'https://dl.dropboxusercontent.com/scl/fi/t41fohw659gwnv9ts71h9/kapitola-11.wav?rlkey=v6uqyy8rw8zyw4h4y6qh0ejo5&st=uh63mj50&dl=1', title: 'kapitola 11', manuallyEdited: false, lastEditedAt: null }, //450
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4n73i1lb7l482e2zy004e/kapitola-12.wav?rlkey=ri23n5qihx5ttn9dfbfmj4vpd&st=3tn9at6y&dl=1', title: 'kapitola 12', manuallyEdited: false, lastEditedAt: null }, //451
{ src: 'https://dl.dropboxusercontent.com/scl/fi/02ddw62zdgoplquykfxxk/kapitola-13.wav?rlkey=ni2vk119rhxxcfvn1i7mvk573&st=m23ej1uw&dl=1', title: 'kapitola 13', manuallyEdited: false, lastEditedAt: null }, //452
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7pkmzepb7xosys65lcbzv/kapitola-14.wav?rlkey=dtx7omc81t6h16g9148kupxju&st=2wpdtyi6&dl=1', title: 'kapitola 14', manuallyEdited: false, lastEditedAt: null }, //453
{ src: 'https://dl.dropboxusercontent.com/scl/fi/4s6ly2xvg8rcpre0ixvol/kapitola-15.wav?rlkey=i3hb22usknj3jdip1c7x2827g&st=8ky0mgzb&dl=1', title: 'kapitola 15', manuallyEdited: false, lastEditedAt: null }, //454
{ src: 'https://dl.dropboxusercontent.com/scl/fi/r65pmkb4ekhukgbfvij9c/kapitola-16.wav?rlkey=fnsnui4885eh4bchjw9tpjof1&st=ngrmyl5a&dl=1', title: 'kapitola 16', manuallyEdited: false, lastEditedAt: null }, //455
{ src: 'https://dl.dropboxusercontent.com/scl/fi/8jfywr9ysalymp1ux5njw/kapitola-17.wav?rlkey=z0xdonjugsqpes594uzlvd6ly&st=lw8gayfb&dl=1', title: 'kapitola 17', manuallyEdited: false, lastEditedAt: null }, //456
{ src: 'https://dl.dropboxusercontent.com/scl/fi/vekhzjzzs2c4zeanqe6k1/kapitola-18.wav?rlkey=ch6b9eq8702k8ayrcsae3m9ky&st=8ouk4qzd&dl=1', title: 'kapitola 18', manuallyEdited: false, lastEditedAt: null }, //457
{ src: 'https://dl.dropboxusercontent.com/scl/fi/j3pze9vy8vle3mz5k4yq9/kapitola-19.wav?rlkey=e3q4yrqg1b413v7363aouw8ju&st=b5y1kzqj&dl=1', title: 'kapitola 19', manuallyEdited: false, lastEditedAt: null }, //458
{ src: 'https://dl.dropboxusercontent.com/scl/fi/czkzpt8pa670zxqmmu2zy/kapitola-20.wav?rlkey=lvrgdw87xf0cbfk16bnp607u2&st=1700zw0l&dl=1', title: 'kapitola 20', manuallyEdited: false, lastEditedAt: null }, //459
{ src: 'https://dl.dropboxusercontent.com/scl/fi/a6zl9gkwgukwo3wweqdxt/kapitola-21.wav?rlkey=c2km633niog47txnsq1wgagq5&st=oevhg7yr&dl=1', title: 'kapitola 21', manuallyEdited: false, lastEditedAt: null }, //460
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ais0xn232x53mjru7vxqn/kapitola-22.wav?rlkey=0zkocz0qvhr0w6qvtk5o9bj4r&st=klr50l70&dl=1', title: 'kapitola 22', manuallyEdited: false, lastEditedAt: null }, //461
{ src: 'https://dl.dropboxusercontent.com/scl/fi/o6qrn2fwky9g9bn04a6cs/kapitola-23.wav?rlkey=edbvmbp2c14fmn5qpvb441o00&st=5lhepl5m&dl=1', title: 'kapitola 23', manuallyEdited: false, lastEditedAt: null }, //462
{ src: 'https://dl.dropboxusercontent.com/scl/fi/2nkjme6yffnp3n14l4eas/kapitola-24.wav?rlkey=piy96260mfz2x9ouv3mi1mbwa&st=wdxt0ndp&dl=1', title: 'kapitola 24', manuallyEdited: false, lastEditedAt: null }, //463
{ src: 'https://dl.dropboxusercontent.com/scl/fi/rpo3ub7ht4i7wmoxg9gwa/kapitola-25.wav?rlkey=g9fr7ptqpni2g9fxh1l3ypxr3&st=7swjtvye&dl=1', title: 'kapitola 25', manuallyEdited: false, lastEditedAt: null }, //464
{ src: 'https://dl.dropboxusercontent.com/scl/fi/xeehdcepeoxaajh0obtre/kapitola-26.wav?rlkey=7xyvh161eub801pmsnrji04n5&st=mmtlmjy1&dl=1', title: 'kapitola 26', manuallyEdited: false, lastEditedAt: null }, //465
{ src: 'https://dl.dropboxusercontent.com/scl/fi/9d8eeyrzvusnlact95nyp/kapitola-27.wav?rlkey=rs19d8sh1bm77lelffqj3yf0h&st=51kb0dg3&dl=1', title: 'kapitola 27', manuallyEdited: false, lastEditedAt: null }, //466
{ src: 'https://dl.dropboxusercontent.com/scl/fi/lw1507xu08nf63sx9oa2e/kapitola-28.wav?rlkey=rrn05voaq9rlz4hyhzw74zo6d&st=6twrd0mx&dl=1', title: 'kapitola 28', manuallyEdited: false, lastEditedAt: null }, //467
{ src: 'https://dl.dropboxusercontent.com/scl/fi/0ehmov74ezr0niu547ynl/kapitola-29.wav?rlkey=aod59rg2wmjy0m8m8a9mac710&st=fnkryx31&dl=1', title: 'kapitola 29', manuallyEdited: false, lastEditedAt: null }, //468
{ src: 'https://dl.dropboxusercontent.com/scl/fi/db0z6gwap5wto89hpdh2q/kapitola-30.wav?rlkey=fp9jg33batmt46qh1s9nzbsc0&st=xpm93fq4&dl=1', title: 'kapitola 30', manuallyEdited: false, lastEditedAt: null }, //469
{ src: 'https://dl.dropboxusercontent.com/scl/fi/vxrslv8fb4krf1fpqfjjt/kapitola-31.wav?rlkey=iy4cbqpnm7spyjpe384q8ymvv&st=z1qsvv1j&dl=1', title: 'kapitola 31', manuallyEdited: false, lastEditedAt: null }, //470
{ src: 'https://dl.dropboxusercontent.com/scl/fi/vbwtb1jrp9qtnxldl1dk3/kapitola-32.wav?rlkey=9g7h9v6u6w8trh6ngq3kw9zig&st=xuc007qh&dl=1', title: 'kapitola 32', manuallyEdited: false, lastEditedAt: null }, //471
{ src: 'https://dl.dropboxusercontent.com/scl/fi/w12vncdcwkvvlb2rvgv91/kapitola-33.wav?rlkey=dqm0o1j8dfy8j491xycz5m5xa&st=7hj7whp0&dl=1', title: 'kapitola 33', manuallyEdited: false, lastEditedAt: null }, //472
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ts4iecs4b5g2jooyk40xd/kapitola-34.wav?rlkey=msgg6a8wny8p3rs73eoh9e1r1&st=yofgu6sn&dl=1', title: 'kapitola 34', manuallyEdited: false, lastEditedAt: null }, //473
{ src: 'https://dl.dropboxusercontent.com/scl/fi/u5umgelznk837b02233qt/kapitola-35.wav?rlkey=l613fq5r7ugx33t25ykz6ckl4&st=uzrsudr0&dl=1', title: 'kapitola 35', manuallyEdited: false, lastEditedAt: null }, //474
{ src: 'https://dl.dropboxusercontent.com/scl/fi/azn1401i2tsdyzancxntc/kapitola-36.wav?rlkey=fqoqnolf6tp2xlgbihc1uu8v1&st=u2bqk6l8&dl=1', title: 'kapitola 36', manuallyEdited: false, lastEditedAt: null }, //475
{ src: 'https://dl.dropboxusercontent.com/scl/fi/futnm4de91g7h7p3wdnfi/kapitola-37.wav?rlkey=2lxjgnif2p69m05opdv8cicso&st=ma6fzw3p&dl=1', title: 'kapitola 37', manuallyEdited: false, lastEditedAt: null }, //476
{ src: 'https://dl.dropboxusercontent.com/scl/fi/p0tzlrzqj6er1j56b7prt/kapitola-38.wav?rlkey=lnbu8a9qpvu7h3okcuh4lrvd5&st=3qclta85&dl=1', title: 'kapitola 38', manuallyEdited: false, lastEditedAt: null }, //477
{ src: 'https://dl.dropboxusercontent.com/scl/fi/brgz7nh2es7ck9ubt08yg/kapitola-39.wav?rlkey=d2svq670defuk8feoesusedip&st=1pqxlnbk&dl=1', title: 'kapitola 39', manuallyEdited: false, lastEditedAt: null }, //478
{ src: 'https://dl.dropboxusercontent.com/scl/fi/jnatm6xldsffkvgbyscd9/kapitola-40.wav?rlkey=5ewmyq66dz5jkn1a6tkbj1nae&st=i7iu6cc0&dl=1', title: 'kapitola 40', manuallyEdited: false, lastEditedAt: null }, //479 
    
// ═══════════════════════════════════════════════════════════
//  🎧 Jardova-cesta-s-prateli
// ═══════════════════════════════════════════════════════════    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/94u9it6bis8c22hjv86bm/Jardova-cesta-s-prateli-v.1.mp3?rlkey=popn4lgotuvwmf9u80jb37f61&st=uc26wjd7&dl=1', title: 'Jardova-cesta-s-prateli-v.1', manuallyEdited: false, lastEditedAt: null }, //480
  { src: 'https://dl.dropboxusercontent.com/scl/fi/71yr1m4xco8hvewasfl4x/Jardova-cesta-s-prateli-v.2.mp3?rlkey=c42yqa3ns4otj4tmwubmlpws5&st=now7enzf&dl=1', title: 'Jardova-cesta-s-prateli-v.2', manuallyEdited: false, lastEditedAt: null }, //481
  { src: 'https://dl.dropboxusercontent.com/scl/fi/9esgur99r5cu31kmsiyhw/Jardova-cesta-s-prateli-v.3.mp3?rlkey=c3i8vfd3hm5keyg9dsjftttk5&st=iobdq9lc&dl=1', title: 'Jardova-cesta-s-prateli-v.3', manuallyEdited: false, lastEditedAt: null }, //482
  { src: 'https://dl.dropboxusercontent.com/scl/fi/5mb4ypu4zdcolj2p28vz2/Jardova-cesta-s-prateli-v.4.mp3?rlkey=wwklrfryzzuc4xcs4vs2n7lgg&st=7h4ukj4b&dl=1', title: 'Jardova-cesta-s-prateli-v.4', manuallyEdited: false, lastEditedAt: null }, //483
  { src: 'https://dl.dropboxusercontent.com/scl/fi/217u0otcntjh44dnkka00/Jardova-cesta-s-prateli-v.5-Top-1.mp3?rlkey=8ba618idnur6vulc462kpohw0&st=dkrdrn6d&dl=1', title: 'Jardova-cesta-s-prateli-v.5-Top-1', manuallyEdited: false, lastEditedAt: null }, //484
  { src: 'https://dl.dropboxusercontent.com/scl/fi/ufegyq7l4ctmighojm7cd/Jardova-cesta-s-prateli-v.5-Top-1-audacity.wav?rlkey=8aux1ne0feoq99m7xzunmt2x9&st=ljmwvfzn&dl=1', title: 'Jardova-cesta-s-prateli-v.6-Top-2', manuallyEdited: false, lastEditedAt: null }, //485   
  
// ═══════════════════════════════════════════════════════════
// 🎧 Ocelová křídla Promethea
// ═══════════════════════════════════════════════════════════     
{ src: 'https://dl.dropboxusercontent.com/scl/fi/8lbny7bdce7jjtnjksy4a/Ocelova-kridla-Promethea-v-1.mp3?rlkey=9nfn05k77enm80s5i8o1n7pz5&st=dkm5yn4w&dl=1', title: 'Ocelová křídla Promethea v.1', manuallyEdited: false, lastEditedAt: null }, //486 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/7k8asrn4ln5v56llrgnke/Ocelova-kridla-Promethea-v-2.mp3?rlkey=xcm6vhe9vjv42ldl8qjgabbck&st=an5pg089&dl=1', title: 'Ocelová křídla Promethea v.4', manuallyEdited: false, lastEditedAt: null }, //487
{ src: 'https://dl.dropboxusercontent.com/scl/fi/91udp50svpx6ynhnqy3w5/Ocelova-kridla-Promethea-v-3.mp3?rlkey=431rxxpankxgtt5jv9uyrw9gl&st=nuxgvezz&dl=1', title: 'Ocelová křídla Promethea v.3', manuallyEdited: false, lastEditedAt: null }, //488 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/v2igjbe1vpp9hyyejwva6/Ocelova-kridla-Promethea-v-4.mp3?rlkey=4c0dnzh9ybgflwgg6o50xu5km&st=h8n4tg2y&dl=1', title: 'Ocelová křídla Promethea v.4', manuallyEdited: false, lastEditedAt: null }, //489 
    
// ═══════════════════════════════════════════════════════════
// 🎧 Velení Promethea
// ═══════════════════════════════════════════════════════════     
{ src: 'https://dl.dropboxusercontent.com/scl/fi/h4c5cqd05ubkjn9ozl2n4/Veleni-Promethea-v-1.mp3?rlkey=a4ogjw4jfql35hvmfwjo4otew&st=dy8g96bf&dl=1', title: 'Velení Promethea v.1', manuallyEdited: false, lastEditedAt: null }, //490 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ffxdbsndbxiz9jnvm91vs/Veleni-Promethea-v-2.mp3?rlkey=pwwowp088czo2u3av80aqv7bv&st=w67bpq2q&dl=1', title: 'Velení Promethea v.2', manuallyEdited: false, lastEditedAt: null }, //491 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/ztm1cyexfoq5y75yd2ii0/Veleni-Promethea-v-3.mp3?rlkey=yvjixhwmre5wejt2djodmlm9v&st=75eljqea&dl=1', title: 'Velení Promethea v.3', manuallyEdited: false, lastEditedAt: null }, //492 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/wma7udlkh8guwgx13h2xf/Veleni-Promethea-v-4.mp3?rlkey=o3yslu4qipue7dfr8ydvz3u9q&st=tzx2dz69&dl=1', title: 'Velení Promethea v.4', manuallyEdited: false, lastEditedAt: null }, //493 
    
// ═══════════════════════════════════════════════════════════
// 🎧 Velení lodi Prometheus
// ═══════════════════════════════════════════════════════════    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/kjlcxk3bp5st3tiqg57w0/Veleni-lodi-Prometheus-v-1.mp3?rlkey=s1r6kthw2lwxc138q77cmqmyq&st=yfjdli77&dl=1', title: 'Velení lodi Prometheus v.1', manuallyEdited: false, lastEditedAt: null }, //494 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/plpkq9l1vob81ld2dxcxu/Veleni-lodi-Prometheus-v-2.mp3?rlkey=lt05rxiim8emvmrp4yrgg50nq&st=793zpy9w&dl=1', title: 'Velení lodi Prometheus v.2', manuallyEdited: false, lastEditedAt: null }, //495 
    
// ═══════════════════════════════════════════════════════════
// 🎧 USS Prometheus
// ═══════════════════════════════════════════════════════════    
{ src: 'https://dl.dropboxusercontent.com/scl/fi/tkeyvchctrzykdqdefkwo/uss-prometheus-v-1.mp3?rlkey=fejzupr64vpv6m8pzgvppucpx&st=lvrkit2a&dl=1', title: 'uss-prometheus-v-1', manuallyEdited: false, lastEditedAt: null }, //496 
{ src: 'https://dl.dropboxusercontent.com/scl/fi/o0c7avusak8dt8x5jk9bx/uss-prometheus-v-2.mp3?rlkey=8cwz1hy10u28otf3ory9hvud5&st=o15f7n1b&dl=1', title: 'uss-prometheus-v-2', manuallyEdited: false, lastEditedAt: null }, //497     

// ═══════════════════════════════════════════════════════════
// 🎧 KONEC PLAYLISTU
// ═══════════════════════════════════════════════════════════     
];   

 

 
window.DebugManager?.log('playlist', `🚀 myPlaylist.js READY! (${window.tracks.length} skladeb)`);

 
 console.log(`%c🚀 [myPlaylistJS] Načteno za ${(performance.now() - __myPlaylistJS_START).toFixed(2)} ms`, 'background: #000; color: #00ff00; font-weight: bold; padding: 2px;');









