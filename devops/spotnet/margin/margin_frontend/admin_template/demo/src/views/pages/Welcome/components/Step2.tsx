import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { Field, Form, Formik } from 'formik'
import { HiArrowSmLeft } from 'react-icons/hi'
import * as Yup from 'yup'
import type { CallbackSetBack } from '../types'
import type { FieldProps } from 'formik'

type Step2Props = CallbackSetBack

const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required('Organization name is required'),
    organizationSize: Yup.string().required(
        'Please select your organization size',
    ),
})

const sizes = [
    { label: 'Solo', value: 'solo' },
    { label: '2 ~ 10 members', value: '2~10' },
    { label: '11 ~ 50 members', value: '11~50' },
    { label: '51 ~ 200 members', value: '51~200' },
    { label: '201 ~ 500 members', value: '201~500' },
]

const Step2 = ({ onNext, onBack }: Step2Props) => {
    return (
        <div className="text-center">
            <h3 className="mb-2">Tell us about your organization</h3>
            <div className="mt-8 max-w-[600px] lg:min-w-[600px] mx-auto">
                <Formik
                    initialValues={{
                        organizationName: '',
                        organizationSize: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={() => {
                        onNext?.()
                    }}
                >
                    {({ values, touched, errors }) => {
                        return (
                            <Form>
                                <FormContainer>
                                    <FormItem
                                        label="Name of your organization"
                                        invalid={
                                            errors.organizationName &&
                                            touched.organizationName
                                        }
                                        errorMessage={errors.organizationName}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="organizationName"
                                            placeholder="Organization Name..."
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Size of your organization"
                                        invalid={
                                            errors.organizationSize &&
                                            touched.organizationSize
                                        }
                                        errorMessage={errors.organizationSize}
                                    >
                                        <Field name="organizationSize">
                                            {({ field, form }: FieldProps) => (
                                                <Select
                                                    placeholder="Organization Size..."
                                                    field={field}
                                                    form={form}
                                                    options={sizes}
                                                    value={sizes.filter(
                                                        (size) =>
                                                            size.value ===
                                                            values.organizationSize,
                                                    )}
                                                    onChange={(size) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            size?.value,
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            block
                                            variant="solid"
                                            type="submit"
                                        >
                                            Continue
                                        </Button>
                                        <Button
                                            block
                                            className="mt-4"
                                            variant="plain"
                                            type="button"
                                            icon={<HiArrowSmLeft />}
                                            onClick={onBack}
                                        >
                                            Back
                                        </Button>
                                    </FormItem>
                                </FormContainer>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

export default Step2
