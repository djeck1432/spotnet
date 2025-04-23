import { useState } from 'react'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import TradeForm, { FormModel } from '@/views/crypto/TradeForm'
import ProceedTrade from '@/views/crypto/ProceedTrade'
import { toggleTradeDialog, useAppDispatch, useAppSelector } from '../store'
import { useNavigate } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

const FastTrade = ({ className }: { className?: string }) => {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const tradeDialogOpen = useAppSelector(
        (state) => state.cryptoDashboard.data.tradeDialogOpen,
    )

    const [status, setStatus] = useState('')
    const [confirmLoading, setConfirmLoading] = useState(false)

    const [showProceed, setShowProceed] = useState({})

    const handleTrade = (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
        trade: 'BUY' | 'SELL',
    ) => {
        setTimeout(() => {
            setSubmitting(false)
            dispatch(toggleTradeDialog(true))
            setShowProceed({ ...values, type: trade })
            setConfirmLoading(false)
            setStatus('')
        }, 500)
    }

    const onDialogClose = () => {
        dispatch(toggleTradeDialog(false))
        setTimeout(() => {
            setShowProceed({})
            setConfirmLoading(false)
            setStatus('')
        }, 300)
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
        <>
            <Card className={className}>
                <TradeForm
                    amount={29877.3}
                    symbol="BTC"
                    onBuy={(values, setSubmitting) =>
                        handleTrade(values, setSubmitting, 'BUY')
                    }
                    onSell={(values, setSubmitting) =>
                        handleTrade(values, setSubmitting, 'SELL')
                    }
                />
            </Card>
            <Dialog
                isOpen={tradeDialogOpen}
                width={400}
                onRequestClose={onDialogClose}
                onClose={onDialogClose}
            >
                <h5 className="mb-4">
                    {!isEmpty(showProceed) && !status && 'Order preview'}
                </h5>
                {!isEmpty(showProceed) && (
                    <ProceedTrade
                        loading={confirmLoading}
                        status={status as 'SUCCESS' | 'FAILED' | ''}
                        onConfirm={hadleConfirm}
                        onDone={handleDone}
                        {...showProceed}
                    />
                )}
            </Dialog>
        </>
    )
}

export default FastTrade
