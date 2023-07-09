import React from 'react'
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <b><h1>Laravel SPA Wow</h1><hr /></b>
        
    )
}

const rootElement = document.getElementById('app');

if (rootElement) 
{
    const root = createRoot(rootElement);

    root.render
    (
        <App />
    )
}
