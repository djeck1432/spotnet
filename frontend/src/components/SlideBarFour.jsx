import React, { useState, useCallback, useMemo } from 'react';
import { useMaxMultiplier } from 'hooks/useMaxMultiplier';
import './slider-three.css';
import { notify } from 'components/Notifier/Notifier';

const StepSlider = ({ min = 0, max = 10, step = 1, defaultValue = 1, setSelectedMultiplier, selectedToken }) => {
    const { data, isLoading, error } = useMaxMultiplier();
    const [value, setValue] = useState(defaultValue);


    const maxMultiplier = useMemo(() => {
        return data?.[selectedToken] || 11.0;
    }, [data, selectedToken]);

    const handleMultiplierChange = useCallback((e) => {
        setValue(Number(e.target.value));
        setSelectedMultiplier(value);
    }, [setSelectedMultiplier, value]);

    const steps = Array.from(
        { length: Math.floor((max - min) / step) + 1 },
        (_, i) => min + (i * step)
    );

    const TOTAL_MARKS = 11;

    const getTrackPercentage = useCallback(() => {
        return ((value - min) / (max - min)) * 100;
    }, [value, min, max]);

    const getCurrentMark = useCallback(() => {
        const invertedValue = maxMultiplier - actualValue + 1;
        const markIndex = Math.round((invertedValue - 1) * (TOTAL_MARKS - 1) / (maxMultiplier - 1));
        return Math.min(Math.max(0, markIndex), TOTAL_MARKS - 1);
    }, [value, maxMultiplier, TOTAL_MARKS]);

    if (isLoading) return <div className="slider-skeleton">Loading multiplier data...</div>;
    if (error) return notify(error.message, 'error');

    const currentMark = getCurrentMark();

    return (
        <div className="step-slider-container">
            <div className="slider-labels">
                <span>Min</span>
                <span>Max</span>
            </div>
            <div className="slider-wrapper">
                <div
                    className="slider-track-fill"
                    style={{ 'width': `${getTrackPercentage()}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleMultiplierChange}
                    className="step-slider"
                />
                <div className="step-markers">
                    {steps.map((stepValue) => (
                        <div
                            key={stepValue}
                            className={`step-mark ${stepValue === currentMark ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <div className="step-multipliers">
                    {Array.from({ length: TOTAL_MARKS }).map((_, index) => (
                        <div
                            key={index}
                            className={`step-multiplier ${index === currentMark ? 'active' : ''}`}
                        >x{index}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepSlider;