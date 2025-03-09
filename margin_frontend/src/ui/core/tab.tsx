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

export function Tabs({ tabs, defaultActiveIndex = 0, className = "" }: TabsProps) {
	const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

	return (
		<div className={`w-full ${className}`}>
			<div className="flex border-b border-inactiveTab bg-pageBg">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						className={`p-4 text-sm  font-medium focus:outline-none transition-colors min-w-[100px] ${
							activeIndex === tabs.indexOf(tab)
								? " rounded-t-lg text-baseWhite bg-navbg border-b border-activeTab "
								: "text-tabText hover:text-baseWhite "
						}`}
						onClick={() => {
							setActiveIndex(tabs.indexOf(tab));
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
