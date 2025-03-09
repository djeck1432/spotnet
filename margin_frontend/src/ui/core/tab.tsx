import { type ReactNode, useState } from "react";

interface Tab {
	label: string;
	content: ReactNode;
}

interface TabsProps {
	tabs: Tab[];
	defaultActiveIndex?: number;
	className?: string;
}

export function Tabs({ tabs, defaultActiveIndex = 0, className = "" }: TabsProps) {
	const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

	return (
		<div className={`w-full ${className}`}>
			<div className="flex border-b border-inactiveTab bg-pageBg bricolage h-[48px] bg-transparent ">
				{tabs.map((tab, index) => (
					<button
						key={index}
						className={`p-4 text-sm  font-semibold focus:outline-none transition-colors w-full max-w-[142px] ${activeIndex === index
								? " rounded-t-lg h-[48px] text-baseWhite bg-navbg border-b border-activeTab"
								: "text-[#B1B1B1] hover:text-baseWhite "
							}`}
						onClick={() => {
							setActiveIndex(index);
						}}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="pt-4">{tabs[activeIndex]?.content}</div>
		</div>
	);
}
