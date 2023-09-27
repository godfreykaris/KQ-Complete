<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <link rel="icon" type="image/svg+xml" href="/plane.webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <title>KQ</title>

        {{-- <link rel="stylesheet" href="{{ asset('build/assets/index-2f04c6bf.css') }}"> --}}
        
        @viteReactRefresh
        @vite('resources/js/index.tsx')

    </head>
    <body>
        <div id="app"></div>

        {{-- <script src="{{ asset('build/assets/index-6c3ec53c.js') }}"></script> --}}
    </body>
</html>
