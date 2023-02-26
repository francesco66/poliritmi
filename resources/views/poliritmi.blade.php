<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Poliritmi</title>

    <script
        src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.5.0">
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/poliritmi.js'])

</head>

<body class="antialiased">
    <div
        class="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">


        <div class="max-w-7xl mx-auto p-6 lg:p-8">

            <h1 id="titolo">POLIRITMI</h1>

            <p id="midifilename">{{ $midifilename }}</p>

            {{-- input form hidden to store midi file? --}}
            <form name="savemidi" id="savemidi" method="post" action="{{ url('poliritmi') }}">
                @csrf
                <input name="midifile" id="midifile" value="">
                <div>
                    <button id="submit" type="submit" hidden
                        class="px-4 py-2 text-sm text-white bg-indigo-600 rounded">Submit</button>
                </div>
            </form>

            <button id="button">PREMI</button>

            <midi-player src="{{ asset('/public/storage/' . $midifilename) }}" sound-font
                visualizer="#myVisualizer">
            </midi-player>
            <midi-visualizer type="staff" id="myVisualizer"></midi-visualizer>
        </div>
    </div>
</body>

<script>
    // console.log('dalla view', MidiWriter);
</script>

</html>
