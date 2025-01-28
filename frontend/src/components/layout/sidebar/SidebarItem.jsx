import addSquare from '@/assets/icons/add-square.svg';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SidebarItem = ({ item: { icon, name }, isExpanded, hasChildren, isNested }) => {
  return (
    <>
      {isNested ? (
        <span className="bg-[#9333ea]/40 w-[6px] h-[6px] rounded-full mr-2" />
      ) : (
        <span className="mr-2 flex items-start">
          <img
            className={`${
              !icon ? 'w-4 h-4' : 'w-6 h-6'
            }`}
            src={icon || addSquare}
            alt={name}
          />
        </span>
      )}
      <span className="flex-1 text-left">{name}</span>
      {hasChildren && (
        <span className="ml-2">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      )}
    </>
  );
};
