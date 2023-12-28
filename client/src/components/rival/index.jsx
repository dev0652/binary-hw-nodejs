import React from 'react';
import './rival.css';

// ******************************************

export function Rival({ side, fighter }) {
  const { source, name } = fighter;

  return (
    <div className={`arena___fighter arena___${side}-fighter`}>
      <img
        className="fighter-preview___img"
        src={source}
        title={name}
        alt={name}
      />
    </div>
  );
}
