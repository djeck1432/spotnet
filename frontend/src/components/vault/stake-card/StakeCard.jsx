import React from 'react';

export default function StakeCard({ icon = 1, title, value }) {
  return (
    <div className="w-72 bg-header-button-bg border-midnight-purple-border rounded-full flex flex-col justify-center items-center">
      <div className="flex items-center gap-4">
        <img src={icon} alt="icon" className="w-8 h-8" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="mt-4">
        <span className="text-xl font-semibold">{value}</span>
      </div>
    </div>
  );
}
