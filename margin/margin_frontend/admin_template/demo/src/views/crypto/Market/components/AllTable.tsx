import { useMemo } from 'react'
import classNames from 'classnames'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import { setTableData, useAppDispatch, AllMarket } from '../store'
import ActionColumn from './ActionColumn'
import growShrinkColor from '@/utils/growShrinkColor'
import cloneDeep from 'lodash/cloneDeep'
import { NumericFormat } from 'react-number-format'
import type { TableQueries } from '@/@types/common'
import type { ColumnDef, OnSortParam } from '@/components/shared'

type AllTableProps = {
    data?: AllMarket[]
    loading: boolean
    tableData: TableQueries
}

const AllTable = ({ data, loading, tableData }: AllTableProps) => {
    const dispatch = useAppDispatch()

    const columns: ColumnDef<AllMarket>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const { img, symbol, name } = props.row.original
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={img}
                                size="sm"
                                className="!bg-transparent"
                            />
                            <span className="font-bold heading-text">
                                {symbol}
                            </span>
                            <span>{name}</span>
                        </div>
                    )
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <NumericFormat
                            displayType="text"
                            value={(Math.round(row.price * 100) / 100).toFixed(
                                2,
                            )}
                            suffix={' USD'}
                            thousandSeparator={true}
                        />
                    )
                },
            },
            {
                header: '24h Change',
                accessorKey: 'change',
                cell: (props) => {
                    const { change } = props.row.original
                    return (
                        <span
                            className={classNames(
                                'font-semibold',
                                growShrinkColor(change, 'text'),
                            )}
                        >
                            {change > 0 && '+'}
                            {change}%
                        </span>
                    )
                },
            },
            {
                header: '24h Volumn',
                accessorKey: 'volumn',
                cell: (props) => {
                    const { volumn } = props.row.original
                    return <span>{volumn}M</span>
                },
            },
            {
                header: 'Market Cap',
                accessorKey: 'marketCap',
                cell: (props) => {
                    const { marketCap } = props.row.original
                    return <span>${marketCap}M</span>
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    const row = props.row.original
                    return <ActionColumn row={row} />
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
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{
                width: 28,
                height: 28,
                className: 'rounded-md',
            }}
            loading={loading}
            pagingData={{
                total: tableData?.total as number,
                pageIndex: tableData?.pageIndex as number,
                pageSize: tableData?.pageSize as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
        />
    )
}

export default AllTable
