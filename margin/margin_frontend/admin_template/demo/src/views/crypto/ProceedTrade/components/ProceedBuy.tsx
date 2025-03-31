import Button from '@/components/ui/Button'
import { paymentList } from '@/views/crypto/TradeForm/options.data'
import { NumericFormat } from 'react-number-format'
import Success from './Success'
import Failed from './Failed'
import InfoItem from './InfoItem'

export type ProceedBuyProps = {
    price?: number
    cryptoSymbol?: string
    payWith?: string
    amount?: number
    status?: 'SUCCESS' | 'FAILED' | ''
    loading?: boolean
    onConfirm: () => void
    onDone: (done?: boolean) => void
}

const ProceedBuy = (props: ProceedBuyProps) => {
    const {
        price,
        cryptoSymbol,
        payWith = '',
        amount = 0,
        status,
        loading,
        onConfirm,
    } = props

    return (
        <div className="mt-4">
            {status === 'SUCCESS' && <Success {...props} />}
            {status === 'FAILED' && <Failed {...props} />}
            {!status && (
                <>
                    <div className="text-center my-8">
                        <p className="mb-2">You will get</p>
                        <h3 className="font-bold">
                            {price} {cryptoSymbol}
                        </h3>
                    </div>
                    <InfoItem
                        label="Pay with"
                        value={(() => {
                            const payment = paymentList.find(
                                (p) => p.value === payWith,
                            )
                            return (
                                <div className="flex items-center gap-1">
                                    <img
                                        className="max-w-[35px]"
                                        src={payment?.img}
                                        alt=""
                                    />
                                    <span>{payment?.label}</span>
                                </div>
                            )
                        })()}
                    />
                    <InfoItem label="Price" value={price} />
                    <InfoItem
                        label="Amount"
                        value={
                            <NumericFormat
                                value={amount}
                                displayType="text"
                                suffix=" USD"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        }
                    />
                    <InfoItem
                        label="Transaction Fees (0.05%)"
                        value={
                            <NumericFormat
                                value={amount * 0.05}
                                displayType="text"
                                suffix=" USD"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        }
                    />
                    <InfoItem
                        label="Total"
                        value={
                            <NumericFormat
                                value={amount * 0.05 + amount}
                                displayType="text"
                                suffix=" USD"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        }
                    />
                    <Button
                        block
                        className="mt-6"
                        variant="solid"
                        loading={loading}
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </>
            )}
        </div>
    )
}

export default ProceedBuy
