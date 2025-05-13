import Pagination from '@/components/ui/Pagination'

const Basic = () => {
    const onPaginationChange = (page: number) => {
        console.log('onPaginationChange', page)
    }

    return (
        <div>
            <Pagination onChange={onPaginationChange} />
        </div>
    )
}

export default Basic
