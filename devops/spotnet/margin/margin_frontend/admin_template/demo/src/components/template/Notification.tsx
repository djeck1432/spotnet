import { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import {
    HiOutlineBell,
    HiOutlineCalendar,
    HiOutlineClipboardCheck,
    HiOutlineBan,
    HiOutlineMailOpen,
} from 'react-icons/hi'
import {
    apiGetNotificationList,
    apiGetNotificationCount,
} from '@/services/CommonService'
import { Link } from 'react-router-dom'
import isLastChild from '@/utils/isLastChild'
import useTwColorByName from '@/utils/hooks/useTwColorByName'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useAppSelector } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import acronym from '@/utils/acronym'

type NotificationList = {
    id: string
    target: string
    description: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}

const notificationHeight = 'h-72'
const imagePath = '/img/avatars/'

const GeneratedAvatar = ({ target }: { target: string }) => {
    const color = useTwColorByName()
    return (
        <Avatar shape="circle" className={`${color(target)}`}>
            {acronym(target)}
        </Avatar>
    )
}

const notificationTypeAvatar = (data: {
    type: number
    target: string
    image: string
    status: string
}) => {
    const { type, target, image, status } = data
    switch (type) {
        case 0:
            if (image) {
                return <Avatar shape="circle" src={`${imagePath}${image}`} />
            } else {
                return <GeneratedAvatar target={target} />
            }
        case 1:
            return (
                <Avatar
                    shape="circle"
                    className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                    icon={<HiOutlineCalendar />}
                />
            )
        case 2:
            return (
                <Avatar
                    shape="circle"
                    className={
                        status === 'succeed'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100'
                            : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100'
                    }
                    icon={
                        status === 'succeed' ? (
                            <HiOutlineClipboardCheck />
                        ) : (
                            <HiOutlineBan />
                        )
                    }
                />
            )
        default:
            return <Avatar />
    }
}

const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    return (
        <div className={classNames('text-2xl', className)}>
            {dot ? (
                <Badge badgeStyle={{ top: '3px', right: '6px' }}>
                    <HiOutlineBell />
                </Badge>
            ) : (
                <HiOutlineBell />
            )}
        </div>
    )
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<
        NotificationList[]
    >([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)

    const { bgTheme } = useThemeClass()

    const { larger } = useResponsive()

    const direction = useAppSelector((state) => state.theme.direction)

    const getNotificationCount = useCallback(async () => {
        const resp = await apiGetNotificationCount()
        if (resp.data.count > 0) {
            setNoResult(false)
            setUnreadNotification(true)
        } else {
            setNoResult(true)
        }
    }, [setUnreadNotification])

    useEffect(() => {
        getNotificationCount()
    }, [getNotificationCount])

    const onNotificationOpen = useCallback(async () => {
        if (notificationList.length === 0) {
            setLoading(true)
            const resp = await apiGetNotificationList()
            setLoading(false)
            setNotificationList(resp.data)
        }
    }, [notificationList, setLoading])

    const onMarkAllAsRead = useCallback(() => {
        const list = notificationList.map((item: NotificationList) => {
            if (!item.readed) {
                item.readed = true
            }
            return item
        })
        setNotificationList(list)
        setUnreadNotification(false)
    }, [notificationList])

    const onMarkAsRead = useCallback(
        (id: string) => {
            const list = notificationList.map((item) => {
                if (item.id === id) {
                    item.readed = true
                }
                return item
            })
            setNotificationList(list)
            const hasUnread = notificationList.some((item) => !item.readed)

            if (!hasUnread) {
                setUnreadNotification(false)
            }
        },
        [notificationList],
    )

    return (
        <Dropdown
            renderTitle={
                <NotificationToggle
                    dot={unreadNotification}
                    className={className}
                />
            }
            menuClass="p-0 min-w-[280px] md:min-w-[340px]"
            placement={larger.md ? 'bottom-end' : 'bottom-center'}
            onOpen={onNotificationOpen}
        >
            <Dropdown.Item variant="header">
                <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center justify-between">
                    <h6>Notifications</h6>
                    <Tooltip title="Mark all as read">
                        <Button
                            variant="plain"
                            shape="circle"
                            size="sm"
                            icon={<HiOutlineMailOpen className="text-xl" />}
                            onClick={onMarkAllAsRead}
                        />
                    </Tooltip>
                </div>
            </Dropdown.Item>
            <div className={classNames('overflow-y-auto', notificationHeight)}>
                <ScrollBar direction={direction}>
                    {notificationList.length > 0 &&
                        notificationList.map((item, index) => (
                            <div
                                key={item.id}
                                className={`relative flex px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20  ${
                                    !isLastChild(notificationList, index)
                                        ? 'border-b border-gray-200 dark:border-gray-600'
                                        : ''
                                }`}
                                onClick={() => onMarkAsRead(item.id)}
                            >
                                <div>{notificationTypeAvatar(item)}</div>
                                <div className="ltr:ml-3 rtl:mr-3">
                                    <div>
                                        {item.target && (
                                            <span className="font-semibold heading-text">
                                                {item.target}{' '}
                                            </span>
                                        )}
                                        <span>{item.description}</span>
                                    </div>
                                    <span className="text-xs">{item.date}</span>
                                </div>
                                <Badge
                                    className="absolute top-4 ltr:right-4 rtl:left-4 mt-1.5"
                                    innerClass={`${
                                        item.readed ? 'bg-gray-300' : bgTheme
                                    } `}
                                />
                            </div>
                        ))}
                    {loading && (
                        <div
                            className={classNames(
                                'flex items-center justify-center',
                                notificationHeight,
                            )}
                        >
                            <Spinner size={40} />
                        </div>
                    )}
                    {noResult && (
                        <div
                            className={classNames(
                                'flex items-center justify-center',
                                notificationHeight,
                            )}
                        >
                            <div className="text-center">
                                <img
                                    className="mx-auto mb-2 max-w-[150px]"
                                    src="/img/others/no-notification.png"
                                    alt="no-notification"
                                />
                                <h6 className="font-semibold">
                                    No notifications!
                                </h6>
                                <p className="mt-1">Please Try again later</p>
                            </div>
                        </div>
                    )}
                </ScrollBar>
            </div>
            <Dropdown.Item variant="header">
                <div className="flex justify-center border-t border-gray-200 dark:border-gray-600 px-4 py-2">
                    <Link
                        to="/app/account/activity-log"
                        className="font-semibold cursor-pointer p-2 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        View All Activity
                    </Link>
                </div>
            </Dropdown.Item>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
