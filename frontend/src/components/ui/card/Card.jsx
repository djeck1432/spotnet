import React from 'react';

function Card({ label, icon, value = '', cardData = [] }) {
  return (
    <div className="w-[317px] h-[101px] bg-transparent border border-light-purple rounded-lg pt-1 px-6 text-center md:w-[260px] md:h-[90px] md:flex md:flex-col md:justify-center md:items-center md:px-1 md:py-2 sm:w-[167px] sm:h-auto sm:px-2">
      <div className="flex justify-center items-center text-second-primary">
        {icon}
        <span className="text-sm font-semibold md:text-xs md:font-normal">{label}</span>
      </div>
      <div className="text-second-primary font-semibold text-lg md:text-base sm:text-sm">
        {cardData.length > 0 ? (
          <>
            <span className="mr-1 text-inherit">$</span>
            <span>
              {cardData[1]?.balance ? Number(cardData[1].balance).toFixed(8) : '0.00'}
            </span>
          </>
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
}

export default Card;