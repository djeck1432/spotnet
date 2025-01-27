import React from "react";
import ReportBugIcon from "../../assets/icons/customer-service-01.svg";

export function ReportBugButton({ onClick }) {
    return (
        <button
            className="fixed top-[125px] right-[30px] flex items-center gap-2 z-10 h-[46px] bg-[#11061E] border border-[#36294E] rounded-[12px] py-3 px-6 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-[#9333ea] hover:via-[#3b82f6] hover:to-transparent"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <img
                src={ReportBugIcon}
                alt="bug-icon"
                className="w-4 h-4"
            />
            <p className="text-[#e7ecf0] text-base font-normal mt-[13px]">Report Bug</p>
        </button>
    );
}
