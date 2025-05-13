import { useState } from 'react'
import Steps from '@/components/ui/Steps'

const Clickable = () => {
    const [step, setStep] = useState(1)

    const onStepChange = (index: number) => {
        setStep(index)
    }

    return (
        <div>
            <Steps current={step} onChange={(index) => onStepChange(index)}>
                <Steps.Item title="Login" />
                <Steps.Item title="Order Placed" />
                <Steps.Item title="In Review" />
                <Steps.Item title="Approved" />
            </Steps>
        </div>
    )
}

export default Clickable
