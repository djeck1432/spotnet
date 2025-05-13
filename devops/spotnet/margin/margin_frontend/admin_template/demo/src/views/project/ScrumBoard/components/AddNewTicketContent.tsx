import { FormItem, FormContainer } from '@/components/ui'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Formik, Field, Form } from 'formik'
import {
    updateColumns,
    closeDialog,
    setSelectedBoard,
    useAppDispatch,
    useAppSelector,
} from '../store'
import cloneDeep from 'lodash/cloneDeep'
import requiredFieldValidation from '@/utils/requiredFieldValidation'
import { createCardObject } from '../utils'

const AddNewColumnContent = () => {
    const dispatch = useAppDispatch()

    const columns = useAppSelector((state) => state.scrumBoard.data.columns)
    const board = useAppSelector((state) => state.scrumBoard.data.board)

    const onFormSubmit = (title: string) => {
        const data = columns
        const newCard = createCardObject()
        newCard.name = title ? title : 'Untitled Card'

        const newData = cloneDeep(data)
        newData[board].push(newCard)
        dispatch(updateColumns(newData))
        dispatch(closeDialog())
        dispatch(setSelectedBoard(''))
    }

    return (
        <div>
            <h5>Add New Ticket</h5>
            <div className="mt-8">
                <Formik
                    initialValues={{ title: '' }}
                    onSubmit={({ title }) => onFormSubmit(title)}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <FormContainer layout="inline">
                                <FormItem
                                    label="Ticket title"
                                    invalid={errors.title && touched.title}
                                    errorMessage={errors.title}
                                >
                                    <Field
                                        type="text"
                                        name="title"
                                        placeholder="Please enter ticket title"
                                        component={Input}
                                        validate={(value: string) =>
                                            requiredFieldValidation(
                                                value,
                                                'Ticket title is required!',
                                            )
                                        }
                                    />
                                </FormItem>
                                <FormItem>
                                    <Button variant="solid" type="submit">
                                        Add
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default AddNewColumnContent
