import { useState, useCallback, Suspense, lazy } from 'react'
import Container from '@/components/shared/Container'

const Step1 = lazy(() => import('./components/Step1'))
const Step2 = lazy(() => import('./components/Step2'))
const Step3 = lazy(() => import('./components/Step3'))
const Step4 = lazy(() => import('./components/Step4'))
const QuickStart = lazy(() => import('./components/QuickStart'))

const Welcome = () => {
    const [surveyStep, setSurveyStep] = useState(0)

    const handleNext = useCallback(() => {
        setSurveyStep(surveyStep + 1)
    }, [surveyStep])

    const handleBack = useCallback(() => {
        setSurveyStep(surveyStep - 1)
    }, [surveyStep])

    const handleSkip = () => {
        setSurveyStep(4)
    }

    return (
        <Container className="h-full">
            <div className="h-full flex flex-col items-center justify-center">
                <Suspense fallback={<></>}>
                    {surveyStep === 0 && (
                        <Step1 onNext={handleNext} onSkip={handleSkip} />
                    )}
                    {surveyStep === 1 && (
                        <Step2 onNext={handleNext} onBack={handleBack} />
                    )}
                    {surveyStep === 2 && (
                        <Step3 onNext={handleNext} onBack={handleBack} />
                    )}
                    {surveyStep === 3 && (
                        <Step4 onNext={handleNext} onBack={handleBack} />
                    )}
                    {surveyStep === 4 && <QuickStart />}
                </Suspense>
            </div>
        </Container>
    )
}

export default Welcome
