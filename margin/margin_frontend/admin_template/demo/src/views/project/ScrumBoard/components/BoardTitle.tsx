import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Dropdown from '@/components/ui/Dropdown'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import EllipsisButton from '@/components/shared/EllipsisButton'
import {
    HiOutlinePencil,
    HiOutlineTrash,
    HiXCircle,
    HiOutlineExclamation,
    HiOutlinePlusCircle,
    HiCheckCircle,
} from 'react-icons/hi'
import { Formik, Field, Form } from 'formik'
import {
    openDialog,
    updateDialogView,
    setSelectedBoard,
    updateColumns,
    updateOrdered,
    useAppDispatch,
    useAppSelector,
} from '../store'
import requiredFieldValidation from '@/utils/requiredFieldValidation'
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import type { Columns } from '../types'

type BoardTitleProps = {
    dragHandleProps?: DraggableProvidedDragHandleProps | null
    title: string
}

type RenameFormProps = {
    title: string
    closeRenameForm: () => void
    columns: Columns
    ordered: string[]
}

const RenameForm = ({
    title,
    closeRenameForm,
    columns,
    ordered,
}: RenameFormProps) => {
    const dispatch = useAppDispatch()

    const onFormSubmit = (newTitle: string) => {
        if (ordered.some((elm) => elm === newTitle)) {
            closeRenameForm()
            return
        }

        const newColumns = {}
        delete Object.assign(newColumns, columns, {
            [newTitle]: columns[title],
        })[title]

        const newOrder = ordered.map((elm) => {
            if (elm === title) {
                return newTitle
            }
            return elm
        })

        dispatch(updateColumns(newColumns))
        dispatch(updateOrdered(newOrder))
        closeRenameForm()
    }

    return (
        <Formik
            initialValues={{ title: title }}
            onSubmit={({ title }) => onFormSubmit(title)}
        >
            {({ errors, touched, submitForm }) => (
                <Form>
                    <FormContainer layout="inline" size="sm">
                        <FormItem
                            className="mb-0"
                            invalid={errors.title && touched.title}
                        >
                            <Field
                                type="text"
                                name="title"
                                placeholder="Please enter board title"
                                component={Input}
                                validate={requiredFieldValidation}
                                suffix={
                                    <div className="flex items-center gap-2">
                                        <HiCheckCircle
                                            className="cursor-pointer text-lg text-emerald-500"
                                            onClick={submitForm}
                                        />
                                    </div>
                                }
                            />
                        </FormItem>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

const BoardTitle = (props: BoardTitleProps) => {
    const { dragHandleProps, title } = props

    const columns = useAppSelector((state) => state.scrumBoard.data.columns)
    const ordered = useAppSelector((state) => state.scrumBoard.data.ordered)

    const dispatch = useAppDispatch()

    const [renameActive, setRenameActive] = useState(false)
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)

    const onRenameActive = () => {
        setRenameActive(true)
    }

    const onRenameDeactivate = () => {
        setRenameActive(false)
    }

    const onConfirmDeleteClose = () => {
        setConfirmDeleteDialog(false)
    }

    const onBoardDelete = () => {
        setConfirmDeleteDialog(true)
    }

    const onAddNewTicket = () => {
        dispatch(openDialog())
        dispatch(updateDialogView('NEW_TICKET'))
        dispatch(setSelectedBoard(title))
    }

    const onDelete = () => {
        const newOrder = ordered.filter((elm) => elm !== title)
        const newColumns: Columns = {}
        Object.assign(newColumns, columns)
        delete newColumns[title]
        dispatch(updateColumns(newColumns))
        dispatch(updateOrdered(newOrder))
    }

    return (
        <div
            className="board-title px-4 py-3 flex justify-between items-center"
            {...dragHandleProps}
        >
            {renameActive ? (
                <>
                    <RenameForm
                        title={title}
                        closeRenameForm={onRenameDeactivate}
                        columns={columns}
                        ordered={ordered}
                    />
                    <HiXCircle
                        className="cursor-pointer text-lg"
                        onClick={onRenameDeactivate}
                    />
                </>
            ) : (
                <>
                    <h6>{title}</h6>
                    <Dropdown
                        placement="bottom-end"
                        renderTitle={<EllipsisButton />}
                    >
                        <Dropdown.Item
                            eventKey="renameBoard"
                            onClick={onRenameActive}
                        >
                            <span className="text-lg">
                                <HiOutlinePencil />
                            </span>
                            <span className="ml-2 rtl:mr-2">Rename</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="addTicket"
                            onClick={onAddNewTicket}
                        >
                            <span className="text-lg">
                                <HiOutlinePlusCircle />
                            </span>
                            <span className="ml-2 rtl:mr-2">Add Ticket</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="deleteBoard"
                            onClick={onBoardDelete}
                        >
                            <span className="text-lg">
                                <HiOutlineTrash />
                            </span>
                            <span className="ml-2 rtl:mr-2">Delete Board</span>
                        </Dropdown.Item>
                    </Dropdown>
                </>
            )}
            <Dialog
                isOpen={confirmDeleteDialog}
                contentClassName="pb-0 px-0 "
                onClose={onConfirmDeleteClose}
                onRequestClose={onConfirmDeleteClose}
            >
                <div className="px-6 pb-6 pt-2 flex">
                    <div>
                        <Avatar
                            className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20"
                            shape="circle"
                        >
                            <span className="text-2xl">
                                <HiOutlineExclamation />
                            </span>
                        </Avatar>
                    </div>
                    <div className="ml-4 rtl:mr-4">
                        <h5 className="mb-2">Delete Board</h5>
                        <p>
                            Are you sure you want to delete this board? All the
                            tickets under this board will be deleted as well.
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
                    <Button
                        size="sm"
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={onConfirmDeleteClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        color="red-600"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default BoardTitle
