import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

interface Link {
  id: number;
  label: string;
  url: string;
}

const Data: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [links, setLinks] = useState<Link[]>([
    { id: 8, label: 'Register A User', url: 'http://127.0.0.1:8000/users/register'},
    { id: 77, label: 'Change User', url: 'http://127.0.0.1:8000/users/change/{userId}' },
    { id: 78, label: 'Delete User', url: 'http://127.0.0.1:8000/users/delete/{userId}' },
    { id: 79, label: 'All Users', url: 'http://127.0.0.1:8000/users' },
    { id: 80, label: 'Fetch User', url: 'http://127.0.0.1:8000/users/{userId}' },
    { id: 1, label: 'All Flights', url: 'http://127.0.0.1:8000/flights' },
    { id: 70, label: 'Add Flight', url: 'http://127.0.0.1:8000/flights/add' },
    { id: 71, label: 'Change Flight', url: 'http://127.0.0.1:8000/flights/change/{flightId}' },
    { id: 72, label: 'Delete Flight', url: 'http://127.0.0.1:8000/flights/delete/{flightId}' },
    { id: 73, label: 'Fetch Flight', url: 'http://127.0.0.1:8000/flights/{flightId}' },
    { id: 74, label: 'Flight By Departure City', url: 'http://127.0.0.1:8000/flights/byDepartureCityId/{departureCityId}' },
    { id: 75, label: 'Flight Departing After Hours', url: 'http://127.0.0.1:8000/flights/byHours/{hours}' },
    { id: 76, label: 'Flight By Departure Date', url: 'http://127.0.0.1:8000/flights/byDepartureDate/{departureDate}' },
    { id: 45, label: 'Add FlightStatus', url: 'http://127.0.0.1:8000/flightStatuses/add' },
    { id: 46, label: 'Change FlightStatus', url: 'http://127.0.0.1:8000/flightStatuses/change/{flightStatusId}' },
    { id: 47, label: 'Delete FlightStatus', url: 'http://127.0.0.1:8000/flightStatuses/delete/{flightStatusId}' },
    { id: 48, label: 'All FlightStatus', url: 'http://127.0.0.1:8000/flightStatuses' },
    { id: 49, label: 'Fetch FlightStatus', url: 'http://127.0.0.1:8000/flightStatuses/{flightStatusName}' },
    { id: 50, label: 'Add FlightClass', url: 'http://127.0.0.1:8000/flightClasses/add' },
    { id: 51, label: 'Change FlightClass', url: 'http://127.0.0.1:8000/flightClasses/change/{flightClassId}' },
    { id: 52, label: 'Delete FlightClass', url: 'http://127.0.0.1:8000/flightClasses/delete/{flightClassId}' },
    { id: 53, label: 'All FlightClass', url: 'http://127.0.0.1:8000/flightClasses' },
    { id: 54, label: 'Fetch FlightClass', url: 'http://127.0.0.1:8000/flightClasses/{flightClassName}' },
    { id: 60, label: 'Add Plane', url: 'http://127.0.0.1:8000/planes/add' },
    { id: 61, label: 'Change Plane', url: 'http://127.0.0.1:8000/planes/change/{planeId}' },
    { id: 62, label: 'Delete Plane', url: 'http://127.0.0.1:8000/planes/delete/{planeId}' },
    { id: 63, label: 'All Planes', url: 'http://127.0.0.1:8000/planes' },
    { id: 64, label: 'Fetch Plane', url: 'http://127.0.0.1:8000/planes/{planeId}' },
    { id: 2, label: 'Fetch Ticket', url: 'http://127.0.0.1:8000/ticket/{ticket_number}' },
    { id: 3, label: 'Available Destinations', url: 'http://127.0.0.1:8000/arrival_cities/{departure_city}' },
    { id: 15, label: 'Add City', url: 'http://127.0.0.1:8000/cities/add' },
    { id: 16, label: 'Change City', url: 'http://127.0.0.1:8000/cities/change/{cityId}' },
    { id: 17, label: 'Delete City', url: 'http://127.0.0.1:8000/cities/delete/{cityId}' },
    { id: 18, label: 'All Cities', url: 'http://127.0.0.1:8000/cities' },
    { id: 19, label: 'Fetch City', url: 'http://127.0.0.1:8000/cities/{cityName}/{cityCountry}' },
    { id: 40, label: 'Add SeatLocation', url: 'http://127.0.0.1:8000/seatLocations/add' },
    { id: 41, label: 'Change SeatLocation', url: 'http://127.0.0.1:8000/seatLocations/change/{seatLocationId}' },
    { id: 42, label: 'Delete SeatLocation', url: 'http://127.0.0.1:8000/seatLocations/delete/{seatLocationId}' },
    { id: 43, label: 'All SeatLocations', url: 'http://127.0.0.1:8000/seatLocations' },
    { id: 44, label: 'Fetch SeatLocation', url: 'http://127.0.0.1:8000/seatLocations/{seatLocationName}' },
    { id: 65, label: 'Add Seat', url: 'http://127.0.0.1:8000/seats/add' },
    { id: 66, label: 'Change Seat', url: 'http://127.0.0.1:8000/seats/change/{seatNumber}' },
    { id: 67, label: 'Delete Seat', url: 'http://127.0.0.1:8000/seats/delete/{seatId}' },
    { id: 68, label: 'All Seats', url: 'http://127.0.0.1:8000/seats/{planeId}' },
    { id: 69, label: 'Fetch Seat', url: 'http://127.0.0.1:8000/seats/{seatNumber}/{planeId}' },
    { id: 4, label: 'Add Booking', url: 'http://127.0.0.1:8000/bookings' },
    { id: 5, label: 'Change Booking', url: 'http://127.0.0.1:8000/bookings/{booking_reference}' },
    { id: 6, label: 'Delete Booking', url: 'http://127.0.0.1:8000/bookings/{booking_reference}'},
    { id: 7, label: 'Guest Booking Inquiry', url: 'http://127.0.0.1:8000/booking_inquiry/guest'},
    { id: 9, label: 'Registerd User Booking Inquiry', url: 'http://127.0.0.1:8000/booking_inquiry/registered_user'},
    { id: 10, label: 'Add Passengers', url: 'http://127.0.0.1:8000/passengers/add/{booking_reference}'},
    { id: 11, label: 'Delete Passenger', url: 'http://127.0.0.1:8000/passengers/delete/{passengerId}'},
    { id: 12, label: 'Change Passenger', url: 'http://127.0.0.1:8000/passengers/change/{passengerId}'},
    { id: 20, label: 'Add Employee', url: 'http://127.0.0.1:8000/employees/add'},
    { id: 21, label: 'Change Employee', url: 'http://127.0.0.1:8000/employees/change/{employeeId}'},
    { id: 22, label: 'Delete Employee', url: 'http://127.0.0.1:8000/employees/delete/{employeeId}'},
    { id: 23, label: 'Fetch Employees', url: 'http://127.0.0.1:8000/employees' },
    { id: 24, label: 'Fetch Employee', url: 'http://127.0.0.1:8000/employees/{employeeId}' },
    { id: 25, label: 'Add Qualification', url: 'http://127.0.0.1:8000/qualifications/add' },
    { id: 26, label: 'Change Qualification', url: 'http://127.0.0.1:8000/qualifications/change/{qualificationId}' },
    { id: 27, label: 'Delete Qualification', url: 'http://127.0.0.1:8000/qualifications/delete/{qualificationId}' },
    { id: 28, label: 'All Qualifications', url: 'http://127.0.0.1:8000/qualifications' },
    { id: 29, label: 'Fetch Qualification', url: 'http://127.0.0.1:8000/qualifications/{qualificationName}' },
    { id: 30, label: 'Add Skill', url: 'http://127.0.0.1:8000/skills/add' },
    { id: 31, label: 'Change Skill', url: 'http://127.0.0.1:8000/skills/change/{skillId}' },
    { id: 32, label: 'Delete Skill', url: 'http://127.0.0.1:8000/skills/delete/{skillId}' },
    { id: 33, label: 'All Skills', url: 'http://127.0.0.1:8000/skills' },
    { id: 34, label: 'Fetch Skill', url: 'http://127.0.0.1:8000/skills/{skillName}' },
    { id: 35, label: 'Add JobTitle', url: 'http://127.0.0.1:8000/jobTitles/add' },
    { id: 36, label: 'Change JobTitle', url: 'http://127.0.0.1:8000/jobTitles/change/{jobTitleId}' },
    { id: 37, label: 'Delete JobTitle', url: 'http://127.0.0.1:8000/jobTitles/delete/{jobTitleId}' },
    { id: 38, label: 'All JobTitles', url: 'http://127.0.0.1:8000/jobTitles' },
    { id: 39, label: 'Fetch JobTitle', url: 'http://127.0.0.1:8000/jobTitles/{jobTitleName}' },
    { id: 55, label: 'Add Opening', url: 'http://127.0.0.1:8000/openings/add' },
    { id: 56, label: 'Change Opening', url: 'http://127.0.0.1:8000/openings/change/{openingId}' },
    { id: 57, label: 'Delete Opening', url: 'http://127.0.0.1:8000/openings/delete/{openingId}' },
    { id: 58, label: 'All Openings', url: 'http://127.0.0.1:8000/openings' },
    { id: 59, label: 'Fetch Opening', url: 'http://127.0.0.1:8000/openings/{openingTitle}' },
    { id: 13, label: 'Match Employee', url: 'http://127.0.0.1:8000/openings/match_employees/{openingId}'},
    { id: 14, label: 'Print Ticket Report', url: 'http://127.0.0.1:8000/tickets/{ticket_number}/report'},
    
  ]);
  
  const fetchData = (url: string) => {
    fetch(url)
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/pdf')) {
          return response.blob(); // Extract the response as a Blob
        } else if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
      })
      .then((data) => {
        // If the response is a Blob (PDF file), display it in an iframe
        if (data instanceof Blob) {
          const url = URL.createObjectURL(data);
          const iframe = document.createElement('iframe');
          iframe.src = url;
          iframe.width = '100%';
          iframe.height = '600px'; // Set the desired height for the iframe
  
          // Append the iframe to a container on your web page
          const pdfContainer = document.getElementById('output-container');
          if(pdfContainer)
          {
            pdfContainer.innerHTML = ''; // Clear previous content, if any
            pdfContainer.appendChild(iframe);
          }
          
        } else {
          setData(data); // Process other types of responses (JSON or text) as you were doing before
        }
      })
      .catch((error) => console.error(error));
  
    // Scroll to the top of the page to view the output
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    const updatedLinks = links.map(link => {
      if (link.id === id) {
        return { ...link, label: event.target.value };
      }
      return link;
    });
    setLinks(updatedLinks);
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    const updatedLinks = links.map(link => {
      if (link.id === id) {
        return { ...link, url: event.target.value };
      }
      return link;
    });
    setLinks(updatedLinks);
    
  };

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Calculate and set the width of each input field
    inputRefs.current.forEach(inputRef => {
      if (inputRef) {
        inputRef.style.width = `${inputRef.value.length * 8}px`; // Adjust the multiplication factor as needed
      }
    });
  }, [links]);

  const addFlight = () => {
    const flightData = {
      airline_id: 1,
      plane_id: 1, 
      is_international: false,
      departure_time: '2023-07-31 12:00:00', 
      arrival_time: '2023-07-31 15:00:00', 
      flight_status_id: 1, 
      departure_city_id: 1, 
      arrival_city_id: 2, 
    };
  
    const  addFlightUrl = links.find((link) => link.id === 70)?.url;
  
    if (addFlightUrl) {
      fetch(addFlightUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(flightData),
      })
        .then((response) => {
            if (response.headers.get('content-type')?.includes('application/json')) {
              return response.json(); // Extract the response as JSON
            } else {
              return response.text(); // Extract the response as text
            }
        })
        .then((data) => setData(data))
        .catch((error) => console.error(error));
    }
  
    // Scroll to the top of the page to view the output
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  const changeFlight = () => {
    const flightData = {
      airline_id: 1,
      plane_id: 2, 
      is_international: false,
      departure_time: '2023-07-31 12:00:00', 
      arrival_time: '2023-07-31 15:00:00', 
      flight_status_id: 1, 
      departure_city_id: 1, 
      arrival_city_id: 2,    
      
    };
  
    const  changeFlightUrl = links.find((link) => link.id === 71)?.url;
  
    if (changeFlightUrl) {
      fetch(changeFlightUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(flightData),
      })
        .then((response) => {
            if (response.headers.get('content-type')?.includes('application/json')) {
              return response.json(); // Extract the response as JSON
            } else {
              return response.text(); // Extract the response as text
            }
        })
        .then((data) => setData(data))
        .catch((error) => console.error(error));
    }
  
    // Scroll to the top of the page to view the output
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  const deleteFlight = () => {
    
    const deleteFlightUrl = links.find((link) => link.id === 72)?.url;
  
    if (deleteFlightUrl) {
      fetch(deleteFlightUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      })
        .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
        .then((data) => setData(data))
        .catch((error) => console.error(error));
    }
  
    // Scroll to the top of the page to view the output
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const addBooking = () => {
    const bookingData = {
      flight_id: 1,
      email: 'johndoe@example.com',      
      passengers : [
        {
          name: 'John Doe',
          date_of_birth: '2022-08-12', // Convert the date format to 'YYYY-MM-DD'
          passport_number: "jdfhvjvs",
          identification_number: "jfkvdfb",
          seat_id: 1,
          // Add other passenger details
        },
        {
          name: 'Jane Smith',
          date_of_birth: '2023-10-15', // Convert the date format to 'YYYY-MM-DD'
          passport_number: "jdfhvjvs",
          identification_number: "jfkvdfb",
          seat_id: 1,
          // Add other passenger details
        },
      ],
      // Add other booking details
    };

    fetch('http://127.0.0.1:8000/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify(bookingData),
    })
      .then(response => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then(data => setData(data))
      .catch(error => console.error(error));

    // Scroll to the top of the page to view the output
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const changeBooking = () => {
    const bookingData = {
      flight_id: 1,
      email: 'johndoe@example.com',
      passengers : [
        {
          passenger_id: "djkdvdfjk",
          name: 'John Doe',
          date_of_birth: '2022-08-12', // Convert the date format to 'YYYY-MM-DD'
          passport_number: "jdfhvjvs",
          identification_number: "jfkvdfb",
          seat_id: 1,
          // Add other passenger details
        },
        {
          passenger_id: "djkdvdfjk",
          name: 'Jane Smith',
          date_of_birth: '2023-10-15', // Convert the date format to 'YYYY-MM-DD'
          passport_number: "jdfhvjvs",
          identification_number: "jfkvdfb",
          seat_id: 1,
          // Add other passenger details
        },
      ]
      // Add other booking details
    };

    const changeBookingUrl = links.find((link) => link.id === 5)?.url;

    if (changeBookingUrl) {
      fetch(changeBookingUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(bookingData),
      })
        .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
        .then((data) => setData(data))
        .catch((error) => console.error(error));
    }

    // Scroll to the top of the page to view the output
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const deleteBooking = () => {
  const deleteBookingUrl = links.find((link) => link.id === 6)?.url;

  if (deleteBookingUrl) {
    fetch(deleteBookingUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const guestBookingInquiry = () => {
  const bookingInquiryData = {
    booking_inquiry_type_id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
    subject: 'Booking cancellation',
    message: 'I need to cancel the booking with this reference number CSJFGHJ.',
    // Add other booking details
  };

  const guestBookingInquiryUrl = links.find((link) => link.id === 7)?.url;

  if (guestBookingInquiryUrl) {
    fetch(guestBookingInquiryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(bookingInquiryData),
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

};

const registerUser = () => {
  const registerUserData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'jdskfbvdijkdbhadh',
    // Add other booking details
  };

  const registerUserUrl = links.find((link) => link.id === 8)?.url;

  if (registerUserUrl) {
    fetch(registerUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(registerUserData),
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const accountBasedBookingInquiry = () => {
  const bookingInquiryData = {
    user_id: 1,
    booking_inquiry_type_id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
    subject: 'Booking cancellation',
    message: 'I need to cancel the booking with this reference number CSJFGHJ.',
    // Add other booking details
  };

  const accountBasedBookingInquiryUrl = links.find((link) => link.id === 9)?.url;

  if (accountBasedBookingInquiryUrl) {
    fetch(accountBasedBookingInquiryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(bookingInquiryData),
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addPassengers = () => {
  const passengersData = [
    {
      name: 'John Doe',
      date_of_birth: '2022-08-12', // Convert the date format to 'YYYY-MM-DD'
      passport_number: "jdfhvjvs",
      identification_number: "jfkvdfb",
      seat_id: 1,
      // Add other passenger details
    },
    {
      name: 'Jane Smith',
      date_of_birth: '2023-10-15', // Convert the date format to 'YYYY-MM-DD'
      passport_number: "jdfhvjvs",
      identification_number: "jfkvdfb",
      seat_id: 1,
      // Add other passenger details
    },
  ];

  const addPassengersUrl = links.find((link) => link.id === 10)?.url;

  if (addPassengersUrl) {
    fetch(addPassengersUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify({ passengers: passengersData }),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deletePassenger = () => {
  
  const deletePassengerUrl = links.find((link) => link.id === 11)?.url;

  if (deletePassengerUrl) {
    fetch(deletePassengerUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changePassenger = () => {
  const passengerData = {
    'name' : 'John Doe',
    'date_of_birth' : '2022-08-12', // Convert the date format to 'YYYY-MM-DD'
    'passport_number': 'jdfhvjvs',
     'identification_number': 'jfkvdfb',
     'seat_id': 1,
    
  };

  const  changePassengerUrl = links.find((link) => link.id === 12)?.url;

  if (changePassengerUrl) {
    fetch(changePassengerUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(passengerData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addCity = () => {
  const cityData = {
    name: 'Washington',
    country: 'United States of America',   
    
  };

  const  addCityUrl = links.find((link) => link.id === 15)?.url;

  if (addCityUrl) {
    fetch(addCityUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(cityData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeCity = () => {
  const cityData = {
    name: 'Washington',
    country: 'United States of America',   
    
  };

  const  changeCityUrl = links.find((link) => link.id === 16)?.url;

  if (changeCityUrl) {
    fetch(changeCityUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(cityData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteCity = () => {
  
  const deleteCityUrl = links.find((link) => link.id === 17)?.url;

  if (deleteCityUrl) {
    fetch(deleteCityUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addEmployee = () => {
  const employeeData = 
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "date_of_birth": "1990-01-01",
      "address": "123 Main Street",
      "job_title_id": 1,
      "qualifications": [1, 2, 3],
      "skills": [1, 2, 3],
    };

  const addEmployeeUrl = links.find((link) => link.id === 20)?.url;

  if (addEmployeeUrl) {
    fetch(addEmployeeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(employeeData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeEmployee = () => {
  const employeeData = 
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "date_of_birth": "1990-01-01",
      "address": "123 Main Street",
      "job_title_id": 1,
      "qualifications": [1, 2, 3],
      "skills": [1, 2, 3, 6],
    };

  const changeEmployeeUrl = links.find((link) => link.id === 21)?.url;

  if (changeEmployeeUrl) {
    fetch(changeEmployeeUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(employeeData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteEmployee = () => {
  
  const deleteEmployeeUrl = links.find((link) => link.id === 22)?.url;

  if (deleteEmployeeUrl) {
    fetch(deleteEmployeeUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addQualification = () => {
  const qualificationData = {
    name: 'Bachelor\'s Degree in Aeronautical Engineering',
    
  };

  const  addQualificationUrl = links.find((link) => link.id === 25)?.url;

  if (addQualificationUrl) {
    fetch(addQualificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(qualificationData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeQualification = () => {
  const qualificationData = {
    name: 'Bachelor\'s Degree in Aeronautical Engineering',
    
  };

  const  changeQualificationUrl = links.find((link) => link.id === 26)?.url;

  if (changeQualificationUrl) {
    fetch(changeQualificationUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(qualificationData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteQualification = () => {
  
  const deleteQualificationUrl = links.find((link) => link.id === 27)?.url;

  if (deleteQualificationUrl) {
    fetch(deleteQualificationUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addSkill = () => {
  const skillData = {
    name: 'Aircraft Maintenance',
    
  };

  const  addSkillUrl = links.find((link) => link.id === 30)?.url;

  if (addSkillUrl) {
    fetch(addSkillUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(skillData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeSkill = () => {
  const skillData = {
    name: 'Aircraft Maintenance',
    
  };

  const  changeSkillUrl = links.find((link) => link.id === 31)?.url;

  if (changeSkillUrl) {
    fetch(changeSkillUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(skillData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteSkill = () => {
  
  const deleteSkillUrl = links.find((link) => link.id === 32)?.url;

  if (deleteSkillUrl) {
    fetch(deleteSkillUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};


const addJobTitle = () => {
  const jobTitleData = {
    name: 'Aircraft Maintenance',
    
  };

  const  addJobTitleUrl = links.find((link) => link.id === 35)?.url;

  if (addJobTitleUrl) {
    fetch(addJobTitleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(jobTitleData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeJobTitle = () => {
  const jobTitleData = {
    name: 'Aircraft Maintenance',
    
  };

  const  changeJobTitleUrl = links.find((link) => link.id === 36)?.url;

  if (changeJobTitleUrl) {
    fetch(changeJobTitleUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(jobTitleData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteJobTitle = () => {
  
  const deleteJobTitleUrl = links.find((link) => link.id === 37)?.url;

  if (deleteJobTitleUrl) {
    fetch(deleteJobTitleUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addSeatLocation = () => {
  const seatLocationData = {
    name: 'Middle',
    
  };

  const  addSeatLocationUrl = links.find((link) => link.id === 40)?.url;

  if (addSeatLocationUrl) {
    fetch(addSeatLocationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(seatLocationData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeSeatLocation = () => {
  const seatLocationData = {
    name: 'Middle',
    
  };

  const  changeSeatLocationUrl = links.find((link) => link.id === 41)?.url;

  if (changeSeatLocationUrl) {
    fetch(changeSeatLocationUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(seatLocationData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteSeatLocation = () => {
  
  const deleteSeatLocationUrl = links.find((link) => link.id === 42)?.url;

  if (deleteSeatLocationUrl) {
    fetch(deleteSeatLocationUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addSeat = () => {
  const seatData = {
    plane_id: 2, // Replace with the actual plane ID
    flight_class_id: 1,
    seats: [
      {
        seat_number: 'A1',
        location_id: 1, // Replace with the actual location ID
        price: 100.00,
      },
      {
        seat_number: 'B2',
        location_id: 2, // Replace with the actual location ID
        price: 120.00,
      },
    ],
    
  };

  const  addSeatUrl = links.find((link) => link.id === 65)?.url;

  if (addSeatUrl) {
    fetch(addSeatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(seatData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeSeat = () => {
  const seatData = {
    plane_id: 1, // Replace with the actual plane ID
    flight_class_id: 1,
    seat_number: 'A6',
    location_id: 1, // Replace with the actual location ID
    price: 100.00,    
  };


  const  changeSeatUrl = links.find((link) => link.id === 66)?.url;

  if (changeSeatUrl) {
    fetch(changeSeatUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(seatData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteSeat = () => {
  
  const deleteSeatUrl = links.find((link) => link.id === 67)?.url;

  if (deleteSeatUrl) {
    fetch(deleteSeatUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addFlightStatus = () => {
  const flightStatusData = {
    name: 'On-time',
    
  };

  const  addFlightStatusUrl = links.find((link) => link.id === 45)?.url;

  if (addFlightStatusUrl) {
    fetch(addFlightStatusUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(flightStatusData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeFlightStatus = () => {
  const flightStatusData = {
    name: 'On-time',
    
  };

  const  changeFlightStatusUrl = links.find((link) => link.id === 46)?.url;

  if (changeFlightStatusUrl) {
    fetch(changeFlightStatusUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(flightStatusData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteFlightStatus = () => {
  
  const deleteFlightStatusUrl = links.find((link) => link.id === 47)?.url;

  if (deleteFlightStatusUrl) {
    fetch(deleteFlightStatusUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addFlightClass = () => {
  const flightClassData = {
    name: 'Economy',
    
  };

  const  addFlightClassUrl = links.find((link) => link.id === 50)?.url;

  if (addFlightClassUrl) {
    fetch(addFlightClassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(flightClassData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeFlightClass = () => {
  const flightClassData = {
    name: 'Economy',
    
  };

  const  changeFlightClassUrl = links.find((link) => link.id === 51)?.url;

  if (changeFlightClassUrl) {
    fetch(changeFlightClassUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(flightClassData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteFlightClass = () => {
  
  const deleteFlightClassUrl = links.find((link) => link.id === 52)?.url;

  if (deleteFlightClassUrl) {
    fetch(deleteFlightClassUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addOpening = () => {
  const openingData = {
    "title": 'Flight Attendant Opening',
    "description": 'Flight Attendatnt employee required ASAP',
    "qualifications": [1, 2, 3],
    "skills": [1, 2, 3],
        
  };

  const  addOpeningUrl = links.find((link) => link.id === 55)?.url;

  if (addOpeningUrl) {
    fetch(addOpeningUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(openingData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeOpening = () => {
  const openingData = {
    "title": 'Flight Attendant Opening',
    "description": 'Flight Attendatnt employee required ASAP',
    "qualifications": [1, 2, 3],
    "skills": [1, 2, 3],
    
  };

  const  changeOpeningUrl = links.find((link) => link.id === 56)?.url;

  if (changeOpeningUrl) {
    fetch(changeOpeningUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(openingData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteOpening = () => {
  
  const deleteOpeningUrl = links.find((link) => link.id === 57)?.url;

  if (deleteOpeningUrl) {
    fetch(deleteOpeningUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const addPlane = () => {
  const planeData = {
    name: 'Boeng 737',
    model: 'Boeng',   
    capacity: 180,
    
  };

  const  addPlaneUrl = links.find((link) => link.id === 60)?.url;

  if (addPlaneUrl) {
    fetch(addPlaneUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(planeData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changePlane = () => {
  const planeData = {
    name: 'Boeng 737',
    model: 'Boeng',   
    capacity: 180,   
    
  };

  const  changePlaneUrl = links.find((link) => link.id === 61)?.url;

  if (changePlaneUrl) {
    fetch(changePlaneUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(planeData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deletePlane = () => {
  
  const deletePlaneUrl = links.find((link) => link.id === 62)?.url;

  if (deletePlaneUrl) {
    fetch(deletePlaneUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changeUser = () => {
  const userData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'jdskfbvdijkdbhadh',  
    
  };

  const  changeUserUrl = links.find((link) => link.id === 77)?.url;

  if (changeUserUrl) {
    fetch(changeUserUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json(); // Extract the response as JSON
          } else {
            return response.text(); // Extract the response as text
          }
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const deleteUser = () => {
  
  const deleteUserUrl = links.find((link) => link.id === 78)?.url;

  if (deleteUserUrl) {
    fetch(deleteUserUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    })
      .then((response) => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json(); // Extract the response as JSON
        } else {
          return response.text(); // Extract the response as text
        }
    })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }

  // Scroll to the top of the page to view the output
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};


  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%', paddingRight: '1rem', borderRight: '1px solid #ccc' }}>
        <h2>Routes:</h2>
        {links.map(link => (
          <div key={link.id} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ marginRight: '1rem', marginBottom: '0.5rem', color: 'rgb(94, 129, 157)' }}>{link.label}</p>
              {link.label === 'Add Booking' ? (
                <button onClick={addBooking} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Booking' ? (
                <button onClick={changeBooking} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Delete Booking' ? (
                <button onClick={deleteBooking} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Guest Booking Inquiry' ? (
                <button onClick={guestBookingInquiry} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) :  link.label === 'Register A User' ? (
                <button onClick={registerUser} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Registerd User Booking Inquiry' ? (
                <button onClick={accountBasedBookingInquiry} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add Passengers' ? (
                <button onClick={addPassengers} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Delete Passenger' ? (
                <button onClick={deletePassenger} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Passenger' ? (
                <button onClick={changePassenger} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add City' ? (
                <button onClick={addCity} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change City' ? (
                <button onClick={changeCity} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete City' ? (
                <button onClick={deleteCity} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add Employee' ? (
                <button onClick={addEmployee} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Employee' ? (
                <button onClick={changeEmployee} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Delete Employee' ? (
                <button onClick={deleteEmployee} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add Qualification' ? (
                <button onClick={addQualification} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Qualification' ? (
                <button onClick={changeQualification} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete Qualification' ? (
                <button onClick={deleteQualification} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add Skill' ? (
                <button onClick={addSkill} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Skill' ? (
                <button onClick={changeSkill} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete Skill' ? (
                <button onClick={deleteSkill} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add JobTitle' ? (
                <button onClick={addJobTitle} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change JobTitle' ? (
                <button onClick={changeJobTitle} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete JobTitle' ? (
                <button onClick={deleteJobTitle} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add SeatLocation' ? (
                <button onClick={addSeatLocation} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change SeatLocation' ? (
                <button onClick={changeSeatLocation} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete SeatLocation' ? (
                <button onClick={deleteSeatLocation} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add FlightStatus' ? (
                <button onClick={addFlightStatus} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change FlightStatus' ? (
                <button onClick={changeFlightStatus} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete FlightStatus' ? (
                <button onClick={deleteFlightStatus} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add FlightClass' ? (
                <button onClick={addFlightClass} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change FlightClass' ? (
                <button onClick={changeFlightClass} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete FlightClass' ? (
                <button onClick={deleteFlightClass} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add Opening' ? (
                <button onClick={addOpening} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Opening' ? (
                <button onClick={changeOpening} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete Opening' ? (
                <button onClick={deleteOpening} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add Plane' ? (
                <button onClick={addPlane} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Plane' ? (
                <button onClick={changePlane} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete Plane' ? (
                <button onClick={deletePlane} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add Seat' ? (
                <button onClick={addSeat} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Seat' ? (
                <button onClick={changeSeat} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete Seat' ? (
                <button onClick={deleteSeat} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Add Flight' ? (
                <button onClick={addFlight} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change Flight' ? (
                <button onClick={changeFlight} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete Flight' ? (
                <button onClick={deleteFlight} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) : link.label === 'Change User' ? (
                <button onClick={changeUser} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label} 
                </button>
              ) : link.label === 'Delete User' ? (
                <button onClick={deleteUser} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              ) :(
                <button onClick={() => fetchData(link.url)} style={{ backgroundColor: 'rgb(0, 128, 128)', marginBottom: '0.1rem' }}>
                  {link.label}
                </button>
              )}

            </div>
            <div>
              <input
                type="text"
                value={link.url}
                onChange={e => handleUrlChange(e, link.id)}
                ref={inputRef => (inputRefs.current[link.id] = inputRef)}
                style={{ width: 'auto' }}
              />
            </div>
          </div>
        ))}
      </div>
      <div id='output-container' style={{ width: '50%', paddingLeft: '1rem' }}>
        <h2>Output:</h2>
        {typeof data === 'object' ? (
           <pre>{JSON.stringify(data, null, 2)}</pre> // Render as formatted JSON
         ) : (
           <p>{data}</p> // Render as plain text
        )}
      </div>
    </div>
  );
};

export default Data;
