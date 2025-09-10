import React, { useState, useEffect } from 'react';
import HospitalCard from '../components/HospitalCard';
import HospitalAPI from '../services/api';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    treatment: '',
    facility: '',
    speciality: ''
  });
  const [selectedSpeciality, setSelectedSpeciality] = useState('All Specialities');
  const [currentPage, setCurrentPage] = useState(1);
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const specialities = [
    'All Specialities',
    'Family Medicine',
    'Neurosurgery',
    'Dentist',
    'Pediatrics',
    'Chief Surgeon',
    'Cardiologist',
    'Dermatologist',
    'Neurologist'
  ];

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async (searchParams = {}) => {
    try {
      setLoading(true);
      const data = await HospitalAPI.getHospitals(searchParams);
      setHospitals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSpecialityClick = (speciality) => {
    setSelectedSpeciality(speciality);
    // Auto-search when speciality is clicked
    if (speciality === 'All Specialities') {
      setCurrentPage(1);
      fetchHospitals(); // Fetch all hospitals
    } else {
      const searchParams = { search: speciality };
      setCurrentPage(1);
      fetchHospitals(searchParams);
    }
  };

  const handleSearch = () => {
    // Build search parameters from filters
    const searchParams = {};
    
    // Add location filters
    if (filters.location) {
      searchParams.city = filters.location;
    }
    
    // Add speciality filter
    if (filters.speciality) {
      searchParams.specialty = filters.speciality;
    }
    
    // Add treatment filter (map to appropriate backend field)
    if (filters.treatment) {
      searchParams.typeOfCare = filters.treatment;
    }
    
    // Add facility filter (map to appropriate backend field)
    if (filters.facility) {
      searchParams.clinicType = filters.facility;
    }
    
    // Add selected speciality as search term
    if (selectedSpeciality && selectedSpeciality !== 'All Specialities') {
      searchParams.search = selectedSpeciality;
    }
    
    console.log('Searching with filters:', searchParams);
    
    // Reset pagination when searching
    setCurrentPage(1);
    
    // Fetch hospitals with search parameters
    fetchHospitals(searchParams);
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      treatment: '',
      facility: '',
      speciality: ''
    });
    setSelectedSpeciality('All Specialities');
    setCurrentPage(1);
    fetchHospitals(); // Fetch all hospitals
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    // Reset form
    setCallbackForm({ name: '', phone: '', email: '' });
    alert('Thank you! We will contact you soon.');
  };

  const handleCallbackChange = (e) => {
    setCallbackForm({
      ...callbackForm,
      [e.target.name]: e.target.value
    });
  };

  // Pagination logic
  const cardsPerPage = 6;
  const totalPages = Math.ceil(hospitals.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentHospitals = hospitals.slice(startIndex, endIndex);

  // Function to render callback form
  const renderCallbackForm = () => (
    <div className="row justify-content-center my-5">
      <div className="col-12">
        <div className="card shadow-sm border-0 rounded-3 p-4" style={{backgroundColor: 'white'}}>
          <h4 className="mb-4 fw-bold" style={{color: '#001244'}}>Can't find what you are looking for?</h4>
          <form onSubmit={handleCallbackSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label fw-normal mb-2" style={{color: '#001244'}}>Name</label>
                <input
                  type="text"
                  className="form-control rounded-3 border-0"
                  placeholder="Type A Name"
                  name="name"
                  value={callbackForm.name}
                  onChange={handleCallbackChange}
                  required
                  style={{
                    backgroundColor: '#f0f2f5',
                    height: '45px',
                    color: '#001244'
                  }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-normal mb-2" style={{color: '#001244'}}>Phone Number</label>
                <input
                  type="tel"
                  className="form-control rounded-3 border-0"
                  placeholder="Type A Phone Number"
                  name="phone"
                  value={callbackForm.phone}
                  onChange={handleCallbackChange}
                  required
                  style={{
                    backgroundColor: '#f0f2f5',
                    height: '45px',
                    color: '#001244'
                  }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-normal mb-2" style={{color: '#001244'}}>Email (Optional)</label>
                <input
                  type="email"
                  className="form-control rounded-3 border-0"
                  placeholder="Type Email"
                  name="email"
                  value={callbackForm.email}
                  onChange={handleCallbackChange}
                  style={{
                    backgroundColor: '#f0f2f5',
                    height: '45px',
                    color: '#001244'
                  }}
                />
              </div>
              <div className="col-md-3">
                <button 
                  type="submit" 
                  className="btn rounded-3 px-4 py-2 fw-semibold w-100"
                  style={{
                    backgroundColor: '#001244',
                    color: 'white',
                    height: '45px',
                    border: 'none'
                  }}
                >
                  Request Callback <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner Container */}
      <div className="banner-container">
        <div 
          className="banner-section"
          style={{
            backgroundImage: 'url(/2147763801.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            borderRadius: '20px'
          }}
        >
          <div className="banner-overlay">
            <div className="container">
              <div className="banner-content">
                <h1 className="banner-title">Hospital Search</h1>
                <nav className="breadcrumb-nav">
                  <span className="breadcrumb-item">Home</span>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item active">Hospital Search</span>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Container */}
      <div className="filter-container">
        <div className="filter-section">
          <div className="container">
            <div className="filter-card">
              <div className="row">
                <div className="col-md-3">
                  <div className="filter-group">
                    <label className="filter-label">Location</label>
                    <select 
                      className="filter-select"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    >
                      <option value="">Select Location</option>
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="chennai">Chennai</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="filter-group">
                    <label className="filter-label">Treatment</label>
                    <select 
                      className="filter-select"
                      value={filters.treatment}
                      onChange={(e) => handleFilterChange('treatment', e.target.value)}
                    >
                      <option value="">Select Treatment</option>
                      <option value="surgery">Surgery</option>
                      <option value="therapy">Therapy</option>
                      <option value="consultation">Consultation</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="filter-group">
                    <label className="filter-label">Facility</label>
                    <select 
                      className="filter-select"
                      value={filters.facility}
                      onChange={(e) => handleFilterChange('facility', e.target.value)}
                    >
                      <option value="">Select Facility</option>
                      <option value="emergency">Emergency</option>
                      <option value="icu">ICU</option>
                      <option value="surgery">Surgery</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="filter-group">
                    <label className="filter-label">Speciality</label>
                    <select 
                      className="filter-select"
                      value={filters.speciality}
                      onChange={(e) => handleFilterChange('speciality', e.target.value)}
                    >
                      <option value="">Select Speciality</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="orthopedics">Orthopedics</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="speciality-buttons">
                {specialities.map((speciality) => (
                  <button
                    key={speciality}
                    className={`speciality-btn ${selectedSpeciality === speciality ? 'active' : ''}`}
                    onClick={() => handleSpecialityClick(speciality)}
                  >
                    {speciality}
                  </button>
                ))}
              </div>
              
              <div className="search-button-container d-flex gap-2">
                <button className="search-btn" onClick={handleSearch}>
                  Search Now <i className="fas fa-arrow-right"></i>
                </button>
                {(filters.location || filters.treatment || filters.facility || filters.speciality || selectedSpeciality !== 'All Specialities') && (
                  <button className="btn btn-outline-secondary" onClick={handleClearFilters}>
                    Clear Filters <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital List */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            {/* Active Filters Display */}
            {(filters.location || filters.treatment || filters.facility || filters.speciality || selectedSpeciality !== 'All Specialities') && (
              <div className="mb-3">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="text-muted">Active filters:</span>
                  {filters.location && (
                    <span className="badge bg-primary">
                      Location: {filters.location} <i className="fas fa-times ms-1" onClick={() => handleFilterChange('location', '')} style={{cursor: 'pointer'}}></i>
                    </span>
                  )}
                  {filters.treatment && (
                    <span className="badge bg-success">
                      Treatment: {filters.treatment} <i className="fas fa-times ms-1" onClick={() => handleFilterChange('treatment', '')} style={{cursor: 'pointer'}}></i>
                    </span>
                  )}
                  {filters.facility && (
                    <span className="badge bg-warning">
                      Facility: {filters.facility} <i className="fas fa-times ms-1" onClick={() => handleFilterChange('facility', '')} style={{cursor: 'pointer'}}></i>
                    </span>
                  )}
                  {filters.speciality && (
                    <span className="badge bg-info">
                      Speciality: {filters.speciality} <i className="fas fa-times ms-1" onClick={() => handleFilterChange('speciality', '')} style={{cursor: 'pointer'}}></i>
                    </span>
                  )}
                  {selectedSpeciality !== 'All Specialities' && (
                    <span className="badge bg-secondary">
                      Selected: {selectedSpeciality} <i className="fas fa-times ms-1" onClick={() => setSelectedSpeciality('All Specialities')} style={{cursor: 'pointer'}}></i>
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {hospitals.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No hospitals found.
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Found {hospitals.length} hospital{hospitals.length !== 1 ? 's' : ''}</h5>
                  <small className="text-muted">Page {currentPage} of {totalPages}</small>
                </div>
                <div className="row">
                  {currentHospitals.map((hospital, index) => (
                    <React.Fragment key={hospital._id}>
                      <HospitalCard hospital={hospital} />
                      {/* Show callback form after first 4 cards on each page */}
                      {index === 3 && currentHospitals.length >= 4 && renderCallbackForm()}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <div className="d-flex align-items-center gap-2">
                      {/* Previous Button */}
                      <button 
                        className="btn rounded-circle d-flex align-items-center justify-content-center"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'white',
                          border: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          color: currentPage === 1 ? '#ccc' : '#001244'
                        }}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      
                      {/* Page Numbers */}
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          className="btn rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          onClick={() => setCurrentPage(index + 1)}
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: currentPage === index + 1 ? '#28a745' : 'white',
                            border: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            color: currentPage === index + 1 ? 'white' : '#001244'
                          }}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      {/* Next Button */}
                      <button 
                        className="btn rounded-circle d-flex align-items-center justify-content-center"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'white',
                          border: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          color: currentPage === totalPages ? '#ccc' : '#001244'
                        }}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trusted Partners Section */}
      <div className="container-fluid py-5 pt-5" style={{backgroundColor: 'white'}}>
        <div className="container">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-0" style={{color: '#001244'}}>
              TRUSTED BY <span style={{color: '#1f5eff'}}>50+</span> INTERNATIONAL RECOGNIZED HOSPITAL PARTNER
            </h3>
          </div>
          <div className="row align-items-center justify-content-center">
            <div className="col-6 col-md-2 text-center mb-3">
              <img 
                src="/hospital icons/mlpcare-healthcare-group-311.jpg" 
                alt="MedicalPark" 
                className="img-fluid"
                style={{maxHeight: '60px', objectFit: 'contain'}}
              />
            </div>
            <div className="col-6 col-md-2 text-center mb-3">
              <img 
                src="/hospital icons/Fortis-Logo.png" 
                alt="Fortis" 
                className="img-fluid"
                style={{maxHeight: '60px', objectFit: 'contain'}}
              />
            </div>
            <div className="col-6 col-md-2 text-center mb-3">
              <img 
                src="/hospital icons/shalby hospital.webp" 
                alt="Shalby Multi-Specialty Hospitals" 
                className="img-fluid"
                style={{maxHeight: '60px', objectFit: 'contain'}}
              />
            </div>
            <div className="col-6 col-md-2 text-center mb-3">
              <img 
                src="/hospital icons/Medanta-The-Medicity-Logo-Vector.svg-.png" 
                alt="Medanta Healthcare" 
                className="img-fluid"
                style={{maxHeight: '60px', objectFit: 'contain'}}
              />
            </div>
            <div className="col-6 col-md-2 text-center mb-3">
              <img 
                src="/hospital icons/max hospital.jpg" 
                alt="MAX Healthcare" 
                className="img-fluid"
                style={{maxHeight: '120px', objectFit: 'contain'}}
              />
            </div>
            <div className="col-6 col-md-2 text-center mb-3">
              <img 
                src="/hospital icons/appolo_hospital.webp" 
                alt="Apollo Hospitals" 
                className="img-fluid"
                style={{maxHeight: '120px', objectFit: 'contain'}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalList;
