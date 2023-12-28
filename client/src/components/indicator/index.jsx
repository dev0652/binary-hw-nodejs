import React from 'react';
import './indicator.css';

// ******************************************

export function Indicator({ side, name }) {
  return (
    <div className="arena___fighter-indicator">
      <span className="arena___fighter-name">{name}</span>
      <div className="arena___health-indicator">
        <div
          className="arena___health-bar"
          id={`${side}-fighter-indicator`}
        ></div>
      </div>
    </div>
  );
}
