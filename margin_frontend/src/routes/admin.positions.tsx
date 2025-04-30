// Updated to resolve merge conflicts
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import ky from "ky";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { HiOutlineTrash } from "react-icons/hi";

interface Position {
  id: string;
  user_id: string;
  borrowed_amount: string;
  multiplier: number;
  transaction_id: string;
  status: "Open" | "Closed";
  liquidated_at: string | null;
}

interface ApiResponse {
  items: Position[];
  total: number;
}

export const Route = createFileRoute("/admin/positions")({
  component: AdminPositions,
});

function AdminPositions() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<ApiResponse>({
    queryKey: ["positions", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const limit = pagination.pageSize;
      const offset = pagination.pageIndex * pagination.pageSize;
      const response = await ky
        .get(`/api/margin/all?limit=${limit}&offset=${offset}`)
        .json();
      return response as ApiResponse;
    },
  });

  const openPositions = useMemo(() => {
    return data?.items?.filter((pos: Position) => pos.status === "Open") ?? [];
  }, [data]);

  const hasMore = (data?.items?.length ?? 0) > 0;

  const columnHelper = createColumnHelper<Position>();
  const columns: ColumnDef<Position, any>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: { table: any }) => (
          <input
            type="checkbox"
            className="checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: { row: Row<Position> }) => (
          <input
            type="checkbox"
            className="checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      columnHelper.accessor("id", { header: "ID" }),
      columnHelper.accessor("user_id", { header: "User ID" }),
      columnHelper.accessor("borrowed_amount", { header: "Borrowed Amount" }),
      columnHelper.accessor("multiplier", { header: "Multiplier" }),
      columnHelper.accessor("transaction_id", { header: "Transaction ID" }),
      columnHelper.accessor("status", { header: "Status" }),
      columnHelper.accessor("liquidated_at", {
        header: "Liquidated At",
        cell: (info) => (info.getValue() ? info.getValue() : "N/A"),
      }),
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: Row<Position> }) => (
          <div className="flex justify-end text-lg">
            <span
              className="cursor-pointer p-2 hover:text-red-500"
              onClick={async () => {
                try {
                  await ky.post("/api/margin/delete", {
                    json: { ids: [row.original.id] },
                  });
                  alert("Position deleted successfully!");
                  await queryClient.invalidateQueries({
                    queryKey: ["positions"],
                  });
                } catch (err) {
                  alert("Error deleting position: " + (err as Error).message);
                }
              }}
            >
              <HiOutlineTrash className="w-5 h-5" />
            </span>
          </div>
        ),
      },
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: openPositions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    enableRowSelection: true,
    state: {
      pagination,
    },
    manualPagination: true,
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row: Row<Position>) => row.original);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="lg:flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0">
          Admin: Open Positions
        </h1>
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <button
              className="h-8 px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-500 rounded font-medium flex items-center"
              onClick={async () => {
                const ids = selectedRows.map((row) => row.id);
                try {
                  await ky.post("/api/margin/delete", { json: { ids } });
                  alert("Positions deleted successfully!");
                  await queryClient.invalidateQueries({
                    queryKey: ["positions"],
                  });
                } catch (err) {
                  alert("Error deleting positions: " + (err as Error).message);
                }
              }}
            >
              <HiOutlineTrash className="w-5 h-5 mr-1" />
              Delete Selected
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => header.column.toggleSorting()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() ? (
                      <span className="ml-1">
                        {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                      </span>
                    ) : (
                      ""
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row: Row<Position>) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {cell.column.id === "borrowed_amount" ? (
                      Number(cell.getValue<string>()).toFixed(2)
                    ) : cell.column.id === "liquidated_at" ? (
                      cell.getValue<string | null>() ? (
                        new Date(cell.getValue<string>()).toLocaleString()
                      ) : (
                        "N/A"
                      )
                    ) : cell.column.id === "status" ? (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cell.getValue<"Open" | "Closed">() === "Open"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cell.getValue<"Open" | "Closed">()}
                      </span>
                    ) : cell.column.id === "transaction_id" ? (
                      `${cell.getValue<string>().slice(0, 6)}...${cell.getValue<string>().slice(-4)}`
                    ) : cell.column.id === "id" ||
                      cell.column.id === "user_id" ? (
                      <span className="font-mono text-xs">
                        {`${cell.getValue<string>().slice(0, 8)}...`}
                      </span>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={pagination.pageIndex === 0}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {table.getState().pagination.pageIndex + 1}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!hasMore}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Next
            </button>
          </div>
          <div style={{ minWidth: 130 }}>
            <select
              className="border border-gray-300 rounded text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} / page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
