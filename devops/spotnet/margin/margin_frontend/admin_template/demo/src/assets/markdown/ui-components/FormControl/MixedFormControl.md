```jsx
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import TimeInput from '@/components/ui/TimeInput'
import Checkbox from '@/components/ui/Checkbox'
import Radio from '@/components/ui/Radio'
import Switcher from '@/components/ui/Switcher'
import Segment from '@/components/ui/Segment'
import Upload from '@/components/ui/Upload'
import SegmentItemOption from '@/components/shared/SegmentItemOption'
import { HiCheckCircle } from 'react-icons/hi'
import { Field, Form, Formik } from 'formik'
import CreatableSelect from 'react-select/creatable'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'

type Option = {
    value: string
    label: string
}

type FormModel = {
    input: string
    select: string
    multipleSelect: string[]
    date: Date | null
    time: Date | null
    singleCheckbox: boolean
    multipleCheckbox: Array<string | number>
    radio: string
    switcher: boolean
    segment: string[];
    upload: File[];
}

const options: Option[] = [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
]

const segmentSelections = [
    { value: 'Personal', desc: 'The plan for personal.' },
    { value: 'Team', desc: 'The plan for team' },
    { value: 'Business', desc: 'Talk to us for business plan.' },
]

const MIN_UPLOAD = 1
const MAX_UPLOAD = 2

const validationSchema = Yup.object().shape({
    input: Yup.string()
        .min(3, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Please input user name!'),
    select: Yup.string().required('Please select one!'),
    multipleSelect: Yup.array().min(1, 'At least one is selected!'),
    date: Yup.date().required('Date Required!').nullable(),
    time: Yup.date().required('Time Required!').nullable(),
    singleCheckbox: Yup.boolean().oneOf([true], 'You must tick this!'),
    multipleCheckbox: Yup.array().min(1, 'Select at least one option!'),
    radio: Yup.string().required('Please select one!'),
    switcher: Yup.boolean().oneOf([true], 'You must turn this on!'),
    upload: Yup.array().min(MIN_UPLOAD, 'At least one file uploaded!'),
    segment: Yup.array().min(1, 'Select at least one option!'),
})

const MixedFormControl = () => {

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        const MAX_FILE_SIZE = 500000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{
                    input: '',
                    select: '',
                    multipleSelect: [],
                    date: null,
                    time: null,
                    singleCheckbox: false,
                    multipleCheckbox: [],
                    radio: '',
                    switcher: false,
                    segment: [],
                    upload: [],
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log('values', values)
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2))
                        setSubmitting(false)
                    }, 400)
                }}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                asterisk
                                label="Input"
                                invalid={errors.input && touched.input}
                                errorMessage={errors.input}
                            >
                                <Field
                                    type="text"
                                    name="input"
                                    placeholder="Input"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Select"
                                invalid={errors.select && touched.select}
                                errorMessage={errors.select}
                            >
                                <Field name="select">
                                    {({ field, form }: FieldProps<FormModel>) => (
                                        <Select
                                            field={field}
                                            form={form}
                                            options={options}
                                            value={options.filter(
                                                (option) =>
                                                    option.value ===
                                                    values.select
                                            )}
                                            onChange={(option) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    option?.value
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Multiple Select"
                                invalid={Boolean(
                                    errors.multipleSelect &&
                                        touched.multipleSelect
                                )}
                                errorMessage={errors.multipleSelect as string}
                            >
                                <Field name="multipleSelect">
                                    {({ field, form }: FieldProps<FormModel>) => (
                                        <Select<Option, true>
                                            isMulti
                                            componentAs={CreatableSelect}
                                            field={field}
                                            form={form}
                                            options={options}
                                            value={values.multipleSelect}
                                            onChange={(option) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    option
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Date"
                                invalid={errors.date && touched.date}
                                errorMessage={errors.date}
                            >
                                <Field name="date" placeholder="Date">
                                    {({ field, form }: FieldProps<FormModel>) => (
                                        <DatePicker
                                            field={field}
                                            form={form}
                                            value={values.date}
                                            onChange={(date) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    date
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Time"
                                invalid={errors.time && touched.time}
                                errorMessage={errors.time}
                            >
                                <Field name="time" placeholder="Date">
                                    {({ field, form }: FieldProps<FormModel>) => (
                                        <TimeInput
                                            field={field}
                                            form={form}
                                            value={values.time}
                                            onChange={(time) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    time
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Upload"
                                invalid={Boolean(
                                    errors.upload && touched.upload
                                )}
                                errorMessage={errors.upload as string}
                            >
                                <Field name="upload">
                                    {({ field, form }: FieldProps<FormModel>) => (
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            fileList={values.upload}
                                            onChange={(files) =>
                                                form.setFieldValue(field.name, files)
                                            }
                                            onFileRemove={(files) =>
                                                form.setFieldValue(field.name, files)
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Multiple Checkbox"
                                invalid={Boolean(
                                    errors.multipleCheckbox &&
                                        touched.multipleCheckbox
                                )}
                                errorMessage={errors.multipleCheckbox as string}
                            >
                                <Field name="multipleCheckbox">
                                    {({ field, form }: FieldProps<FormModel>) => (
                                        <>
                                            <Checkbox.Group
                                                value={values.multipleCheckbox}
                                                onChange={(options) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        options
                                                    )
                                                }
                                            >
                                                <Checkbox
                                                    name={field.name}
                                                    value="Apple"
                                                >
                                                    Apple{' '}
                                                </Checkbox>
                                                <Checkbox
                                                    name={field.name}
                                                    value="Banana"
                                                >
                                                    Banana{' '}
                                                </Checkbox>
                                                <Checkbox
                                                    name={field.name}
                                                    value="Lemon"
                                                >
                                                    Lemon{' '}
                                                </Checkbox>
                                            </Checkbox.Group>
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Radio"
                                invalid={errors.radio && touched.radio}
                                errorMessage={errors.radio}
                            >
                                <Field name="radio">
                                    {({ field, form }: FieldProps<FormModel>) => (
                                        <Radio.Group
                                            value={values.radio}
                                            onChange={(val) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    val
                                                )
                                            }
                                        >
                                            <Radio value={1}>Paypal</Radio>
                                            <Radio value={2}>Stripe</Radio>
                                        </Radio.Group>
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Single Checkbox"
                                invalid={
                                    errors.singleCheckbox &&
                                    touched.singleCheckbox
                                }
                                errorMessage={errors.singleCheckbox}
                            >
                                <Field
                                    name="singleCheckbox"
                                    component={Checkbox}
                                >
                                    I agree to the terms and conditions
                                </Field>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Switcher"
                                invalid={errors.switcher && touched.switcher}
                                errorMessage={errors.switcher}
                            >
                                <div>
                                    <Field
                                        name="switcher"
                                        component={Switcher}
                                    />
                                </div>
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Segment"
                                invalid={Boolean(
                                    errors.segment && touched.segment
                                )}
                                errorMessage={errors.segment as string}
                            >
                                <Field name="segment">
                                    {({ field, form }: FieldProps<FormModel>) => (
                                        <Segment
                                            className="w-full"
                                            selectionType="multiple"
                                            value={values.segment}
                                            onChange={(val) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    val
                                                )
                                            }
                                        >
                                            <div className="grid grid-cols-3 gap-4 w-full">
                                                {segmentSelections.map(
                                                    (segment) => (
                                                        <Segment.Item
                                                            key={segment.value}
                                                            value={
                                                                segment.value
                                                            }
                                                        >
                                                            {({
                                                                active,
                                                                onSegmentItemClick,
                                                                disabled,
                                                            }) => {
                                                                return (
                                                                    <div className="text-center">
                                                                        <SegmentItemOption
                                                                            hoverable
                                                                            active={
                                                                                active
                                                                            }
                                                                            disabled={
                                                                                disabled
                                                                            }
                                                                            defaultGutter={
                                                                                false
                                                                            }
                                                                            className="relative min-h-[80px] w-full"
                                                                            customCheck={
                                                                                <HiCheckCircle className="text-indigo-600 absolute top-2 right-2 text-lg" />
                                                                            }
                                                                            onSegmentItemClick={
                                                                                onSegmentItemClick
                                                                            }
                                                                        >
                                                                            <div className="flex flex-col items-start mx-4">
                                                                                <h6>
                                                                                    {
                                                                                        segment.value
                                                                                    }
                                                                                </h6>
                                                                                <p>
                                                                                    {
                                                                                        segment.desc
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </SegmentItemOption>
                                                                    </div>
                                                                )
                                                            }}
                                                        </Segment.Item>
                                                    )
                                                )}
                                            </div>
                                        </Segment>
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
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

export default MixedFormControl
```
