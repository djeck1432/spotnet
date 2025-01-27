import React from "react"
import "./ReportBugButton.css"
import ReportBugIcon from "../../assets/icons/customer-service-01.svg"

export function ReportBugButton({ onClick }) {
    return (
        <button className="report-button" onClick={(e) => {
    
            e.stopPropagation();
            onClick();
        }}>

            <img
                src={ReportBugIcon}
                alt="bug-icon"
                className="bug-icon"
            />

            <p className="bug-text">Report Bug</p>


        </button>
    )
}

