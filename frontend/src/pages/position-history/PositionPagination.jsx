import React from 'react';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg?react';

export default function PositionPagination({ currentPage, setCurrentPage, isPending, tableData, positionsOnPage }) {
  const pagesCount = (totalItems, itemsPerPage) => Math.ceil(totalItems / itemsPerPage);
  const range = (length, startIdx = 1) => [...Array(length).keys()].map((i) => i + startIdx);

  const range = (length, startIdx = 1) => [...Array(length).keys()].map((i) => i + startIdx);

  const setPage = (page) => {
    if (isPending || page < 1 || page > pagesCount(tableData?.length, positionsOnPage)) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-center items-center gap-12 mt-[-16px]">
      <div
        className={`flex justify-center items-center w-6 h-6 rounded-full cursor-pointer ${currentPage === 1 ? 'bg-[#2e1b3d] cursor-default' : 'bg-[#5b3c8f]'} ${isPending ? 'cursor-default' : ''}`}
        onClick={() => setPage(currentPage - 1)}
        aria-label="Previous Page"
      >
        <img src={ArrowLeftIcon} alt="arrow-left-icon" className={`${currentPage === 1 ? 'stroke-[#402525]' : 'stroke-[#b2a0b6]'} transition-all`} />
      </div>

      <div className="flex items-center justify-center gap-4">
        {!isPending && tableData ? 
          range(pagesCount(tableData?.length, positionsOnPage)).map((page) => (
            <div
              key={page}
              className={`text-xs font-normal cursor-pointer ${currentPage === page ? 'font-semibold text-[#5b3c8f]' : 'text-[#413547]'}`}
              onClick={() => setPage(page)}
            >
              {page}
            </div>
          )) : null}
      </div>

      <div
        className={`flex justify-center items-center w-6 h-6 rounded-full cursor-pointer ${currentPage === pagesCount(tableData?.length, positionsOnPage) ? 'bg-[#2e1b3d] cursor-default' : 'bg-[#5b3c8f]'} ${isPending ? 'cursor-default' : ''}`}
        onClick={() => setPage(currentPage + 1)}
        aria-label="Next Page"
      >
        <img src={ArrowRightIcon} alt="arrow-right-icon" className={`${currentPage === pagesCount(tableData?.length, positionsOnPage) ? 'stroke-[#402525]' : 'stroke-[#b2a0b6]'} transition-all`} />
      </div>
    </div>
  );
  );
}
