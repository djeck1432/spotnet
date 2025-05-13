```jsx
import Switcher from '@/components/ui/Switcher'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import type { ReactNode } from 'react'

const withIcon = (component: ReactNode) => {
    return <div className="text-lg">{component}</div>
}

const Content = () => {
    return (
        <div>
            <div className="mb-4">
                <Switcher checkedContent="a" unCheckedContent="b" />
            </div>
            <div className="mb-4">
                <Switcher
                    unCheckedContent={withIcon(<RiMoonClearLine />)}
                    checkedContent={withIcon(<RiSunLine />)}
                />
            </div>
        </div>
    )
}

export default Content
```
