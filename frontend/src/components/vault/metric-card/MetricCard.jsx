import React from 'react';
import './metricCard.css';

export default function MetricCard({ title, value }) {
  return (
    <div className="metric-card">
      <div className="card-header">
        <span className="label">{title}</span>
      </div>
      <div className="card-value">
        <span className="metric-card-value">{value}</span>
      </div>
    </div>
  );
}
