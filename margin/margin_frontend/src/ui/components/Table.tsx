import React from 'react';
import { Table as AntdTable } from 'antd';

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
}

const Table = <T extends object>({ data, columns, loading }: TableProps<T>) => {
  const antdColumns = columns.map((col) => ({
    title: col.header,
    dataIndex: String(col.accessor),
    key: String(col.accessor),
    render: col.cell ? (_: any, record: T) => col.cell!(record) : undefined,
  }));

  return (
    <AntdTable
      columns={antdColumns}
      dataSource={data}
      loading={loading}
      rowKey={(record) => (record as any).id}
      pagination={false} 
      scroll={{ x: true }} 
      bordered
    />
  );
};

export default Table;