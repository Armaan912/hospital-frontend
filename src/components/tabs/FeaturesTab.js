import React from 'react';

const FeaturesTab = () => {
  const extraServices = [
    { name: "Visa Support", icon: "fas fa-passport" },
    { name: "Pastoral Care", icon: "fas fa-church" },
    { name: "On-Site Pharmacy", icon: "fas fa-pills" },
    { name: "Parking Space", icon: "fas fa-parking" },
    { name: "Intensive Care Unit", icon: "fas fa-bed" },
    { name: "+5 services", icon: "fas fa-plus" }
  ];

  return (
    <div>
      <h2 className="h3 fw-bold text-black mb-4">Extra Services</h2>
      <div className="row">
        {extraServices.map((service, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="d-flex align-items-center">
              <i className={`${service.icon} text-black me-3 fa-lg`}></i>
              <span>{service.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesTab;
