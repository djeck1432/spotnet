import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Slider } from "../ui/core/trade/slider";
import { Graph } from "../ui/core/trade/graph";
import "../ui/core/trade/trade.css";
import { PeriodPicker } from "../ui/core/trade/period-picker";
import { TradeView } from "../ui/core/trade/trade-view";

export const Route = createFileRoute("/trade")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (value.trim() === "") {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
      <div className="flex flex-row h-full gap-[24px] mt-[28px] w-full">
        <div
            className="side-bar bg-[#0C1219] min-w-[223px] h-[633px] pt-[20px] pr-[12px]
        rounded-tr-2xl flex flex-col justify-between text-xs text-[#97A0A6] font-medium"
        >
          <ul>
            <li className="px-[16px] py-[12px] cursor-pointer">
              <a href="/trade">Trade</a>
            </li>
            <li className="px-[16px] py-[12px] cursor-pointer">
              <a href="/pool">Pool</a>
            </li>
            <li
                className="px-[16px] py-[12px] active
            bg-[#12171E] rounded-tr-4xl rounded-br-4xl text-[#F1F7FF]
            border-1 border-[#1C73E8]/14 border-l-0 cursor-pointer"
            >
              Multiplayer
            </li>
          </ul>
          <ul>
            <li className="px-[16px] py-[12px] cursor-pointer">Settings</li>
            <li className="px-[16px] py-[12px] cursor-pointer">Log Out</li>
          </ul>
        </div>

        <div className="w-full">
          <div className="flex justify-between mr-[80px]">
            <div>
              <h1 className="font-extrabold text-3xl text-[#1A232A] trade-title">TRADE</h1>
              <p className="text-[#F1F7FF] trade-description">
                Trade with precision. Multiplier your gain.
              </p>
            </div>
            <PeriodPicker className="mb-[28px]" />
          </div>

          <div className="trade-container flex flex-row gap-[24px] flex-wrap mr-[80px] max-w-fit mt-[20px] items-start">
            <div className="flex-1 max-w-[800px]">
              <Graph/>
            </div>

            <div className="flex flex-col items-end flex-1">
              <TradeView />
              <form
                  onSubmit={handleSubmit}
                  className="trade-form mt-10 w-full border-1 border-[#17191B]
              rounded-xl p-[24px] h-fit"
              >
                <div className="w-full">
                  <label className="uppercase text-xs text-[#556571]">
                    health factor level
                  </label>
                  <input
                      type="number"
                      className="rounded-full border-1 border-[#17191B]
                  block w-full h-[43px] mt-[6px] px-5 text-white"
                  />
                </div>

                <div className="w-full mt-[32px]">
                  <label className="uppercase text-xs text-[#556571]">
                    liquidation price
                  </label>
                  <input
                      type="number"
                      className="rounded-full border-1 border-[#17191B]
                  block w-full h-[43px] mt-[6px] px-5 text-white"
                  />
                </div>

                <div className="w-full mt-[32px]">
                  <div className="justify-between flex">
                    <label className="uppercase text-xs text-[#556571]">
                      interest rate APY
                    </label>
                    <span className="text-xs text-[#E5E5E5]">
                    Please fill this field <span className="text-red-500">*</span>
                  </span>
                  </div>
                  <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className={`rounded-full border-1
                  block w-full h-[43px] mt-[6px] px-5 text-white ${
                          error ? "border-red-500" : "border-[#17191B]"
                      } focus:outline-none focus:border-transparent`}
                  />
                  {error && (
                      <p className="text-red-500 text-xs mt-1">
                        This field is required.
                      </p>
                  )}
                </div>

                <div className="w-full mt-[32px]">
                  <label className="uppercase text-xs text-[#556571]">
                    Multiplier
                  </label>
                  <Slider className="mt-4" />
                </div>

                <button
                    type="submit"
                    className="text-center w-full rounded-full bg-[#121519] h-[44px]
                text-[#556571] mt-[32px] font-medium text-sm"
                >
                  Trade
                </button>
              </form>
            </div>
            <div className="w-full" />
          </div>
        </div>
      </div>
  );
}
