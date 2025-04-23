import { useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { setTableData, useAppDispatch, TransactionDetails } from '../store'
import { statusColor } from '../constants'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type { TableQueries } from '@/@types/common'
import type { OnSortParam, ColumnDef } from '@/components/shared'

type DepositWithdrawalTableProps = {
    data: TransactionDetails[]
    loading?: boolean
    tableData: TableQueries
}

const DepositWithdrawalTable = ({
    data,
    loading,
    tableData,
}: DepositWithdrawalTableProps) => {
    const dispatch = useAppDispatch()

    const columns: ColumnDef<TransactionDetails>[] = useMemo(
        () => [
            {
                header: 'Transaction Id',
                accessorKey: 'id',
                cell: (props) => {
                    const row = props.row.original
                    return <span>TxID-{row.id}</span>
                },
            },
            {
                header: 'Date',
                accessorKey: 'date',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            {dayjs.unix(row.date).format('MM/DD/YYYY')}
                        </div>
                    )
                },
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.amount} USD</span>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={statusColor[status]?.dotClass} />
                            <span
                                className={`capitalize font-semibold ${statusColor[status]?.textClass}`}
                            >
                                {statusColor[status]?.label}
                            </span>
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total: tableData.total as number,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
        />
    )
}

export default DepositWithdrawalTable
