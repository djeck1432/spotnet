import Segment from '@/components/ui/Segment'
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import isLastChild from '@/utils/isLastChild'
import { HiMail, HiGlobeAlt, HiOutlineDeviceMobile } from 'react-icons/hi'
import type {
    FieldProps,
    FormikTouched,
    FormikErrors,
    FieldInputProps,
    FormikProps,
} from 'formik'

type NotificationFormModel = {
    news: string[]
    accountActivity: string[]
    signIn: string[]
    reminders: string[]
    mentioned: string[]
    replies: string[]
    taskUpdate: string[]
    assigned: string[]
    newProduct: string[]
    newOrder: string[]
}

type NotificationSettingProps = {
    data?: NotificationFormModel
}

type RowsProps = {
    rows: {
        label: string
        name: string
    }[]
    validators: {
        touched: FormikTouched<NotificationFormModel>
        errors: FormikErrors<NotificationFormModel>
    }
    values: NotificationFormModel
}

type SelectorProps = {
    field: FieldInputProps<NotificationFormModel>
    form: FormikProps<NotificationFormModel>
    values: NotificationFormModel
    name: string
}

const generalNotificationForm = [
    { label: 'News', name: 'news' },
    { label: 'Account activity', name: 'accountActivity' },
    { label: 'New device used to sign in', name: 'signIn' },
    { label: 'Reminders', name: 'reminders' },
]

const projectNotificationForm = [
    { label: 'Somone mentions you', name: 'mentioned' },
    { label: 'Somone replies to your message', name: 'replies' },
    { label: 'Task status updated', name: 'taskUpdate' },
    { label: 'Task assigned to you', name: 'assigned' },
]

const salesNotificationForm = [
    { label: 'New product', name: 'newProduct' },
    { label: 'New order placed', name: 'newOrder' },
]

const Selector = ({ field, form, values, name }: SelectorProps) => {
    return (
        <Segment
            value={values[name as keyof NotificationFormModel]}
            selectionType="multiple"
            onChange={(selected) => form.setFieldValue(field.name, selected)}
        >
            <Segment.Item
                className="flex items-center justify-center"
                type="button"
                value="email"
            >
                <HiMail className="text-xl" />
                <span className="hidden sm:block ltr:ml-2 rtl:mr-2">Email</span>
            </Segment.Item>
            <Segment.Item
                className="flex items-center justify-center"
                type="button"
                value="browser"
            >
                <HiGlobeAlt className="text-xl" />
                <span className="hidden sm:block  ltr:ml-2 rtl:mr-2">
                    Browser
                </span>
            </Segment.Item>
            <Segment.Item
                className="flex items-center justify-center"
                type="button"
                value="app"
            >
                <HiOutlineDeviceMobile className="text-xl" />
                <span className="hidden sm:block  ltr:ml-2 rtl:mr-2">App</span>
            </Segment.Item>
        </Segment>
    )
}

const Rows = ({ rows, validators, values }: RowsProps) => {
    return (
        <>
            {rows.map((row, index) => (
                <FormRow
                    key={row.name}
                    name={row.name as keyof NotificationFormModel}
                    label={row.label}
                    {...validators}
                    border={!isLastChild(rows, index)}
                >
                    <Field name={row.name}>
                        {({
                            field,
                            form,
                        }: FieldProps<NotificationFormModel>) => (
                            <Selector
                                field={field}
                                form={form}
                                values={values}
                                name={row.name}
                            />
                        )}
                    </Field>
                </FormRow>
            ))}
        </>
    )
}

const NotificationSetting = ({
    data = {
        news: [],
        accountActivity: [],
        signIn: [],
        reminders: [],
        mentioned: [],
        replies: [],
        taskUpdate: [],
        assigned: [],
        newProduct: [],
        newOrder: [],
    },
}: NotificationSettingProps) => {
    const onFormSubmit = (
        values: NotificationFormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        toast.push(
            <Notification
                title={'Notification setting updated'}
                type="success"
            />,
            {
                placement: 'top-center',
            },
        )
        setSubmitting(false)
        console.log(values)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={data}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                }, 1000)
            }}
        >
            {({ values, touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        <FormContainer>
                            <FormDesription
                                title="General Notification"
                                desc="Select how you'll be notified when the following changes occur."
                            />
                            <Rows
                                rows={generalNotificationForm}
                                validators={validatorProps}
                                values={values}
                            />
                            <FormDesription
                                className="mt-6"
                                title="Project Notification"
                                desc="Select how you'll be notified when the project related events happended."
                            />
                            <Rows
                                rows={projectNotificationForm}
                                validators={validatorProps}
                                values={values}
                            />
                            <FormDesription
                                className="mt-6"
                                title="Sales Notification"
                                desc="Select how you'll be notified when any products & order updated."
                            />
                            <Rows
                                rows={salesNotificationForm}
                                validators={validatorProps}
                                values={values}
                            />
                            <div className="mt-4 ltr:text-right">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    type="button"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    loading={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? 'Updating' : 'Update'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default NotificationSetting
