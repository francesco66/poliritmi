<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MidiFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // un file midi di default ...
        return view('poliritmi', [
            'midifilename' => 'default.mid',
            'meifilename' => '',
            'scorefilename' => ''
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // nome unico per tutte le tre le score
        $identificatore = uniqid();

        // MIDI
        $name = '/midi/' . $identificatore . '.mid';
        $data = base64_decode($request->midifile);
        Storage::disk('public')->put($name, $data);

        // Csound score
        $nameSco = '/score/' . $identificatore . '.sco';
        $dataSco = $request->scorefile;
        Storage::disk('public')->put($nameSco, $dataSco);

        // MEI score
        $nameMeiSco = '/MEIscore/' . $identificatore . '.mei';
        $dataMeiSco = $request->meifile;
        Storage::disk('public')->put($nameMeiSco, $dataMeiSco);

        return view('poliritmi', [
            'midifilename' => $name,
            'meifilename' => "../../storage" . $nameMeiSco,
            'scorefilename' => '../../storage'. $nameSco
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
