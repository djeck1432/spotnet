import { useState } from 'react'
import Input from '@/components/ui/Input'
import type { ChangeEvent } from 'react'

const ControlledInput = () => {
    const [value, setValue] = useState('')
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value)

    return (
        <div>
            <Input
                value={value}
                placeholder="Sample placeholder"
                onChange={handleChange}
            />
        </div>
    )
}

export default ControlledInput
