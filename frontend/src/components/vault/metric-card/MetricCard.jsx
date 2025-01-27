import React from 'react';

export default function MetricCard({ title, value }) {
  return (
    <div className="w-72 bg-header-button-bg border-midnight-purple-border rounded-lg flex flex-col justify-center items-center gap-1.5 p-6 sm:w-full sm:rounded-xl sm:p-4 sm:text-xs sm:gap-2 sm:p-4">
      <div className="flex justify-center">
        <span className="text-sm font-semibold leading-5">{title}</span>
      </div>
      <div className="flex justify-center">
        <span className="text-xl font-semibold leading-8">{value}</span>
      </div>
    </div>
  );
}
