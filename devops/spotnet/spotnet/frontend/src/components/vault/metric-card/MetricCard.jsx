import React from 'react';

export default function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-header-button-bg border-light-purple xs:px-0.5 flex w-[309px] flex-col items-center justify-center gap-1 rounded-lg border p-6 sm:w-full md:w-full md:rounded-[10px]">
      <div className="flex items-center gap-2">
        <img src={icon} alt={title} className="size-5" />
        <span className="xs:text-xs xs:leading-4 text-gray text-sm leading-[19px] font-semibold">{title}</span>
      </div>
      <div>
        <span className="xs:text-base xs:leading-[21px] text-primary text-2xl leading-8 font-semibold md:text-[21px]">
          {value}
        </span>
      </div>
    </div>
  );
}
