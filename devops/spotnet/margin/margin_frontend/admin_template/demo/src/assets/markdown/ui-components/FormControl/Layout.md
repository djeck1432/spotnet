```jsx
import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import { Formik, Field, Form } from 'formik'

type FormLayout = 'horizontal' | 'vertical' | 'inline'

const options: {
    label: string
    value: FormLayout
}[] = [
    { label: 'Vertical', value: 'vertical' },
    { label: 'Horizontal', value: 'horizontal' },
    { label: 'Inline', value: 'inline' },
]

const Layout = () => {
    const [layout, setLayout] = useState<FormLayout>('vertical')

    const onLayoutSelect = (val: FormLayout) => {
        setLayout(val)
    }

    return (
        <div>
            <InputGroup className="mb-6">
                {options.map((opt) => (
                    <Button
                        key={opt.value}
                        active={layout === opt.value}
                        onClick={() => onLayoutSelect(opt.value)}
                    >
                        {opt.label}
                    </Button>
                ))}
            </InputGroup>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500))
                    alert(JSON.stringify(values, null, 2))
                }}
            >
                <Form>
                    <FormContainer layout={layout}>
                        <FormItem label="Name">
                            <Field
                                type="text"
                                name="name"
                                placeholder="Please enter your name"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="Email">
                            <Field
                                type="email"
                                name="email"
                                placeholder="Please enter your email"
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

export default Layout
```
