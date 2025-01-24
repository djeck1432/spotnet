import React from 'react';

export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const sizeClasses = {
    lg: 'w-[642px] py-4 px-8',
    md: 'w-[309px] py-4 px-6',
    sm: 'w-[167px] py-4 px-4',
  };

  const variantClasses = {
    primary: 'text-white bg-transparent relative border-none cursor-pointer font-semibold rounded-lg text-sm h-[60px] flex justify-center items-center transition-all duration-200 ease-in-out',
    secondary: 'text-white bg-transparent border border-midnight-purple cursor-pointer font-semibold rounded-lg text-sm h-[60px] flex justify-center items-center transition-all duration-200 ease-in-out relative z-10',
  };

  const primaryHover = 'hover:after:bg-gradient-to-r hover:after:from-[#e01dee] hover:after:to-[#49abd2]';
  const primaryActive = 'active:translate-y-[1px]';
  const primaryFocus = 'focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-50';

  const buttonClasses = [
    'button', 
    sizeClasses[size], 
    variantClasses[variant], 
    className,
    variant === 'primary' ? primaryHover : '',
    variant === 'primary' ? primaryActive : '',
    variant === 'primary' ? primaryFocus : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses}  {...props}>
      {children}
    </button>
  );
};
