import React from 'react';
import SettingIcon from '@/assets/icons/settings.svg?react';

export default function GasFee() {
  return (
    <div className="flex items-center justify-between px-12 pb-4">
      <div className="relative flex items-center justify-center w-8 h-8 bg-footer-divider rounded-full cursor-pointer">
        <SettingIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
      </div>
      <div className="text-stormy-gray text-xs font-normal">Gas fee: 0.00 STRK</div>
    </div>
  );
}
