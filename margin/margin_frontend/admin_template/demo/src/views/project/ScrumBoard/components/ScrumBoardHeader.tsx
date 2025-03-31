import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import BoardAddNewColumn from './BoardAddNewColumn'
import QuickFilterTab from './QuickFilterTab'
import Container from '@/components/shared/Container'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import {
    getMembers,
    openDialog,
    updateDialogView,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { HiOutlineUserAdd, HiOutlineCog } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

const BoardHeader = () => {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const boardMembers = useAppSelector(
        (state) => state.scrumBoard.data.boardMembers,
    )

    const onAddMember = () => {
        dispatch(updateDialogView('ADD_MEMBER'))
        dispatch(openDialog())
    }

    useEffect(() => {
        dispatch(getMembers())
    }, [dispatch])

    return (
        <div className="pt-8 pb-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <Container className="px-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="mb-1">Agile project</p>
                        <h3>RND Team Sprint 2</h3>
                    </div>
                    <UsersAvatarGroup users={boardMembers} />
                </div>
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                    <QuickFilterTab />
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            icon={<HiOutlineUserAdd />}
                            onClick={onAddMember}
                        />
                        <Button
                            size="sm"
                            icon={<HiOutlineCog />}
                            onClick={() =>
                                navigate('/app/account/settings/profile')
                            }
                        />
                        <BoardAddNewColumn />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default BoardHeader
