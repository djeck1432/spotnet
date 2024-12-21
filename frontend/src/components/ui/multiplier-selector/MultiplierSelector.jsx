import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useMaxMultiplier } from '../../../hooks/useMaxMultiplier';
import sliderThumb from '../../../assets/icons/slider_thumb.svg';
import './multiplier.css';

const MultiplierSelector = ({ setSelectedMultiplier, selectedToken }) => {
  const minMultiplier = 1.1;

  const { data, isLoading } = useMaxMultiplier();
  const [actualValue, setActualValue] = useState(minMultiplier);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const maxMultiplier = useMemo(() => {
    return data?.[selectedToken] || 5.0;
  }, [data, selectedToken]);

  const marks = useMemo(() => {
    const marksArray = [];
    for (let i = Math.ceil(minMultiplier); i <= Math.floor(maxMultiplier); i++) {
      marksArray.push(i);
    }
    marksArray.unshift(minMultiplier);
    if (!marksArray.includes(maxMultiplier)) {
      marksArray.push(maxMultiplier);
    }
    return marksArray;
  }, [minMultiplier, maxMultiplier]);

  const mapSliderToValue = useCallback(
    (sliderPosition) => {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = sliderPosition / rect.width;
      const value = percentage * (maxMultiplier - minMultiplier) + minMultiplier;
      return Math.max(minMultiplier, Math.min(maxMultiplier, parseFloat(value.toFixed(1))));
    },
    [maxMultiplier, minMultiplier]
  );

  const calculateSliderPercentage = useCallback(
    (value) => {
      const percentage = ((value - minMultiplier) / (maxMultiplier - minMultiplier)) * 100;
      return Math.min(Math.max(percentage, 0), 100);
    },
    [maxMultiplier, minMultiplier]
  );

  const updateSliderValue = useCallback(
    (clientX) => {
      const slider = sliderRef.current;
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
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
    if (actualValue > maxMultiplier) {
      setActualValue(maxMultiplier);
      setSelectedMultiplier(maxMultiplier.toFixed(1));
    } else {
      setSelectedMultiplier(actualValue.toFixed(1));
    }
  }, [maxMultiplier, actualValue, setSelectedMultiplier]);

  if (isLoading) return <div className="slider-skeleton">Loading multiplier data...</div>;

  return (
    <div className="multiplier-card">
      <div className="slider-container">
        <div className="slider-with-tooltip">
          <div className="multiplier-slider-container">
            <div className="slider" ref={sliderRef} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
              <div className="slider-track">
                <div
                  className="slider-range"
                  style={{
                    width: `${calculateSliderPercentage(actualValue)}%`,
                  }}
                ></div>
              </div>
              <div
                className="slider-thumb"
                style={{
                  left: `${calculateSliderPercentage(actualValue)}%`,
                }}
              >
                <div className="tooltip">{actualValue.toFixed(1)}</div>
                <img src={sliderThumb} className="cursor" alt="slider thumb" draggable="false" />
              </div>
            </div>
          </div>
          <div className="mark-container">
            {marks.map((mark, index) => (
              <div
                key={index}
                className={`mark-item ${actualValue === mark ? 'active' : ''}`}
                style={{
                  left: `${calculateSliderPercentage(mark)}%`,
                  position: 'absolute',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="marker" />
                <span className="mark-label">{`x${mark}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplierSelector;
