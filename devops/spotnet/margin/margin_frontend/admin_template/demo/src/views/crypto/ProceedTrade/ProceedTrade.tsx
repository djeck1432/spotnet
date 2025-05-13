import ProceedBuy, { ProceedBuyProps } from './components/ProceedBuy'
import ProceedSell, { ProceedSellProps } from './components/ProceedSell'

type ProceedTrade = ProceedBuyProps &
    ProceedSellProps & {
        type?: 'BUY' | 'SELL'
    }

const ProceedTrade = (props: ProceedTrade) => {
    const { type } = props

    return (
        <>
            {type === 'BUY' && <ProceedBuy {...props} />}
            {type === 'SELL' && <ProceedSell {...props} />}
        </>
    )
}

export default ProceedTrade
