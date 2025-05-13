```jsx
import Tag from '@/components/ui/Tag'

const Custom = () => {
    return (
        <div className="flex">
            <div className="mr-2 rtl:ml-2">
                <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
                    Tag 1
                </Tag>
            </div>
            <div className="mr-2 rtl:ml-2">
                <Tag className="text-white bg-indigo-600 border-0">Tag 2</Tag>
            </div>
            <div className="mr-2 rtl:ml-2">
                <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded">
                    Tag 3
                </Tag>
            </div>
        </div>
    )
}

export default Custom
```
