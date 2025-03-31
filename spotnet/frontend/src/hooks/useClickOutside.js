import { useEffect } from 'react';

export const useClickOutside = (refs, handler) => {
  useEffect(() => {
    function handleClickOutside(event) {
      const isOutside = refs.every((ref) => ref.current && !ref.current.contains(event.target));

      if (isOutside) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, handler]);
};
