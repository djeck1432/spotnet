import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import FormCustomFormatInput from '@/components/shared/FormCustomFormatInput'
import { Field, Form, Formik } from 'formik'
import { HiCalendar } from 'react-icons/hi'
import type { FieldProps } from 'formik'

function limit(val: string, max: string) {
    if (val.length === 1 && val[0] > max[0]) {
        val = '0' + val
    }

    if (val.length === 2) {
        if (Number(val) === 0) {
            val = '01'
        } else if (val > max) {
            val = max
        }
    }

    return val
}

function cardExpiryFormat(val: string) {
    const month = limit(val.substring(0, 2), '12')
    const date = limit(val.substring(2, 4), '31')

    return month + (date.length ? '/' + date : '')
}

const WithForm = () => {
    return (
        <Formik
            initialValues={{
                expiredDate: 0,
            }}
            onSubmit={(values, { resetForm, setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2))
                    setSubmitting(false)
                    resetForm()
                }, 400)
            }}
        >
            {({ touched, errors, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Expired Date"
                            invalid={errors.expiredDate && touched.expiredDate}
                            errorMessage={errors.expiredDate}
                        >
                            <Field name="expiredDate">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <FormCustomFormatInput
                                            form={form}
                                            field={field}
                                            placeholder="••/••"
                                            inputSuffix={
                                                <HiCalendar className="text-lg" />
                                            }
                                            format={cardExpiryFormat}
                                            defaultValue={
                                                form.values.cardExpiry
                                            }
                                            onValueChange={(e) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    e.value,
                                                )
                                            }}
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <FormItem>
                            <Button
                                variant="solid"
                                loading={isSubmitting}
                                type="submit"
                            >
                                Submit
                            </Button>
                        </FormItem>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default WithForm
