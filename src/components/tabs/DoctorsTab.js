import React, { useState } from 'react';

const DoctorsTab = ({ hospital }) => {
  const [expandedDepartments, setExpandedDepartments] = useState({});

  const toggleDepartment = (index) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div>
      <h2 className="h3 fw-bold text-black mb-4">Departments & Doctors</h2>
      <div className="accordion" id="departmentsAccordion">
        {hospital.departments && hospital.departments.length > 0 ? (
          hospital.departments.map((dept, index) => (
            <div key={index} className="mb-2" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
              <div 
                className="d-flex align-items-center"
                style={{ 
                  backgroundColor: 'white', 
                  color: expandedDepartments[index] ? '#20c997' : '#212529',
                  padding: '16px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: expandedDepartments[index] ? '1px solid #e9ecef' : 'none'
                }}
                onClick={() => toggleDepartment(index)}
              >
                <i className="fas fa-sitemap me-3" style={{ color: expandedDepartments[index] ? '#20c997' : '#6c757d' }}></i>
                {dept.name}
                <div className="ms-auto">
                  <i 
                    className={`fas ${expandedDepartments[index] ? 'fa-minus' : 'fa-plus'}`} 
                    style={{ 
                      color: '#6c757d'
                    }}
                  ></i>
                </div>
              </div>
              {expandedDepartments[index] && dept.doctors && dept.doctors.length > 0 && (
                <div style={{ padding: '0 20px 20px 20px', color: '#495057', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {dept.doctors.map((doctor, docIndex) => (
                    <div key={docIndex} className="d-flex align-items-center mb-3">
                      <div className="rounded-circle me-3 d-flex align-items-center justify-content-center bg-primary text-white" style={{ width: '60px', height: '60px' }}>
                        <span className="fw-bold">{doctor.name ? doctor.name.charAt(0) : 'D'}</span>
                      </div>
                      <div>
                        <h6 className="mb-1">
                          {doctor.name || 'Doctor Name'} <i className="fas fa-external-link-alt text-muted"></i>
                        </h6>
                        <small className="text-muted">{doctor.specialties ? doctor.specialties.join(', ') : 'Specialties not specified'}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No departments available for this hospital.</p>
          </div>
        )}
      </div>
      <div className="text-center mt-3">
        <button className="btn btn-outline-secondary">Show more</button>
      </div>
    </div>
  );
};

export default DoctorsTab;
