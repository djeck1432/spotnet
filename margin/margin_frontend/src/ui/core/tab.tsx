import { type ReactNode, useState } from "react";
interface Tab {
  label: string;
  content: ReactNode;
  id: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveIndex?: number;
  className?: string;
}

export function Tabs({
  tabs,
  defaultActiveIndex = 0,
  className = "",
}: TabsProps) {
  const [activeIndex] = useState(defaultActiveIndex);

  return (
    <div className={`w-fullgo   ${className}`}>
      <div className="flex items-center justify-between border-b border-inactiveTab bg-pageBg">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`px-4 py-2 whitespace-nowrap text-sm  font-medium focus:outline-none transition-colors  ${
                activeIndex === tabs.indexOf(tab)
                  ? " text-[#00D1FF] border-b-2 border-t-2 border-[#00D1FF] "
                  : "text-tabText hover:text-baseWhite "
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">{tabs[activeIndex]?.content}</div>
    </div>
  );
}
