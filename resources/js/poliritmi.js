// 26 febbraio 2023

import MidiWriter from 'midi-writer-js';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LCM(A)
{
	var n = A.length, a = Math.abs(A[0]);
	for (var i = 1; i < n; i++) {
		var b = Math.abs(A[i]), c = a;
		while (a && b) { a > b ? a %= b : b %= a; } 
		a = Math.abs(c*A[i])/(a+b);
	}
	return a;
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// il primo ritmo fisso a 4
function mkTavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni, tavola_suddivisioni_richieste) {
	var ritmi = [];
	// ritmi casuali
	if (typeof (tavola_suddivisioni_richieste)=='undefined') {
		//console.log('tavola dei ritmi non definita la calcolo casualmente');
		if (con_ripetizioni) {
			//console.log('sono richiesti', numero_di_linee, 'valori (con possibili ripetizioni)');
			ritmi = TavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni);
			return ritmi;
		} else {
			//console.log('sono richiesti', numero_di_linee, 'valori (senza ripetizioni)');
			ritmi = TavolaRitmi(numero_di_linee, suddivisioni, con_ripetizioni);
			return ritmi;
		}
	} else {
		//console.log('tavola definita');
		tavola_suddivisioni_richieste.forEach(element => ritmi.push(element));
		// se non ha valori sufficienti ne aggiunge random
		if (ritmi.length<numero_di_linee) {
			//console.log('gli elementi nella tavola definita non sono sufficienti per il numero di linee');
			//console.log('ne aggiungo', numero_di_linee - ritmi.length, 'casuali');
			for (var i = 0; i<(numero_di_linee-ritmi.length); i++) {
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
	var min = 2; // suddivisioni_min;
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
		if (numero_di_linee>(max - min +1)) {
			console.log('il numero di suddivisioni', max - min +1, 'non e\' sufficiente per il numero di linee', numero_di_linee);
			return ritmi;
		}
		for (let i = 0; i < r; i++) {
		  do {
			n = Math.floor(Math.random() * (max - min + 1)) + min;
			p = ritmi.includes(n);
			if(!p){
			  ritmi.push(n);
			}
		  }
		  while(p);
		}
		return ritmi;
	}
}

function prepara_tavola_possibili_suddivisioni() {
	const out = [];
	const matrix = (size) => {
		const max = Math.pow(2, size);
		for (let i = 0; i < max; i++) {
			out.push(`${i.toString(2).padStart(size, '0')}`);
		}
	}
	for (let n=1; n<=12; n++) {
		matrix(n);
	}
	const tav = [];
	for (let i=0; i<out.length; i++) {
		// sostituisce 2 a 0 e 3 a 1
		const s1 = out[i].replaceAll('0', '2');
		const s2 = s1.replaceAll('1', '3');
		// somma
		let somma = 0;
		for (let i2=0; i2<s2.length; i2++) {
			somma += Number(s2[i2]);
		}
		tav[i] = {somma: somma, stringa: s2}; 
	}
	tav.sort((a, b) => a.somma - b.somma);
	return tav;
}

// trovo le possibili suddivisioni in duine/terzine del ritmo
function possibili_divisioni(ritmo) {
	const t = [];
	var count = 0;
	for (let i=0; i<tavola_suddivisione_accenti.length; i++) {
		if (tavola_suddivisione_accenti[i].somma==ritmo) {
			t.push(tavola_suddivisione_accenti[i].stringa);
			count += 1;
		}
	}
	return [t, count];
}

// costruisce la tavola degli accenti di un singolo ritmo
// accenti dipendenti dal numero di note nel ritmo
function mkTavolaAccenti(ritmo, acc) {
	var accenti = [];
	var tavolaAccenti = [];
	// la tavola dei valori di ampiezza degli accenti non e' specificata
	if (typeof (acc)=='undefined') {
		//console.log('La tavola degli accenti non e\' definita. Uso i valori di default [0.75, 0.5]');
		accenti = [0.75, 0.5];
	} else {
		console.log('La tavola degli accenti e\':', acc);
		for (var i=0; i<acc.length; i++) {
			accenti.push(acc[i]);
		}
	}
	// trovo le possibili suddivisioni in duine/terzine
	var divisione = [];
	var tp = possibili_divisioni(ritmo);
	//console.log('ritmo', ritmo, 'possibili suddivisioni', tp[1]);
	// scelgo una delle possibilita'
	divisione[ritmo] = tp[0][getRandomInt(tp[1], 0)];
	//console.log('ho scelto', divisione[ritmo]);
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

const scala = {
	maggiore: [0, 2, 4, 5, 7, 9, 11],
	minore: [0, 2, 3, 5, 7, 8, 10],
};

// probabilita':
const intervalli = [1, 1, 1, 5, 5, 5, 5, 3, 3, 7, 7, 4, 4, 2, 2, 6, 6];

function mkMelodia(numero_note)
{
	const melodia = [];
	for (let i=0; i<numero_note; i++) {
		var index = getRandomInt(intervalli.length);
		var nota = scala['maggiore'][intervalli[index] - 1];
		if (Math.random()>0.75) {
			nota = nota + 12;
		}
		melodia[i] = nota;
	}
	return melodia;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// una battuta di 4/4
const battuta = 4
const numero_di_linee = 5
const suddivisioni = 7

const tavola_suddivisione_accenti = prepara_tavola_possibili_suddivisioni();

// singola track per un singolo ritmo
function mkSectionTrack(t, numero_di_battute, start)
{
	const score = [];
	const midi_note = 62;
	//print('midi tono', midi_note)
	const durata_nota = 0.125;
	var fine;
	const track = {};
	// var start = start or 0
	var start = 0;
	const battute = numero_di_battute/t.ritmo;
	//console.log('numero di battute', battute);
	for (var beats = 1;  beats<=battute; beats++) {
		//console.log(beats);
		for (var n=0; n<t.ritmo; n++) {
			var amp = t.accenti[n];
			var notaM = t.melodia[n];
			//console.log('nota', notaM, 'amp', amp);

			//score.push({start: start*96, durata: durata_nota*96, midi: midi_note + notaM, velocity: amp*100});
			score.push({start: start, durata: durata_nota, midi: midi_note + notaM, velocity: amp*100});
			start += durata_nota;
		}
	}
	return [score, start];
}

// costruisce le tavole ritmi, accenti e melodie per una sezione
function mkSong()
{
	const T = [];
	// calcola numero_di_linee di ritmi differenti con al massimo un numero di suddivisioni suddivisioni 
	const ritmi = mkTavolaRitmi(numero_di_linee, suddivisioni, false);
	// numero di battute necessarie per un ciclo completo (da verificare)
	const numero_di_battute = LCM(ritmi);
	//const ta = [0.4, 0.2];
	// calcola la tavola accenti e melodia per ogni ritmo
	for (var i=0; i<ritmi.length; i++) {
		const accenti = mkTavolaAccenti(ritmi[i]);
		const melodia = mkMelodia(ritmi[i]);
		T[i] = {ritmo: ritmi[i], accenti: accenti, melodia: melodia};
	}
	return [T, ritmi, numero_di_battute];
}

function Run() {
  var start = 0;

  var [t, ritmiche, num_battute] = mkSong();

  const tracks = [];

  for (var tra=0; tra<t.length; tra++) {
    var [score, fine] = mkSectionTrack(t[tra], num_battute);

    tracks[tra] = new MidiWriter.Track();

    // Define an instrument (optional):
    tracks[tra].addEvent(new MidiWriter.ProgramChangeEvent({instrument: 12}));

    // Add some notes:
    for (var i=0; i<score.length; i++) {
      const note = new MidiWriter.NoteEvent({pitch: score[i].midi, duration: '16', velocity: score[i].velocity});
      tracks[tra].addEvent(note);
    }  
  }

  // Generate a data URI
  const write = new MidiWriter.Writer(tracks);

  //console.log(write.base64());
  midifile.value = write.base64()

  // automatic click submit
  buttonSubmit.click();
}

var midifile = document.getElementById("midifile");

var button = document.getElementById("button");
button.addEventListener('click', Run);
var buttonSubmit = document.getElementById("submit");

// function eventHandler(event) {
//   console.log(event.type);
// }


