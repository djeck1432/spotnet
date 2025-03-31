import { useRef } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { HiOutlinePencilAlt } from 'react-icons/hi'
import MailEditor, { MailEditorRef } from './MailEditor'
import {
    toggleNewMessageDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'

const MainCompose = () => {
    const dispatch = useAppDispatch()

    const mailEditorRef = useRef<MailEditorRef>(null)

    const isOpen = useAppSelector(
        (state) => state.crmMail.data.newMessageDialog,
    )

    const onDialogOpen = () => {
        dispatch(toggleNewMessageDialog(true))
    }

    const onDialogClose = () => {
        dispatch(toggleNewMessageDialog(false))
    }

    const onSend = () => {
        mailEditorRef.current?.formikRef?.submitForm()
    }

    return (
        <>
            <Button
                block
                variant="solid"
                icon={<HiOutlinePencilAlt />}
                onClick={onDialogOpen}
            >
                New Message
            </Button>
            <Dialog
                isOpen={isOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">New Message</h5>
                <div className="max-h-[400px] overflow-y-auto px-1">
                    <MailEditor ref={mailEditorRef} mode="new" />
                </div>
                <div className="text-right mt-4">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Discard
                    </Button>
                    <Button variant="solid" onClick={onSend}>
                        Send
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default MainCompose
