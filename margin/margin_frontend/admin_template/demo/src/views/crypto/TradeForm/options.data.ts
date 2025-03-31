export type Currency = {
    label: string
    img: string
    value: string
    rate: number
}

export type Payment = {
    name: string
    label: string
    value: string
    img: string
}

export const currencyList: Currency[] = [
    {
        label: 'BTC',
        img: '/img/thumbs/bitcoin.png',
        value: 'BTC',
        rate: 29877.3,
    },
    {
        label: 'ETH',
        img: '/img/thumbs/ethereum.png',
        value: 'ETH',
        rate: 1785.91,
    },
    {
        label: 'USDT',
        img: '/img/thumbs/tether-us.png',
        value: 'USDT',
        rate: 1,
    },
    {
        label: 'SOL',
        img: '/img/thumbs/solana.png',
        value: 'SOL',
        rate: 40.25,
    },
    {
        label: 'DOGE',
        img: '/img/thumbs/doge.png',
        value: 'DOGE',
        rate: 0.07979,
    },
    {
        label: 'DOT',
        img: '/img/thumbs/polkadot.png',
        value: 'DOT',
        rate: 0.07979,
    },
    {
        label: 'TRX',
        img: '/img/thumbs/tron.png',
        value: 'TRX',
        rate: 0.31,
    },
    {
        label: 'AVAX',
        img: '/img/thumbs/avalanche.png',
        value: 'AVAX',
        rate: 24.65,
    },
    {
        label: 'SHIB',
        img: '/img/thumbs/shiba-inu.png',
        value: 'SHIB',
        rate: 24.65,
    },
    {
        label: 'MATIC',
        img: '/img/thumbs/polygon.png',
        value: 'MATIC',
        rate: 0.633,
    },
    {
        label: 'XLM',
        img: '/img/thumbs/stellar-lumens.png',
        value: 'XLM',
        rate: 0.1404,
    },
    {
        label: 'EOS',
        img: '/img/thumbs/eos.png',
        value: 'EOS',
        rate: 1.25,
    },
    {
        label: 'XRP',
        img: '/img/thumbs/ripple.png',
        value: 'XRP',
        rate: 0.34,
    },
    {
        label: 'LINK',
        img: '/img/thumbs/chainlink.png',
        value: 'LINK',
        rate: 6.62,
    },
    {
        label: 'BCH',
        img: '/img/thumbs/bitcoin-cash.png',
        value: 'BCH',
        rate: 149,
    },
    {
        label: 'LTC',
        img: '/img/thumbs/litecoin.png',
        value: 'LTC',
        rate: 49.5,
    },
    {
        label: 'BSV',
        img: '/img/thumbs/bitcoin-sv.png',
        value: 'BSV',
        rate: 50.54,
    },
    {
        label: 'ADA',
        img: '/img/thumbs/cardano.png',
        value: 'ADA',
        rate: 0.508,
    },
    {
        label: 'XMR',
        img: '/img/thumbs/monero.png',
        value: 'XMR',
        rate: 160.2,
    },
    {
        label: 'IOTA',
        img: '/img/thumbs/miota.png',
        value: 'IOTA',
        rate: 0.28,
    },
]

export const paymentList: Payment[] = [
    {
        name: 'VISA',
        label: 'VISA •••• 6165',
        value: 'VISA',
        img: '/img/others/img-8.png',
    },
    {
        name: 'MASTER',
        label: 'MASTER •••• 6165',
        value: 'MASTER',
        img: '/img/others/img-9.png',
    },
    {
        name: 'Paypal',
        label: 'Paypal cookie_lukie@gmail.com',
        value: 'PAYPAL',
        img: '/img/others/img-10.png',
    },
    {
        name: 'Wallet',
        label: 'Wallet Ballance $26,322,574.87',
        value: 'WALLET',
        img: '/img/others/img-17.png',
    },
]

export default currencyList
