import React from 'react';
import './positionHistory.css';

function PositionHistoryModal({ position, onClose, index, tokenIcon, statusStyles }) {
  return (
    <div className="position-modal-overlay">
      <div className="position-modal-content">
        <div className="position-modal-header">
          <p className="position-modal-p">
            <span>
              <span>{index}.</span>
              {tokenIcon[position.token_symbol]}
              {position.token_symbol}
            </span>
            <span>{position.amount}</span>
            <span className={`status-cell ${statusStyles[position.status.toLowerCase()] || ''}`}>
              {position.status}
            </span>
          </p>

          <span onClick={onClose} className="position-close-button" aria-label="Close Account Info Modal Box">
            ✕
          </span>
        </div>
        <hr className="modal-divider" />
        <div className="position-modal-body">
          <div className="position-detail-row">
            <p>
              Start Price <span>{position.start_price}</span>
            </p>
          </div>
          <div className="position-detail-row">
            <p>
              Multiplier <span>{position.multiplier}</span>
            </p>
          </div>
          <div className="position-detail-row">
            <p>
              Liquidated <span>{position.is_liquidated ? 'Yes' : 'No'}</span>
            </p>
          </div>
          <div className="position-detail-row">
            <p>
              Created At <span>{position.created_at}</span>
            </p>
          </div>
          <div className="position-detail-row">
            <p>
              Closed At <span>{position.datetime_liquidation}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PositionHistoryModal;
