import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { apiSignIn } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik, FormikProps } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'

interface LoginFormProps extends CommonProps {
    disableSubmit?: boolean
}

type LoginFormSchema = {
    userName: string
    password: string
}

const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Please enter your name'),
    password: Yup.string().required('Please enter your password'),
})

const LoginForm = (props: LoginFormProps) => {
    const { disableSubmit = false, className } = props

    const [message, setMessage] = useTimeOutMessage()

    const initialValues: LoginFormSchema = {
        userName: '',
        password: '',
    }

    const onSendForm = async (
        values: LoginFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                setSubmitting(false)
            }
        } catch (errors) {
            setMessage(
                (errors as AxiosError<{ message: string }>)?.response?.data
                    ?.message || (errors as Error).toString(),
            )
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(
                    values: LoginFormSchema,
                    {
                        setSubmitting,
                    }: { setSubmitting: (isSubmitting: boolean) => void },
                ) => {
                    if (!disableSubmit) {
                        onSendForm(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }: FormikProps) => (
                    <Form>
                        <FormContainer>
                            <div>
                                <FormItem
                                    invalid={
                                        errors.userName && touched.userName
                                    }
                                    errorMessage={errors.userName}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="userName"
                                        placeholder="Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    invalid={
                                        errors.password && touched.password
                                    }
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="password"
                                        placeholder="Password"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {'Login'}
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm
