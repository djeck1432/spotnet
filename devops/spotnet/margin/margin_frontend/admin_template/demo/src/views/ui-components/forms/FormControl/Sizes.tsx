import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import DatePicker from '@/components/ui/DatePicker'
import { Formik, Field, Form } from 'formik'
import type { FieldProps } from 'formik'

type Size = 'lg' | 'md' | 'sm'

const options: {
    label: string
    value: Size
}[] = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
]

const Sizes = () => {
    const [size, setSize] = useState<Size>('md')

    const onSizeSelect = (val: Size) => {
        setSize(val)
    }

    return (
        <div>
            <InputGroup className="mb-6">
                {options.map((opt) => (
                    <Button
                        key={opt.value}
                        active={size === opt.value}
                        onClick={() => onSizeSelect(opt.value)}
                    >
                        {opt.label}
                    </Button>
                ))}
            </InputGroup>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    date: '',
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500))
                    alert(JSON.stringify(values, null, 2))
                }}
            >
                <Form>
                    <FormContainer size={size}>
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
                        <FormItem label="Date">
                            <Field name="date">
                                {({ field, form }: FieldProps) => (
                                    <DatePicker
                                        field={field}
                                        form={form}
                                        value={field.value}
                                        placeholder="Select Date"
                                        onChange={(date) => {
                                            form.setFieldValue(field.name, date)
                                        }}
                                    />
                                )}
                            </Field>
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

export default Sizes
