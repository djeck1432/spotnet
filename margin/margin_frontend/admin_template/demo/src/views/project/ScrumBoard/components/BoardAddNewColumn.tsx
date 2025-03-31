import Button from '@/components/ui/Button'
import { useDispatch } from 'react-redux'
import { openDialog, updateDialogView } from '../store'
import { HiOutlinePlusCircle } from 'react-icons/hi'

const BoardAddNewColumn = () => {
    const dispatch = useDispatch()

    const onAddNewColumn = () => {
        dispatch(updateDialogView('NEW_COLUMN'))
        dispatch(openDialog())
    }

    return (
        <Button
            size="sm"
            icon={<HiOutlinePlusCircle />}
            onClick={onAddNewColumn}
        >
            <span>New Board</span>
        </Button>
    )
}

export default BoardAddNewColumn
