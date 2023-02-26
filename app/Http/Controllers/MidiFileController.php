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
        return view('poliritmi', ['midifilename' => '']);
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
        // dd($request->midifile);

        $name = uniqid() . '.mid';
        $data = base64_decode($request->midifile);
        Storage::disk('public')->put($name, $data);

        return view('poliritmi', ['midifilename' => $name]);
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
