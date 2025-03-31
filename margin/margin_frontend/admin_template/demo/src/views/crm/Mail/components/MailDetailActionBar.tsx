import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import InputGroup from '@/components/ui/InputGroup'
import classNames from 'classnames'
import {
    HiReply,
    HiOutlineFolderDownload,
    HiStar,
    HiOutlineStar,
    HiFlag,
    HiOutlineFlag,
    HiOutlineTrash,
    HiOutlinePaperAirplane,
    HiOutlineArrowSmLeft,
} from 'react-icons/hi'
import {
    updateMailList,
    updateMail,
    updateMailId,
    updateReply,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { groupList } from '../constants'
import useResponsive from '@/utils/hooks/useResponsive'
import cloneDeep from 'lodash/cloneDeep'

type MailDetailActionBarProps = {
    starred?: boolean
    flagged?: boolean
    isReply?: boolean
    mailId?: number | string
    onStarToggle?: () => void
    onFlagToggle?: () => void
    onMailSend?: () => void
    onMailReply?: () => void
}

const BackButton = () => {
    const dispatch = useAppDispatch()

    const { smaller } = useResponsive()

    const onResetSelectedMail = () => {
        dispatch(updateMail({}))
        dispatch(updateMailId(''))
    }

    return smaller.xl ? (
        <Button
            icon={<HiOutlineArrowSmLeft />}
            variant="plain"
            shape="circle"
            size="sm"
            onClick={onResetSelectedMail}
        />
    ) : (
        <></>
    )
}

const MailDetailActionBar = (props: MailDetailActionBarProps) => {
    const {
        starred,
        flagged,
        isReply,
        mailId,
        onStarToggle,
        onFlagToggle,
        onMailSend,
        onMailReply,
    } = props

    const dispatch = useAppDispatch()
    const mails = useAppSelector((state) => state.crmMail.data.mailList)

    const onReply = () => {
        dispatch(updateReply(true))
        onMailReply?.()
    }

    const onDiscard = () => {
        dispatch(updateReply(false))
    }

    const onSend = () => {
        onMailSend?.()
    }

    const onStar = () => {
        const data = updateMailsData('starred')
        dispatch(updateMailList(data))
        onStarToggle?.()
    }

    const onFlag = () => {
        const data = updateMailsData('flagged')
        dispatch(updateMailList(data))
        onFlagToggle?.()
    }

    const updateMailsData = (key: 'starred' | 'flagged') => {
        let newMailsData = cloneDeep(mails)
        newMailsData = newMailsData.map((mail) => {
            if (mail.id === mailId) {
                mail[key] = !mail[key]
            }
            return mail
        })
        return newMailsData
    }

    return (
        <div
            className={classNames(
                'relative flex items-center min-h-[55px] px-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800',
            )}
        >
            {isReply ? (
                <div className="flex items-center xl:justify-end justify-between gap-2 w-full">
                    <BackButton />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            icon={<HiOutlineTrash />}
                            onClick={onDiscard}
                        >
                            Discard
                        </Button>
                        <Button
                            variant="solid"
                            size="sm"
                            icon={<HiOutlinePaperAirplane />}
                            onClick={onSend}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <BackButton />
                        <Button size="sm" icon={<HiReply />} onClick={onReply}>
                            <span className="hidden sm:block">Reply</span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <InputGroup size="sm">
                            <Button
                                size="sm"
                                icon={
                                    <span className="text-amber-500">
                                        {starred ? (
                                            <HiStar />
                                        ) : (
                                            <HiOutlineStar />
                                        )}
                                    </span>
                                }
                                onClick={onStar}
                            >
                                <span className="hidden sm:block">
                                    {starred ? 'Starred' : 'Star'}
                                </span>
                            </Button>
                            <Button
                                size="sm"
                                icon={
                                    <span className="text-red-500">
                                        {flagged ? (
                                            <HiFlag />
                                        ) : (
                                            <HiOutlineFlag />
                                        )}
                                    </span>
                                }
                                onClick={onFlag}
                            >
                                <span className="hidden sm:block">
                                    {flagged ? 'Flagged' : 'Flag'}
                                </span>
                            </Button>
                        </InputGroup>
                        <Dropdown
                            placement="bottom-end"
                            renderTitle={
                                <Button
                                    size="sm"
                                    icon={<HiOutlineFolderDownload />}
                                >
                                    <span className="hidden sm:block">
                                        Move to
                                    </span>
                                </Button>
                            }
                        >
                            {groupList.map((group) => (
                                <Dropdown.Item
                                    key={group.value}
                                    eventKey={group.value}
                                >
                                    <span className="text-xl ltr:mr-2 rtl:ml-2">
                                        {group.icon}
                                    </span>
                                    <span>{group.label}</span>
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MailDetailActionBar
