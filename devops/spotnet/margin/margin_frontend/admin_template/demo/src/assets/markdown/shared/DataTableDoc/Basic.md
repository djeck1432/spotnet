```jsx
import { useState, useEffect, useMemo } from 'react'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import axios from 'axios'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'

type Customer = {
    id: string;
    name: string;
    email: string;
}

const Basic = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number;
        };
        query: string
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    })

    const columns: ColumnDef<Customer>[] = useMemo(() => {
        return [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <Button size="xs" onClick={() => console.log('Action clicked', props)}>
                        Action
                    </Button>
                ),
            },
        ]
    }, [])

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageSize } }))
    }

    const handleSort = ({ order, key }: OnSortParam) => {
        setTableData((prevData) => ({
            ...prevData,
            sort: { order, key }
        }))
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await axios.post('/api/crm/customers', tableData)
            if (response.data) {
                setData(response.data.data)
                setLoading(false)
                setTableData((prevData) => ({
                    ...prevData,
                    ...{ total: response.data.total },
                }))
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize])

    return (
        <DataTable<Customer>
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total: tableData.total,
                pageIndex: tableData.pageIndex,
                pageSize: tableData.pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
        />
    )
}

export default Basic
```
