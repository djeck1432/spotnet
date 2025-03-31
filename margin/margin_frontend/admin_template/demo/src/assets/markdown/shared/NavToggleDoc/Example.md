```jsx
import { useState } from 'react'
import Button from '@/components/ui/Button'
import NavToggle from '@/components/shared/NavToggle'

const Example = () => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Button
            shape="circle"
            variant="plain"
            icon={<NavToggle toggled={collapsed} />}
            onClick={() => setCollapsed(!collapsed)}
        />
    )
}

export default Example
```
