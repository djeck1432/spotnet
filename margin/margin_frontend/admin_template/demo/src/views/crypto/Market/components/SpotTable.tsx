import { useMemo } from 'react'
import classNames from 'classnames'
import DataTable from '@/components/shared/DataTable'
import { setTableData, Spot } from '../store'
import ActionColumn from './ActionColumn'
import growShrinkColor from '@/utils/growShrinkColor'
import cloneDeep from 'lodash/cloneDeep'
import { NumericFormat } from 'react-number-format'
import { useDispatch } from 'react-redux'
import type { TableQueries } from '@/@types/common'
import type { ColumnDef, OnSortParam } from '@/components/shared'

type SpotTableProps = {
    data?: Spot[]
    loading: boolean
    tableData: TableQueries
}

const SpotTable = ({ data, loading, tableData }: SpotTableProps) => {
    const dispatch = useDispatch()

    const columns: ColumnDef<Spot>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const { name } = props.row.original
                    return (
                        <span className="font-bold heading-text">{name}</span>
                    )
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span>
                            <NumericFormat
                                displayType="text"
                                value={(
                                    Math.round(row.amount * 100) / 100
                                ).toFixed(2)}
                                thousandSeparator={true}
                            />
                            <span> / </span>
                            <NumericFormat
                                displayType="text"
                                value={(
                                    Math.round(row.price * 100) / 100
                                ).toFixed(2)}
                                prefix={'$'}
                                thousandSeparator={true}
                            />
                        </span>
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
                header: '24h High /24h Low',
                accessorKey: 'high',
                cell: (props) => {
                    const { high, low } = props.row.original
                    return (
                        <span>
                            {high} / {low}
                        </span>
                    )
                },
            },
            {
                header: '24h Volumn',
                accessorKey: 'volumn',
                cell: (props) => {
                    const { volumn } = props.row.original
                    return (
                        <NumericFormat
                            displayType="text"
                            value={(Math.round(volumn * 100) / 100).toFixed(2)}
                            thousandSeparator={true}
                        />
                    )
                },
            },
            {
                header: '24h Turnover',
                accessorKey: 'turnOver',
                cell: (props) => {
                    const { turnOver } = props.row.original
                    return <span>${turnOver}M</span>
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

export default SpotTable
