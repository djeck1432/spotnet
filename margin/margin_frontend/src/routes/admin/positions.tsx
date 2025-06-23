import  { useEffect, useState } from 'react';
import { Table, Spin, Alert } from 'antd';
import axios from 'axios';
import { createFileRoute } from '@tanstack/react-router';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
  { title: 'Borrowed Amount', dataIndex: 'borrowed_amount', key: 'borrowed_amount' },
  { title: 'Multiplier', dataIndex: 'multiplier', key: 'multiplier' },
  { title: 'Transaction ID', dataIndex: 'transaction_id', key: 'transaction_id' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Liquidated At', dataIndex: 'liquidated_at', key: 'liquidated_at',
    render: (text: string | null) => text ? new Date(text).toLocaleString() : '-' },
];

const AdminPositions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://0.0.0.0:8000/api/margin/all?limit=25&offset=0')
      .then(res => {
        setData(res.data.results || res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch positions');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <h2>All Opened Positions</h2>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
    </div>
  );
};

export const Route = createFileRoute('/admin/positions')({
  component: AdminPositions,
});

export default AdminPositions;
