// 23 marzo 2023

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

    function midiHightlightingHandler(event) {
        // per midi player
        var T = getMS(event.time);
        currenttime.innerHTML = T;
        progress.value = Number((event.time * 100) / totalDuration);
        if (event.time == totalDuration) {
            stopM.click();
        }

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

    // Set the function as message callback
    MIDIjs.player_callback = midiHightlightingHandler;

    function renderScore() {
        duration();
        tk.loadData(document.getElementById("meifile").value);
        let svg = tk.renderToSVG(1);
        document.getElementById("notation").innerHTML = svg;
    }

    document.getElementById("viewscore").addEventListener("click", renderScore);

});
