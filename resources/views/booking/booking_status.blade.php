<!DOCTYPE html>
<html>
<head>
    <title>Booking Status</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

    <style>
        /* Add your custom styles here */
        body {
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }

        .container {
            background-color: #ffffff;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            margin-top: 30px;
        }

        .success-message {
            text-align: center;
            margin-bottom: 20px;
        }

        .booking-details {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }

        .btn-home {
            display: block;
            width: 100%;
            max-width: 200px;
            margin: 0 auto;
            background-color: #007bff;
            color: #fff;
            text-align: center;
            padding: 10px 0;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .btn-home:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container mt-30">
               
        <div class="success-message">
            @if($success)
                <h2>Booking Operation Successful!</h2>
                <p>{{ $success }}</p>
                <p>Thank you for flying with us!</p>

            @elseif($error)
                <h2>Booking Failed</h2>
                <p>Sorry, we couldn't process your booking at this time.</p>
                <div class="alert alert-danger text-center">
                    {{ $error }}
                </div>
            @else
                <h2>Booking Failed</h2>
                <p>Sorry, we couldn't process your booking at this time.</p>
            @endif
        </div>
        
        <a href="{{ route('app') }}" class="btn btn-home">Return to Homepage</a>

    </div>
</body>
</html>
