import { createFileRoute } from "@tanstack/react-router";
import { Slider } from "../ui/core/trade/slider";
import { Graph } from "../ui/core/trade/graph";

export const Route = createFileRoute("/trade")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col lg:flex-row h-full gap-[24px] mt-[28px]">
			<div className="collapse lg:visible bg-[#0C1219] h-0 lg:h-[633px] pt-[20px] pr-[12px] 
			rounded-tr-2xl flex flex-col justify-between text-xs text-[#97A0A6] font-medium">
				<ul>
					<li className="px-[16px] py-[12px]">Trade</li>
					<li className="px-[16px] py-[12px]">Pool</li>
					<li className="px-[16px] py-[12px] active
					 bg-[#12171E] rounded-tr-4xl rounded-br-4xl text-[#F1F7FF]
					 border-1 border-[#1C73E8]/14 border-l-0 
					 ">Multiplayer</li>
				</ul>
				<ul>
					<li className="px-[16px] py-[12px]">Settings</li>
					<li className="px-[16px] py-[12px]">Log Out</li>
				</ul>
			</div>
			<div className="w-full">
				<h1 className="font-extrabold text-3xl text-[#1A232A]">
					TRADE
				</h1>
				<p className="text-[#F1F7FF]">
					Trade with precision. Multiplier your gain.
				</p>

				<Graph></Graph>
			</div>

			<div className="w-full flex flex-col mr-[80px] items-center lg:items-end r">

				<div className="collapse lg:visible text-[#656D77] text-sm flex
				 bg-[#0E1114] mb-[28px] gap-[2px] rounded-[6px]">
					<div className="w-[32px] h-[32px] flex items-center justify-center
					text-[#F1F7FF] font-bold bg-[#12181F] rounded-[6px]">
						1H
					</div>
					<div className="w-[32px] h-[32px] flex items-center justify-center">
						1D
					</div>
					<div className="w-[32px] h-[32px] flex items-center justify-center">
						1W
					</div>
					<div className="w-[32px] h-[32px] flex items-center justify-center">
						1M
					</div>
					<div className="w-[32px] h-[32px] flex items-center justify-center">
						1Y
					</div>
				</div>

				<div className="w-full max-w-[300px]">
					<div className="flex justify-between items-center w-full font-bricolageGrotesque">
						<div className="flex items-center  h-[37px] gap-[16px] text-[#556571]">
							<span className="p-[10px] font-extrabold text-[#00D1FF]  border-y-1 border-y-[#00D1FF] ">Trade</span>
							<span className="p-[10px]">Send</span>
							<span className="p-[10px]">Receive</span>
						</div>
						<div className="w-[20px] h-[20px] flex items-center justify-center">
							<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M11.75 2.75C11.75 2.58424 11.8158 2.42527 11.9331 2.30806C12.0503 2.19085 12.2092 2.125 12.375 2.125H14.875C15.0408 2.125 15.1997 2.19085 15.3169 2.30806C15.4342 2.42527 15.5 2.58424 15.5 2.75C15.5 2.91576 15.4342 3.07473 15.3169 3.19194C15.1997 3.30915 15.0408 3.375 14.875 3.375H12.375C12.2092 3.375 12.0503 3.30915 11.9331 3.19194C11.8158 3.07473 11.75 2.91576 11.75 2.75ZM1.125 3.375H9.25V4.625C9.25 4.79076 9.31585 4.94973 9.43306 5.06694C9.55027 5.18415 9.70924 5.25 9.875 5.25C10.0408 5.25 10.1997 5.18415 10.3169 5.06694C10.4342 4.94973 10.5 4.79076 10.5 4.625V0.875C10.5 0.70924 10.4342 0.550269 10.3169 0.433058C10.1997 0.315848 10.0408 0.25 9.875 0.25C9.70924 0.25 9.55027 0.315848 9.43306 0.433058C9.31585 0.550269 9.25 0.70924 9.25 0.875V2.125H1.125C0.95924 2.125 0.800269 2.19085 0.683058 2.30806C0.565848 2.42527 0.5 2.58424 0.5 2.75C0.5 2.91576 0.565848 3.07473 0.683058 3.19194C0.800269 3.30915 0.95924 3.375 1.125 3.375ZM14.875 9.625H7.375C7.20924 9.625 7.05027 9.69085 6.93306 9.80806C6.81585 9.92527 6.75 10.0842 6.75 10.25C6.75 10.4158 6.81585 10.5747 6.93306 10.6919C7.05027 10.8092 7.20924 10.875 7.375 10.875H14.875C15.0408 10.875 15.1997 10.8092 15.3169 10.6919C15.4342 10.5747 15.5 10.4158 15.5 10.25C15.5 10.0842 15.4342 9.92527 15.3169 9.80806C15.1997 9.69085 15.0408 9.625 14.875 9.625ZM4.875 7.75C4.70924 7.75 4.55027 7.81585 4.43306 7.93306C4.31585 8.05027 4.25 8.20924 4.25 8.375V9.625H1.125C0.95924 9.625 0.800269 9.69085 0.683058 9.80806C0.565848 9.92527 0.5 10.0842 0.5 10.25C0.5 10.4158 0.565848 10.5747 0.683058 10.6919C0.800269 10.8092 0.95924 10.875 1.125 10.875H4.25V12.125C4.25 12.2908 4.31585 12.4497 4.43306 12.5669C4.55027 12.6842 4.70924 12.75 4.875 12.75C5.04076 12.75 5.19973 12.6842 5.31694 12.5669C5.43415 12.4497 5.5 12.2908 5.5 12.125V8.375C5.5 8.20924 5.43415 8.05027 5.31694 7.93306C5.19973 7.81585 5.04076 7.75 4.875 7.75Z" fill="#556571" />
							</svg>
						</div>

					</div>


					<div className="mt-[12px] w-full items-center bg-[#0E1116]  py-[8px] px-[12px] rounded-t-xl">
						<div className="">
							<div className="text-xs text-[#556571] h-[18px] flex items-center">Sell</div>
						</div>
						<div className="mt-[16px] flex justify-between">
							<div>
								<div className="text-[18px] text-[#97A0A6] font-[700]">0.00</div>
								<div className="text-[#556571] text-[10px]">$ 0.00</div>
							</div>
							<div className="rounded-full p-[8px] bg-[#12181F] text-[#97A0A6] flex items-center min-w-[120px]">
								<img src="src/assets/img/ETH.png" className="size-[24px]" />
								<span className="ml-[4px] text-sm font-medium">ETH</span>
								<button className="ml-[17px] size-[20px]">
									<svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M13.692 1.94217L7.44205 8.19217C7.384 8.25028 7.31507 8.29638 7.2392 8.32783C7.16332 8.35928 7.082 8.37547 6.99986 8.37547C6.91773 8.37547 6.8364 8.35928 6.76052 8.32783C6.68465 8.29638 6.61572 8.25028 6.55767 8.19217L0.307672 1.94217C0.190396 1.82489 0.124512 1.66583 0.124512 1.49998C0.124512 1.33413 0.190396 1.17507 0.307672 1.05779C0.424947 0.940518 0.584007 0.874634 0.749859 0.874634C0.915712 0.874634 1.07477 0.940518 1.19205 1.05779L6.99986 6.86639L12.8077 1.05779C12.8657 0.999725 12.9347 0.953662 13.0106 0.922235C13.0864 0.890809 13.1677 0.874634 13.2499 0.874634C13.332 0.874634 13.4133 0.890809 13.4892 0.922235C13.565 0.953662 13.634 0.999725 13.692 1.05779C13.7501 1.11586 13.7962 1.1848 13.8276 1.26067C13.859 1.33654 13.8752 1.41786 13.8752 1.49998C13.8752 1.5821 13.859 1.66342 13.8276 1.73929C13.7962 1.81516 13.7501 1.8841 13.692 1.94217Z" fill="#556571" />
									</svg>

								</button>
							</div>
						</div>
					</div>

					<div className="mt-[4px] w-full items-center bg-[#0E1116] py-[8px] px-[12px] rounded-b-xl">
						<div className="">
							<div className="text-xs text-[#556571] h-[18px] flex items-center">Buy</div>
						</div>
						<div className="mt-[16px] flex justify-between">
							<div>
								<div className="text-[18px] text-[#97A0A6] font-[700]">0.00</div>
								<div className="text-[#556571] text-[10px]">$ 0.00</div>
							</div>
							<div className="rounded-full p-[8px] bg-[#12181F] text-[#97A0A6] flex items-center min-w-[120px]">
								<img src="src/assets/img/STRK.png" className="size-[24px]" />
								<span className="ml-[4px] text-sm font-medium">STRK</span>
								<button className="ml-[17px] size-[20px]">
									<svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M13.692 1.94217L7.44205 8.19217C7.384 8.25028 7.31507 8.29638 7.2392 8.32783C7.16332 8.35928 7.082 8.37547 6.99986 8.37547C6.91773 8.37547 6.8364 8.35928 6.76052 8.32783C6.68465 8.29638 6.61572 8.25028 6.55767 8.19217L0.307672 1.94217C0.190396 1.82489 0.124512 1.66583 0.124512 1.49998C0.124512 1.33413 0.190396 1.17507 0.307672 1.05779C0.424947 0.940518 0.584007 0.874634 0.749859 0.874634C0.915712 0.874634 1.07477 0.940518 1.19205 1.05779L6.99986 6.86639L12.8077 1.05779C12.8657 0.999725 12.9347 0.953662 13.0106 0.922235C13.0864 0.890809 13.1677 0.874634 13.2499 0.874634C13.332 0.874634 13.4133 0.890809 13.4892 0.922235C13.565 0.953662 13.634 0.999725 13.692 1.05779C13.7501 1.11586 13.7962 1.1848 13.8276 1.26067C13.859 1.33654 13.8752 1.41786 13.8752 1.49998C13.8752 1.5821 13.859 1.66342 13.8276 1.73929C13.7962 1.81516 13.7501 1.8841 13.692 1.94217Z" fill="#556571" />
									</svg>

								</button>
							</div>
						</div>
					</div>

					<button className="text-center w-full rounded-full bg-[#121519] h-[44px] text-[#556571]
						mt-[12px] font-medium text-sm">
						TRADE
					</button>
				</div>





				<form className="max-w-lg min-w-md block  border-1 border-[#17191B] rounded-xl p-[24px] h-fit mt-16">
					<div className="w-full">
						<label className="uppercase text-xs text-[#556571]">health factor level</label>
						<input type="number" className="rounded-full border-1 border-[#17191B] 
					block w-full h-[43px] mt-[6px] px-5 text-white"/>
					</div>

					<div className="w-full mt-[32px]">
						<label className="uppercase text-xs text-[#556571]">liquidation price</label>
						<input type="number" className="rounded-full border-1 border-[#17191B] 
					block w-full h-[43px] mt-[6px] px-5 text-white"/>
					</div>

					<div className="w-full mt-[32px]">
						<div className="justify-between flex">
							<label className="uppercase text-xs text-[#556571]">interest rate APY</label>
							<span className="text-xs text-[#E5E5E5]">
								Please fill this field <span className="text-red-500">*</span>
							</span>
						</div>
						<input type="number" className="rounded-full border-1 border-[#17191B] 
					block w-full h-[43px] mt-[6px] px-5 text-white" />
					</div>

					<div className="w-full mt-[32px]">
						<label className="uppercase text-xs text-[#556571]">Multiplier</label>
						<Slider className="mt-4"></Slider>
					</div>

					<button className="text-center w-full rounded-full bg-[#121519] h-[44px]
				 text-[#556571] mt-[32px] font-medium text-sm" type="submit">
						Trade
					</button>
				</form>
			</div>




		</div>
	);
}
