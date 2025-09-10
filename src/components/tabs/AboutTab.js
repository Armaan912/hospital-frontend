import React from 'react';

const AboutTab = ({ hospital }) => {
  return (
    <div>
      <h2 className="h3 fw-bold text-black mb-4">About the clinic</h2>
      <p className="mb-3">
        {hospital.about || 'No description available for this hospital.'}
      </p>
      {hospital.about && (
        <button className="btn btn-link text-black text-decoration-none fw-medium p-0">Read more &gt;</button>
      )}
    </div>
  );
};

export default AboutTab;
