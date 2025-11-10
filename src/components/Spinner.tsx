import React from 'react';

const Spinner = () => {
  return (
    <div className="fs-loader-overlay">
      <div className="fs-loader" />
      <p className="fs-loader-text">Loading...</p>
    </div>
  );
}

export default Spinner;
