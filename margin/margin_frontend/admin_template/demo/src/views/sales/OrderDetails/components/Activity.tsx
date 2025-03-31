import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import isLastChild from '@/utils/isLastChild'
import dayjs from 'dayjs'

type Event = {
    time: number
    action: string
    recipient?: string
}

type ActivityProps = {
    data?: {
        date: number
        events: Event[]
    }[]
}

const Activity = ({ data = [] }: ActivityProps) => {
    return (
        <Card className="mb-4">
            <h5 className="mb-4">Activity</h5>
            {data.map((activity, i) => (
                <div
                    key={activity.date}
                    className={!isLastChild(data, i) ? 'mb-8' : ''}
                >
                    <div className="mb-2 font-semibold uppercase opacity-80">
                        {dayjs.unix(activity.date).format('dddd, DD MMMM')}
                    </div>
                    <Timeline>
                        {activity.events.map((event, j) => (
                            <Timeline.Item
                                key={event.time + j}
                                media={
                                    <div className="flex mt-1.5">
                                        <Badge
                                            innerClass={classNames(
                                                event.recipient
                                                    ? 'bg-emerald-500'
                                                    : 'bg-blue-500',
                                            )}
                                        />
                                    </div>
                                }
                            >
                                <div
                                    className={classNames(
                                        'font-semibold mb-1 text-base',
                                        event.recipient && 'text-emerald-500',
                                    )}
                                >
                                    {event.action}
                                </div>
                                {event.recipient && (
                                    <div className="mb-1">
                                        Recipient: {event.recipient}
                                    </div>
                                )}
                                <div>
                                    {dayjs.unix(event.time).format('hh:mm A')}
                                </div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </div>
            ))}
        </Card>
    )
}

export default Activity
