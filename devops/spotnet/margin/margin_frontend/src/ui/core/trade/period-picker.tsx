import { useState } from "react";
import { classBuilder } from "../../../utils/utils";

interface PeriodPickerProps {
  className?: string;
}

export function PeriodPicker({ className = "" }: PeriodPickerProps) {
  const [current, setCurrent] = useState<number>(0);
  return (
    <div
      className={classBuilder(
        className,
        "collapse lg:visible text-[#656D77]",
        "text-sm flex bg-[#0E1114] gap-[2px] rounded-[6px]",
      )}
    >
      {["1H", "1D", "1W", "1M", "1Y"].map((period, index) => (
        <div
          className={classBuilder(
            index === current &&
            "text-[#F1F7FF] font-bold bg-[#12181F] rounded-[6px]",
            "w-[32px] h-[32px] flex items-center justify-center cursor-pointer",
          )}
          onClick={() => setCurrent(index)}
          key={period}
        >
          {period}
        </div>
      ))}
    </div>
  );
}
