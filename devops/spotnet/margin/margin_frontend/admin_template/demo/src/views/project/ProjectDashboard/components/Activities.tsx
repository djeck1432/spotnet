import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Timeline from '@/components/ui/Timeline'
import Event from '@/views/account/ActivityLog/components/Event'
import TimelineAvatar from '@/views/account/ActivityLog/components/TimeLineAvatar'
import { useNavigate } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

type ActivitiesProps = {
    data?: {
        type: string
        dateTime: number
        ticket?: string
        status?: number
        userName: string
        userImg?: string
        comment?: string
        tags?: string[]
        files?: string[]
    }[]
}

const Activities = ({ data = [] }: ActivitiesProps) => {
    const navigate = useNavigate()

    const onViewAllActivity = () => {
        navigate('/app/account/activity-log')
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Activitiess</h4>
                <Button size="sm" onClick={onViewAllActivity}>
                    View All
                </Button>
            </div>
            <div className="mt-6">
                <Timeline>
                    {isEmpty(data) ? (
                        <Timeline.Item>No Activities</Timeline.Item>
                    ) : (
                        data.map((event, index) => (
                            <Timeline.Item
                                key={event.type + index}
                                media={<TimelineAvatar data={event} />}
                            >
                                <Event compact data={event} />
                            </Timeline.Item>
                        ))
                    )}
                </Timeline>
            </div>
        </Card>
    )
}

export default Activities
