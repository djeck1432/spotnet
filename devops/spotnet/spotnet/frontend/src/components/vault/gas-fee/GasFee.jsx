import React from 'react';
import SettingIcon from '@/assets/icons/settings.svg?react';

export default function GasFee() {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-2 border-t border-[#36294e] px-2 py-3">
      <div className="rounded-full bg-[#201338] p-2">
        <SettingIcon />
      </div>
      <div className="text-sm font-normal text-[#83919F]">Gas fee: 0.00 STRK</div>
    </div>
  );
}
