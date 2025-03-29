import { useEffect, useMemo, useRef, useState } from "react";

interface GraphProps {
    className?: string;
}

type GraphState = {
    min: number,
    max: number
}

export function Graph({ className = "" }: GraphProps) {

    const [state, setState] = useState<GraphState>({
        min: 0,
        max: 1
    })


    const prices = useMemo(() => {
        const delta = state.max - state.min;
        return [
            state.max,
            state.min + delta / 4,
            state.min + delta / 4 * 2,
            state.min + delta / 4 * 3,
            state.min
        ].map(price => price.toFixed(4))
    }, [state])
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const data = [
        {
            start: 3.9,
            finish: 3.7,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.8,
            finish: 4.0,
            min: 3.6,
            max: 4.0
        },
        {
            start: 3.9,
            finish: 3.7,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.8,
            finish: 5.0,
            min: 3.6,
            max: 5.1
        },
        {
            start: 3.8,
            finish: 3.6,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.9,
            finish: 3.7,
            min: 3.0,
            max: 4.0
        },
        {
            start: 3.7,
            finish: 4.2,
            min: 3.7,
            max: 4.2
        },
        {
            start: 4.2,
            finish: 4.95,
            min: 4.2,
            max: 5
        },
        {
            start: 5,
            finish: 4.5,
            min: 4.5,
            max: 5.1
        },
        {
            start: 4.5,
            finish: 4.8,
            min: 4.5,
            max: 4.859
        },
        {
            start: 4.5,
            finish: 4.05,
            min: 4,
            max: 4.5
        },
        {
            start: 3.9,
            finish: 3.7,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.8,
            finish: 4.0,
            min: 3.6,
            max: 4.0
        },
        {
            start: 3.9,
            finish: 3.7,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.8,
            finish: 5.0,
            min: 3.6,
            max: 5.1
        },
        {
            start: 3.8,
            finish: 3.6,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.9,
            finish: 3.7,
            min: 3.0,
            max: 4.0
        },
        {
            start: 3.7,
            finish: 4.2,
            min: 3.7,
            max: 4.2
        },
        {
            start: 4.2,
            finish: 4.95,
            min: 4.2,
            max: 5
        },
        {
            start: 5,
            finish: 4.5,
            min: 4.5,
            max: 5.1
        },
        {
            start: 4.5,
            finish: 4.8,
            min: 4.5,
            max: 4.859
        },
        {
            start: 4.5,
            finish: 4.05,
            min: 4,
            max: 4.5
        },
        {
            start: 3.9,
            finish: 3.7,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.8,
            finish: 4.0,
            min: 3.6,
            max: 4.0
        },
        {
            start: 3.9,
            finish: 3.7,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.8,
            finish: 5.0,
            min: 3.6,
            max: 5.1
        },
        {
            start: 3.8,
            finish: 3.6,
            min: 3.2,
            max: 3.9
        },
        {
            start: 3.9,
            finish: 3.7,
            min: 3.0,
            max: 4.0
        },
        {
            start: 3.7,
            finish: 4.2,
            min: 3.7,
            max: 4.2
        },
        {
            start: 4.2,
            finish: 4.95,
            min: 4.2,
            max: 5
        },
        {
            start: 5,
            finish: 4.5,
            min: 4.5,
            max: 5.1
        },
        {
            start: 4.5,
            finish: 4.8,
            min: 4.5,
            max: 4.859
        },
        {
            start: 4.5,
            finish: 4.05,
            min: 4,
            max: 4.5
        },
    ]

    useEffect(() => {
        if (canvasRef.current == null) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const { min, max } = data.reduce((acc, { min, max }) => {
            acc.min = Math.min(acc.min, min);
            acc.max = Math.max(acc.max, max);
            return acc;
        }, { min: Infinity, max: -Infinity });

        setState(prevState => {
            if (prevState.min !== min || prevState.max !== max) {
                return { ...prevState, min, max };
            }
            return prevState; 
        });
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        drawGraph(canvas, ctx)
    }, [data]);


    function drawGraph(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

        const size = state.max - state.min;
        let gap = Math.floor(canvas.width / data.length);
        gap = gap > 15 ? gap : 15;
        let i = 1;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const { start, finish, max, min } of data) {
            if (finish >= start) {
                ctx.fillStyle = '#00D1FF';
            } else {
                ctx.fillStyle = '#700000';
            }

            const y = (state.max - max) / size * canvas.height;
            const height = (max - min) / size * canvas.height;
            const enter = (state.max - start) / size * canvas.height;
            const exit = (state.max - finish) / size * canvas.height;
            ctx.fillRect(i * gap, y, 3, height)
            ctx.fillRect(i * gap - 3, enter, 6, 3)
            ctx.fillRect(i * gap + 3, exit, 3, 3)

            ++i;
        }
    }

    return (
        <div className="w-full h-[426px] bg-[#0E1116] p-[20px] flex flex-col
				 mt-[20px] border-1 border-[#12181F]  rounded-[12px]">
            <div className="flex items-center">
                <button className="px-[8px] py-[4px] text-[#A2B1C6]">
                    ETH / USD
                </button>
                <div className="px-[8px] py-[4px] text-[#556571] text-xs">
                    7:45AM | MAR 10 | UTC 9:45
                </div>
            </div>
            <div className="mt-[24px] flex justify-between">
                <div>
                    <div className="font-bricolageGrotesque font-semibold">
                        <span className=" text-[#F1F7FF] text-[32px]">$2,505.58</span>
                        <span className="ml-1 text-sm text-[#B4B4B4]">USD</span>
                    </div>
                    <span className="bg-[#12181F] text-[#E5E5E5] px-[12px] py-[6px] rounded-full text-sm">
                        0.51(0.08%)
                    </span>
                </div>
                <div className="flex h-[59px] font-bricolageGrotesque gap-[20px]">
                    <div className="">
                        <div className="text-xs text-[#556571]">Market Cap</div>
                        <div className="font-bold text-[#F1F7FF] text-sm mt-[8px]">$499 M USD</div>
                    </div>
                    <div>
                        <div className="text-xs text-[#556571]">24h Flight</div>
                        <div className="font-bold text-[#F1F7FF] text-sm mt-[8px]">$6 M USD</div>
                    </div>
                    <div>
                        <div className="text-xs text-[#556571]">Liquidity</div>
                        <div className="font-bold text-[#F1F7FF] text-sm mt-[8px]">$238 M USD</div>
                    </div>
                </div>
            </div>

            <div className="h-full mt-[24px] flex flex-col text-[#556571] text-xs relative
									font-bricolageGrotesque font-bold">
                <div className="flex w-full grow relative">
                    <div className="flex flex-col justify-around h-full items-center
							 w-[35px] pb-[35px] border-r-1">
                        <div>1H</div>
                        <div>1H</div>
                        <div>1H</div>
                        <div>1H</div>
                        <div>1H</div>
                    </div>
                    <div className="flex-1 grow flex flex-col">
                        <div
                            className="bg-[url('src/assets/img/trade-graph-bg.png')] absolute
                          left-[35px] top-0 right-[70px] bottom-[35px] bg-repeat opacity-30"></div>

                       
                        <canvas ref={canvasRef} className="w-full h-full max-h-[200px] pr-[10px]"></canvas>

                        <div className="absolute bottom-0 flex  justify-around items-center  h-[35px]
							 border-t-1 left-[35px]  right-[70px] ">
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                            <div>1H</div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-around h-full  px-[10px]">
                        {prices.map(price => (
                            <div>{price}</div>
                        ))}
                    </div>

                    <div className="absolute top-[50%] flex items-center left-[35px] right-0">
                        <span className="grow border-1 w-full border-dashed border-[#2A3335]"></span>
                        <span className="bg-[#2A3335] rounded-full w-[8px] h-[8px]"></span>
                        <span className="bg-[#00D1FF] px-[10px] py-[8px] rounded-full text-xs
									text-[#06336E] font-semibold ml-[8px]">3.6784</span>
                    </div>
                </div>
            </div>
        </div>
    )
}