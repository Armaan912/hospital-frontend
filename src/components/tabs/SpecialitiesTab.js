import React from 'react';

const SpecialitiesTab = ({ hospital }) => {
  return (
    <div>
      <h2 className="h3 fw-bold text-black mb-4">Primary Focus</h2>
      <div className="d-flex flex-wrap gap-2">
        {hospital.primaryFocus ? (
          hospital.primaryFocus.split(',').map((focus, index) => (
            <span key={index} className="badge bg-light text-dark border px-3 py-2">
              {focus.trim()}
            </span>
          ))
        ) : (
          <p className="text-muted">No primary focus specified</p>
        )}
      </div>
    </div>
  );
};

export default SpecialitiesTab;
