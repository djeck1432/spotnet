import React from 'react';
import './metricCard.css';

export default function MetricCard({ icon= 1, title, value }) {
  return (
    <div className="stake-card">
      <div className="card-header">
        <img src={icon} className="card-icon" />
        <span className="label">{title}</span>
      </div>
      <div className="card-value">
        <span className="top-card-value">{value}</span>
      </div>
    </div>
  );
}
