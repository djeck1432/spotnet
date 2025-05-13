import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { Formik, Form, Field } from 'formik'
import type { FormikErrors, FormikProps } from 'formik'

type FormModel = {
    userName: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const AsyncValidation = () => {
    const [validating, setValidating] = useState(false)

    const validateAsync = async (
        value: string,
        form: {
            errors: FormikErrors<FormModel>
        } & FormikProps<FormModel>,
    ) => {
        const { touched, errors } = form
        if (!value) {
            return
        }
        if (errors.userName && !touched.userName) {
            return errors.userName
        }
        setValidating(true)
        await sleep(2000)
        if (value === 'Adam') {
            setValidating(false)
            return
        }
        setValidating(false)
        return 'This User name has been taken'
    }

    return (
        <div>
            <Formik
                initialValues={{ userName: '' }}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2))
                        setSubmitting(false)
                        resetForm()
                    }, 400)
                }}
            >
                {({ errors, ...formProps }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Check valid username"
                                invalid={
                                    errors.userName &&
                                    errors.userName.length > 0
                                }
                                errorMessage={errors.userName}
                            >
                                <Field
                                    type="text"
                                    name="userName"
                                    autoComplete="off"
                                    placeholder="User Name"
                                    suffix={
                                        <Spinner
                                            className={
                                                !validating ? 'hidden' : ''
                                            }
                                        />
                                    }
                                    validate={(values: string) =>
                                        validateAsync(values, {
                                            errors,
                                            ...formProps,
                                        })
                                    }
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem>
                                <Button variant="solid" type="submit">
                                    Submit
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AsyncValidation
