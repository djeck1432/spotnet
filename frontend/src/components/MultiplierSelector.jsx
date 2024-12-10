import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useMaxMultiplier } from 'hooks/useMaxMultiplier';
import sliderThumb from '../assets/icons/slider_thumb.svg';
import './multiplier.css';

const MultiplierSelector = ({ setSelectedMultiplier, selectedToken }) => {
  const { data, isLoading, error } = useMaxMultiplier();
  const [actualValue, setActualValue] = useState(1.0);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const maxMultiplier = useMemo(() => {
    return parseFloat(data?.[selectedToken]) || 5.0;
  }, [data, selectedToken]);

  const mapSliderToValue = useCallback(
    (sliderPosition) => {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = sliderPosition / rect.width;
      const value = percentage * (maxMultiplier - 1) + 1;
      return Math.max(1, Math.min(maxMultiplier, parseFloat(value.toFixed(1))));
    },
    [maxMultiplier]
  );

  const calculateSliderPercentage = useCallback(
    (value) => Math.min(((value - 1) / (maxMultiplier - 1)) * 100, 100),
    [maxMultiplier]
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
    [mapSliderToValue, maxMultiplier, setSelectedMultiplier]
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
    }
  }, [maxMultiplier, actualValue, setSelectedMultiplier]);

  if (isLoading) return <div className="slider-skeleton">Loading multiplier data...</div>;
  if (error) return <div className="error-message">Error loading multiplier data: {error.message}</div>;

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
            {Array.from({ length: maxMultiplier }, (_, i) => i + 1).map((mark) => (
              <div key={mark} className={`mark-item ${actualValue >= mark && actualValue < mark + 1 ? 'active' : ''}`}>
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
