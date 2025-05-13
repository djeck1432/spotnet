import { useEffect, useMemo, useRef, useState } from "react";
import { classBuilder } from "../../../utils/utils";

interface GraphProps {
  className?: string;
}

type GraphState = {
  min: number;
  max: number;
};

export function Graph({ className = "" }: GraphProps) {
  const [state, setState] = useState<GraphState>({
    min: 0,
    max: 1,
  });

  const prices = useMemo(() => {
    const delta = state.max - state.min;
    return [
      state.max,
      state.min + (delta / 4) * 3,
      state.min + (delta / 4) * 2,
      state.min + delta / 4,
      state.min,
    ].map((price) => price.toFixed(4));
  }, [state]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const data = [
    {
      start: 3.9,
      finish: 3.7,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.8,
      finish: 4.0,
      min: 3.6,
      max: 4.0,
    },
    {
      start: 3.9,
      finish: 3.7,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.8,
      finish: 5.0,
      min: 3.6,
      max: 5.1,
    },
    {
      start: 3.8,
      finish: 3.6,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.9,
      finish: 3.7,
      min: 3.0,
      max: 4.0,
    },
    {
      start: 3.7,
      finish: 4.2,
      min: 3.7,
      max: 4.2,
    },
    {
      start: 4.2,
      finish: 4.95,
      min: 4.2,
      max: 5,
    },
    {
      start: 5,
      finish: 4.5,
      min: 4.5,
      max: 5.1,
    },
    {
      start: 4.5,
      finish: 4.8,
      min: 4.5,
      max: 4.859,
    },
    {
      start: 4.5,
      finish: 4.05,
      min: 4,
      max: 4.5,
    },
    {
      start: 3.9,
      finish: 3.7,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.8,
      finish: 4.0,
      min: 3.6,
      max: 4.0,
    },
    {
      start: 3.9,
      finish: 3.7,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.8,
      finish: 5.0,
      min: 3.6,
      max: 5.1,
    },
    {
      start: 3.8,
      finish: 3.6,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.9,
      finish: 3.7,
      min: 3.0,
      max: 4.0,
    },
    {
      start: 3.7,
      finish: 4.2,
      min: 3.7,
      max: 4.2,
    },
    {
      start: 4.2,
      finish: 4.95,
      min: 4.2,
      max: 5,
    },
    {
      start: 5,
      finish: 4.5,
      min: 4.5,
      max: 5.1,
    },
    {
      start: 4.5,
      finish: 4.8,
      min: 4.5,
      max: 4.859,
    },
    {
      start: 4.5,
      finish: 4.05,
      min: 4,
      max: 4.5,
    },
    {
      start: 3.9,
      finish: 3.7,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.8,
      finish: 4.0,
      min: 3.6,
      max: 4.0,
    },
    {
      start: 3.9,
      finish: 3.7,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.8,
      finish: 5.0,
      min: 3.6,
      max: 5.1,
    },
    {
      start: 3.8,
      finish: 3.6,
      min: 3.2,
      max: 3.9,
    },
    {
      start: 3.9,
      finish: 3.7,
      min: 3.0,
      max: 4.0,
    },
    {
      start: 3.7,
      finish: 4.2,
      min: 3.7,
      max: 4.2,
    },
    {
      start: 4.2,
      finish: 4.95,
      min: 4.2,
      max: 5,
    },
    {
      start: 5,
      finish: 4.5,
      min: 4.5,
      max: 5.1,
    },
    {
      start: 4.5,
      finish: 4.8,
      min: 4.5,
      max: 4.859,
    },
    {
      start: 4.5,
      finish: 4.05,
      min: 4,
      max: 4.5,
    },
  ];

  useEffect(() => {
    if (canvasRef.current == null) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const { min, max } = data.reduce(
      (acc, { min, max }) => {
        acc.min = Math.min(acc.min, min);
        acc.max = Math.max(acc.max, max);
        return acc;
      },
      { min: Infinity, max: -Infinity },
    );

    setState((prevState) => {
      if (prevState.min !== min || prevState.max !== max) {
        return { ...prevState, min, max };
      }
      return prevState;
    });
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    drawGraph(canvas, ctx);
  }, [data]);

  function drawGraph(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const size = state.max - state.min;
    let gap = Math.floor(canvas.width / data.length);
    gap = gap > 15 ? gap : 15;
    let i = 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const { start, finish, max, min } of data) {
      if (finish >= start) {
        ctx.fillStyle = "#00D1FF";
      } else {
        ctx.fillStyle = "#700000";
      }

      const y = ((state.max - max) / size) * canvas.height;
      const height = ((max - min) / size) * canvas.height;
      const enter = ((state.max - start) / size) * canvas.height;
      const exit = ((state.max - finish) / size) * canvas.height;
      ctx.fillRect(i * gap, y, 3, height);
      ctx.fillRect(i * gap - 3, enter, 6, 3);
      ctx.fillRect(i * gap + 3, exit, 3, 3);

      ++i;
    }
  }

  const verticalLabels = ["1H", "1H", "1H", "1H", "1H"];
  const horizontalLabels = Array(12).fill("1H");

  return (
    <div
      className={classBuilder(
        className,
        `graph-container w-[50vw] h-[60vh] bg-[#0E1116] p-[20px] flex flex-col
				 border-1 border-[#12181F]  rounded-[12px]`,
      )}
    >
      <div className="flex items-center components-title">
        <button className="px-[8px] py-[4px] text-[#A2B1C6] flex items-center gap-[8px] cursor-pointer">
          <span>ETH / USD</span>
          <svg
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.692 1.94217L7.44205 8.19217C7.384 8.25028 7.31507 8.29638 7.2392 8.32783C7.16332 8.35928 7.082 8.37547 6.99986 8.37547C6.91773 8.37547 6.8364 8.35928 6.76052 8.32783C6.68465 8.29638 6.61572 8.25028 6.55767 8.19217L0.307672 1.94217C0.190396 1.82489 0.124512 1.66583 0.124512 1.49998C0.124512 1.33413 0.190396 1.17507 0.307672 1.05779C0.424947 0.940518 0.584007 0.874634 0.749859 0.874634C0.915712 0.874634 1.07477 0.940518 1.19205 1.05779L6.99986 6.86639L12.8077 1.05779C12.8657 0.999725 12.9347 0.953662 13.0106 0.922235C13.0864 0.890809 13.1677 0.874634 13.2499 0.874634C13.332 0.874634 13.4133 0.890809 13.4892 0.922235C13.565 0.953662 13.634 0.999725 13.692 1.05779C13.7501 1.11586 13.7962 1.1848 13.8276 1.26067C13.859 1.33654 13.8752 1.41786 13.8752 1.49998C13.8752 1.5821 13.859 1.66342 13.8276 1.73929C13.7962 1.81516 13.7501 1.8841 13.692 1.94217Z"
              fill="#556571"
            />
          </svg>
        </button>
        <div className="px-[8px] py-[4px] text-[#556571] text-xs flex gap-[4px]">
          <span>7:45AM</span>
          <span className="w-[2px] rounded-[4px] bg-[#17191B] h-auto"></span>
          <span>MAR 10</span>
          <span className="w-[2px] rounded-[4px] bg-[#17191B] h-auto"></span>
          <span>UTC 9:45</span>
        </div>
      </div>
      <div className="mt-[24px] flex justify-between graph-components">
        <div>
          <div className="font-bricolageGrotesque font-semibold">
            <span className="price text-[#F1F7FF] text-[32px]">$2,505.58</span>
            <span className="ml-1 text-sm text-[#B4B4B4]">USD</span>
          </div>
          <span className="bg-[#12181F] text-[#E5E5E5] px-[12px] py-[6px] rounded-full text-sm">
            0.51(0.08%)
          </span>
        </div>
        <div className="flex h-[59px] font-bricolageGrotesque gap-[20px] unside-components">
          <div className="">
            <div className="text-xs text-[#556571]">Market Cap</div>
            <div className="font-bold text-[#F1F7FF] text-sm mt-[8px]">
              $499 M USD
            </div>
          </div>
          <div>
            <div className="text-xs text-[#556571]">24h Flight</div>
            <div className="font-bold text-[#F1F7FF] text-sm mt-[8px]">
              $6 M USD
            </div>
          </div>
          <div>
            <div className="text-xs text-[#556571]">Liquidity</div>
            <div className="font-bold text-[#F1F7FF] text-sm mt-[8px]">
              $238 M USD
            </div>
          </div>
        </div>
      </div>

      <div
        className="h-full mt-[24px] flex flex-col text-[#556571] text-xs relative
									font-bricolageGrotesque font-bold graph-table"
      >
        <div className="flex w-full grow relative">
          <div
            className="flex flex-col justify-around h-full items-center
							 w-[35px] pb-[35px] border-r-1 border-[#17191B]"
          >
              {verticalLabels.map((label, index) => (
                  <div key={index}>{label}</div>
              ))}
          </div>
          <div className="flex-1 grow flex flex-col">
            <div
                className="bg-[url('src/assets/img/trade-graph-bg.png')] absolute
                          left-[35px] top-0 right-[70px] bottom-[35px] bg-repeat opacity-30 graph-border"
            ></div>

            <canvas
              ref={canvasRef}
              className="w-full h-[80%] pr-[10px]"
            ></canvas>

            <div
              className="absolute bottom-0 flex  justify-around items-center  h-[35px]
							 border-t-1 left-[35px]  right-[70px] border-[#17191B]"
            >
              {horizontalLabels.map((label, index) => (
                  <div key={index}>{label}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-around h-full  px-[10px]">
            {prices.map((price) => (
              <div>{price}</div>
            ))}
          </div>

          <div className="absolute top-[50%] flex items-center left-[35px] right-0">
            <span className="grow border-1 w-full border-dashed border-[#2A3335]"></span>
            <span className="bg-[#2A3335] rounded-full w-[8px] h-[8px]"></span>
            <span
              className="bg-[#00D1FF] px-[10px] py-[8px] rounded-full text-xs
									text-[#06336E] font-semibold ml-[8px]"
            >
              4.0024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
