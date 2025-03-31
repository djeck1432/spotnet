```jsx
import Tooltip from '@/components/ui/Tooltip'

const Customize = () => {
    return (
        <div>
            <Tooltip
                title={
                    <div>
                        This is{' '}
                        <strong className="text-yellow-400">HTML</strong>
                    </div>
                }
            >
                <span className="cursor-pointer">Hover me</span>
            </Tooltip>
        </div>
    )
}

export default Customize
```
