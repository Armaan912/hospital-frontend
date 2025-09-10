import React from 'react';

const ReviewsTab = () => {
  const reviews = [
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
      review: "I recently had a brain surgery in Germany, and I couldn't be happier with the experience. The medical team was exceptionally skilled and attentive, and the facility was top-notch. My recovery has been smooth, and I'm grateful for the excellent care I received."
    }
  ];

  return (
    <div>
      <h2 className="h3 fw-bold text-black mb-3">
        Reviews <i className="fas fa-info-circle text-muted"></i>
      </h2>
      
      {reviews.map((review, index) => (
        <div key={index} className="card border-0 bg-light mb-3">
          <div className="card-body">
            <div className="d-flex align-items-start">
              <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${index === 0 ? 'bg-primary' : 'bg-danger'}`} 
                   style={{ width: '40px', height: '40px' }}>
                <span className="text-white fw-bold">{review.initials}</span>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1">{review.name}</h6>
                    <small className="text-muted">{review.date}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    {review.verified && (
                      <span className="badge bg-primary me-2">verified</span>
                    )}
                    <i className="fas fa-user text-muted"></i>
                  </div>
                </div>
                <div className="mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star text-warning"></i>
                  ))}
                </div>
                {review.review && (
                  <p className="mb-0">{review.review}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsTab;
