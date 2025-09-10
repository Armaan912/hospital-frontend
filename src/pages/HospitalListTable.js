import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalAPI from '../services/api';

const HospitalListTable = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHospitals, setTotalHospitals] = useState(0);
  const [selectedHospitals, setSelectedHospitals] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchHospitals();
  }, [currentPage]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };

      const data = await HospitalAPI.getHospitals(params);
      setHospitals(data.hospitals || data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalHospitals(data.pagination?.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSelectHospital = (hospitalId) => {
    setSelectedHospitals(prev => 
      prev.includes(hospitalId) 
        ? prev.filter(id => id !== hospitalId)
        : [...prev, hospitalId]
    );
  };

  const handleSelectAll = () => {
    if (selectedHospitals.length === hospitals.length) {
      setSelectedHospitals([]);
    } else {
      setSelectedHospitals(hospitals.map(h => h._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedHospitals.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedHospitals.length} hospital(s)?`)) {
      try {
        await Promise.all(selectedHospitals.map(id => HospitalAPI.deleteHospital(id)));
        setSelectedHospitals([]);
        fetchHospitals();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteHospital = async (hospitalId, hospitalName) => {
    if (window.confirm(`Are you sure you want to delete "${hospitalName}"?`)) {
      try {
        await HospitalAPI.deleteHospital(hospitalId);
        fetchHospitals();
      } catch (err) {
        setError(err.message);
      }
    }
  };


  const getLocationString = (location) => {
    if (!location) return 'N/A';
    const parts = [location.city, location.state, location.country].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  const getRatingDisplay = (hospital) => {
    if (hospital.rating) return hospital.rating;
    if (hospital.googleReviewsRating) return hospital.googleReviewsRating;
    return 'N/A';
  };

  if (loading && hospitals.length === 0) {
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

  return (
    <div className="container-fluid px-0">
      <div className="bg-white">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold text-black mb-0">Hospital Management</h2>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/hospitals')}
              >
                <i className="fas fa-th-large me-2"></i>Card View
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/hospitals/create')}
              >
                <i className="fas fa-plus me-2"></i>Create Hospital
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{totalHospitals}</h5>
                  <p className="card-text text-muted mb-0">Total Hospitals</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title text-success">{hospitals.length}</h5>
                  <p className="card-text text-muted mb-0">Showing</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title text-warning">{selectedHospitals.length}</h5>
                  <p className="card-text text-muted mb-0">Selected</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title text-info">{totalPages}</h5>
                  <p className="card-text text-muted mb-0">Pages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}


        {/* Bulk Actions */}
        {selectedHospitals.length > 0 && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>{selectedHospitals.length} hospital(s) selected</span>
            <button 
              className="btn btn-danger btn-sm"
              onClick={handleDeleteSelected}
            >
              <i className="fas fa-trash me-1"></i>Delete Selected
            </button>
          </div>
        )}

        {/* Hospitals Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedHospitals.length === hospitals.length && hospitals.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="fw-bold">Hospital Name</th>
                    <th className="fw-bold">Location</th>
                    <th className="fw-bold">Rating</th>
                    <th className="fw-bold">Type</th>
                    <th className="fw-bold">Patients</th>
                    <th className="fw-bold">Doctors</th>
                    <th className="fw-bold">Created</th>
                    <th className="fw-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hospital) => (
                    <tr key={hospital._id}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedHospitals.includes(hospital._id)}
                          onChange={() => handleSelectHospital(hospital._id)}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {hospital.mainImage ? (
                            <img
                              src={hospital.mainImage.startsWith('http') ? hospital.mainImage : `hospital-backend-elzv.onrender.com${hospital.mainImage}`}
                              alt={hospital.name}
                              className="rounded me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <i className="fas fa-hospital text-muted"></i>
                            </div>
                          )}
                          <div>
                            <div className="fw-bold">{hospital.name}</div>
                            <small className="text-muted">{hospital.clinicType || 'N/A'}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-muted">
                          {getLocationString(hospital.location)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-warning text-dark me-1">
                            ⭐ {getRatingDisplay(hospital)}
                          </span>
                          {hospital.userScore && (
                            <small className="text-muted">({hospital.userScore}%)</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {hospital.typeOfCare || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="text-muted">
                          {hospital.totalPatients ? hospital.totalPatients.toLocaleString() : '0'}
                        </div>
                      </td>
                      <td>
                        <div className="text-muted">
                          {hospital.totalDoctors || 0}
                        </div>
                      </td>
                      <td>
                        <div className="text-muted">
                          {new Date(hospital.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => navigate(`/hospital/${hospital._id}`)}
                            title="View Details"
                          >
                            <i className="fas fa-eye me-1"></i>View
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => navigate(`/hospitals/edit/${hospital._id}`)}
                            title="Edit Hospital"
                          >
                            <i className="fas fa-edit me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteHospital(hospital._id, hospital.name)}
                            title="Delete Hospital"
                          >
                            <i className="fas fa-trash me-1"></i>Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hospitals.length === 0 && !loading && (
              <div className="text-center py-5">
                <i className="fas fa-hospital fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No hospitals found</h5>
                <p className="text-muted">Try adjusting your search criteria or create a new hospital.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/hospitals/create')}
                >
                  <i className="fas fa-plus me-2"></i>Create First Hospital
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-angle-double-left"></i>
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-angle-left"></i>
                </button>
              </li>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-angle-right"></i>
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-angle-double-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default HospitalListTable;
