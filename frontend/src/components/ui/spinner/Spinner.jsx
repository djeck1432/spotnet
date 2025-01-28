import React from "react";

const Spinner = ({ loading }) => {
  return (
    loading && (
      <div className="fixed inset-0 flex items-center justify-center bg-spinner-bgn z-[9999]">
        <div className="flex items-center rounded-lg px-8 py-3 w-[250px] h-[68px] bg-spinner-content md:w-[200px] md:h-[56px] md:px-7 sm:w-[180px] sm:h-[52px] sm:px-6 xs:w-[160px] xs:h-[48px] xs:px-5">
          <div
            className="h-9 w-9 mr-3 animate-spin rounded-full border-4 border-t-white border-transparent md:h-7 md:w-7 md:mr-2.5 sm:h-6 sm:w-6 sm:mr-2 xs:h-5 xs:w-5 xs:mr-2"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <span className="font-semibold text-[28px] text-white md:text-[22px] sm:text-[20px] xs:text-[18px]">
            Loading...
          </span>
        </div>
      </div>
    )
  );
};

export default Spinner;
