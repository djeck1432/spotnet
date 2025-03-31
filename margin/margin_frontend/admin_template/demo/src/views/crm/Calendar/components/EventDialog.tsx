import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Badge from '@/components/ui/Badge'
import hooks from '@/components/ui/hooks'
import { closeDialog, useAppDispatch, useAppSelector } from '../store'
import { Field, Form, Formik, FieldProps } from 'formik'
import { HiCheck } from 'react-icons/hi'
import { components, ControlProps, OptionProps } from 'react-select'
import * as Yup from 'yup'
import dayjs from 'dayjs'

type FormModel = {
    title: string
    startDate: string | Date
    endDate: string | Date
    color: string
}

export type EventParam = {
    id: string
    title: string
    start: string
    eventColor: string
    end?: string
}

type ColorOption = {
    value: string
    label: string
    color: string
}

type EventDialogProps = {
    submit: (eventData: EventParam, type: string) => void
}

const { Control } = components

const { useUniqueId } = hooks

const colorOptions = [
    {
        value: 'red',
        label: 'red',
        color: 'bg-red-500',
    },
    {
        value: 'orange',
        label: 'orange',
        color: 'bg-orange-500',
    },
    {
        value: 'amber',
        label: 'amber',
        color: 'bg-amber-500',
    },
    {
        value: 'yellow',
        label: 'yellow',
        color: 'bg-yellow-500',
    },
    {
        value: 'lime',
        label: 'lime',
        color: 'bg-lime-500',
    },
    {
        value: 'green',
        label: 'green',
        color: 'bg-green-500',
    },
    {
        value: 'emerald',
        label: 'emerald',
        color: 'bg-emerald-500',
    },
    {
        value: 'teal',
        label: 'teal',
        color: 'bg-teal-500',
    },
    {
        value: 'cyan',
        label: 'cyan',
        color: 'bg-cyan-500',
    },
    {
        value: 'sky',
        label: 'sky',
        color: 'bg-sky-500',
    },
    {
        value: 'blue',
        label: 'blue',
        color: 'bg-blue-500',
    },
    {
        value: 'indigo',
        label: 'indigo',
        color: 'bg-indigo-500',
    },
    {
        value: 'purple',
        label: 'purple',
        color: 'bg-purple-500',
    },
    {
        value: 'fuchsia',
        label: 'fuchsia',
        color: 'bg-fuchsia-500',
    },
    {
        value: 'pink',
        label: 'pink',
        color: 'bg-pink-500',
    },
    {
        value: 'rose',
        label: 'rose',
        color: 'bg-rose-500',
    },
]

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<ColorOption>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <Badge className={data.color} />
                <span className="ml-2 rtl:mr-2 capitalize">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControl = ({ children, ...props }: ControlProps<ColorOption>) => {
    const selected = props.getValue()[0]

    return (
        <Control className="capitalize" {...props}>
            {selected && (
                <Badge className={`${selected.color} ltr:ml-4 rtl:mr-4`} />
            )}
            {children}
        </Control>
    )
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Event title Required'),
    startDate: Yup.date().required('Start Date Required'),
    endDate: Yup.date(),
    color: Yup.string().required('Color Required'),
})

const EventDialog = ({ submit }: EventDialogProps) => {
    const dispatch = useAppDispatch()

    const open = useAppSelector((state) => state.crmCalendar.data.dialogOpen)
    const selected = useAppSelector((state) => state.crmCalendar.data.selected)
    const newId = useUniqueId('event-')

    const handleDialogClose = () => {
        dispatch(closeDialog())
    }

    const handleSubmit = (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(false)
        const eventData: EventParam = {
            id: selected.id || newId,
            title: values.title,
            start: dayjs(values.startDate).format(),
            eventColor: values.color,
        }
        if (values.endDate) {
            eventData.end = dayjs(values.endDate).format()
        }
        submit?.(eventData, selected.type)
        dispatch(closeDialog())
    }

    return (
        <Dialog
            isOpen={open}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h5 className="mb-4">
                {selected.type === 'NEW' ? 'Add New Event' : 'Edit Event'}
            </h5>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        title: selected.title || '',
                        startDate: selected.start
                            ? dayjs(selected.start).toDate()
                            : '',
                        endDate: selected.end
                            ? dayjs(selected.end).toDate()
                            : '',
                        color: selected.eventColor || colorOptions[0].value,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSubmit(values, setSubmitting)
                    }}
                >
                    {({ values, touched, errors }) => (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="User Name"
                                    invalid={errors.title && touched.title}
                                    errorMessage={errors.title}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="title"
                                        placeholder="Please enter title"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Start Date"
                                    invalid={
                                        errors.startDate && touched.startDate
                                    }
                                    errorMessage={errors.startDate}
                                >
                                    <Field name="startDate" placeholder="Date">
                                        {({ field, form }: FieldProps) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={field.value}
                                                onChange={(date) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        date,
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    label="End Date"
                                    invalid={errors.endDate && touched.endDate}
                                    errorMessage={errors.endDate}
                                >
                                    <Field name="endDate" placeholder="Date">
                                        {({ field, form }: FieldProps) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={field.value}
                                                onChange={(date) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        date,
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    label="Prefered"
                                    asterisk={true}
                                    invalid={errors.color && touched.color}
                                    errorMessage={errors.color}
                                >
                                    <Field name="color">
                                        {({ field, form }: FieldProps) => (
                                            <Select<ColorOption>
                                                field={field}
                                                form={form}
                                                options={colorOptions}
                                                value={colorOptions.filter(
                                                    (option) =>
                                                        option.value ===
                                                        values.color,
                                                )}
                                                components={{
                                                    Option: CustomSelectOption,
                                                    Control: CustomControl,
                                                }}
                                                onChange={(option) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value,
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem className="mb-0 text-right rtl:text-left">
                                    <Button variant="solid" type="submit">
                                        Submit
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </Dialog>
    )
}

export default EventDialog
