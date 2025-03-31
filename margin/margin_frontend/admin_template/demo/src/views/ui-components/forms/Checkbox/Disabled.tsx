import { useState } from 'react'
import Checkbox from '@/components/ui/Checkbox'

const Disabled = () => {
    const [selected] = useState(['A'])

    const checkboxes = [
        { value: 'A', label: 'Selection A', disabled: true },
        { value: 'B', label: 'Selection B', disabled: true },
        { value: 'C', label: 'Selection C', disabled: false },
    ]

    return (
        <div>
            <div className="mb-3">
                <Checkbox disabled>Disabled</Checkbox>
                <Checkbox defaultChecked disabled>
                    Checked Disabled
                </Checkbox>
            </div>
            <Checkbox.Group value={selected}>
                {checkboxes.map((checkbox) => (
                    <Checkbox
                        key={checkbox.label}
                        value={checkbox.value}
                        disabled={checkbox.disabled}
                    >
                        {checkbox.label}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </div>
    )
}

export default Disabled
