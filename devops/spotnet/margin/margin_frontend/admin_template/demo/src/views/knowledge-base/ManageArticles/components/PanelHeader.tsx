import Button from '@/components/ui/Button'
import { toggleAddCategoryDialog, useAppDispatch } from '../store'

const PanelHeader = () => {
    const dispatch = useAppDispatch()

    const onAddCategory = () => {
        dispatch(toggleAddCategoryDialog(true))
    }

    return (
        <div className="flex items-center">
            <Button size="sm" variant="solid" onClick={onAddCategory}>
                Add category
            </Button>
        </div>
    )
}

export default PanelHeader
