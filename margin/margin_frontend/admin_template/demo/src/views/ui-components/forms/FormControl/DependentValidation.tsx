import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Password Required'),
    confirmPassword: Yup.string()
        .required('Confirm Password Required')
        .oneOf([Yup.ref('password')], 'Password not match'),
})

const DependentValidation = () => {
    return (
        <Formik
            enableReinitialize
            initialValues={{
                password: '',
                confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2))
                    setSubmitting(false)
                    resetForm()
                }, 400)
            }}
        >
            {({ resetForm, touched, errors, isSubmitting }) => {
                return (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={Input}
                                    type="password"
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    component={Input}
                                    type="password"
                                />
                            </FormItem>
                            <FormItem>
                                <div className="flex gap-2">
                                    <Button
                                        type="reset"
                                        onClick={() => resetForm()}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmitting}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default DependentValidation
