import React from 'react';

const Spinner = ({ loading }) => {
  if (!loading) return null;
  return (
    <div className="bg-spinner-bgn fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center">
      <div className="bg-spinner-content flex h-16 items-center justify-center rounded-xl px-8 py-3">
        <span className="text-primary text-3xl font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
