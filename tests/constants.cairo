pub const HYPOTHETICAL_OWNER_ADDR: felt252 =
    0x059a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff;

pub mod contracts {
    pub const EKUBO_CORE_MAINNET: felt252 =
        0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b;

    pub const ZKLEND_MARKET: felt252 =
        0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05;

    pub const PRAGMA_ADDRESS: felt252 =
        0x02a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b;

    pub const TREASURY_ADDRESS: felt252 = 0x123; // Mock Address
}

pub mod tokens {
    pub const ETH: felt252 = 0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;
    pub const USDC: felt252 = 0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8;
}

pub mod pool_key {
    pub const FEE: u128 = 170141183460469235273462165868118016;
    pub const TICK_SPACING: u128 = 1000;
    pub const EXTENSION: felt252 = 0;
}
