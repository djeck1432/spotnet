import { useEffect, useRef, useState } from "react";
import "./slider.css";
import { classBuilder } from "../../../utils/utils";

interface SliderProps {
  className?: string;
}

export function Slider({ className = "" }: SliderProps) {
  const [_value, setValue] = useState<number>(1);
  const [multiplayer, setMultiplayer] = useState<string>("1.0");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);

  function sliderChanged(value: number) {
    setValue(value);
    const mult = (value / 10.0).toFixed(1);
    setMultiplayer(mult);
    drawRuler(Math.floor(value));
  }

  function drawRuler(current: number) {
    if (canvasRef.current == null) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.font = "10px serif";
    ctx.fillStyle = "#556571";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const x = 18;

    const gap = (canvas.width - x - x) / 90;
    for (let i = 0; i <= 90; ++i) {
      if (i % 10 == 0) {
        if (i + 10 == Math.floor(current / 10.0) * 10) {
          ctx.fillStyle = "#fff";
        }
        ctx.fillText(String(i / 10 + 1), x + i * gap - 2, 22);
        ctx.fillStyle = "#556571";
        ctx.fillRect(x + i * gap, 0, 2, 10);
      } else {
        ctx.fillRect(x + i * gap, 0, 2, 4);
      }
    }

    ctx.beginPath();
    ctx.arc(current * gap - 28, 3, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#00D1FF";
    ctx.fill();
  }

  useEffect(() => {
    rangeRef.current!.value = "10";
    sliderChanged(10);
  }, []);

  return (
    <div className="w-full relative flex flex-col items-center">
      <div
        className={classBuilder(
          className,
          "w-full h-[12px] relative bg-[#01060D] rounded-full",
        )}
      >
        <div
          className={`absolute rounded-full  bg-[#00D1FF] 
                left-[0px] right-[0px]
                 top-0 bottom-0 inset-shadow-[#171E2852]/32 pointer-events-none z-8`}
          style={{ right: `calc(${100 - Number(multiplayer) * 10}%  + 25px)` }}
        ></div>

        <div
          className="no-select absolute -top-[2px] z-10 text-[#06336E] text-[10px] font-semibold"
          style={{ left: `calc(${_value}% - 29px - ${_value * 0.05}px)` }}
        >
          {multiplayer}
        </div>

        <input
          ref={rangeRef}
          onInput={(event) =>
            sliderChanged(Number((event.target as HTMLInputElement).value))
          }
          type="range"
          min="10"
          max="100"
          className="absolute -top-[4px] left-0 right-0"
        />
      </div>

      <canvas
        ref={canvasRef}
        className="h-[50px] mt-[12px] left-[10px] right-[10px]  block w-full"
      ></canvas>
    </div>
  );
}
