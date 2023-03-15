// 12 marzo 2023

import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';

createVerovioModule().then(VerovioModule => {
    const tk = new VerovioToolkit(VerovioModule);

    tk.setOptions({
        scale: 30,
        pageWidth: document.body.clientWidth,
        pageHeight: document.body.clientHeight,
        scaleToPageSize: true,
    });

    // The current page, which will change when playing through the piece
    let currentPage = 1;

    // The handler to start playing the file
    const playMIDIHandler = function () {
        // Get the MIDI file from the Verovio toolkit
        let base64midi = tk.renderToMIDI();
        // Add the data URL prefixes describing the content
        let midiString = 'data:audio/midi;base64,' + base64midi;
        // Pass it to play to MIDIjs
        MIDIjs.play(midiString);
    }
    // The handler to stop playing the file
    const stopMIDIHandler = function () {
        MIDIjs.stop();
    }

    // let playingNotes = document.querySelectorAll('g.note.playing');
    // playingNotes.forEach(note => note.style.fill = "crimson" );

    const midiHightlightingHandler = function (event) {
        // Remove the attribute 'playing' of all notes previously playing
        let playingNotes = document.querySelectorAll('g.note.playing');
        for (let playingNote of playingNotes) playingNote.classList.remove("playing");

        // Get elements at a time in milliseconds (time from the player is in seconds)
        let currentElements = tk.getElementsAtTime(event.time * 1000);
        if (currentElements.page == 0) return;
        if (currentElements.page != currentPage) {
            currentPage = currentElements.page;
            document.getElementById("notation").innerHTML = tk.renderToSVG(currentPage);
        }

        // Get all notes playing and set the class
        for (let note of currentElements.notes) {
            let noteElement = document.getElementById(note);
            if (noteElement) noteElement.classList.add("playing");
        }
    }

    // Wire up the buttons to actually work.
    document.getElementById("playMIDI").addEventListener("click", playMIDIHandler);
    document.getElementById("stopMIDI").addEventListener("click", stopMIDIHandler);
    // Set the function as message callback
    MIDIjs.player_callback = midiHightlightingHandler;

    var fileMei = document.getElementById("meifilename").value;
    document.getElementById("viewscore").addEventListener("click", renderScore);

    function renderScore() {
        console.log('called viewScore')
        fetch(fileMei)
            .then((response) => response.text())
            .then((meiXML) => {
                tk.loadData(meiXML);
                let svg = tk.renderToSVG(1);
                document.getElementById("notation").innerHTML = svg;
            });
    }

    // This line fetches the MEI file we want to render...
    // fetch("../../storage/default.mei")
    //     // ... then receives the response and "unpacks" the MEI from it
    //     .then((response) => response.text())
    //     .then((meiXML) => {
    //         // ... then we can load the data into Verovio ...
    //         tk.loadData(meiXML);
    //         // ... and generate the SVG for the first page ...
    //         let svg = tk.renderToSVG(1);
    //         // ... and finally gets the <div> element with the ID we specified, 
    //         // and sets the content (innerHTML) to the SVG that we just generated.
    //         document.getElementById("notation").innerHTML = svg;
    //     });
});
