```jsx
import Alert from '@/components/ui/Alert'
import { HiFire } from 'react-icons/hi'

const Icon = () => {
    return (
        <div>
            <Alert showIcon type="success" customIcon={<HiFire />}>
                Additional description and information about copywriting.
            </Alert>
        </div>
    )
}

export default Icon
```
