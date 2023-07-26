<!-- resources/views/matched_employees/pdf_template.blade.php -->

<!DOCTYPE html>
<html>
<head>
    <title>Matched Employees</title>
    <style>
        /* Add your CSS styles for the card-based layout here */
        .card-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }

        .card {
            width: 500px; /* Increased width for the card */
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px; /* Increased padding for better spacing */
            margin: 20px; /* Increased margin for better spacing */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9; /* Light background color */
        }

        .card h3 {
            margin-top: 10px;
            font-size: 20px; /* Increased font size */
            font-weight: bold; /* Make the card title (item title) bold */
            text-align: center; /* Center text in the card */

        }

        .card p {
            margin: 5px 0;
            font-size: 16px; /* Increased font size */
        }
    </style>
</head>
<body>
    <h1 style="text-align: center;">Matched Employees</h1>

    <div class="card-container">
        @foreach ($matched_employees as $employee)
            <div class="card">
                <h3>{{ $employee['first_name'] }} {{ $employee['last_name'] }}</h3>
                <p><strong>ID:</strong> {{ $employee['employee_id'] }}</p>
                <p><strong>Email:</strong> {{ $employee['email'] }}</p>
                <p><strong>Phone:</strong> {{ $employee['phone'] }}</p>
                <p><strong>Address:</strong> {{ $employee['address'] }}</p>
                <p><strong>Job Title:</strong> {{ $employee['job_title']['name'] }}</p> <!-- Assuming you have 'job_title_name' key in the JSON response -->
            </div>
        @endforeach
    </div>
</body>
</html>
