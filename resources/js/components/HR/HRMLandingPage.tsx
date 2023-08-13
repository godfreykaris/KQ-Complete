import React from 'react';
import { Link } from 'react-router-dom';

const HRMLandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to KQ Human Resource Manager</h1>
        <p>Your Central Hub for Employee Management and Job Openings</p>
      </header>
      <div className="landing-content" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="landing-section" style={{ marginRight: '20px' }}>
          <h2>Employee Management</h2>
          <p>Efficiently manage employee information, edit their details, and match them to suitable job openings.</p>
          <Link to="/hrm/manage_employees/add" className="landing-btn primary">Add New Employee</Link>
          <Link to="/hrm/manage_employees/view" className="landing-btn primary">View/Edit/Delete Employees</Link>
        </div>
        <div className="landing-section" style={{ marginLeft: '20px' }}>
          <h2>Job Openings</h2>
          <p>Stay organized by managing job openings, viewing and editing details, and matching employees to the right roles.</p>
          <Link to="/hrm/manage_openings/add" className="landing-btn primary">Add New Opening</Link>
          <Link to="/hrm/manage_openings/view" className="landing-btn primary">View/Edit/Delete Openings</Link>
          <Link to="/hrm/manage_openings/employee-opening_matchings" className="landing-btn primary">Match Employees to Openings</Link>
        </div>
      </div>
    </div>

  );

};

export default HRMLandingPage;
