```jsx
import { useState } from 'react'
import Calendar from '@/components/ui/Calendar'

const Basic = () => {
    const [value, setValue] = (useState < Date) | (null > null)

    return (
        <div className="md:w-[260px] max-w-[260px] mx-auto">
            <Calendar value={value} onChange={setValue} />
        </div>
    )
}

export default Basic
```
