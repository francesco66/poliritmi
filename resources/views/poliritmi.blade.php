<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Poliritmi</title>

    {{-- <script
        src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.5.0">
    </script> --}}

    <script type='text/javascript' src='//www.midijs.net/lib/midi.js'></script>
    {{-- <script src="http://www.verovio.org/javascript/latest/verovio-toolkit-wasm.js" defer></script> --}}

    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/poliritmi2.js', 'resources/js/verovio2.js'])

</head>

<body>

    <div class="container mx-2 p-4">

        <h1 id="titolo" class="text-xl py-4">POLIRITMI</h1>

        {{-- hidden input to store midi, mei and Csound score file address --}}
        <input hidden name="midifilename" id="midifilename" value="{{ $midifilename }}">
        <input hidden name="csdfilename" id="csdfilename" value="{{ $csdfilename }}">
        <input hidden name="meifilename" id="meifilename" value="{{ $meifilename }}">

        {{-- hidden input form to store midi, mei and Csound score file --}}
        <form hidden name="savefiles" id="savefiles" method="post" action="{{ url('poliritmi') }}">
            @csrf
            <input name="midifile" id="midifile" value="">
            <textarea name="csdfile" id="csdfile" value=""></textarea>
            <textarea name="meifile" id="meifile" value=""></textarea>
            <div>
                <button id="submit" type="submit" hidden
                    class="px-4 py-2 text-sm text-white bg-indigo-600 rounded">Submit</button>
            </div>
        </form>

        <div class="flex flex-row gap-6">

            <div class="flex flex-col border border-black rounded-md p-4">

                <label class="label">
                    <span class="label-text">Sections (max 10)</span>
                </label>
                <label class="input-group pb-4">
                    <span class="w-32">Sections</span>
                    <input id="sections" type="number" min="1" max="10" value="1"
                        class="input input-bordered w-24" />
                </label>

                <label class="label">
                    <span class="label-text">Lines (min 2, max 10)</span>
                </label>
                <label class="input-group pb-4">
                    <span class="w-32">Lines</span>
                    <input id="lines" type="number" min="2" max="10" value="5"
                        class="input input-bordered w-24" />
                </label>

                <label class="label">
                    <span class="label-text">Divisors (min 3, max 18 ?)</span>
                </label>
                <label class="input-group pb-4">
                    <span class="w-32">Divisors</span>
                    <input id="divisors" type="number" min="3" max="18" value="9"
                        class="input input-bordered w-24" />
                </label>

                <label class="input-group pb-4">
                    <span class="w-32">Ripetizioni</span>
                    <input id="repetitions" type="checkbox" class="checkbox" />
                </label>

                <label class="label">
                    <span class="label-text">Midi note (min 21, max 100)</span>
                </label>
                <label class="input-group pb-4">
                    <span class="w-32">Midi note</span>
                    <input id="midi" type="number" min="21" max="100" value="62"
                        class="input input-bordered w-24" />
                </label>

                <label class="label">
                    <span class="label-text">Accenti</span>
                </label>
                <label class="input-group pb-1">
                    <span class="w-32">Mezzoforte</span>
                    <input id="acc1" type="number" min="0.1" max="1" value="0.6" step="0.1"
                        class="input input-bordered w-24" />
                </label>
                <label class="input-group pb-4">
                    <span class="w-32">Debole</span>
                    <input id="acc2" type="number" min="0.1" max="1" value="0.4" step="0.1"
                        class="input input-bordered w-24" />
                </label>

                <button id="button" class="btn btn-primary my-4">CREA FILE</button>

            </div>

            <div class="flex flex-col border border-black rounded-md p-4 w-full">
                <p id="midifilename" class="text-sm pb-2">Il file <span
                        class="text-blue-400">{{ $midifilename }}</span>
                    è pronto
                </p>
                {{-- <midi-player src="{{ asset('/storage/' . $midifilename) }}" sound-font visualizer="#myVisualizer">
                </midi-player> --}}
                {{-- <midi-visualizer type="staff" id="myVisualizer"></midi-visualizer> --}}

                <h1 class="text-xl">CSOUND</h1>
                <button id="play" class="btn btn-primary my-4">PLAY</button>
                <button id="stop" class="btn btn-primary my-4">STOP</button>

                <textarea id="console" class="textarea textarea-primary h-80" placeholder="Csound message"></textarea>

            </div>
        </div>

        {{-- TEST --}}
        <div class="mt-4">
          <x-midi-player :midifile="$midifilename"></x-midi-player>
        </div>

        <button id="viewscore" class="hidden btn btn-secondary my-4">View Score</button>

        {{-- <div class="flex flex-row gap-6 m-auto p-4"> --}}
            <div class="text-3xl font-bold">
                <h1>Verovio</h1>
            </div>
        {{-- </div> --}}

        <div id="notation" class="h-screen"></div>

    </div>
    @stack('js')
</body>

<script>
</script>

<style>
    g.note.playing {
        fill: crimson;
    }
</style>

</html>
