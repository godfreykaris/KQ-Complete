import React from 'react';
import { Link } from 'react-router-dom';

const AdminLandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to KQ Admin</h1>
        <p>Your All-in-One Dashboard for Managing Your Airline Operations</p>
      </header>
      <div className="landing-content">
        <div className="landing-section">
          <h2>Flights Management</h2>
          <p>Effortlessly manage your flight schedules, view/edit/delete flights, and keep your operations running smoothly.</p>
          <Link to="/admin/manage_flights/add" className="landing-btn primary">Add New Flight</Link>
          <Link to="/admin/manage_flights/view" className="landing-btn secondary">View/Edit/Delete Flights</Link>
        </div>
        <div className="landing-section">
          <h2>Planes & Seats</h2>
          <p>Stay in control of your fleet. Add, edit, or remove planes, and manage seat configurations for an exceptional flying experience.</p>
          <Link to="/admin/planes/add" className="landing-btn primary">Add New Plane</Link>
          <Link to="/admin/planes/view" className="landing-btn secondary">View/Edit/Delete Planes</Link>
          <Link to="/admin/plane_seats/add" className="landing-btn primary">Add New Seat</Link>
          <Link to="/admin/plane_seats/view" className="landing-btn secondary">View/Edit/Delete Seats</Link>
        </div>
        <div className="landing-section">
          <h2>Cities & Airlines</h2>
          <p>Manage city and airline information seamlessly. Add, edit, or delete entries to keep your data up to date.</p>
          <Link to="/admin/cities_airlines/add/city" className="landing-btn primary">Add New City</Link>
          <Link to="/admin/cities_airlines/add/airline" className="landing-btn primary">Add New Airline</Link>
          <Link to="/admin/cities_airlines/view" className="landing-btn secondary">View/Edit/Delete Cities & Airlines</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLandingPage;
