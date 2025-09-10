import React from "react";

const Footer = () => {
	return (
		<footer className="footer-main">
			<div className="footer-container">
				<div className="footer-contact-bar">
					<div className="container">
						<div className="row justify-content-center">
							<div className="col-12 col-sm-6 col-md-4 mb-3 mb-md-0">
								<div className="footer-contact-block">
									<div className="contact-icon">
										<i className="fas fa-phone"></i>
									</div>
									<div className="contact-text">
										<p className="footer-contact-label">Emergency Line</p>
										<p className="footer-contact-value">+91 9876543212</p>
									</div>
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-4 mb-3 mb-md-0">
								<div className="footer-contact-block">
									<div className="contact-icon">
										<i className="fas fa-envelope"></i>
									</div>
									<div className="contact-text">
										<p className="footer-contact-label">Support Email</p>
										<p className="footer-contact-value">support@aarogya.com</p>
									</div>
								</div>
							</div>
							<div className="col-12 col-sm-12 col-md-4">
								<div className="footer-contact-block">
									<div className="contact-icon">
										<i className="fas fa-map-marker-alt"></i>
									</div>
									<div className="contact-text">
										<p className="footer-contact-label">Visit Us On</p>
										<p className="footer-contact-value">
											Innov8 Orchid Center India, 122001
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="footer-content">
					<div className="container">
						<div className="row">
							<div className="col-12 col-md-6 col-lg-3 mb-4">
								<div className="footer-brand">
									<div className="footer-logo mb-3">
										<img
											src="/images.png"
											alt="AAROGYA GLOBAL Logo"
											className="footer-logo-image"
										/>
									</div>
									<p className="footer-description">
										We strive to create a welcoming environment where patients
										feel valued respected and well informed about their health
									</p>
									<div className="social-section">
										<span className="follow-text">Follow Us:</span>
										<div className="social-icons">
											<a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
												<i className="fab fa-facebook-f"></i>
											</a>
											<a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
												<i className="fab fa-twitter"></i>
											</a>
											<a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
												<i className="fab fa-instagram"></i>
											</a>
											<a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">
												<i className="fab fa-linkedin-in"></i>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div className="col-6 col-md-6 col-lg-2 mb-4">
								<div className="footer-links">
									<h6 className="footer-heading">Quick Links</h6>
									<ul className="footer-list">
										<li>
											<a href="/medical-directory">Medical Directory</a>
										</li>
										<li>
											<a href="/top-doctors">Top Doctors</a>
										</li>
										<li>
											<a href="/latest-news">Latest News</a>
										</li>
										<li>
											<a href="/why-choose-us">Why Choose Us</a>
										</li>
										<li>
											<a href="/contact">Contact</a>
										</li>
									</ul>
								</div>
							</div>

							<div className="col-6 col-md-6 col-lg-2 mb-4">
								<div className="footer-links">
									<h6 className="footer-heading">Useful Links</h6>
									<ul className="footer-list">
										<li>
											<a href="/featured-hospitals">Featured Hospitals</a>
										</li>
										<li>
											<a href="/how-it-works">How It Works</a>
										</li>
										<li>
											<a href="/treatments-specialties">Treatments & Specialties</a>
										</li>
										<li>
											<a href="/doctors-search">Doctors Search</a>
										</li>
										<li>
											<a href="/chat-bot">Chat Bot</a>
										</li>
									</ul>
								</div>
							</div>

							<div className="col-12 col-md-12 col-lg-5 mb-4">
								<div className="newsletter-section">
									<h6 className="footer-heading">Subscribe Newsletter</h6>
									<p className="newsletter-description">
										Sign up for our newsletter to latest weekly updates & news
									</p>
									<div className="newsletter-form">
										<input
											type="email"
											className="newsletter-input"
											placeholder="Enter your email"
										/>
										<button className="newsletter-btn">
											<i className="fas fa-paper-plane"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="footer-bottom">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-12 col-md-6 mb-2 mb-md-0">
							<p className="mb-0 text-center text-md-start">&copy; aarogyaglobal.com</p>
						</div>
						<div className="col-12 col-md-6">
							<div className="footer-bottom-links d-flex justify-content-center justify-content-md-end">
								<a href="/privacy-policy">Privacy Policy</a>
								<span className="footer-dot"></span>
								<a href="/terms-conditions">Terms & Conditions</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
