import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalAPI from '../services/api';

const CreateHospital = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: {
      city: '',
      state: '',
      country: ''
    },
    rating: '',
    googleReviewsRating: '',
    userScore: '',
    foundedYear: '',
    totalPatients: '',
    totalUnits: '',
    sizeAndCapacity: {
      operationTheatres: '',
      icus: '',
      patientBeds: ''
    },
    clinicType: [],
    typeOfCare: [],
    ageGroup: [],
    about: '',
    primaryFocus: '',
    departments: [{ name: '', doctors: [{ name: '', specialties: [] }] }],
    featureAndFacts: [{ title: '', description: '' }],
    faq: [{ question: '', answer: '' }],
    mainImage: null,
    gallery: []
  });

  const [newDepartment, setNewDepartment] = useState('');
  const [newDoctor, setNewDoctor] = useState({ name: '', specialties: [] });
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'mainImage') {
      setFormData(prev => ({
        ...prev,
        mainImage: files[0]
      }));
    } else if (name === 'gallery') {
      setFormData(prev => ({
        ...prev,
        gallery: Array.from(files)
      }));
    }
  };

  const addDepartment = () => {
    if (newDepartment.trim()) {
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, { name: newDepartment, doctors: [] }]
      }));
      setNewDepartment('');
    }
  };

  const removeDepartment = (index) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== index)
    }));
  };

  const addDoctor = (deptIndex) => {
    if (newDoctor.name.trim()) {
      setFormData(prev => ({
        ...prev,
        departments: prev.departments.map((dept, index) => 
          index === deptIndex 
            ? { ...dept, doctors: [...dept.doctors, { ...newDoctor }] }
            : dept
        )
      }));
      setNewDoctor({ name: '', specialties: [] });
    }
  };

  const removeDoctor = (deptIndex, doctorIndex) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.map((dept, index) => 
        index === deptIndex 
          ? { ...dept, doctors: dept.doctors.filter((_, i) => i !== doctorIndex) }
          : dept
      )
    }));
  };

  const addSpecialty = (deptIndex, doctorIndex) => {
    if (newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        departments: prev.departments.map((dept, index) => 
          index === deptIndex 
            ? { 
                ...dept, 
                doctors: dept.doctors.map((doc, docIndex) => 
                  docIndex === doctorIndex 
                    ? { ...doc, specialties: [...doc.specialties, newSpecialty.trim()] }
                    : doc
                )
              }
            : dept
        )
      }));
      setNewSpecialty('');
    }
  };

  const addSpecialtyToNewDoctor = () => {
    if (newSpecialty.trim()) {
      setNewDoctor(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (deptIndex, doctorIndex, specialtyIndex) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.map((dept, index) => 
        index === deptIndex 
          ? { 
              ...dept, 
              doctors: dept.doctors.map((doc, docIndex) => 
                docIndex === doctorIndex 
                  ? { ...doc, specialties: doc.specialties.filter((_, i) => i !== specialtyIndex) }
                  : doc
              )
            }
          : dept
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'mainImage' && formData[key]) {
          formDataToSend.append('mainImage', formData[key]);
        } else if (key === 'gallery' && formData[key].length > 0) {
          formData[key].forEach(file => {
            formDataToSend.append('gallery', file);
          });
        } else if (key === 'departments') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'featureAndFacts' || key === 'faq') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'location' || key === 'sizeAndCapacity') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'clinicType' || key === 'typeOfCare' || key === 'ageGroup') {
          // Handle array fields
          if (Array.isArray(formData[key]) && formData[key].length > 0) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          }
        } else if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      await HospitalAPI.createHospital(formDataToSend);
      navigate('/hospitals');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="bg-white">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold text-black mb-0">Create New Hospital</h2>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/hospitals')}
            >
              <i className="fas fa-arrow-left me-2"></i>Back to Hospitals
            </button>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Basic Information</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hospital Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Founded Year</label>
                      <input
                        type="number"
                        className="form-control"
                        name="foundedYear"
                        value={formData.foundedYear}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Google Reviews Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        name="googleReviewsRating"
                        value={formData.googleReviewsRating}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">User Score (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="userScore"
                        value={formData.userScore}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Location</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Hospital Details</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Clinic Type</label>
                      <div className="border rounded p-3" style={{ minHeight: '120px', maxHeight: '120px', overflowY: 'auto' }}>
                        {['Public', 'Private', 'University', 'Research', 'Community', 'Specialty'].map((type) => (
                          <div key={type} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`clinicType-${type}`}
                              checked={formData.clinicType.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    clinicType: [...prev.clinicType, type]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    clinicType: prev.clinicType.filter(t => t !== type)
                                  }));
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor={`clinicType-${type}`}>
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Type of Care</label>
                      <div className="border rounded p-3" style={{ minHeight: '120px', maxHeight: '120px', overflowY: 'auto' }}>
                        {['General', 'Specialized', 'Emergency', 'Rehabilitation', 'Outpatient', 'Inpatient', 'Critical Care'].map((care) => (
                          <div key={care} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`typeOfCare-${care}`}
                              checked={formData.typeOfCare.includes(care)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    typeOfCare: [...prev.typeOfCare, care]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    typeOfCare: prev.typeOfCare.filter(t => t !== care)
                                  }));
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor={`typeOfCare-${care}`}>
                              {care}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Age Group</label>
                      <div className="border rounded p-3" style={{ minHeight: '120px', maxHeight: '120px', overflowY: 'auto' }}>
                        {[
                          { value: 'Pediatric', label: 'Pediatric (0-17)' },
                          { value: 'Adult', label: 'Adult (18-64)' },
                          { value: 'Geriatric', label: 'Geriatric (65+)' },
                          { value: 'All Ages', label: 'All Ages' },
                          { value: 'Neonatal', label: 'Neonatal (0-28 days)' },
                          { value: 'Infant', label: 'Infant (1-12 months)' }
                        ].map((age) => (
                          <div key={age.value} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`ageGroup-${age.value}`}
                              checked={formData.ageGroup.includes(age.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    ageGroup: [...prev.ageGroup, age.value]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    ageGroup: prev.ageGroup.filter(t => t !== age.value)
                                  }));
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor={`ageGroup-${age.value}`}>
                              {age.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Total Patients</label>
                      <input
                        type="number"
                        className="form-control"
                        name="totalPatients"
                        value={formData.totalPatients}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Total Units</label>
                      <input
                        type="number"
                        className="form-control"
                        name="totalUnits"
                        value={formData.totalUnits}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Primary Focus (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="primaryFocus"
                        value={formData.primaryFocus}
                        onChange={handleInputChange}
                        placeholder="e.g., Cardiology, Neurology, Oncology"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">About Hospital</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      placeholder="Describe the hospital..."
                    />
                  </div>
                </div>
              </div>

              {/* Size and Capacity */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Size and Capacity</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Operation Theatres</label>
                      <input
                        type="number"
                        className="form-control"
                        name="sizeAndCapacity.operationTheatres"
                        value={formData.sizeAndCapacity.operationTheatres}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ICUs</label>
                      <input
                        type="number"
                        className="form-control"
                        name="sizeAndCapacity.icus"
                        value={formData.sizeAndCapacity.icus}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Patient Beds</label>
                      <input
                        type="number"
                        className="form-control"
                        name="sizeAndCapacity.patientBeds"
                        value={formData.sizeAndCapacity.patientBeds}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Departments and Doctors */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Departments and Doctors</h5>
                </div>
                <div className="card-body">
                  {formData.departments.map((dept, deptIndex) => (
                    <div key={deptIndex} className="card mb-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Department {deptIndex + 1}</h6>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeDepartment(deptIndex)}
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Department Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Cardiology, Neurology"
                              value={dept.name}
                              onChange={(e) => {
                                const newDepartments = [...formData.departments];
                                newDepartments[deptIndex].name = e.target.value;
                                setFormData(prev => ({ ...prev, departments: newDepartments }));
                              }}
                            />
                          </div>
                        </div>

                        {/* Existing Doctors */}
                        {dept.doctors.length > 0 && (
                          <div className="mb-3">
                            <h6 className="mb-2">Doctors in this Department</h6>
                            {dept.doctors.map((doctor, doctorIndex) => (
                              <div key={doctorIndex} className="border rounded p-2 mb-2 bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="flex-grow-1">
                                    <strong>{doctor.name || 'Unnamed Doctor'}</strong>
                                    {doctor.specialties.length > 0 && (
                                      <div className="mt-1">
                                        {doctor.specialties.map((specialty, specIndex) => (
                                          <span key={specIndex} className="badge bg-primary me-1">
                                            {specialty}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeDoctor(deptIndex, doctorIndex)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add New Doctor */}
                        <div className="border rounded p-3 bg-light">
                          <h6 className="mb-3">Add New Doctor</h6>
                          <div className="row">
                            <div className="col-md-6 mb-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Doctor Name"
                                value={newDoctor.name}
                                onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="col-md-6 mb-2">
                              <div className="d-flex">
                                <input
                                  type="text"
                                  className="form-control me-2"
                                  placeholder="Add specialty"
                                  value={newSpecialty}
                                  onChange={(e) => setNewSpecialty(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addSpecialtyToNewDoctor();
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                  onClick={addSpecialtyToNewDoctor}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Show specialties being added */}
                          {newDoctor.specialties.length > 0 && (
                            <div className="mb-2">
                              <small className="text-muted">Specialties:</small>
                              <div className="d-flex flex-wrap gap-1">
                                {newDoctor.specialties.map((specialty, specIndex) => (
                                  <span key={specIndex} className="badge bg-secondary">
                                    {specialty}
                                    <button
                                      type="button"
                                      className="btn-close btn-close-white ms-1"
                                      onClick={() => {
                                        setNewDoctor(prev => ({
                                          ...prev,
                                          specialties: prev.specialties.filter((_, i) => i !== specIndex)
                                        }));
                                      }}
                                      style={{ fontSize: '0.7em' }}
                                    ></button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => addDoctor(deptIndex)}
                            disabled={!newDoctor.name.trim()}
                          >
                            <i className="fas fa-plus me-1"></i>Add Doctor
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Department */}
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-3">Add New Department</h6>
                      <div className="d-flex">
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder="Department name (e.g., Cardiology, Neurology)"
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addDepartment();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={addDepartment}
                          disabled={!newDepartment.trim()}
                        >
                          <i className="fas fa-plus me-1"></i>Add Department
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features & Facts */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Features & Facts</h5>
                </div>
                <div className="card-body">
                  {formData.featureAndFacts.map((item, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-5">
                            <label className="form-label">Title</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.title}
                              onChange={(e) => {
                                const list = [...formData.featureAndFacts];
                                list[index].title = e.target.value;
                                setFormData(prev => ({ ...prev, featureAndFacts: list }));
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Description</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.description}
                              onChange={(e) => {
                                const list = [...formData.featureAndFacts];
                                list[index].description = e.target.value;
                                setFormData(prev => ({ ...prev, featureAndFacts: list }));
                              }}
                            />
                          </div>
                          <div className="col-md-1 d-flex align-items-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger w-100"
                              onClick={() => setFormData(prev => ({ ...prev, featureAndFacts: prev.featureAndFacts.filter((_, i) => i !== index) }))}
                              disabled={formData.featureAndFacts.length === 1}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setFormData(prev => ({ ...prev, featureAndFacts: [...prev.featureAndFacts, { title: '', description: '' }] }))}
                  >
                    <i className="fas fa-plus me-1"></i>Add Feature/Fact
                  </button>
                </div>
              </div>

              {/* FAQ */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">FAQ</h5>
                </div>
                <div className="card-body">
                  {formData.faq.map((item, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-5">
                            <label className="form-label">Question</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.question}
                              onChange={(e) => {
                                const list = [...formData.faq];
                                list[index].question = e.target.value;
                                setFormData(prev => ({ ...prev, faq: list }));
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Answer</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.answer}
                              onChange={(e) => {
                                const list = [...formData.faq];
                                list[index].answer = e.target.value;
                                setFormData(prev => ({ ...prev, faq: list }));
                              }}
                            />
                          </div>
                          <div className="col-md-1 d-flex align-items-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger w-100"
                              onClick={() => setFormData(prev => ({ ...prev, faq: prev.faq.filter((_, i) => i !== index) }))}
                              disabled={formData.faq.length === 1}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setFormData(prev => ({ ...prev, faq: [...prev.faq, { question: '', answer: '' }] }))}
                  >
                    <i className="fas fa-plus me-1"></i>Add FAQ
                  </button>
                </div>
              </div>

              {/* Images */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Images</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Main Image</label>
                      <input
                        type="file"
                        className="form-control"
                        name="mainImage"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Gallery Images</label>
                      <input
                        type="file"
                        className="form-control"
                        name="gallery"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/hospitals')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Hospital'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHospital;
