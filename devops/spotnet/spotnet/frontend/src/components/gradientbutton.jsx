import React from 'react';
import Rocket from '@/assets/icons/rocket.svg?react';

const GradientButton = ({
  onClick,
  children,
  mobileWidth = 'w-[300px]',
  desktopWidth = 'lg:w-[400px]',
  icon = <Rocket />,
  className = '',
}) => {
  return (
    <button
      className={`z-10 mt-[20px] h-[52px] cursor-pointer rounded-[8px] border-none bg-gradient-to-r from-[var(--button-gradient-from)] via-[var(--button-gradient-to)] to-[var(--button-gradient-to)] text-[20px] font-[700] text-black hover:bg-gradient-to-r hover:from-[var(--button-gradient-hover-from)] hover:via-[var(--button-gradient-from)] hover:to-[var(--button-gradient-hover-from)] 2xl:h-[60px] ${mobileWidth} ${desktopWidth} ${className} `}
      onClick={onClick}
    >
      <div className="flex cursor-pointer items-center justify-center gap-[20px]">
        <span>{children}</span>
        {icon}
      </div>
    </button>
  );
};

export default GradientButton;
