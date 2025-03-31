```jsx
import Upload from '@/components/ui/Upload'

const Disabled = () => {
    return (
        <div>
            <div className="mb-6">
                <Upload disabled />
            </div>
            <div>
                <Upload draggable disabled />
            </div>
        </div>
    )
}

export default Disabled
```
