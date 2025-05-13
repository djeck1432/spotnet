import { Fragment } from 'react'
import Table from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import isLastChild from '@/utils/isLastChild'

export type Product = {
    id: string
    name: string
    productCode: string
    img: string
    price: number
    quantity: number
    total: number
    details: {
        color: string[]
        size: string[]
    }
}

export type Summary = {
    subTotal: number
    tax: number
    deliveryFees: number
    total: number
}

type ContentTableProps = {
    products?: Product[]
    summary?: Partial<Summary>
}

type TFootRowsProps = {
    label: string
    value?: number
}

const { Tr, Th, Td, THead, TBody, TFoot } = Table

const TFootRows = ({ label, value }: TFootRowsProps) => {
    return (
        <Tr>
            <Td className="!border-t-0" colSpan={2}></Td>
            <Td className="font-semibold !border-t-0">{label}</Td>
            <Td className="!py-5 !border-t-0">
                <PriceAmount amount={value} />
            </Td>
        </Tr>
    )
}

const ProductColumn = ({ row }: { row: Product }) => {
    return (
        <div className="flex">
            <div className="ltr:ml-2 rtl:mr-2">
                <h6 className="mb-2">{row.name}</h6>
                {Object.keys(row.details).map((key, i) => (
                    <div key={key + i} className="mb-1">
                        <span className="capitalize">{key}: </span>
                        {row.details[key as keyof Product['details']].map(
                            (item, j) => (
                                <Fragment key={item + j}>
                                    <span className="font-semibold">
                                        {item}
                                    </span>
                                    {!isLastChild(
                                        row.details[
                                            key as keyof Product['details']
                                        ],
                                        j,
                                    ) && <span>, </span>}
                                </Fragment>
                            ),
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const PriceAmount = ({ amount = 0 }: { amount?: number }) => {
    return (
        <NumericFormat
            displayType="text"
            value={(Math.round(amount * 100) / 100).toFixed(2)}
            prefix={'$'}
            thousandSeparator={true}
        />
    )
}

const columnHelper = createColumnHelper<Product>()

const columns = [
    columnHelper.accessor('name', {
        header: 'Product',
        cell: (props) => {
            const row = props.row.original
            return <ProductColumn row={row} />
        },
    }),
    columnHelper.accessor('price', {
        header: 'Price',
        cell: (props) => {
            const row = props.row.original
            return <PriceAmount amount={row.price} />
        },
    }),
    columnHelper.accessor('quantity', {
        header: 'Quantity',
    }),
    columnHelper.accessor('total', {
        header: 'Total',
        cell: (props) => {
            const row = props.row.original
            return <PriceAmount amount={row.price} />
        },
    }),
]

const ContentTable = ({ products = [], summary = {} }: ContentTableProps) => {
    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Table>
            <THead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </Th>
                            )
                        })}
                    </Tr>
                ))}
            </THead>
            <TBody>
                {table.getRowModel().rows.map((row) => {
                    return (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                                return (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </Td>
                                )
                            })}
                        </Tr>
                    )
                })}
            </TBody>
            <TFoot>
                <TFootRows label="Subtotal" value={summary.subTotal} />
                <TFootRows label="Delivery fee" value={summary.deliveryFees} />
                <TFootRows label="Tax(6%)" value={summary.tax} />
                <Tr>
                    <Td className="!border-t-0" colSpan={2}></Td>
                    <Td className="font-semibold text-base">Grand Total</Td>
                    <Td className="font-semibold text-base !py-5">
                        <PriceAmount amount={summary.total} />
                    </Td>
                </Tr>
            </TFoot>
        </Table>
    )
}

export default ContentTable
