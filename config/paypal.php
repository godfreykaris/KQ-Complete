
<?php

return [
    'client_id' => env('PAYPAL_CLIENT_ID'),
    'secret' => env('PAYPAL_SECRET'),
    'settings' => [
        'mode' => env('PAYPAL_MODE', 'sandbox'), // Change to 'live' for production
        'http.ConnectionTimeOut' => 30,
        // Add other PayPal SDK settings if needed
    ],
];
