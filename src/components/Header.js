import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hospitalsMenuOpen, setHospitalsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="top-bar d-none d-md-block">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 small">Caring Today for a Healthier Tomorrow and Forever</p>
            </div>
            <div className="col-md-6 text-end">
              <a href="/find-doctor" className="text-white text-decoration-none small">
                Find A Doctor <i className="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-6 col-md-4">
              <div className="brand-section d-flex align-items-center">
                <img 
                  src="/images.png" 
                  alt="AAROGYA GLOBAL Logo" 
                  className="logo-image"
                />
              </div>
            </div>
            
            <div className="col-md-8 d-none d-md-block">
              <div className="row">
                <div className="col-md-4">
                  <div className="contact-block">
                    <i className="fas fa-phone"></i>
                    <div>
                      <p className="contact-label">Emergency Line</p>
                      <p className="contact-value">+91 9876543212</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="contact-block">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <p className="contact-label">Support Email</p>
                      <p className="contact-value">support@aarogya.com</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="contact-block">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <p className="contact-label">Visit Us On</p>
                      <p className="contact-value">Innov8 Orchid Center India, 122001</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 d-md-none text-end">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <nav className="navbar navbar-expand-lg p-0">
                <div className="container-fluid p-0">
                  <div className="d-none d-lg-flex w-100">
                    <ul className="navbar-nav me-auto">
                      <li className="nav-item">
                        <a className="nav-link" href="/">
                          Home <i className="fas fa-plus"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/about">About</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/pages">
                          Pages <i className="fas fa-plus"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/doctors">
                          Doctors <i className="fas fa-plus"></i>
                        </a>
                      </li>
                      <li 
                        className="nav-item dropdown"
                        onMouseEnter={() => setHospitalsMenuOpen(true)}
                        onMouseLeave={() => setHospitalsMenuOpen(false)}
                      >
                        <a className="nav-link dropdown-toggle active" href="/hospitals" role="button">
                          Hospitals
                        </a>
                        <ul className={`dropdown-menu ${hospitalsMenuOpen ? 'show' : ''}`}>
                          <li><a className="dropdown-item" href="/hospitals/create">Create Hospital</a></li>
                          <li><a className="dropdown-item" href="/hospitals/table">Hospital Table</a></li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/blog">
                          Blog <i className="fas fa-plus"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/contact">Contact</a>
                      </li>
                    </ul>
                    <div className="d-flex align-items-center">
                      <a href="/login" className="login-link me-3">
                        <i className="fas fa-user me-1"></i> Login/Register
                      </a>
                      <a href="/appointment" className="appointment-btn">
                        Make An Appointment <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>

                  <div className={`d-lg-none w-100 ${isMenuOpen ? 'd-block' : 'd-none'}`}>
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <a className="nav-link" href="/">
                          Home <i className="fas fa-plus"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/about">About</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/pages">
                          Pages <i className="fas fa-plus"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/doctors">
                          Doctors <i className="fas fa-plus"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link active" href="/hospitals">
                          Hospitals
                        </a>
                      </li>
                      <li className="nav-item ps-3">
                        <a className="nav-link" href="/hospitals/create">Create Hospital</a>
                      </li>
                      <li className="nav-item ps-3">
                        <a className="nav-link" href="/hospitals/table">Hospital Table</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/blog">
                          Blog <i className="fas fa-plus"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/contact">Contact</a>
                      </li>
                    </ul>
                    <div className="d-flex flex-column gap-2 mt-3">
                      <a href="/login" className="btn btn-outline-primary">
                        <i className="fas fa-user me-1"></i> Login/Register
                      </a>
                      <a href="/appointment" className="btn btn-success">
                        Make An Appointment <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
