import React from 'react';
import { ReactComponent as SettingIcon } from 'assets/icons/settings.svg';
import './gasfee.css';


export default function GasFee() {
    return (
        <div className="main-card-footer">
           
            <div className="gas-fee-container">
                <div className="gas-fee-circle">
                    <SettingIcon className="gas-fee-icon" />
                </div>
                <div className="gas-fee-title">Gas fee: 0.00 STRK</div>
            </div>
        </div>
    );
}