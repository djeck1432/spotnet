import Button from '@/components/ui/Button'
import { HiDownload, HiOutlineTrash } from 'react-icons/hi'
import OrderTableSearch from './OrderTableSearch'
import { setDeleteMode, useAppDispatch, useAppSelector } from '../store'
import { Link } from 'react-router-dom'

const BatchDeleteButton = () => {
    const dispatch = useAppDispatch()

    const onBatchDelete = () => {
        dispatch(setDeleteMode('batch'))
    }

    return (
        <Button
            variant="solid"
            color="red-600"
            size="sm"
            icon={<HiOutlineTrash />}
            onClick={onBatchDelete}
        >
            Batch Delete
        </Button>
    )
}

const OrdersTableTools = () => {
    const selectedRows = useAppSelector(
        (state) => state.salesOrderList.data.selectedRows,
    )
    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {selectedRows.length > 0 && <BatchDeleteButton />}
            <Link download to="/data/order-list.csv" target="_blank">
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link>
            <OrderTableSearch />
        </div>
    )
}

export default OrdersTableTools
