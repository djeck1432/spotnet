import addSquare from '@/assets/icons/add-square.svg';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SidebarItem = ({ item: { icon, name }, isExpanded, hasChildren, isNested }) => {
  return (
    <>
      {isNested ? (
        <span className="mr-2 h-[6px] w-[6px] rounded-full bg-[#9333ea]/40" />
      ) : (
        <span className="mr-2 flex items-start">
          <img className={`${!icon ? 'h-4 w-4' : 'h-6 w-6'}`} src={icon || addSquare} alt={name} />
        </span>
      )}
      <span className="flex-1 text-left text-sm">{name}</span>
      {hasChildren && <span className="ml-2">{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>}
    </>
  );
};
