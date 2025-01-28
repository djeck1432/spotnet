import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useMaxMultiplier } from '../../../hooks/useMaxMultiplier';
import sliderThumb from '../../../assets/icons/slider_thumb.svg';

const MultiplierSelector = ({ setSelectedMultiplier, selectedToken }) => {
  const minMultiplier = 1.1;
  const { data, isLoading } = useMaxMultiplier();
  const [actualValue, setActualValue] = useState(minMultiplier);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const maxMultiplier = useMemo(() => data?.[selectedToken] || 5.0, [data, selectedToken]);

  const marks = useMemo(() => {
    const marksArray = Array.from(
      { length: Math.floor(maxMultiplier) - Math.ceil(minMultiplier) + 1 },
      (_, i) => i + Math.ceil(minMultiplier)
    );
    marksArray.unshift(minMultiplier);
    if (!marksArray.includes(maxMultiplier)) marksArray.push(maxMultiplier);
    return marksArray;
  }, [minMultiplier, maxMultiplier]);

  const mapSliderToValue = useCallback(
    (sliderPosition) => {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = sliderPosition / rect.width;
      const value = percentage * (maxMultiplier - minMultiplier) + minMultiplier;
      return Math.min(maxMultiplier, Math.max(minMultiplier, parseFloat(value.toFixed(1))));
    },
    [maxMultiplier, minMultiplier]
  );

  const calculateSliderPercentage = useCallback(
    (value) => ((value - minMultiplier) / (maxMultiplier - minMultiplier)) * 100,
    [maxMultiplier, minMultiplier]
  );

  const updateSliderValue = useCallback(
    (clientX) => {
      const slider = sliderRef.current;
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const newValue = mapSliderToValue(x);
      setActualValue(newValue);
      setSelectedMultiplier(newValue.toFixed(1));
    },
    [mapSliderToValue, setSelectedMultiplier]
  );

  const handleDrag = (e) => {
    if (!isDragging.current) return;
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    updateSliderValue(clientX);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    updateSliderValue(e.clientX);
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    updateSliderValue(e.touches[0].clientX);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDrag]);

  useEffect(() => {
    const boundedValue = Math.min(actualValue, maxMultiplier);
    setActualValue(boundedValue);
    setSelectedMultiplier(boundedValue.toFixed(1));
  }, [maxMultiplier, actualValue, setSelectedMultiplier]);

  if (isLoading) return <div className="w-full text-gray">Loading multiplier data...</div>;

  return (
    <div className="w-full pt-12">
      <div className="relative w-full">
        <div className="relative w-11/12 mx-auto">
          <div
            className="relative h-2 bg-gray-300 rounded-full cursor-pointer"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div
              className="ml-2.5 absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: `${calculateSliderPercentage(actualValue)}%` }}
            />
            <div
              className="ml-2.5 absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${calculateSliderPercentage(actualValue)}%` }}
            >
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white text-xs p-1.5 rounded shadow-md">
                {actualValue.toFixed(1)}
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-blue-900" />
              </div>
              <img
                src={sliderThumb}
                alt="slider thumb"
                className="w-8 h-8"
                draggable="false"
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            {marks.map((mark, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ left: `${calculateSliderPercentage(mark)}%` }}
              >
                <div
                  className={`w-1 h-3 rounded-full ${actualValue === mark ? 'bg-brand' : 'bg-gray'}`}
                />
                <span
                  className={`text-xs mt-1 ${actualValue === mark ? 'text-blue-500' : 'text-gray'}`}
                >
                  x{mark}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplierSelector;
