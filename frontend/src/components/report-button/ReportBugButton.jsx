import React from "react";
import ReportBugIcon from "../../assets/icons/customer-service-01.svg";

export function ReportBugButton({ onClick }) {
    return (
        <button
            className="fixed top-[125px] right-[30px] flex items-center gap-2 z-10 h-[46px] bg-[#11061E] border-x border-y border-border-color rounded-[12px] py-3 px-6 cursor-pointer transition-all hover:bg-report-btn-bg-hover"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <img
                src={ReportBugIcon}
                alt="bug-icon"
                className="w-4 h-4 inline"
            />
            <p className="text-[#e7ecf0] text-base font-normal">Report Bug</p>
        </button>
    );
}
