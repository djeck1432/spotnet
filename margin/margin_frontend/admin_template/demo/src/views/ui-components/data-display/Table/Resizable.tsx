import { useMemo } from 'react'
import Table from '@/components/ui/Table'
import {
    getCoreRowModel,
    flexRender,
    useReactTable,
} from '@tanstack/react-table'
import { data10 } from './data'
import type { Person } from './data'
import type { ColumnDef } from '@tanstack/react-table'

const { Tr, Th, Td, THead, TBody } = Table

function Resizable() {
    const data = useMemo(() => data10, [])

    const columns = useMemo<ColumnDef<Person>[]>(
        () => [
            { header: 'First Name', accessorKey: 'firstName' },
            { header: 'Last Name', accessorKey: 'lastName' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Gender', accessorKey: 'gender' },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Table>
            <THead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <Th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{
                                        position: 'relative',
                                        width: header.getSize(),
                                    }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                    {header.column.getCanResize() && (
                                        <div
                                            className={`table-resizer cursor-all-scroll ${
                                                header.column.getIsResizing()
                                                    ? 'isResizing'
                                                    : ''
                                            }`}
                                            onMouseDown={header.getResizeHandler()}
                                            onTouchStart={header.getResizeHandler()}
                                        ></div>
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
                                    <Td
                                        key={cell.id}
                                        style={{ width: cell.column.getSize() }}
                                    >
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
    )
}

export default Resizable
