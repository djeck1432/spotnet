import classNames from 'classnames'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import {
    HiOutlineSwitchHorizontal,
    HiOutlineShoppingCart,
} from 'react-icons/hi'
import type { Acivity } from '../store'
import type { ReactNode } from 'react'

export type RecentAcivityProps = {
    data?: Acivity[]
    className?: string
    title?: string
    extra?: ReactNode
}

const ActionAvatar = ({ actionType }: { actionType: number }) => {
    switch (actionType) {
        case 0:
            return (
                <Avatar
                    className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                    icon={<HiOutlineShoppingCart />}
                />
            )
        case 1:
            return (
                <Avatar
                    className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                    icon={<HiOutlineSwitchHorizontal />}
                />
            )
        case 2:
            return (
                <Avatar
                    className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
                    icon={<HiOutlineSwitchHorizontal />}
                />
            )
        default:
            return <Avatar />
    }
}

const RecentAcivity = (props: RecentAcivityProps) => {
    const { data = [], className, title = 'Recent Transaction', extra } = props

    return (
        <Card className={className}>
            <div className="flex items-center justify-between">
                <h4>{title}</h4>
                {extra}
            </div>
            <div className="mt-6">
                {data.map((timeline) => (
                    <div key={timeline.date} className="mb-6">
                        <p className="mb-4">{timeline.date}</p>
                        {timeline.data.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between mb-4"
                            >
                                <div className="flex items-center gap-2">
                                    <ActionAvatar
                                        actionType={activity.actionType}
                                    />
                                    <h6 className="text-sm font-bold">
                                        {activity.action}
                                    </h6>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={classNames(
                                            'font-semibold',
                                            activity.actionType === 2
                                                ? 'text-red-600'
                                                : 'text-gray-900 dark:text-gray-100',
                                        )}
                                    >
                                        {activity.coinValue} {activity.symbol}
                                    </p>
                                    <p className="text-xs">
                                        {activity.actionType === 2 ? '-' : '+'}{' '}
                                        {activity.fiatValue} {activity.curency}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default RecentAcivity
