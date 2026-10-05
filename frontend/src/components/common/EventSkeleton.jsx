import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export function EventCardSkeleton() {
  return (
    <div
      className="card shadow-sm"
      style={{
        borderRadius: "16px",
        width: "100%",
        borderColor: "rgba(255, 44, 85, 0.3)",
        backgroundColor: "rgba(18, 18, 26, 0.75)",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Event Image Placeholder */}
      <Skeleton
        variant="rectangular"
        height={260}
        animation="wave"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.08)" }}
      />
      <div className="card-body" style={{ padding: "16px" }}>
        {/* Date Placeholder */}
        <Skeleton
          variant="text"
          width="50%"
          height={20}
          animation="wave"
          sx={{ bgcolor: "rgba(255, 255, 255, 0.08)", mb: 1 }}
        />
        {/* Title Placeholder */}
        <Skeleton
          variant="text"
          width="85%"
          height={32}
          animation="wave"
          sx={{ bgcolor: "rgba(255, 255, 255, 0.12)", mb: 1 }}
        />
        {/* Price & Action Placeholder */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <Skeleton
            variant="text"
            width="30%"
            height={28}
            animation="wave"
            sx={{ bgcolor: "rgba(255, 44, 85, 0.2)" }}
          />
          <Skeleton
            variant="rounded"
            width={90}
            height={36}
            animation="wave"
            sx={{ bgcolor: "rgba(255, 255, 255, 0.08)", borderRadius: "20px" }}
          />
        </div>
      </div>
    </div>
  );
}

export function EventSkeletonGrid({ count = 6 }) {
  return (
    <div className="row g-4 justify-content-center">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <EventCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function ArtistCircleSkeleton() {
  return (
    <div className="d-flex flex-column align-items-center me-4">
      <Skeleton
        variant="circular"
        width={180}
        height={180}
        animation="wave"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.08)" }}
      />
      <Skeleton
        variant="text"
        width={120}
        height={24}
        animation="wave"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", mt: 2 }}
      />
    </div>
  );
}
