import React from "react";
import { Link } from "react-router-dom";

const HospitalCard = ({ hospital }) => {
	return (
		<div className="col-12 col-md-6 col-lg-6 mb-4">
			<div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
				<div className="row g-0 h-100">
					<div className="col-6 position-relative p-3">
						{hospital.mainImage && (
							<img
								src={`https://hospital-backend-elzv.onrender.com/api${hospital.mainImage}`}
								className="img-fluid h-100 rounded-3"
								alt={hospital.name}
								style={{ objectFit: "cover" }}
							/>
						)}
						<div className="position-absolute top-0 start-0 p-3 d-flex gap-2">
							<button className="btn btn-light btn-sm rounded-2 shadow-sm p-2">
								<i className="fas fa-share-alt text-dark"></i>
							</button>
							<button className="btn btn-light btn-sm rounded-2 shadow-sm p-2">
								<i className="fas fa-heart text-dark"></i>
							</button>
						</div>
					</div>

					<div className="col-6">
						<div className="card-body d-flex flex-column h-100 p-4">
							<div className="d-flex justify-content-between align-items-center mb-3">
								<span className="badge bg-success rounded px-3 py-1 fw-bold text-uppercase small">
									Hospital
								</span>
								<div className="d-flex align-items-center gap-2">
									<i className="fas fa-star text-warning"></i>
									<span className="text-dark fw-semibold small">
										{hospital.rating || "4.8"}+ Rating
									</span>
								</div>
							</div>

							<h5 className="card-title fw-bold text-dark mb-3 lh-sm">
								{hospital.name}
							</h5>

							<div className="d-flex align-items-center gap-2 mb-4">
								<i className="fas fa-map-marker-alt text-primary"></i>
								<span className="text-dark small">
									{hospital.location?.city && `${hospital.location.city}, `}
									{hospital.location?.state && `${hospital.location.state}, `}
									{hospital.location?.country || "INDIA"}
								</span>
							</div>

							<div className="d-flex justify-content-between align-items-center mt-auto">
								<Link
									to={`/hospital/${hospital._id}`}
									className="btn btn-sm rounded-2 px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
									style={{
										backgroundColor: "#f8f9fa",
										color: "#1f5eff",
										border: "1px solid #e9ecef"
									}}
								>
									Book Today <i className="fas fa-arrow-right"></i>
								</Link>
								<div className="d-flex align-items-center gap-2">
									<i className="fas fa-stethoscope text-success"></i>
									<span className="text-dark small fw-medium">
										{hospital.totalDoctors || "50"} Doctors
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HospitalCard;
