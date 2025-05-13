import { useEffect } from 'react'
import Timeline from '@/components/ui/Timeline'
import Button from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import Event from './Event'
import TimeLineAvatar from './TimeLineAvatar'
import {
    getLogs,
    filterLogs,
    setActivityIndex,
    useAppDispatch,
    useAppSelector,
} from '../store'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'

const Log = () => {
    const dispatch = useAppDispatch()
    const logs = useAppSelector((state) => state.accountActivityLog.data.logs)
    const loading = useAppSelector(
        (state) => state.accountActivityLog.data.loading,
    )
    const loadMoreLoading = useAppSelector(
        (state) => state.accountActivityLog.data.loadMoreLoading,
    )
    const loadable = useAppSelector(
        (state) => state.accountActivityLog.data.loadable,
    )
    const selectedType = useAppSelector(
        (state) => state.accountActivityLog.data.selectedType,
    )
    const activityIndex = useAppSelector(
        (state) => state.accountActivityLog.data.activityIndex,
    )

    useEffect(() => {
        dispatch(filterLogs({ filter: selectedType, activityIndex }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onLoadMore = () => {
        const nextIndex = activityIndex + 1
        dispatch(setActivityIndex(nextIndex))
        dispatch(getLogs({ filter: selectedType, activityIndex: nextIndex }))
    }

    return (
        <Loading loading={loading}>
            <div className="max-w-[900px]">
                {logs.map((log) => (
                    <div key={log.id} className="mb-8">
                        <div className="mb-4 font-semibold uppercase">
                            {dayjs.unix(log.date).format('dddd, DD MMMM')}
                        </div>
                        <Timeline>
                            {isEmpty(log.events) ? (
                                <Timeline.Item>No Activities</Timeline.Item>
                            ) : (
                                log.events.map((event, index) => (
                                    <Timeline.Item
                                        key={event.type + index}
                                        media={<TimeLineAvatar data={event} />}
                                    >
                                        <div className="mt-1">
                                            <Event data={event} />
                                        </div>
                                    </Timeline.Item>
                                ))
                            )}
                        </Timeline>
                    </div>
                ))}
                <div className="text-center">
                    {loadable ? (
                        <Button loading={loadMoreLoading} onClick={onLoadMore}>
                            Load More
                        </Button>
                    ) : (
                        'No more activity to load'
                    )}
                </div>
            </div>
        </Loading>
    )
}

export default Log
