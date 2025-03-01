import * as React from "react";
import clsx from "clsx"; 

export interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={clsx("flex border-b border-[#252525] mb-6", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            "relative px-6 py-3 text-sm font-medium transition-colors",
            activeTab === tab.value ? "text-white" : "text-[#898989]"
          )}
        >
          {tab.label}
          {activeTab === tab.value && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffb80d]" />
          )}
        </button>
      ))}
    </div>
  );
}
