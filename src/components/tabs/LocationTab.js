import React, { useState } from 'react';

const LocationTab = ({ hospital }) => {
  const [expandedFaq, setExpandedFaq] = useState({});

  const toggleFaq = (index) => {
    setExpandedFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: "What is the therapeutic range of the Charite University Hospital?",
      answer: "The clinic offers various medical services in general and visceral surgery, neurosurgery, transplantology, primary therapy, allergology, endocrinology, ophthalmology, and otorhinolaryngology. The center pays the most attention to tumors and neurological diseases."
    },
    {
      question: "Can I get an artificial knee joint?",
      answer: "Yes, our orthopedic department specializes in joint replacement surgeries including artificial knee joints."
    },
    {
      question: "Does the clinic have a radiation oncology department?",
      answer: "Yes, we have a comprehensive radiation oncology department with state-of-the-art equipment."
    }
  ];

  return (
    <div>
      <h2 className="h3 fw-bold text-black mb-3">Location</h2>
      <p className="mb-3">
        {hospital.location?.city && hospital.location?.state && hospital.location?.country 
          ? `${hospital.location.city}, ${hospital.location.state}, ${hospital.location.country}`
          : hospital.location?.city && hospital.location?.country
          ? `${hospital.location.city}, ${hospital.location.country}`
          : hospital.location?.city || hospital.location?.state || hospital.location?.country
          ? Object.values(hospital.location).filter(Boolean).join(', ')
          : 'Location not specified'
        }
      </p>
      
      {/* Map Placeholder */}
      <div className="bg-light rounded d-flex align-items-center justify-content-center mb-4" style={{ height: '400px' }}>
        <div className="text-center">
          <i className="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
          <p className="text-muted">Interactive Map</p>
          <small className="text-muted">View larger map</small>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-5">
        <h3 className="h4 fw-bold text-primary mb-3">FAQ</h3>
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, index) => (
            <div key={index} className="accordion-item border-0 mb-2">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${expandedFaq[index] ? '' : 'collapsed'} border-0 bg-light`}
                  type="button"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                </button>
              </h2>
              {expandedFaq[index] && (
                <div className="accordion-collapse collapse show">
                  <div className="accordion-body bg-light">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button className="btn btn-link text-primary p-0 text-decoration-none">Show more</button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-top">
        <p className="text-muted small">© University Hospital Charite Berlin</p>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><button className="btn btn-link text-decoration-none p-0">Home</button></li>
            <li className="breadcrumb-item"><button className="btn btn-link text-decoration-none p-0">Hospitals</button></li>
            <li className="breadcrumb-item active">University Hospital Charite Berlin</li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default LocationTab;
