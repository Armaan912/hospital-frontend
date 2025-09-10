import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import HospitalAPI from "../services/api";
import SpecialitiesTab from "../components/tabs/SpecialitiesTab";
import FeaturesTab from "../components/tabs/FeaturesTab";
import AboutTab from "../components/tabs/AboutTab";
import DoctorsTab from "../components/tabs/DoctorsTab";
import GalleryTab from "../components/tabs/GalleryTab";
import ReviewsTab from "../components/tabs/ReviewsTab";
import LocationTab from "../components/tabs/LocationTab";

const HospitalDetail = () => {
	const { id } = useParams();
	const [hospital, setHospital] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("Overview");
	const [expandedFeatures, setExpandedFeatures] = useState({});
	const [similarHospitals, setSimilarHospitals] = useState([]);

	const fetchHospital = useCallback(async () => {
		try {
			setLoading(true);
			const data = await HospitalAPI.getHospitalById(id, "details");
			setHospital(data.hospital);

			// Fetch similar hospitals
			await fetchSimilarHospitals();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchHospital();
	}, [fetchHospital]);

	const fetchSimilarHospitals = async () => {
		try {
			const data = await HospitalAPI.getHospitals();

			// Check if data.hospitals exists, if not use data directly
			const hospitals = data.hospitals || data || [];

			// Filter out the current hospital and get first 4 others
			const similar = hospitals.filter((h) => h._id !== id).slice(0, 4);

			setSimilarHospitals(similar);
		} catch (err) {
			console.error("Error fetching similar hospitals:", err);
			// Set fallback data if API fails
			setSimilarHospitals([
				{
					_id: "1",
					name: "University Hospital Munich",
					rating: "9.90",
					mainImage: null
				},
				{
					_id: "2",
					name: "University Hospital Frankfurt",
					rating: "9.85",
					mainImage: null
				},
				{ _id: "3", name: "Beta Clinic Bonn", rating: "9.80", mainImage: null },
				{
					_id: "4",
					name: "Helios Hospital Berlin",
					rating: "9.75",
					mainImage: null
				}
			]);
		}
	};

	const toggleFeature = (index) => {
		setExpandedFeatures((prev) => ({
			...prev,
			[index]: !prev[index]
		}));
	};

	const handleTabClick = (tab) => {
		setActiveTab(tab);
	};

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

	if (!hospital) {
		return (
			<div className="container mt-5">
				<div className="alert alert-warning" role="alert">
					Hospital not found.
				</div>
			</div>
		);
	}

	const features =
		Array.isArray(hospital?.featureAndFacts) &&
		hospital.featureAndFacts.length > 0
			? hospital.featureAndFacts
			: [
					{
						title: "Proton beams for eye cancer",
						description:
							"The clinic achieved a milestone by curing its 3,000th eye cancer patient using proton therapy. This treatment involves using protons to target the tumor while minimizing damage to healthy surrounding tissue."
					},
					{
						title: "The heart of scientific research",
						description:
							"Leading medical research facility with cutting-edge technology and innovative treatments."
					},
					{
						title: "Over 800 clinical trials annually",
						description:
							"Conducting extensive clinical research to advance medical knowledge and patient care."
					},
					{
						title: "Revolutionary achievements",
						description:
							"Pioneering medical breakthroughs and innovative treatment methods."
					},
					{
						title: "900 cured stroke patients annually",
						description:
							"Specialized stroke treatment program with exceptional recovery rates."
					}
			  ];

	// Departments will be used from hospital.departments

	return (
		<div className="container-fluid px-0">
			{/* Header Section with Gallery */}
			<div className="bg-white">
				<div className="container py-4">
					<h3 className="display-7 fw-bold text-black mb-4">{hospital.name}</h3>

					{/* Gallery Section */}
					<div className="row g-3 mb-4">
						{/* Large main image on the left */}
						<div className="col-lg-8">
							<div className="position-relative">
								<img
									src={
										hospital.mainImage
											? hospital.mainImage.startsWith("http")
												? hospital.mainImage
												: `hospital-backend-elzv.onrender.com/api${hospital.mainImage}`
											: hospital.gallery && hospital.gallery[0]
											? hospital.gallery[0].startsWith("http")
												? hospital.gallery[0]
												: `hospital-backend-elzv.onrender.com/api${hospital.gallery[0]}`
											: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop&crop=center"
									}
									className="img-fluid rounded"
									alt="Main hospital view"
									style={{ height: "400px", objectFit: "cover", width: "100%" }}
									onError={(e) => {
										e.target.src =
											"https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop&crop=center&random=" +
											Math.random();
									}}
								/>
								{/* Rating badge */}
								{hospital.rating && (
									<div className="position-absolute top-0 start-0 m-3">
										<span
											className="badge"
											style={{
												backgroundColor: "#fbbf24",
												color: "#1f2937",
												fontSize: "0.9rem",
												padding: "8px 12px"
											}}
										>
											⭐ {hospital.rating}
										</span>
									</div>
								)}
								{/* Location pin */}
								<div className="position-absolute bottom-0 start-0 m-3">
									<div className="bg-white rounded p-2 shadow-sm">
										<i className="fas fa-map-marker-alt text-primary"></i>
									</div>
								</div>
							</div>
						</div>

						{/* 2x2 grid of smaller images on the right */}
						<div className="col-lg-4">
							<div className="row g-2 h-100">
								{hospital.gallery && hospital.gallery.length > 1
									? hospital.gallery.slice(1, 5).map((image, index) => (
											<div key={index} className="col-6">
												<div className="position-relative h-100">
													<img
														src={
															image.startsWith("http")
																? image
																: `https://hospital-backend-elzv.onrender.com/${image}`
														}
														className="img-fluid rounded"
														alt={`Gallery ${index + 2}`}
														style={{
															height: "190px",
															objectFit: "cover",
															width: "100%"
														}}
														onError={(e) => {
															e.currentTarget.style.display = "none";
														}}
													/>
													{/* Gallery count badge on the last image */}
													{index === 3 && hospital.gallery.length > 5 && (
														<div className="position-absolute bottom-0 end-0 m-2">
															<span
																className="badge bg-white text-dark shadow-sm"
																style={{ fontSize: "0.8rem" }}
															>
																<i className="fas fa-images me-1"></i>+
																{hospital.gallery.length - 5}
															</span>
														</div>
													)}
												</div>
											</div>
										))
									: null}
							</div>
						</div>
					</div>

					{/* Navigation Tabs */}
					<div
						className="nav nav-pills nav-fill rounded-pill p-2"
						style={{ backgroundColor: "#dcf8ec" }}
					>
						{[
							"Overview",
							"Specialities",
							"Features",
							"About",
							"Doctors",
							"Gallery",
							"Reviews",
							"Location"
						].map((tab) => (
							<button
								key={tab}
								className={`nav-link hospital-tab ${
									activeTab === tab ? "active" : ""
								}`}
								style={{
									backgroundColor:
										activeTab === tab ? "#03cd77" : "transparent",
									color: activeTab === tab ? "white" : "#212529",
									borderRadius: "20px",
									margin: "0 2px",
									border: "none",
									padding: "8px 16px"
								}}
								onClick={() => handleTabClick(tab)}
							>
								{tab}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container py-4">
				<div className="row">
					{/* Left Column */}
					<div className="col-lg-8">
						{/* Overview Section - Shows Everything */}
						{activeTab === "Overview" && (
							<div>
								<h2 className="h3 fw-bold text-dark mb-4">Overview</h2>

								{/* Statistics Cards */}
								<div className="row mb-4">
									<div className="col-md-3 mb-3">
										<div
											className="border-0 shadow-sm"
											style={{
												backgroundColor: "#f6f6f6",
												height: "80px",
												padding: "0",
												borderRadius: "8px"
											}}
										>
											<div
												className="d-flex justify-content-center align-items-center"
												style={{ height: "100%", padding: "20px" }}
											>
												<i className="far fa-star text-success fa-2x me-3"></i>
												<h6 className="mb-0 fw-bold">
													{hospital.userScore
														? `${hospital.userScore}% UserScore`
														: "N/A UserScore"}
												</h6>
											</div>
										</div>
									</div>
									<div className="col-md-3 mb-3">
										<div
											className="border-0 shadow-sm"
											style={{
												backgroundColor: "#f6f6f6",
												height: "80px",
												padding: "0",
												borderRadius: "8px"
											}}
										>
											<div
												className="d-flex justify-content-center align-items-center"
												style={{ height: "100%", padding: "20px" }}
											>
												<i className="fas fa-cut text-success fa-2x me-3"></i>
												<h6 className="mb-0 fw-bold">
													{hospital.foundedYear
														? `Founded in ${hospital.foundedYear}`
														: "Founded year N/A"}
												</h6>
											</div>
										</div>
									</div>
									<div className="col-md-3 mb-3">
										<div
											className="border-0 shadow-sm"
											style={{
												backgroundColor: "#f6f6f6",
												height: "80px",
												padding: "0",
												borderRadius: "8px"
											}}
										>
											<div
												className="d-flex justify-content-center align-items-center"
												style={{ height: "100%", padding: "20px" }}
											>
												<i className="fas fa-users text-success fa-2x me-3"></i>
												<h6 className="mb-0 fw-bold">
													{hospital.totalPatients
														? `${hospital.totalPatients.toLocaleString()} patients`
														: "0 patients"}
												</h6>
											</div>
										</div>
									</div>
									<div className="col-md-3 mb-3">
										<div
											className="border-0 shadow-sm"
											style={{
												backgroundColor: "#f6f6f6",
												height: "80px",
												padding: "0",
												borderRadius: "8px"
											}}
										>
											<div
												className="d-flex justify-content-center align-items-center"
												style={{ height: "100%", padding: "20px" }}
											>
												<i className="fas fa-sitemap text-success fa-2x me-3"></i>
												<h6 className="mb-0 fw-bold">
													{hospital.totalUnits
														? `${hospital.totalUnits} units`
														: "0 units"}
												</h6>
											</div>
										</div>
									</div>
								</div>

								{/* Detailed Information */}
								<div className="mb-5">
									<ul className="list-unstyled">
										<li className="mb-4 d-flex align-items-start">
											<div
												className="me-3 d-flex align-items-center justify-content-center"
												style={{
													width: "40px",
													height: "40px",
													backgroundColor: "#f8f9fa",
													borderRadius: "6px"
												}}
											>
												<i
													className="fas fa-bed text-dark"
													style={{ fontSize: "18px" }}
												></i>
											</div>
											<div>
												<div className="fw-bold text-dark">Size & Capacity</div>
												<div className="text-muted">
													OT: {hospital.sizeAndCapacity?.operationTheatres || 0}
													, ICU: {hospital.sizeAndCapacity?.icus || 0}, Patient
													Beds: {hospital.sizeAndCapacity?.patientBeds || 0}+
												</div>
											</div>
										</li>
										<li className="mb-4 d-flex align-items-start">
											<div
												className="me-3 d-flex align-items-center justify-content-center"
												style={{
													width: "40px",
													height: "40px",
													backgroundColor: "#f8f9fa",
													borderRadius: "6px"
												}}
											>
												<i
													className="fas fa-building text-dark"
													style={{ fontSize: "18px" }}
												></i>
											</div>
											<div>
												<div className="fw-bold text-dark">Clinic type</div>
												<div className="text-muted">
													{hospital.clinicType || "Not specified"}
												</div>
											</div>
										</li>
										<li className="mb-4 d-flex align-items-start">
											<div
												className="me-3 d-flex align-items-center justify-content-center"
												style={{
													width: "40px",
													height: "40px",
													backgroundColor: "#f8f9fa",
													borderRadius: "6px"
												}}
											>
												<i
													className="fas fa-plus-circle text-dark"
													style={{ fontSize: "18px" }}
												></i>
											</div>
											<div>
												<div className="fw-bold text-dark">Type of care</div>
												<div className="text-muted">
													{hospital.typeOfCare || "Not specified"}
												</div>
											</div>
										</li>
										<li className="mb-4 d-flex align-items-start">
											<div
												className="me-3 d-flex align-items-center justify-content-center"
												style={{
													width: "40px",
													height: "40px",
													backgroundColor: "#f8f9fa",
													borderRadius: "6px"
												}}
											>
												<i
													className="fas fa-users text-dark"
													style={{ fontSize: "18px" }}
												></i>
											</div>
											<div>
												<div className="fw-bold text-dark">Age group</div>
												<div className="text-muted">
													{hospital.ageGroup || "Not specified"}
												</div>
											</div>
										</li>
										{hospital.googleReviewsRating && (
											<li className="mb-4 d-flex align-items-start">
												<div
													className="me-3 d-flex align-items-center justify-content-center"
													style={{
														width: "40px",
														height: "40px",
														backgroundColor: "#f8f9fa",
														borderRadius: "6px"
													}}
												>
													<i
														className="fab fa-google text-dark"
														style={{ fontSize: "18px" }}
													></i>
												</div>
												<div>
													<div className="fw-bold text-dark">
														{hospital.googleReviewsRating}/5 on Google
													</div>
													<small className="text-muted">
														Google Reviews Rating
													</small>
												</div>
											</li>
										)}
									</ul>
								</div>

								{/* Certificates Section */}
								<div className="mb-5">
									<h3 className="h4 fw-bold text-black mb-3">
										Certificates{" "}
										<i className="fas fa-info-circle text-muted"></i>
									</h3>
									<div className="d-flex overflow-auto">
										{[
											{
												name: "Clean Hands Count",
												image: "/certificates/Clean-Hands-Count-Hand.jpg"
											},
											{ name: "DKG", image: "/certificates/images.png" },
											{ name: "CERT", image: "/certificates/images.jfif" },
											{ name: "DGAKI", image: "/certificates/images (1).jfif" },
											{
												name: "ENETS",
												image: "/certificates/EANM_Master-Logo.jpg"
											},
											{
												name: "Leading Medicine Guide",
												image: "/certificates/leading-medicine-guide.png"
											}
										].map((cert, index) => (
											<div key={index} className="flex-shrink-0 me-3">
												<img
													src={cert.image}
													alt={cert.name}
													className="img-fluid"
													style={{
														width: "120px",
														height: "80px",
														objectFit: "contain"
													}}
												/>
											</div>
										))}
										<div className="flex-shrink-0 pt-3">
											<button className="btn btn-outline-secondary">
												<i className="fas fa-arrow-right"></i>
											</button>
										</div>
									</div>
								</div>

								{/* Features & Facts Section */}
								<div className="mb-4">
									<h3 className="h4 fw-bold text-dark mb-3">
										Features & Facts
									</h3>
									<div className="accordion" id="featuresAccordion">
										{features.map((feature, index) => (
											<div
												key={index}
												className="mb-2"
												style={{
													backgroundColor: "white",
													borderRadius: "8px",
													border: "1px solid #e9ecef",
													overflow: "hidden"
												}}
											>
												<div
													className="d-flex align-items-center"
													style={{
														backgroundColor: "white",
														color: expandedFeatures[index]
															? "#20c997"
															: "#212529",
														padding: "16px 20px",
														fontSize: "0.95rem",
														fontWeight: "500",
														cursor: "pointer",
														borderBottom: expandedFeatures[index]
															? "1px solid #e9ecef"
															: "none"
													}}
													onClick={() => toggleFeature(index)}
												>
													<i
														className="fas fa-lightbulb me-3"
														style={{
															color: expandedFeatures[index]
																? "#20c997"
																: "#6c757d"
														}}
													></i>
													{feature.title}
													<div className="ms-auto">
														<i
															className={`fas ${
																expandedFeatures[index] ? "fa-minus" : "fa-plus"
															}`}
															style={{
																color: "#6c757d"
															}}
														></i>
													</div>
												</div>
												{expandedFeatures[index] && (
													<div
														style={{
															padding: "0 20px 20px 20px",
															color: "#495057",
															fontSize: "0.9rem",
															lineHeight: "1.5"
														}}
													>
														{feature.description}
													</div>
												)}
											</div>
										))}
									</div>
								</div>

								{/* About Section */}
								<div className="mt-5">
									<h2 className="h3 fw-bold text-black mb-4">
										About the clinic
									</h2>
									<p className="mb-3">
										{hospital.about ||
											"No description available for this hospital."}
									</p>
									{hospital.about && (
										<button className="btn btn-link text-black text-decoration-none fw-medium p-0">
											Read more &gt;
										</button>
									)}
								</div>

								{/* Specialities Section */}
								<div className="mt-5">
									<h2 className="h3 fw-bold text-black mb-4">Primary Focus</h2>
									<div className="d-flex flex-wrap gap-2">
										{hospital.primaryFocus ? (
											hospital.primaryFocus.split(",").map((focus, index) => (
												<span
													key={index}
													className="badge bg-light text-dark border px-3 py-2"
												>
													{focus.trim()}
												</span>
											))
										) : (
											<p className="text-muted">No primary focus specified</p>
										)}
									</div>
								</div>

								{/* Doctors Section */}
								<div className="mt-5">
									<h2 className="h3 fw-bold text-black mb-4">
										Departments & Doctors
									</h2>
									<div className="accordion" id="departmentsAccordion">
										{hospital.departments && hospital.departments.length > 0 ? (
											hospital.departments.map((dept, index) => (
												<div
													key={index}
													className="mb-2"
													style={{
														backgroundColor: "white",
														borderRadius: "8px",
														border: "1px solid #e9ecef",
														overflow: "hidden"
													}}
												>
													<div
														className="d-flex align-items-center"
														style={{
															backgroundColor: "white",
															color: expandedFeatures[index]
																? "#20c997"
																: "#212529",
															padding: "16px 20px",
															fontSize: "0.95rem",
															fontWeight: "500",
															cursor: "pointer",
															borderBottom: expandedFeatures[index]
																? "1px solid #e9ecef"
																: "none"
														}}
														onClick={() => toggleFeature(index)}
													>
														<i
															className="fas fa-sitemap me-3"
															style={{
																color: expandedFeatures[index]
																	? "#20c997"
																	: "#6c757d"
															}}
														></i>
														{dept.name}
														<div className="ms-auto">
															<i
																className={`fas ${
																	expandedFeatures[index]
																		? "fa-minus"
																		: "fa-plus"
																}`}
																style={{
																	color: "#6c757d"
																}}
															></i>
														</div>
													</div>
													{expandedFeatures[index] &&
														dept.doctors &&
														dept.doctors.length > 0 && (
															<div
																style={{
																	padding: "0 20px 20px 20px",
																	color: "#495057",
																	fontSize: "0.9rem",
																	lineHeight: "1.5"
																}}
															>
																{dept.doctors.map((doctor, docIndex) => (
																	<div
																		key={docIndex}
																		className="d-flex align-items-center mb-3"
																	>
																		<div
																			className="rounded-circle me-3 d-flex align-items-center justify-content-center bg-primary text-white"
																			style={{ width: "60px", height: "60px" }}
																		>
																			<span className="fw-bold">
																				{doctor.name
																					? doctor.name.charAt(0)
																					: "D"}
																			</span>
																		</div>
																		<div>
																			<h6 className="mb-1">
																				{doctor.name || "Doctor Name"}{" "}
																				<i className="fas fa-external-link-alt text-muted"></i>
																			</h6>
																			<small className="text-muted">
																				{doctor.specialties
																					? doctor.specialties.join(", ")
																					: "Specialties not specified"}
																			</small>
																		</div>
																	</div>
																))}
															</div>
														)}
												</div>
											))
										) : (
											<div className="text-center py-4">
												<p className="text-muted">
													No departments available for this hospital.
												</p>
											</div>
										)}
									</div>
									<div className="text-center mt-3">
										<button className="btn btn-outline-secondary">
											Show more
										</button>
									</div>
								</div>

								{/* Gallery Section */}
								<div className="mt-5">
									<h2 className="h3 fw-bold text-black mb-3">
										Gallery <i className="fas fa-info-circle text-muted"></i>
									</h2>

									{/* Gallery Grid */}
									<div className="row g-3">
										{hospital.gallery && hospital.gallery.length > 0
											? hospital.gallery.slice(0, 6).map((image, index) => (
													<div key={index} className="col-md-4">
														<div className="position-relative">
															<img
																src={
																	image.startsWith("http")
																		? image
																		: `hospital-backend-elzv.onrender.com/api${image}`
																}
																className="img-fluid rounded"
																alt={`Gallery ${index + 1}`}
																style={{
																	height: "200px",
																	objectFit: "cover",
																	width: "100%"
																}}
																onError={(e) => { e.currentTarget.style.display = "none"; }}
															/>
															<div className="position-absolute bottom-0 start-0 m-2">
																<i className="fas fa-camera text-white"></i>
															</div>
														</div>
													</div>
											  ))
											: // Fallback if no gallery images
											  Array.from({ length: 6 }).map((_, index) => (
													<div key={index} className="col-md-4">
														<div
															className="bg-light rounded d-flex align-items-center justify-content-center"
															style={{ height: "200px" }}
														>
															<div className="text-center">
																<i className="fas fa-image text-muted fa-3x mb-2"></i>
																<p className="text-muted">No Image</p>
															</div>
														</div>
													</div>
											  ))}
									</div>
									<div className="text-center mt-3">
										<button className="btn btn-outline-secondary">
											Show more
										</button>
									</div>
								</div>

								{/* Reviews Section */}
								<div className="mt-5">
									<h2 className="h3 fw-bold text-black mb-3">
										Reviews <i className="fas fa-info-circle text-muted"></i>
									</h2>

									{[
										{
											name: "Ngong Shansline Techuoc",
											initials: "N",
											date: "17 September, 2023",
											rating: 5,
											verified: false
										},
										{
											name: "Karl Sting",
											initials: "K",
											date: "5 June, 2023",
											rating: 5,
											verified: true
										},
										{
											name: "Patricia Severs",
											initials: "P",
											date: "11 February, 2023",
											rating: 5,
											verified: true,
											review:
												"I recently had a brain surgery in Germany, and I couldn't be happier with the experience. The medical team was exceptionally skilled and attentive, and the facility was top-notch. My recovery has been smooth, and I'm grateful for the excellent care I received."
										}
									].map((review, index) => (
										<div
											key={index}
											className="border-0 bg-light mb-2 shadow-sm"
											style={{ borderRadius: "8px" }}
										>
											<div
												className={`card-body ${
													review.review ? "p-3" : "py-1 px-3"
												}`}
												style={{ minHeight: review.review ? "auto" : "60px" }}
											>
												<div className="d-flex align-items-center">
													<div
														className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
															index === 0 ? "bg-primary" : "bg-danger"
														}`}
														style={{
															width: "40px",
															height: "40px",
															minWidth: "40px",
															minHeight: "40px",
															flexShrink: 0
														}}
													>
														<span className="text-white fw-bold">
															{review.initials}
														</span>
													</div>
													<div className="flex-grow-1">
														<div className="d-flex justify-content-between align-items-center">
															<div>
																<h6 className="mb-0 fw-bold text-dark">
																	{review.name}
																</h6>
																<small className="text-muted">
																	{review.date}
																</small>
															</div>
															<div className="d-flex flex-column align-items-end">
																<div className="mb-1">
																	{[...Array(5)].map((_, i) => (
																		<i
																			key={i}
																			className={`fas fa-star ${
																				i < review.rating
																					? "text-warning"
																					: "text-muted"
																			}`}
																		></i>
																	))}
																</div>
																<div className="d-flex align-items-center">
																	{review.verified && (
																		<span
																			className="badge bg-primary me-2"
																			style={{ fontSize: "0.75rem" }}
																		>
																			verified
																		</span>
																	)}
																	<i className="fas fa-user text-muted"></i>
																</div>
															</div>
														</div>
														{review.review && (
															<p className="mb-0 text-dark mt-2">
																{review.review}
															</p>
														)}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Features Section */}
								<div className="mt-5">
									<h2 className="h3 fw-bold text-black mb-4">Extra Services</h2>
									<div className="row">
										{[
											{ name: "Visa Support", icon: "fas fa-passport" },
											{ name: "Pastoral Care", icon: "fas fa-church" },
											{ name: "On-Site Pharmacy", icon: "fas fa-pills" },
											{ name: "Parking Space", icon: "fas fa-parking" },
											{ name: "Intensive Care Unit", icon: "fas fa-bed" },
											{ name: "+5 services", icon: "fas fa-plus" }
										].map((service, index) => (
											<div key={index} className="col-md-6 mb-3">
												<div className="d-flex align-items-center">
													<i
														className={`${service.icon} text-black me-3 fa-lg`}
													></i>
													<span>{service.name}</span>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Location Section */}
								<div className="mt-5">
									<h2 className="h3 fw-bold text-black mb-3">Location</h2>
									<p className="mb-3">
										{hospital.location?.city &&
										hospital.location?.state &&
										hospital.location?.country
											? `${hospital.location.city}, ${hospital.location.state}, ${hospital.location.country}`
											: hospital.location?.city && hospital.location?.country
											? `${hospital.location.city}, ${hospital.location.country}`
											: hospital.location?.city ||
											  hospital.location?.state ||
											  hospital.location?.country
											? Object.values(hospital.location)
													.filter(Boolean)
													.join(", ")
											: "Location not specified"}
									</p>

									{/* Map Placeholder */}
									<div
										className="bg-light rounded d-flex align-items-center justify-content-center mb-4"
										style={{ height: "400px" }}
									>
										<div className="text-center">
											<i className="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
											<p className="text-muted">Interactive Map</p>
											<small className="text-muted">View larger map</small>
										</div>
									</div>

									{/* FAQ Section */}
									<div className="mt-5">
										<h3 className="h4 fw-bold text-black mb-3">FAQ</h3>
										<div className="accordion" id="faqAccordion">
											{(Array.isArray(hospital?.faq) && hospital.faq.length > 0
												? hospital.faq
												: [
														{
															question:
																"What is the therapeutic range of the Charite University Hospital?",
															answer:
																"The clinic offers various medical services in general and visceral surgery, neurosurgery, transplantology, primary therapy, allergology, endocrinology, ophthalmology, and otorhinolaryngology. The center pays the most attention to tumors and neurological diseases."
														},
														{
															question: "Can I get an artificial knee joint?",
															answer:
																"Yes, our orthopedic department specializes in joint replacement surgeries including artificial knee joints."
														},
														{
															question:
																"Does the clinic have a radiation oncology department?",
															answer:
																"Yes, we have a comprehensive radiation oncology department with state-of-the-art equipment."
														}
												  ]
											).map((faq, index) => (
												<div
													key={index}
													className="mb-2"
													style={{
														backgroundColor: "white",
														borderRadius: "8px",
														border: "1px solid #e9ecef",
														overflow: "hidden"
													}}
												>
													<div
														className="d-flex align-items-center"
														style={{
															backgroundColor: "white",
															color: expandedFeatures[index + 10]
																? "#20c997"
																: "#212529",
															padding: "16px 20px",
															fontSize: "0.95rem",
															fontWeight: "500",
															cursor: "pointer",
															borderBottom: expandedFeatures[index + 10]
																? "1px solid #e9ecef"
																: "none"
														}}
														onClick={() => toggleFeature(index + 10)}
													>
														{faq.question}
														<div className="ms-auto">
															<i
																className={`fas ${
																	expandedFeatures[index + 10]
																		? "fa-minus"
																		: "fa-plus"
																}`}
																style={{
																	color: "#6c757d"
																}}
															></i>
														</div>
													</div>
													{expandedFeatures[index + 10] && (
														<div
															style={{
																padding: "0 20px 20px 20px",
																color: "#495057",
																fontSize: "0.9rem",
																lineHeight: "1.5",
																backgroundColor: "white"
															}}
														>
															{faq.answer}
														</div>
													)}
												</div>
											))}
										</div>
										<div className="mt-3">
											<button className="btn btn-link text-primary p-0 text-decoration-none">
												Show more
											</button>
										</div>
									</div>

									{/* Footer */}
									<div className="mt-5 pt-4 border-top">
										<p className="text-muted small">
											© University Hospital Charite Berlin
										</p>
										<nav aria-label="breadcrumb">
											<ol className="breadcrumb">
												<li className="breadcrumb-item">
													<button className="btn btn-link text-decoration-none p-0">
														Home
													</button>
												</li>
												<li className="breadcrumb-item">
													<button className="btn btn-link text-decoration-none p-0">
														Hospitals
													</button>
												</li>
												<li className="breadcrumb-item active">
													University Hospital Charite Berlin
												</li>
											</ol>
										</nav>
									</div>
								</div>
							</div>
						)}

						{/* Individual Tabs */}
						{/* Specialities Tab */}
						{activeTab === "Specialities" && (
							<SpecialitiesTab hospital={hospital} />
						)}

						{/* Features Tab */}
						{activeTab === "Features" && <FeaturesTab />}

						{/* About Tab */}
						{activeTab === "About" && <AboutTab hospital={hospital} />}

						{/* Doctors Tab */}
						{activeTab === "Doctors" && <DoctorsTab hospital={hospital} />}

						{/* Gallery Tab */}
						{activeTab === "Gallery" && <GalleryTab hospital={hospital} />}

						{/* Reviews Tab */}
						{activeTab === "Reviews" && <ReviewsTab />}

						{/* Location Tab */}
						{activeTab === "Location" && <LocationTab hospital={hospital} />}
					</div>

					{/* Right Sidebar */}
					<div className="col-lg-4">
						{/* Contact Card Container */}
						<div
							className="card border-0 mb-4 shadow-sm mx-auto"
							style={{
								backgroundColor: "white",
								borderRadius: "12px",
								padding: "20px",
								maxWidth: "360px"
							}}
						>
							<div
								className="card border-0 shadow-sm"
								style={{ borderRadius: "12px", overflow: "hidden" }}
							>
								<img
									src="/group-young-doctors-white-coats-posing-hospital.jpg"
									alt="Medical Team"
									className="img-fluid"
									style={{ width: "100%", height: "280px", objectFit: "cover" }}
								/>
								<div
									className="p-4 text-center"
									style={{ backgroundColor: "#000c44" }}
								>
									<div className="mb-3">
										<img
											src="/logo.png"
											alt="Logo"
											style={{
												width: "50px",
												height: "50px",
												objectFit: "contain"
											}}
										/>
									</div>
									<h5
										className="card-title text-white mb-2"
										style={{ fontSize: "1rem", fontWeight: "bold" }}
									>
										For Any Service to Contact us
									</h5>
									<p
										className="card-text text-white mb-3"
										style={{ fontSize: "0.85rem" }}
									>
										If you need any help please feel free to contact us
									</p>
									<button
										className="btn text-white"
										style={{
											backgroundColor: "#20c997",
											border: "none",
											padding: "6px 16px",
											borderRadius: "4px",
											fontSize: "0.85rem"
										}}
									>
										Contact Us <i className="fas fa-arrow-right ms-1"></i>
									</button>
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<div
							className="card border-0 shadow-sm mx-auto"
							style={{
								backgroundColor: "white",
								borderRadius: "12px",
								maxWidth: "360px"
							}}
						>
							<div className="card-body p-4">
								<h5 className="card-title text-primary fw-bold mb-4">
									Get In Touch
								</h5>
								<form>
									<div className="mb-3">
										<input
											type="text"
											className="form-control"
											placeholder="Name"
											style={{
												borderRadius: "8px",
												border: "1px solid #e9ecef",
												padding: "12px 16px",
												fontSize: "0.9rem"
											}}
										/>
									</div>
									<div className="mb-3">
										<input
											type="email"
											className="form-control"
											placeholder="Email"
											style={{
												borderRadius: "8px",
												border: "1px solid #e9ecef",
												padding: "12px 16px",
												fontSize: "0.9rem"
											}}
										/>
									</div>
									<div className="mb-4">
										<textarea
											className="form-control"
											rows="4"
											placeholder="Message"
											style={{
												borderRadius: "8px",
												border: "1px solid #e9ecef",
												padding: "12px 16px",
												fontSize: "0.9rem",
												resize: "vertical"
											}}
										></textarea>
									</div>
									<button
										type="submit"
										className="btn w-100 text-white"
										style={{
											backgroundColor: "#20c997",
											border: "none",
											borderRadius: "8px",
											padding: "12px 16px",
											fontSize: "0.9rem",
											fontWeight: "500"
										}}
									>
										Send Message <i className="fas fa-arrow-right ms-1"></i>
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>

				{/* Similar Hospitals Section */}
				<div className="mt-5">
					<h3 className="h4 fw-bold text-black mb-4">Similar Hospitals</h3>
					{similarHospitals.length > 0 ? (
						<div className="position-relative">
							<div
								className="d-flex overflow-auto"
								style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
							>
								<div className="d-flex" style={{ gap: "16px" }}>
									{similarHospitals.map((similarHospital, index) => (
										<div
											key={similarHospital._id || index}
											className="flex-shrink-0"
											style={{ width: "280px" }}
										>
											<div
												className="card border-0 shadow-sm position-relative"
												style={{ borderRadius: "12px", overflow: "hidden" }}
											>
												<div className="position-relative">
													<img
														src={
															similarHospital.mainImage
																? similarHospital.mainImage.startsWith("http")
																	? similarHospital.mainImage
																	: `hospital-backend-elzv.onrender.com/api${similarHospital.mainImage}`
																: `https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=280&h=180&fit=crop&crop=center`
														}
														className="card-img-top"
														alt={similarHospital.name}
														style={{
															height: "180px",
															objectFit: "cover",
															width: "100%"
														}}
														onError={(e) => {
															e.target.src = `https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=280&h=180&fit=crop&crop=center&random=${Math.random()}`;
														}}
													/>

													{/* Rating Badge */}
													<div className="position-absolute top-0 start-0 m-2">
														<span
															className="badge d-flex align-items-center"
															style={{
																backgroundColor: "#1f2937",
																color: "white",
																fontSize: "0.8rem",
																padding: "6px 10px",
																borderRadius: "20px"
															}}
														>
															<i
																className="fas fa-star me-1"
																style={{ color: "#fbbf24" }}
															></i>
															{similarHospital.rating || "N/A"}
														</span>
													</div>

													{/* Location Pin */}
													<div className="position-absolute bottom-0 start-0 m-2">
														<div
															className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
															style={{ width: "32px", height: "32px" }}
														>
															<i
																className="fas fa-map-marker-alt text-dark"
																style={{ fontSize: "14px" }}
															></i>
														</div>
													</div>

													{/* Clock Icon (for third card) */}
													{index === 2 && (
														<div className="position-absolute top-0 end-0 m-2">
															<div
																className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
																style={{ width: "32px", height: "32px" }}
															>
																<i
																	className="fas fa-clock text-dark"
																	style={{ fontSize: "14px" }}
																></i>
															</div>
														</div>
													)}
												</div>

												<div className="card-body p-3">
													<h6
														className="card-title fw-bold text-dark mb-0"
														style={{ fontSize: "0.9rem", lineHeight: "1.3" }}
													>
														{similarHospital.name}
													</h6>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Navigation Arrow */}
							<div
								className="position-absolute top-50 end-0 translate-middle-y"
								style={{ zIndex: 10 }}
							>
								<button
									className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center"
									style={{ width: "40px", height: "40px" }}
								>
									<i className="fas fa-arrow-right text-white"></i>
								</button>
							</div>

							{/* Pagination Dots */}
							<div
								className="d-flex justify-content-center mt-3"
								style={{ gap: "8px" }}
							>
								{similarHospitals.map((_, index) => (
									<button
										key={index}
										className="btn p-0 rounded-circle"
										style={{
											width: "8px",
											height: "8px",
											backgroundColor: index === 0 ? "#dc2626" : "#d1d5db",
											border: "none"
										}}
									></button>
								))}
							</div>
						</div>
					) : (
						<div className="text-center py-4">
							<p className="text-muted">No similar hospitals found.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default HospitalDetail;
