import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import FormNumericInput from '@/components/shared/FormNumericInput'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'

const WithForm = () => {
    return (
        <Formik
            initialValues={{
                amount: 0,
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
                    <FormContainer layout="inline">
                        <FormItem
                            label="Amount"
                            invalid={errors.amount && touched.amount}
                            errorMessage={errors.amount}
                        >
                            <Field name="amount">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <FormNumericInput
                                            thousandSeparator
                                            form={form}
                                            field={field}
                                            placeholder="Amount"
                                            value={field.value}
                                            onValueChange={(e) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    e.floatValue,
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
