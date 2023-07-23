<!DOCTYPE html>
<html>
<head>
    <title>Ticket Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .ticket-details {
            display: flex;
            flex-direction: column;
            border: 1px solid #ccc;
            padding: 20px;
            margin-bottom: 20px;
        }
        .ticket-details div {
            margin-bottom: 10px;
        }
        .flight-details {
            display: flex;
            flex-direction: column;
        }
        .flight-details div {
            display: flex;
        }
        .flight-details .label {
            width: 150px;
            font-weight: bold;
        }
        .passengers-table {
            border-collapse: collapse;
            width: 100%;
        }
        .passengers-table th,
        .passengers-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        .passengers-table th {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="ticket-details">
        <h2>Ticket Details</h2>
        <div>
            <span class="label">Ticket Number:</span>
            <span>{{ $ticketNumber }}</span>
        </div>
        <div>
            <span class="label">Ticket Price:</span>
            <span>${{ $ticketPrice }}</span>
        </div>
        <div>
            <span class="label">Booking Email:</span>
            <span>{{ $bookingEmail }}</span>
        </div>
        <div>
            <span class="label">Booking Reference:</span>
            <span>{{ $bookingReference }}</span>
        </div>
        <div>
            <span class="label">Boarding Pass:</span>
            <span>{{ $boardingPass }}</span>
        </div>
        <div class="flight-details">
            <h3>Flight Details</h3>
            <div>
                <span class="label">Flight Type:</span>
                <span>{{ $flightType}}</span>
            </div>
            <div>
                <span class="label">Flight Number:</span>
                <span>{{ $flight ? $flight : 'N/A' }}</span>
            </div>
            <div>
                <span class="label">Flight Status:</span>
                <span>{{ $flightStatus }}</span>
            </div>
            <div>
                <span class="label">Destination:</span>
                <span>{{ $destination ? $destination : 'N/A' }}</span>
            </div>

        </div>
    </div>

    <h2>Passengers</h2>
    <table class="passengers-table">
        <tr>
            <th>Passenger Name</th>
            <th>Passport Number</th>
            <th>Identification Number</th>
            <th>Seat Number</th>
        </tr>
        @foreach ($passengers as $passenger)
            <tr>
                <td>{{ $passenger->name }}</td>
                <td>{{ $passenger->passport_number == null ? N/A :  $passenger->passport_number}}</td>
                <td>{{ $passenger->identification_number == null ? N/A :  $passenger->identification_number}}</td>
                <td>{{ $passenger->seat->seat_number }}</td>
            </tr>
        @endforeach
    </table>
    
</body>
</html>
