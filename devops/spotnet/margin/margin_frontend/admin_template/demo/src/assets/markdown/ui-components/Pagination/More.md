```jsx
import Pagination from '@/components/ui/Pagination'

const More = () => {
    return (
        <div>
            <div className="mb-4">
                <Pagination total={50} />
            </div>
            <div className="mb-4">
                <Pagination total={100} />
            </div>
        </div>
    )
}

export default More
```
