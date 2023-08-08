import React from 'react';

export default function MenuItem({ label, link }) {
  return (
    <div className="menu-item">
      <a className="nav-link" href={link}>{label}</a>
    </div>
  );
}
