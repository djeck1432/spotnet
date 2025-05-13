import React from 'react';

function PositionHistoryModal({ position, onClose, index, tokenIcon, statusStyles }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-md rounded-lg p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <span>{index}.</span>
          {tokenIcon[position.token_symbol]}
          {position.token_symbol}
          <span className="ml-2">{position.amount}</span>
          <span className={`ml-2 ${statusStyles[position.status.toLowerCase()] || ''}`}>{position.status}</span>

          <button
            onClick={onClose}
            className="text-xl text-white transition-colors hover:text-gray-400"
            aria-label="Close Account Info Modal Box"
          >
            ✕
          </button>
        </div>
        <hr className="mb-4 border-t border-gray-700" />
        <div className="space-y-2">
          <div className="flex justify-between text-white">
            <p>Start Price</p>
            <span>{position.start_price}</span>
          </div>
          <div className="flex justify-between text-white">
            <p>Multiplier</p>
            <span>{position.multiplier}</span>
          </div>
          <div className="flex justify-between text-white">
            <p>Liquidated</p>
            <span>{position.is_liquidated ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between text-white">
            <p>Created At</p>
            <span>{position.created_at}</span>
          </div>
          <div className="flex justify-between text-white">
            <p>Closed At</p>
            <span>{position.closed_at}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PositionHistoryModal;
