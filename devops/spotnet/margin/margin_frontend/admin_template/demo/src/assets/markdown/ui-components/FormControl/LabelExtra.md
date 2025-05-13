```jsx
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import { Formik, Field, Form } from 'formik'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'

const tip = (
    <Tooltip title="Field info">
        <HiOutlineQuestionMarkCircle className="text-lg cursor-pointer ml-1" />
    </Tooltip>
)

const optional = <span className="ml-1 opacity-60">(optional)</span>

const LabelExtra = () => {
    return (
        <div>
            <Formik
                initialValues={{
                    fieldA: '',
                    fieldB: '',
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500))
                    alert(JSON.stringify(values, null, 2))
                }}
            >
                <Form>
                    <FormContainer>
                        <FormItem label="Name" extra={tip}>
                            <Field
                                type="text"
                                name="fieldA"
                                placeholder="Please Input"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="Email" extra={optional}>
                            <Field
                                type="text"
                                name="fieldB"
                                placeholder="Please Input"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem>
                            <Button type="submit">Submit</Button>
                        </FormItem>
                    </FormContainer>
                </Form>
            </Formik>
        </div>
    )
}

export default LabelExtra
```
