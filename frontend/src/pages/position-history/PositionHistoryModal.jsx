import React from 'react';

function PositionHistoryModal({ position, onClose, index, tokenIcon, statusStyles }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-bg rounded-xl p-6 border-2 border-modal-border w-[400px] max-w-[90%]">
        <div className="flex items-center justify-between">
          <p className="text-primary flex gap-8 items-center w-full text-sm flex-wrap">
            <span className="flex items-center">
              <span>{index}.</span>
              {tokenIcon[position.token_symbol]}
              {position.token_symbol}
            </span>
            <span>{position.amount}</span>
            <span className={`font-semibold ${statusStyles[position.status.toLowerCase()] || ''}`}>{position.status}</span>
          </p>
          <span onClick={onClose} className="cursor-pointer text-lg ml-2">&times;</span>
        </div>
        <hr className="border-gray-500 my-4" />
        <div className="flex flex-col ml-6">
          <div className="flex gap-2">
            <p className="text-gray-400">Start Price</p>
            <span className="text-primary">{position.start_price}</span>
          </div>
          <div className="flex gap-2">
            <p className="text-gray-400">Multiplier</p>
            <span className="text-primary">{position.multiplier}</span>
          </div>
          <div className="flex gap-2">
            <p className="text-gray-400">Liquidated</p>
            <span className="text-primary">{position.is_liquidated ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex gap-2">
            <p className="text-gray-400">Created At</p>
            <span className="text-primary">{position.created_at}</span>
          </div>
          <div className="flex gap-2">
            <p className="text-gray-400">Closed At</p>
            <span className="text-primary">{position.closed_at}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PositionHistoryModal;
