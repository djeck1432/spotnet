import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import ky from "ky";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Position {
  id: string;
  user_id: string;
  borrowed_amount: string;
  multiplier: number;
  transaction_id: string;
  status: string;
  liquidated_at: string | null;
}

export const Route = createFileRoute("/admin/positions")({
  component: AdminPositions,
});

function AdminPositions() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const response = await ky.get("/api/margin/all?limit=25&offset=0").json();
      return response as { items: Position[] };
    },
  });

  const openPositions = useMemo(() => {
    return data?.items?.filter((pos: Position) => pos.status === "Open") ?? [];
  }, [data]);

  const columnHelper = createColumnHelper<Position>();
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("user_id", { header: "User ID" }),
    columnHelper.accessor("borrowed_amount", { header: "Borrowed Amount" }),
    columnHelper.accessor("multiplier", { header: "Multiplier" }),
    columnHelper.accessor("transaction_id", { header: "Transaction ID" }),
    columnHelper.accessor("status", { header: "Status" }),
    columnHelper.accessor("liquidated_at", {
      header: "Liquidated At",
      cell: (info) => info.getValue() || "N/A",
    }),
  ];

  const table = useReactTable({
    data: openPositions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin: Open Positions</h1>
      {openPositions.length === 0 ? (
        <p>No open positions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2 border">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
