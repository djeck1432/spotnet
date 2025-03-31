```jsx
import Tooltip from '@/components/ui/Tooltip'

const DefaultOpen = () => {
    return (
        <div>
            <Tooltip title="Tooltip Message" isOpen={true} placement="right">
                <span>Default Open</span>
            </Tooltip>
        </div>
    )
}

export default DefaultOpen
```
