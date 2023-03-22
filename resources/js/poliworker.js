var CSD = '<CsoundSynthesizer>\n' +
'<CsOptions>\n' +
'</CsOptions>\n' +
'<CsInstruments>\n' +
'sr=44100\n' +
'ksmps=64\n' +
'nchnls=2\n' +
'0dbfs=1\n' +
'\n' +
'instr 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15\n' +
'\n' +
'icps = cpsmidinn(p4)\n' +
'iamp = p5*0.001\n' +
'\n' +
'ioct = octcps(icps)\n' +
'kpwm = oscili(.1, 5)\n' +
'asig = vco2(iamp, icps, 4, .5 + kpwm)\n' +
'asig += vco2(iamp, icps * 2)\n' +
'\n' +
'idepth = 3\n' +
'acut = transegr:a(0, .002, 0, idepth, .5, -4.2, 0.001, .5, -4.2, 0)\n' +
'asig = zdf_2pole(asig, cpsoct(ioct + acut), 0.5)\n' +
'\n' +
'asig *= linsegr:a(1, p3, 1, .5, 0)\n' +
'\n' +
'out(asig*0.5, asig*0.5)\n' +
'\n' +
'endin\n' +
'\n' +
'</CsInstruments>\n' +
'<CsScore>\n'

var dataMEI = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<mei meiversion="3.0.0" xmlns="http://www.music-encoding.org/ns/mei">\n' +
    '<meiHead>\n' +
    '<fileDesc>\n' +
    '<titleStmt>\n' +
    // '<title>' + titolo + '</title>\n' +
    '</titleStmt>\n' +
    '\n' +
    '<pubStmt>\n' +
    '</pubStmt>\n' +
    '</fileDesc>\n' +
    '</meiHead>\n' +
    '\n' +
    '<music>\n' +
    '<body>\n' +
    '<mdiv>\n' +
    '<score>\n' +
    '\n' +
    '<scoreDef>\n' +
    '<staffGrp>\n' +
    '<grpSym symbol="brace" />\n' +
    '<staffGrp bar.thru="true">\n' +
    '<instrDef midi.channel="0" midi.instrnum="12" midi.volume="78.00%" />\n'


function MEInote(notamidi) {
    const name = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const nome = name[notamidi % 12];
    const ottava = Math.floor(notamidi / 12) - 1;
    // se nome ha il diesis va diviso in nome nota e alterazione
    const [n, a] = nome.split('');
    // alterazione e' sempre #
    if (a) {
        return '<note pname="' + n + '" oct="' + ottava + '" dur="16" accid="s" />';
    } else {
        return '<note pname="' + n + '" oct="' + ottava + '" dur="16"/>';
    }
}

function midiToNote(notamidi) {
    const name = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const nome = name[notamidi % 12];
    // f per flat, s per sharp
    const altInChiave = { 'c': '0', 'c#': '7s', 'd': '2s', 'd#': '3f', 'e': '4s', 'f': '1f', 'f#': '6s', 'g': '1s', 'g#': '4f', 'a': '3s', 'a#': '2f', 'b': '5s' };
    return altInChiave[nome];
}

function LCM(A) {
    var n = A.length, a = Math.abs(A[0]);
    for (var i = 1; i < n; i++) {
        var b = Math.abs(A[i]), c = a;
        while (a && b) { a > b ? a %= b : b %= a; }
        a = Math.abs(c * A[i]) / (a + b);
    }
    return a;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////
TAVOLA DEI RITMI
 
mkTavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni = false, tavola_suddivisioni_richieste = nil)
che usa
TavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni)
*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mkTavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni = false, tavola_suddivisioni_richieste = null) {
    var ritmi = [];
    // ritmi casuali
    if (!tavola_suddivisioni_richieste) {
        if (con_ripetizioni) {
            ritmi = TavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni);
            return ritmi;
        } else {
            ritmi = TavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni);
            return ritmi;
        }
    } else {
        tavola_suddivisioni_richieste.forEach(element => ritmi.push(element));
        // se non ha valori sufficienti ne aggiunge random
        if (ritmi.length < numero_di_linee) {
            for (var i = 0; i < (numero_di_linee - ritmi.length); i++) {
                ritmi.push(2 + Math.floor(Math.random() * (suddivisioni - 2 + 1)));
            }
        }
    }
    return ritmi
}

// ATTENZIONE:
// il numero di linee NON puo' superare il numero delle possibili divisioni
// se suddivisioni = 7 allora hai massimo 6 possibilita' (da 2 a 7 compresi)
function TavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni) {
    var ritmi = [];
    var min = 3; // suddivisioni_min;
    var max = suddivisioni;
    var r = numero_di_linee;
    var n, p;
    if (con_ripetizioni) {
        for (let i = 0; i < r; i++) {
            n = Math.floor(Math.random() * (max - min + 1)) + min;
            ritmi.push(n);
        }
        return ritmi;
    } else {
        if (numero_di_linee > (max - min + 1)) {
            console.log('il numero di suddivisioni', max - min + 1, 'non e\' sufficiente per il numero di linee', numero_di_linee);
            return ritmi;
        }
        for (let i = 0; i < r; i++) {
            do {
                n = Math.floor(Math.random() * (max - min + 1)) + min;
                p = ritmi.includes(n);
                if (!p) {
                    ritmi.push(n);
                }
            }
            while (p);
        }
        return ritmi;
    }
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////
costruisce la tavola degli accenti per ogni ritmo, opzionale array dei valori degli accenti mezzoforte e debole (default 0.75, 0.5)
 
mkTavolaAccenti(ritmo, acc)
che usa
possibili_divisioni(ritmo);
che usa
prepara_tavola_possibili_suddivisioni()
*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// costruisce la tavola degli accenti di un singolo ritmo
// accenti dipendenti dal numero di note nel ritmo
function mkTavolaAccenti(ritmo, acc = null) {
    var accenti = [];
    var tavolaAccenti = [];
    // la tavola dei valori di ampiezza degli accenti non e' specificata
    if (!acc) {
        accenti = [0.6, 0.5];
    } else {
        for (var i = 0; i < acc.length; i++) {
            accenti.push(acc[i]);
        }
    }
    // trovo le possibili suddivisioni in duine/terzine
    var divisione = [];
    var tp = possibili_divisioni(ritmo);
    // scelgo una delle possibilita'
    divisione[ritmo] = tp[0][getRandomInt(tp[1], 0)];
    for (let i in divisione[ritmo]) {
        if (divisione[ritmo][i] == 2) {
            tavolaAccenti.push(accenti[0]);
            tavolaAccenti.push(accenti[1]);
        } else if (divisione[ritmo][i] == 3) {
            tavolaAccenti.push(accenti[0]);
            tavolaAccenti.push(accenti[1]);
            tavolaAccenti.push(accenti[1]);
        } else {
            console.log('divisione ne 2 ne 3! BO!');
        }
    }
    // il primo accento e' sempre 1 (il 'fondamentale')
    tavolaAccenti[0] = 1;
    return tavolaAccenti;
}

// trovo le possibili suddivisioni in duine/terzine del ritmo
function possibili_divisioni(ritmo) {
    const tavola_suddivisione_accenti = prepara_tavola_possibili_suddivisioni();
    const t = [];
    var count = 0;
    for (let i = 0; i < tavola_suddivisione_accenti.length; i++) {
        if (tavola_suddivisione_accenti[i].somma == ritmo) {
            t.push(tavola_suddivisione_accenti[i].stringa);
            count += 1;
        }
    }
    return [t, count];
}

function prepara_tavola_possibili_suddivisioni() {
    const out = [];
    const matrix = (size) => {
        const max = Math.pow(2, size);
        for (let i = 0; i < max; i++) {
            out.push(`${i.toString(2).padStart(size, '0')}`);
        }
    }
    for (let n = 1; n <= 13; n++) {
        matrix(n);
    }
    const tav = [];
    for (let i = 0; i < out.length; i++) {
        // sostituisce 2 a 0 e 3 a 1
        const s1 = out[i].replaceAll('0', '2');
        const s2 = s1.replaceAll('1', '3');
        // somma
        let somma = 0;
        for (let i2 = 0; i2 < s2.length; i2++) {
            somma += Number(s2[i2]);
        }
        tav[i] = { somma: somma, stringa: s2 };
    }
    tav.sort((a, b) => a.somma - b.somma);
    return tav;
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////
costruisce una melodia casuale per ogni linea ritmica
usa scala (per ora solo maggiore e minore)
e intervalli (possibilita' dell'intervallo in base alle ripetizioni)
*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const scala = {
    maggiore: [0, 2, 4, 5, 7, 9, 11],
    minore: [0, 2, 3, 5, 7, 8, 10],
};

// probabilita':
const intervalli = [1, 1, 1, 5, 5, 5, 5, 3, 3, 7, 7, 4, 4, 2, 2, 6, 6];

function mkMelodia(numero_note, tiposcala = 'maggiore') {
    const melodia = [];
    for (let i = 0; i < numero_note; i++) {
        var index = getRandomInt(intervalli.length);
        var nota = scala[tiposcala][intervalli[index] - 1];
        if (Math.random() > 0.75) {
            nota = nota + 12;
        }
        melodia[i] = nota;
    }
    return melodia;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// singola track per un singolo ritmo
function mkSectionTrack(t, numero_di_note, start = 0, midi_note = 62) {
    const score = [];
    // numero di note per un ciclo completo di un ritmo 
    const cicli_per_ritmo = numero_di_note / t.ritmo;
    // ripete il ciclo per ogni ritmo
    for (var ciclo = 0; ciclo < cicli_per_ritmo; ciclo++) {
        // singolo ciclo delle note di un ritmo
        for (var n = 0; n < t.ritmo; n++) {
            var amp = t.accenti[n];
            var notaM = t.melodia[n];
            score.push({ start: start, durata: durata_nota, midi: midi_note + notaM, velocity: amp * 100 });
            start += durata_nota;
        }
    }
    return [score, start];
}

// costruisce le tavole ritmi, accenti e melodie per una sezione
function mkSong() {
    const T = [];

    // calcola numero_di_linee di ritmi differenti con al massimo un numero di suddivisioni suddivisioni
    // se vuoi specificare i ritmi
    // const tavola_suddivisioni_richieste = [4, 5, 6];
    // const ritmi = mkTavolaRitmi(numero_di_linee, suddivisioni, false, tavola_suddivisioni_richieste);
    const ritmi = mkTavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni, tavola_suddivisioni_richieste);

    // numero di note necessarie per un ciclo completo (dipende da durata nota)
    const numero_di_note = LCM(ritmi);

    // calcola la tavola accenti e melodia per ogni ritmo
    for (var i = 0; i < ritmi.length; i++) {
        const accenti = mkTavolaAccenti(ritmi[i], taccenti);
        const melodia = mkMelodia(ritmi[i]);
        T[i] = { ritmo: ritmi[i], accenti: accenti, melodia: melodia };
    }
    return [T, numero_di_note];
}

function prepareMidiScore() {
    const tracks = [];
    // prepara le tracce
    for (var tra = 0; tra < numero_di_linee; tra++) {
        tracks[tra] = new MidiWriter.Track();
        tracks[tra].addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 12 }));
    }
    return tracks;
}

function midiScore(score, tracks) {
    for (var i = 0; i < score.length; i++) {
        const note = new MidiWriter.NoteEvent({ pitch: score[i].nota, duration: '16', velocity: score[i].velocity });
        tracks[score[i].traccia].addEvent(note);
    }
    // Generate a data URI
    const write = new MidiWriter.Writer(tracks);
    midifile.value = write.base64()
}

function csoundScore(score) {
    var SCO = '';
    for (var i = 0; i < score.length; i++) {
        SCO += 'i' + (score[i].traccia + 1) + ' ' + score[i].start + ' ' + score[i].duration + ' ' + score[i].nota + ' ' + score[i].velocity + '\n';
        CSD += 'i' + (score[i].traccia + 1) + ' ' + score[i].start + ' ' + score[i].duration + ' ' + score[i].nota + ' ' + score[i].velocity + '\n';
    }
    scorefile.value = SCO;
    // return SCO;

    CSD += '</CsScore>\n' +
    '</CsoundSynthesizer>\n'

    // return csd;
}

function meiScore(score) {
    var numMisure = score.length / numero_di_linee / battuta / 4;
    // console.log(numMisure);

    // riordina la score per tempo di inizio delle note
    score.sort((a, b) => a.start - b.start);
    // tutte le misure
    var S = [];
    // tutte le misure
    for (var m = 0; m < (16 * numero_di_linee * numMisure); m += 16 * numero_di_linee) {
        var M = [];
        for (var nota = 0; nota < 16 * numero_di_linee; nota++) {
            if (score[nota + m]) {
                M.push(score[nota + m]);
            }
        }
        M.sort((a, b) => a.traccia - b.traccia);
        S.push(M);
    }

    var pitches = '';
    for (var m = 0; m < S.length; m++) {
        var din = [];
        pitches += '<measure n="' + (m + 1) + '">\n'
        // se la misura e' completa
        if (S[m].length == 64) {
            // dividi per 16 (ogni sedici una traccia)
            for (var l = 0; l < S[m].length; l += 16) {
                pitches += '<staff n="' + (l / 16 + 1) + '">\n<layer n="' + (l / 16 + 1) + '">\n'
                for (var n = 0; n < 16; n++) {
                    if (n % 4 == 0) {
                        pitches += '<beam>\n'
                    }
                    pitches += MEInote(S[m][n + l].nota) + '\n'
                    // per ora solo il primo accento dei ritmi (velocity 100)
                    if (S[m][n + l].velocity == 100) {
                        din.push({ layer: (l / 16 + 1), quarto: 1 + (n / 4), velocity: S[m][n + l].velocity });
                    }
                    if (n % 4 == 3) {
                        pitches += '</beam>\n'
                    }
                }
                pitches += '  </layer>\n' + ' </staff>\n'
            }
        } else {
            // console.log(S[m].length, 'per traccia', S[m].length / numero_di_linee);
            // dividi per S[m].length / numero_di_linee (ogni S[m].length / numero_di_linee una traccia)
            for (var l = 0; l < S[m].length; l += S[m].length / numero_di_linee) {
                pitches += '<staff n="' + (l / (S[m].length / numero_di_linee) + 1) + '">\n<layer n="' + (l / (S[m].length / numero_di_linee) + 1) + '">\n'
                for (var n = 0; n < S[m].length / numero_di_linee; n++) {
                    if (n % 4 == 0) {
                        pitches += '<beam>\n'
                    }
                    pitches += MEInote(S[m][n + l].nota) + '\n'
                    // per ora solo il primo accento dei ritmi (velocity 100)
                    if (S[m][n + l].velocity == 100) {
                        din.push({ layer: (l / (S[m].length / numero_di_linee) + 1), quarto: 1 + (n / 4), velocity: S[m][n + l].velocity });
                    }
                    if (n % 4 == 3) {
                        pitches += '</beam>\n'
                    }
                }
                pitches += '  </layer>\n' + ' </staff>\n'
            }
        }
        // tstamp onset time in terms of musical time, i.e., beats[.fractional]
        // MIDI value may be assigned to a dynamic marking using the @val attribute
        for (var i = 0; i < din.length; i++) {
            pitches += '<dynam layer="' + din[i].layer + '" place="above" staff="' + din[i].layer + '" tstamp="' + din[i].quarto + '" val="' + din[i].velocity + '">f</dynam>\n'
        }
        pitches += '</measure>\n'
    }

    // prepara la score MEI
    var keyAlt = midiToNote(midi_note);
    for (var i = 0; i < numero_di_linee; i++) {
        dataMEI += '' +
            '<staffDef n="' + (i + 1) + '" lines="5">\n' +
            '<clef shape="G" line="2" />\n' +
            '<keySig mode="major" sig="' + keyAlt + '" />\n' +
            '<meterSig count="4" unit="4" />\n' +
            '<instrDef midi.instrnum="12"></instrDef>\n' +
            '</staffDef>\n'
    }

    dataMEI += '</staffGrp>\n' +
        '</staffGrp>\n' +
        '</scoreDef>\n' +
        '\n' +
        '<section>\n'

    dataMEI += pitches +
        '</section>\n' +
        '</score>\n' +
        '</mdiv>\n' +
        '</body>\n' +
        '</music>\n' +
        '</mei>\n'

    meifile.value = String(dataMEI);
}

// calcola la score totale
function calcolaScore() {
    var scoreTotale = [];
    var start = 0;
    for (var sez = 0; sez < sezioni; sez++) {
        var [t, num_note] = mkSong();
        for (var tra = 0; tra < t.length; tra++) {
            var [score, fine] = mkSectionTrack(t[tra], num_note, start, midi_note + sez * 2);
            for (var i = 0; i < score.length; i++) {
                scoreTotale.push({ traccia: tra, start: score[i].start, duration: score[i].durata, nota: score[i].midi, velocity: score[i].velocity });
            }
        }
        start = fine;
    }
    return scoreTotale;
}

function Run() {

    console.log("web worker!");

    window.setTimeout(function () {
        var score = calcolaScore();

        // midi
        // prepara le tracce
        const tracks = prepareMidiScore();
        midiScore(score, tracks);

        // csound
        csoundScore(score);

        meiScore(score);

        // playB.disabled = false;
        buttonSubmit.click();

        // vedi verovio score
        // viewscore.click();
    }, 0);
}
