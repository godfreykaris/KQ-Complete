<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <link rel="icon" type="image/svg+xml" href="/plane.webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <title>KQ</title>

        @viteReactRefresh
        @vite('resources/js/index.tsx')
    </head>
    <body>
        <div id="app"></div>
        
    </body>
</html>
