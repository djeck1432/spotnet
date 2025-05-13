```jsx
import { Field, FieldArray, Form, Formik, getIn } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiMinus } from 'react-icons/hi'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'

type FormModel = {
    users: {
        name: string
        email: string
    }[]
    groupName: string
}

const validationSchema = Yup.object({
    groupName: Yup.string().required('Group Name is required'),
    users: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Name required'),
            email: Yup.string()
                .required('Email required')
                .email('Enter valid email'),
        })
    ),
})

const fieldFeedback = (form: FormikProps<FormModel>, name: string) => {
    const error = getIn(form.errors, name)
    const touch = getIn(form.touched, name)
    return {
        errorMessage: error || '',
        invalid: typeof touch === 'undefined' ? false : error && touch,
    }
}

const DynamicForm = () => {
    return (
        <div>
            <Formik
                validationSchema={validationSchema}
                initialValues={{
                    users: [
                        {
                            name: 'Leslie James',
                            email: 'leslie.james@themenate.com',
                        },
                        {
                            name: 'Kelly Lambert',
                            email: 'kelly.lambert@themenate.com',
                        },
                    ],
                    groupName: '',
                }}
                onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
            >
                {({ touched, errors, values }) => {
                    const users = values.users
                    return (
                        <Form>
                            <FormContainer layout="inline">
                                <div>
                                    <div className="mb-10">
                                        <h5 className="mb-4">User List</h5>
                                        <FormItem
                                            layout="vertical"
                                            label="Group"
                                            invalid={
                                                errors.groupName &&
                                                touched.groupName
                                            }
                                            errorMessage={errors.groupName}
                                        >
                                            <Field
                                                placeholder="Group Name"
                                                name="groupName"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>
                                    <FieldArray name="users">
                                        {({ form, remove, push }) => (
                                            <div>
                                                {users && users.length > 0
                                                    ? users.map((_, index) => {
                                                          const nameFeedBack =
                                                              fieldFeedback(
                                                                  form,
                                                                  `users[${index}].name`
                                                              )
                                                          const emailFeedBack =
                                                              fieldFeedback(
                                                                  form,
                                                                  `users[${index}].email`
                                                              )

                                                          return (
                                                              <div key={index}>
                                                                  <FormItem
                                                                      label="Name"
                                                                      invalid={
                                                                          nameFeedBack.invalid
                                                                      }
                                                                      errorMessage={
                                                                          nameFeedBack.errorMessage
                                                                      }
                                                                  >
                                                                      <Field
                                                                          invalid={
                                                                              nameFeedBack.invalid
                                                                          }
                                                                          placeholder="User Name"
                                                                          name={`users[${index}].name`}
                                                                          type="text"
                                                                          component={
                                                                              Input
                                                                          }
                                                                      />
                                                                  </FormItem>
                                                                  <FormItem
                                                                      label="Email"
                                                                      invalid={
                                                                          emailFeedBack.invalid
                                                                      }
                                                                      errorMessage={
                                                                          emailFeedBack.errorMessage
                                                                      }
                                                                  >
                                                                      <Field
                                                                          invalid={
                                                                              emailFeedBack.invalid
                                                                          }
                                                                          placeholder="User Name"
                                                                          name={`users[${index}].email`}
                                                                          type="email"
                                                                          component={
                                                                              Input
                                                                          }
                                                                      />
                                                                  </FormItem>
                                                                  <Button
                                                                      shape="circle"
                                                                      size="sm"
                                                                      icon={
                                                                          <HiMinus />
                                                                      }
                                                                      onClick={() =>
                                                                          remove(
                                                                              index
                                                                          )
                                                                      }
                                                                  />
                                                              </div>
                                                          )
                                                      })
                                                    : null}
                                                <div>
                                                    <Button
                                                        type="button"
                                                        className="ltr:mr-2 rtl:ml-2"
                                                        onClick={() => {
                                                            push({
                                                                name: '',
                                                                email: '',
                                                            })
                                                        }}
                                                    >
                                                        Add a User
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="solid"
                                                    >
                                                        Submit
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default DynamicForm
```
