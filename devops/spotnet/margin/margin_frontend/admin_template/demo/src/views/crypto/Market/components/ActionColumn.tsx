import { useCallback } from 'react'
import Button from '@/components/ui/Button'
import {
    toggleTradeDialog,
    setSelectedRow,
    useAppDispatch,
    Row,
} from '../store'

const ActionColumn = ({ row }: { row: Row }) => {
    const dispatch = useAppDispatch()

    const onTrade = useCallback(() => {
        dispatch(toggleTradeDialog(true))
        dispatch(setSelectedRow(row))
    }, [dispatch, row])

    return (
        <div className="ltr:text-right rtl:text-left">
            <Button size="sm" onClick={onTrade}>
                Trade
            </Button>
        </div>
    )
}

export default ActionColumn
