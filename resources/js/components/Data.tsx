import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

interface Link {
  id: number;
  label: string;
  url: string;
}

const Data: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [links, setLinks] = useState<Link[]>([
    { id: 1, label: 'Fetch Flights', url: 'http://127.0.0.1:8000/flights' },
    { id: 2, label: 'Fetch Ticket', url: 'http://127.0.0.1:8000/ticket/NA290856' },
    { id: 3, label: 'Available Destinations', url: 'http://127.0.0.1:8000/available_destinations/Nairobi' },
    { id: 4, label: 'Add Booking', url: 'http://127.0.0.1:8000/bookings' },
    { id: 5, label: 'Change Booking', url: 'http://127.0.0.1:8000/bookings/{booking_reference}' },
    { id: 6, label: 'Delete Booking', url: 'http://127.0.0.1:8000/bookings/{booking_reference}'},
  ]);

  const fetchData = (url: string) => {
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(error));
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

  const addBooking = () => {
    const bookingData = {
      flight_id: 1,
      class_id: 1,
      seat_id: 3,
      passenger_name: 'John Doe',
      passenger_email: 'johndoe@example.com',
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
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(error));
  };

  const changeBooking = () => {
    const bookingData = {
      flight_id: 1,
      class_id: 1,
      seat_id: 3,
      passenger_name: 'John Doe',
      passenger_email: 'johndoe@example.com',
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
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error(error));
    }
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
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }
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
              ) : (
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
      <div style={{ width: '50%', paddingLeft: '1rem' }}>
        <h2>Output:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Data;
