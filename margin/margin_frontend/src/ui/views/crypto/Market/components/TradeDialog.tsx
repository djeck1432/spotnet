import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import {
    toggleTradeDialog,
    setSelectedRow,
    useAppDispatch,
    useAppSelector,
} from '../store'
import TradeForm, { FormModel } from '@/views/crypto/TradeForm'
import ProceedTrade from '@/views/crypto/ProceedTrade'
import { useNavigate } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

const TradeDialog = () => {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const tradeDialogOpen = useAppSelector(
        (state) => state.cryptoMarket.data.tradeDialogOpen,
    )
    const selectedRow = useAppSelector(
        (state) => state.cryptoMarket.data.selectedRow,
    )

    const [showProceed, setShowProceed] = useState({})
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [status, setStatus] = useState<'SUCCESS' | 'FAILED' | ''>('')

    const onDialogClose = () => {
        dispatch(toggleTradeDialog(false))
        setTimeout(() => {
            dispatch(setSelectedRow({}))
            setShowProceed({})
            setConfirmLoading(false)
            setStatus('')
        }, 500)
    }

    const handleTrade = (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
        trade: 'BUY' | 'SELL',
    ) => {
        setSubmitting(true)
        setTimeout(() => {
            setShowProceed({ ...values, type: trade })
            setConfirmLoading(false)
            setStatus('')
        }, 500)
    }

    const hadleConfirm = () => {
        setConfirmLoading(true)
        setTimeout(() => {
            setStatus('SUCCESS')
        }, 1000)
    }

    const handleDone = (shouldRedirect?: boolean) => {
        onDialogClose()
        if (shouldRedirect) {
            navigate('/app/crypto/wallets')
        }
    }

    return (
        <Dialog
            isOpen={tradeDialogOpen}
            closable={!status}
            width={400}
            onRequestClose={onDialogClose}
            onClose={onDialogClose}
        >
            <h5 className="mb-4">
                {isEmpty(showProceed) &&
                    !status &&
                    `Trade ${selectedRow.symbol}`}
                {!isEmpty(showProceed) && !status && 'Order preview'}
            </h5>
            {isEmpty(showProceed) ? (
                <TradeForm
                    amount={selectedRow.price as number}
                    symbol={selectedRow.symbol as string}
                    onBuy={(values, setSubmitting) =>
                        handleTrade(values, setSubmitting, 'BUY')
                    }
                    onSell={(values, setSubmitting) =>
                        handleTrade(values, setSubmitting, 'SELL')
                    }
                />
            ) : (
                <ProceedTrade
                    loading={confirmLoading}
                    status={status as 'SUCCESS' | 'FAILED' | ''}
                    onConfirm={hadleConfirm}
                    onDone={handleDone}
                    {...showProceed}
                />
            )}
        </Dialog>
    )
}

export default TradeDialog
