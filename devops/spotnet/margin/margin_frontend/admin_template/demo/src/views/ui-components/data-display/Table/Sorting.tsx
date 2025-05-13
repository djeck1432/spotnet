import { useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: string
}

const columns: ColumnDef<Person>[] = [
    {
        header: 'First Name',
        accessorKey: 'firstName',
    },
    {
        header: 'Last Name',
        accessorKey: 'lastName',
    },
    {
        header: 'Age',
        accessorKey: 'age',
    },
    {
        header: 'Visits',
        accessorKey: 'visits',
    },
    {
        header: 'Status',
        accessorKey: 'status',
    },
    {
        header: 'Profile Progress',
        accessorKey: 'progress',
    },
]

const data = [
    {
        firstName: 'Maria',
        lastName: 'Anders',
        age: 24,
        visits: 28,
        progress: 56,
        status: 'complicated',
    },
    {
        firstName: 'Francisco',
        lastName: 'Chang',
        age: 9,
        visits: 90,
        progress: 77,
        status: 'single',
    },
    {
        firstName: 'Roland',
        lastName: 'Mendel',
        age: 1,
        visits: 16,
        progress: 56,
        status: 'single',
    },
    {
        firstName: 'Helen',
        lastName: 'Bennett',
        age: 43,
        visits: 94,
        progress: 53,
        status: 'single',
    },
    {
        firstName: 'Yoshi ',
        lastName: 'Tannamuri',
        age: 37,
        visits: 85,
        progress: 28,
        status: 'single',
    },
]

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const Sorting = () => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                                {
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                }
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table
                        .getRowModel()
                        .rows.slice(0, 10)
                        .map((row) => {
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
            </Table>
        </>
    )
}

export default Sorting
