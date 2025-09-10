import React, { useState } from "react";

const GalleryTab = ({ hospital }) => {
	const [galleryTab, setGalleryTab] = useState("grid");

	return (
		<div>
			<h2 className="h3 fw-bold text-black mb-3">
				Gallery <i className="fas fa-info-circle text-muted"></i>
			</h2>

			<div className="nav nav-pills mb-4">
				<button
					className={`nav-link ${galleryTab === "grid" ? "active" : ""}`}
					onClick={() => setGalleryTab("grid")}
				>
					<i className="fas fa-th me-2"></i>Grid
				</button>
				<button
					className={`nav-link ${galleryTab === "single" ? "active" : ""}`}
					onClick={() => setGalleryTab("single")}
				>
					<i className="fas fa-image me-2"></i>Single
				</button>
				<button
					className={`nav-link ${galleryTab === "video" ? "active" : ""}`}
					onClick={() => setGalleryTab("video")}
				>
					<i className="fas fa-play me-2"></i>Video
				</button>
			</div>

			<div className="row g-3">
				{hospital.gallery && hospital.gallery.length > 0
					? hospital.gallery.slice(0, 6).map((image, index) => (
							<div key={index} className="col-md-4">
								<div className="position-relative">
									<img
										src={
											image.startsWith("http")
												? image
												: `hospital-backend-elzv.onrender.com/${image}`
										}
										className="img-fluid rounded"
										alt={`Gallery ${index + 1}`}
										style={{
											height: "200px",
											objectFit: "cover",
											width: "100%"
										}}
										onError={(e) => {
											e.target.src = `https://via.placeholder.com/300x200/007bff/ffffff?text=Gallery+${
												index + 1
											}`;
										}}
									/>
									<div className="position-absolute bottom-0 start-0 m-2">
										<i className="fas fa-camera text-white"></i>
									</div>
								</div>
							</div>
					  ))
					: Array.from({ length: 6 }).map((_, index) => (
							<div key={index} className="col-md-4">
								<img
									src={`https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop&crop=center&random=${index}`}
									className="img-fluid rounded"
									alt={`Gallery ${index + 1}`}
									style={{ height: "200px", objectFit: "cover", width: "100%" }}
								/>
							</div>
					  ))}
			</div>
			<div className="text-center mt-3">
				<button className="btn btn-outline-secondary">Show more</button>
			</div>
		</div>
	);
};

export default GalleryTab;
