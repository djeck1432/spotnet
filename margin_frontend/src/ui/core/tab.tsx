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
			<div className="flex border-b border-inactiveTab bg-pageBg">
				{tabs.map((tab, index) => (
					<button
						type="button"
						key={tab.label}
						className={`p-4 text-sm  font-medium focus:outline-none transition-colors min-w-[100px] ${
							activeIndex === index
								? " rounded-t-lg text-baseWhite bg-navbg border-b border-activeTab "
								: "text-tabText hover:text-baseWhite "
						}`}
						onClick={() => {
							setActiveIndex(index);
						}}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="p-4">{tabs[activeIndex]?.content}</div>
		</div>
	);
}
