import { useEffect, useMemo, lazy, Suspense } from 'react'
import Container from '@/components/shared/Container'
import AdaptableCard from '@/components/shared/AdaptableCard'
import FormStep from './components/FormStep'
import reducer, {
    getForm,
    setStepStatus,
    setFormData,
    setCurrentStep,
    useAppDispatch,
    useAppSelector,
    PersonalInformation as PersonalInformationType,
    Identification as IdentificationType,
    Address,
    FinancialInformation as FinancialInformationType,
} from './store'
import { injectReducer } from '@/store'

injectReducer('accountDetailForm', reducer)

const PersonalInformation = lazy(
    () => import('./components/PersonalInformation'),
)
const Identification = lazy(() => import('./components/Identification'))
const AddressInfomation = lazy(() => import('./components/AddressInfomation'))
const FinancialInformation = lazy(
    () => import('./components/FinancialInformation'),
)
const AccountReview = lazy(() => import('./components/AccountReview'))

const DetailForm = () => {
    const dispatch = useAppDispatch()
    const stepStatus = useAppSelector(
        (state) => state.accountDetailForm.data.stepStatus,
    )
    const currentStep = useAppSelector(
        (state) => state.accountDetailForm.data.currentStep,
    )
    const formData = useAppSelector(
        (state) => state.accountDetailForm.data.formData,
    )

    useEffect(() => {
        dispatch(getForm())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleNextChange = (
        values:
            | PersonalInformationType
            | IdentificationType
            | Address
            | FinancialInformationType,
        name: string,
    ) => {
        const nextStep = currentStep + 1
        dispatch(setFormData({ [name]: values }))
        dispatch(
            setStepStatus({
                [currentStep]: { status: 'complete' },
                [nextStep]: { status: 'current' },
            }),
        )
        dispatch(setCurrentStep(nextStep))
    }

    const handleBackChange = () => {
        const previousStep = currentStep - 1
        dispatch(setCurrentStep(previousStep))
    }

    const currentStepStatus = useMemo(
        () => stepStatus[currentStep].status,
        [stepStatus, currentStep],
    )

    return (
        <Container className="h-full">
            <AdaptableCard className="h-full" bodyClass="h-full">
                <div className="grid lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-5 gap-4 h-full">
                    {currentStep !== 4 && (
                        <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-2">
                            <FormStep
                                currentStep={currentStep}
                                currentStepStatus={currentStepStatus}
                                stepStatus={stepStatus}
                            />
                        </div>
                    )}
                    <div
                        className={
                            currentStep !== 4
                                ? '2xl:col-span-4 lg:col-span-3 xl:col-span-2'
                                : 'lg:col-span-5'
                        }
                    >
                        <Suspense fallback={<></>}>
                            {currentStep === 0 && (
                                <PersonalInformation
                                    data={formData.personalInformation}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                />
                            )}
                            {currentStep === 1 && (
                                <Identification
                                    data={formData.identification}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                    onBackChange={handleBackChange}
                                />
                            )}
                            {currentStep === 2 && (
                                <AddressInfomation
                                    data={formData.addressInformation}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                    onBackChange={handleBackChange}
                                />
                            )}
                            {currentStep === 3 && (
                                <FinancialInformation
                                    data={formData.financialInformation}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                    onBackChange={handleBackChange}
                                />
                            )}
                            {currentStep === 4 && <AccountReview />}
                        </Suspense>
                    </div>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default DetailForm
