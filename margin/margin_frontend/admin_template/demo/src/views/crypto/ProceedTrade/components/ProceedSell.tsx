import Button from '@/components/ui/Button'
import { NumericFormat } from 'react-number-format'
import Success from './Success'
import Failed from './Failed'
import InfoItem from './InfoItem'

export type ProceedSellProps = {
    price?: number
    cryptoSymbol?: string
    payWith?: string
    amount?: number
    status?: 'SUCCESS' | 'FAILED' | ''
    loading?: boolean
    onConfirm: () => void
    onDone: (done?: boolean) => void
}

const ProceedSell = (props: ProceedSellProps) => {
    const {
        price,
        cryptoSymbol,
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
                            <NumericFormat
                                value={amount - amount * 0.05}
                                displayType="text"
                                suffix=" USD"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                            />
                        </h3>
                    </div>
                    <InfoItem
                        label="Price"
                        value={
                            <NumericFormat
                                value={price}
                                displayType="text"
                                suffix={` ${cryptoSymbol}`}
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

export default ProceedSell
