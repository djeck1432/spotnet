import { useEffect, useState } from 'react';
import axios from 'axios';
import { createFileRoute } from '@tanstack/react-router';
import Table from '@/components/Table'; // Adjust the import path as needed
import { toast } from 'react-hot-toast';

interface Position {
  id: string;
  user_id: string;
  borrowed_amount: number;
  multiplier: number;
  transaction_id: string;
  status: string;
  liquidated_at: string | null;
}

const AdminPositions = () => {
  const [data, setData] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://0.0.0.0:8000/api/margin/all?limit=25&offset=0')
      .then(res => {
        setData(res.data.items || res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch positions');
        setLoading(false);
      });
  }, []);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      cell: (row: Position) => (
        <span
          onClick={() => copyToClipboard(row.id)}
          className="cursor-pointer text-blue-400 hover:underline"
          title={row.id}
        >
          {row.id.slice(0, 6)}...{row.id.slice(-4)}
        </span>
      ),
    },
    {
      header: 'User ID',
      accessor: 'user_id',
      cell: (row: Position) => (
        <span
          onClick={() => copyToClipboard(row.user_id)}
          className="cursor-pointer text-blue-400 hover:underline"
          title={row.user_id}
        >
          {row.user_id.slice(0, 6)}...{row.user_id.slice(-4)}
        </span>
      ),
    },
    {
      header: 'Borrowed Amount',
      accessor: 'borrowed_amount',
    },
    {
      header: 'Multiplier',
      accessor: 'multiplier',
    },
    {
      header: 'Transaction ID',
      accessor: 'transaction_id',
      cell: (row: Position) => (
        <span
          onClick={() => copyToClipboard(row.transaction_id)}
          className="cursor-pointer text-blue-400 hover:underline"
          title={row.transaction_id}
        >
          {row.transaction_id.slice(0, 6)}...{row.transaction_id.slice(-4)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row: Position) => (
        <span className={row.status === 'Open' ? 'text-green-400' : 'text-red-400'}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Liquidated At',
      accessor: 'liquidated_at',
      cell: (row: Position) => (
        row.liquidated_at
          ? new Date(row.liquidated_at).toLocaleString()
          : '-'
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h2 className="text-2xl font-semibold mb-6">All Opened Positions</h2>

      {error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : (
        <Table data={data} columns={columns} loading={loading} />
      )}
    </div>
  );
};

export const Route = createFileRoute('/admin/positions')({
  component: AdminPositions,
});

export default AdminPositions;
