import { createSlice } from "@reduxjs/toolkit";
// import { apiGetCryptoDashboardData } from '@/services/CryptoService'

type Stat = {
  series: {
    name: string;
    data: number[];
  }[];
  timeRange: string[];
};

export type PortfolioStats = Record<string, Stat>;

export type Acivity = {
  coinValue: number;
  fiatValue: number;
  symbol: string;
  curency: string;
  action: string;
  actionType: number;
};

export type Market = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  volumn: number;
  marketCap: number;
  img: string;
};

export type Holding = {
  icon: string;
  symbol: string;
  name: string;
  fiatValue: number;
  coinValue: number;
  growshrink: number;
  address: string;
};

export type DashboardData = {
  portfolioStatsData: PortfolioStats;
  recentAcivityData: { date: string; data: Acivity[] }[];
  marketValueData: Market[];
  holdingsData: Holding[];
};

type GetCryptoDashboardDataResponse = DashboardData;

export type CryptoDashboardState = {
  loading: boolean;
  dashboardData: Partial<DashboardData>;
  tradeDialogOpen: boolean;
};

const initialState: CryptoDashboardState = {
  loading: false,
  dashboardData: {
    portfolioStatsData: {
      "1M": {
        series: [{ name: "Value", data: [100, 120, 150, 170, 200] }],
        timeRange: ["Jan", "Feb", "Mar", "Apr", "May"],
      },
    },
    recentAcivityData: [
      {
        date: "2023-10-01",
        data: [
          {
            coinValue: 1.5,
            fiatValue: 1500,
            symbol: "BTC",
            curency: "USD",
            action: "Buy",
            actionType: 1,
          },
        ],
      },
    ],
    marketValueData: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        price: 30000,
        change: 2.5,
        volumn: 1000000,
        marketCap: 600000000,
        img: "bitcoin.png",
      },
    ],
    holdingsData: [
      {
        icon: "bitcoin.png",
        symbol: "BTC",
        name: "Bitcoin",
        fiatValue: 1500,
        coinValue: 0.05,
        growshrink: 2.5,
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      },
    ],
  },
  tradeDialogOpen: false,
};

export const SLICE_NAME = "cryptoDashboard";

const cryptoDashboardSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    toggleTradeDialog: (state, action) => {
      state.tradeDialogOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const { toggleTradeDialog } = cryptoDashboardSlice.actions;

export default cryptoDashboardSlice.reducer;
