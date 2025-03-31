import { useState } from 'react'
import Switcher from '@/components/ui/Switcher'

const Loading = () => {
    const [checked, setChecked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSwitcherToggle = () => {
        setIsLoading(true)
        setTimeout(() => {
            setChecked((checked) => !checked)
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div>
            <Switcher
                checked={checked}
                isLoading={isLoading}
                onChange={onSwitcherToggle}
            />
        </div>
    )
}

export default Loading
