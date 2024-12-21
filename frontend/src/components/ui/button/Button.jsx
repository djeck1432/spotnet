import React from 'react';
import './button.css';

const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const buttonClasses = ['button', `button--${variant}`, `button--${size}`, className].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
