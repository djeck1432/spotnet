import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import hooks from '@/components/ui/hooks'
import NewTaskField from './NewTaskField'
import { Field, Form, Formik, FieldProps } from 'formik'
import { HiCheck } from 'react-icons/hi'
import { components, MultiValueGenericProps, OptionProps } from 'react-select'
import {
    getMembers,
    putProject,
    toggleNewProjectDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'

type FormModel = {
    title: string
    content: string
    assignees: {
        img: string
        name: string
        label: string
    }[]
}

type TaskCount = {
    completedTask?: number
    totalTask?: number
}

const { MultiValueLabel } = components

const { useUniqueId } = hooks

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<{ img: string }>) => {
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
                <Avatar shape="circle" size={20} src={data.img} />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControlMulti = ({ children, ...props }: MultiValueGenericProps) => {
    const { img } = props.data

    return (
        <MultiValueLabel {...props}>
            <div className="inline-flex items-center">
                <Avatar
                    className="mr-2 rtl:ml-2"
                    shape="circle"
                    size={15}
                    src={img}
                />
                {children}
            </div>
        </MultiValueLabel>
    )
}

const validationSchema = Yup.object().shape({
    title: Yup.string().min(3, 'Too Short!').required('Title required'),
    content: Yup.string().required('Title required'),
    assignees: Yup.array().min(1, 'Assignee required'),
    rememberMe: Yup.bool(),
})

const NewProjectForm = () => {
    const dispatch = useAppDispatch()

    const members = useAppSelector((state) => state.projectList.data.allMembers)

    const newId = useUniqueId('project-')

    const [taskCount, setTaskCount] = useState<TaskCount>({})

    useEffect(() => {
        dispatch(getMembers())
    }, [dispatch])

    const handleAddNewTask = (count: TaskCount) => {
        setTaskCount(count)
    }

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)

        const { title, content, assignees } = formValue

        const { totalTask, completedTask } = taskCount

        const member = cloneDeep(assignees).map((assignee) => {
            assignee.name = assignee.label
            return assignee
        })

        const values = {
            id: newId,
            name: title,
            desc: content,
            totalTask,
            completedTask,
            progression:
                ((completedTask as number) / (totalTask as number)) * 100 || 0,
            member,
        }
        dispatch(putProject(values))
        dispatch(toggleNewProjectDialog(false))
    }

    return (
        <Formik
            initialValues={{
                title: '',
                content: '',
                assignees: [],
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values, setSubmitting)
            }}
        >
            {({ touched, errors, values }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Title"
                            invalid={errors.title && touched.title}
                            errorMessage={errors.title}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="title"
                                placeholder="Enter title"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="Assignees"
                            invalid={
                                (errors.assignees && touched.assignees) as ''
                            }
                            errorMessage={errors.assignees as string}
                        >
                            <Field name="assignees">
                                {({ field, form }: FieldProps) => (
                                    <Select
                                        isMulti
                                        className="min-w-[120px]"
                                        components={{
                                            Option: CustomSelectOption,
                                            MultiValueLabel: CustomControlMulti,
                                        }}
                                        field={field}
                                        form={form}
                                        options={members}
                                        value={values.assignees}
                                        onChange={(option) => {
                                            form.setFieldValue(
                                                field.name,
                                                option,
                                            )
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>
                        <FormItem
                            label="Content"
                            invalid={errors.content && touched.content}
                            errorMessage={errors.content}
                        >
                            <Field
                                textArea
                                type="text"
                                autoComplete="off"
                                name="content"
                                placeholder="Enter content"
                                component={Input}
                            />
                        </FormItem>
                        <NewTaskField onAddNewTask={handleAddNewTask} />
                        <Button block variant="solid" type="submit">
                            Submit
                        </Button>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default NewProjectForm
