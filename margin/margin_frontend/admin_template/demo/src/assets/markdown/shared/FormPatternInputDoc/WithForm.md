```jsx
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import FormPatternInput from '@/components/shared/FormPatternInput'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'

const WithForm = () => {
    return (
        <Formik
            initialValues={{
                cardNumber: 0,
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
                            label="Card Number"
                            invalid={errors.cardNumber && touched.cardNumber}
                            errorMessage={errors.cardNumber}
                        >
                            <Field name="cardNumber">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <FormPatternInput
                                            form={form}
                                            field={field}
                                            format="#### #### #### ####"
                                            mask="_"
                                            placeholder="Card Number"
                                            value={field.value}
                                            onValueChange={(e) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    e.floatValue
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
```
