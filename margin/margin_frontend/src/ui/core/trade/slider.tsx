import { useEffect, useRef, useState } from "react";
import "./slider.css";
import { classBuilder } from "../../../utils/utils";

interface SliderProps {
  className?: string;
}

export function Slider({ className = "" }: SliderProps) {
  const [value, setValue] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<string>("1.0");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);

  function sliderChanged(val: number) {
    setValue(val);
    const mult = (val / 10).toFixed(1);
    setMultiplier(mult);
    drawRuler(val);
  }

  function drawRuler(current: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const xPadding = 18;
    const totalTicks = 90;
    const gap = (canvas.width - 2 * xPadding) / totalTicks;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "10px serif";
    ctx.fillStyle = "#556571";

    for (let i = 0; i <= totalTicks; ++i) {
      const x = xPadding + i * gap;

      if (i % 10 === 0) {
        if ((i + 10) === Math.floor(current / 10) * 10) {
          ctx.fillStyle = "#fff";
        }
        ctx.fillText(String(i / 10 + 1), x - 2, 22);
        ctx.fillStyle = "#556571";
        ctx.fillRect(x, 0, 2, 10);
      } else {
        ctx.fillRect(x, 0, 2, 4);
      }
    }

    // Draw the current value marker
    const currentIndex = current - 10;
    const markerX = xPadding + currentIndex * gap;

    ctx.beginPath();
    ctx.arc(markerX, 3, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#00D1FF";
    ctx.fill();
  }

  useEffect(() => {
    if (rangeRef.current) {
      rangeRef.current.value = String(value);
      sliderChanged(value);
    }
  }, []);

  return (
      <div className="w-full relative flex flex-col items-center">
        <div
            className={classBuilder(
                className,
                "w-full h-[12px] relative bg-[#01060D] rounded-full"
            )}
        >
          <div
              className="absolute rounded-full bg-[#00D1FF] z-8"
              style={{
                right: `calc(${100 - value}% - 10px)`,
                width: "40px",
                height: "17px",
                top: "-4px"
              }}
          ></div>

          <div
              className="no-select absolute -top-[4px] z-10 text-[#06336E] text-[10px] font-semibold"
              style={{
                left: `calc(${value}% - 18px)`
              }}
          >
            {multiplier}
          </div>

          <input
              ref={rangeRef}
              onInput={(e) =>
                  sliderChanged(Number((e.target as HTMLInputElement).value))
              }
              type="range"
              min="10"
              max="100"
              className="absolute w-full top-0 h-[12px] opacity-0 cursor-pointer z-20"
          />
        </div>

        <canvas ref={canvasRef} className="h-[50px] mt-[12px] w-full" />
      </div>
  );
}
