import { FormItem, FormContainer } from '@/components/ui/Form'
import Segment from '@/components/ui/Segment'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import SegmentItemOption from '@/components/shared/SegmentItemOption'
import {
    HiOutlineBookOpen,
    HiOutlineClock,
    HiOutlineAdjustments,
    HiOutlineSparkles,
    HiArrowSmLeft,
} from 'react-icons/hi'
import type { CallbackSetBack } from '../types'
import type { FieldProps } from 'formik'
import type { ReactNode } from 'react'

type Step4Props = CallbackSetBack

const roles: {
    value: string
    label: string
    icon: ReactNode
    disabled?: boolean
}[] = [
    {
        value: '0',
        label: 'Start project from scratch',
        icon: <HiOutlineBookOpen />,
    },
    {
        value: '1',
        label: 'Automate time consuming tasks',
        icon: <HiOutlineClock />,
    },
    {
        value: '2',
        label: 'Enhance current workflow',
        icon: <HiOutlineAdjustments />,
    },
    { value: '3', label: 'Others', icon: <HiOutlineSparkles /> },
]

const Step4 = ({ onNext, onBack }: Step4Props) => {
    return (
        <div className="text-center">
            <h3 className="mb-2">What is your main objective with Elstar?</h3>
            <div className="mt-8 max-w-[600px] lg:min-w-[600px] mx-auto">
                <Formik
                    initialValues={{
                        role: '',
                    }}
                    onSubmit={() => {
                        console.log()
                    }}
                >
                    {({ touched, errors }) => {
                        return (
                            <Form>
                                <FormContainer>
                                    <FormItem
                                        invalid={errors.role && touched.role}
                                        errorMessage={errors.role}
                                    >
                                        <Field name="role">
                                            {({ field, form }: FieldProps) => (
                                                <Segment
                                                    value={[field.value]}
                                                    onChange={(val) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            val[0],
                                                        )
                                                        onNext?.()
                                                    }}
                                                >
                                                    <div className="w-full">
                                                        {roles.map((item) => (
                                                            <Segment.Item
                                                                key={item.value}
                                                                value={
                                                                    item.value
                                                                }
                                                                disabled={
                                                                    item.disabled
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    onSegmentItemClick,
                                                                    disabled,
                                                                }) => {
                                                                    return (
                                                                        <SegmentItemOption
                                                                            hoverable
                                                                            active={
                                                                                active
                                                                            }
                                                                            disabled={
                                                                                disabled
                                                                            }
                                                                            className="mb-4 bg-white dark:bg-gray-800"
                                                                            onSegmentItemClick={
                                                                                onSegmentItemClick
                                                                            }
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-2xl">
                                                                                    {
                                                                                        item.icon
                                                                                    }
                                                                                </span>
                                                                                <h6>
                                                                                    {
                                                                                        item.label
                                                                                    }
                                                                                </h6>
                                                                            </div>
                                                                        </SegmentItemOption>
                                                                    )
                                                                }}
                                                            </Segment.Item>
                                                        ))}
                                                    </div>
                                                </Segment>
                                            )}
                                        </Field>
                                    </FormItem>
                                    <Button
                                        block
                                        variant="plain"
                                        type="button"
                                        icon={<HiArrowSmLeft />}
                                        onClick={onBack}
                                    >
                                        Back
                                    </Button>
                                </FormContainer>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default Step4
