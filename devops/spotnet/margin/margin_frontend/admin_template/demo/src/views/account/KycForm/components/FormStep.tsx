import { useDispatch } from 'react-redux'
import Menu from '@/components/ui/Menu'
import { HiCheckCircle, HiLockClosed } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { setCurrentStep, setStepStatus, StepStatus } from '../store'

type FormStepProps = {
    currentStep: number
    currentStepStatus: string
    stepStatus: StepStatus
}

const steps = [
    { label: 'Personal information', value: 0 },
    { label: 'Identification', value: 1 },
    { label: 'Address Information', value: 2 },
    { label: 'Financial Information', value: 3 },
]

const FormStep = ({
    currentStep,
    currentStepStatus,
    stepStatus,
}: FormStepProps) => {
    const { textTheme } = useThemeClass()
    const dispatch = useDispatch()

    const onStepChange = (step: number) => {
        const selectedStepStatus = stepStatus[step].status

        if (
            selectedStepStatus === 'complete' ||
            selectedStepStatus === 'current'
        ) {
            dispatch(setCurrentStep(step))
            return
        }

        if (step !== currentStep && step < currentStep) {
            if (currentStepStatus === 'pending') {
                dispatch(setStepStatus('complete'))
            }
            dispatch(setCurrentStep(step))
        }
    }

    return (
        <Menu variant="transparent" className="px-2">
            {steps.map((step) => (
                <Menu.MenuItem
                    key={step.value}
                    eventKey={step.value.toString()}
                    className={`mb-2`}
                    isActive={currentStep === step.value}
                    onSelect={() => onStepChange(step.value)}
                >
                    <span className="text-2xl ltr:mr-2 rtl:ml-2">
                        {stepStatus[step.value].status === 'complete' && (
                            <HiCheckCircle className={textTheme} />
                        )}
                        {stepStatus[step.value].status === 'current' && (
                            <HiCheckCircle className="text-gray-400" />
                        )}
                        {stepStatus[step.value].status === 'pending' &&
                            currentStep === step.value && (
                                <HiCheckCircle className="text-gray-400" />
                            )}
                        {stepStatus[step.value].status === 'pending' &&
                            currentStep !== step.value && (
                                <HiLockClosed className="text-gray-400" />
                            )}
                        {stepStatus[step.value].status === 'invalid' && (
                            <HiCheckCircle className="text-gray-400" />
                        )}
                    </span>
                    <span>{step.label}</span>
                </Menu.MenuItem>
            ))}
        </Menu>
    )
}

export default FormStep
