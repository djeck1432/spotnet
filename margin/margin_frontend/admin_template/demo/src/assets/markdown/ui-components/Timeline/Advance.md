```jsx
import Timeline from '@/components/ui/Timeline'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { HiTag } from 'react-icons/hi'
import type { AvatarProps } from '@/components/ui/Avatar'

type TimelineAvatarProps = AvatarProps

const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
    return (
        <Avatar {...rest} size={25} shape="circle">
            {children}
        </Avatar>
    )
}

const Advance = () => {
    return (
        <div className="max-w-[700px]">
            <Timeline>
                <Timeline.Item
                    media={
                        <TimelineAvatar className="bg-amber-500">
                            C
                        </TimelineAvatar>
                    }
                >
                    <p className="my-1 flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Carolyn Perkins{' '}
                        </span>
                        <span className="mx-2">has change the status to </span>
                        <Badge className="bg-emerald-500" />
                        <span className="ml-1 rtl:mr-1 font-semibold text-gray-900 dark:text-gray-100">
                            Completed
                        </span>
                        <span className="ml-3 rtl:mr-3">6h ago</span>
                    </p>
                </Timeline.Item>
                <Timeline.Item
                    media={
                        <TimelineAvatar
                            src="/img/avatars/thumb-3.jpg"
                            className="bg-amber-500"
                        />
                    }
                >
                    <p className="my-1 flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Ron Vargas
                        </span>
                        <span className="mx-2">comment on your </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Post
                        </span>
                        <span className="ml-3 rtl:mr-3">2d ago</span>
                    </p>
                    <Card className="mt-4">
                        <p>
                            Fine, Java MIGHT be a good example of what a
                            programming language should be like. But Java
                            applications are good examples of what applications
                            SHOULDN&apos;T be like.
                        </p>
                    </Card>
                </Timeline.Item>
                <Timeline.Item
                    media={
                        <TimelineAvatar className="text-gray-700 bg-gray-200 dark:text-gray-100">
                            <HiTag />
                        </TimelineAvatar>
                    }
                >
                    <p className="flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Joyce Freeman{' '}
                        </span>
                        <span className="mx-2">added tags </span>
                        <Tag
                            prefix
                            className="mr-2 rtl:ml-2 cursor-pointer"
                            prefixClass="bg-rose-500"
                        >
                            Live Issue
                        </Tag>
                        <Tag
                            prefix
                            className="mr-2 rtl:ml-2 cursor-pointer"
                            prefixClass="bg-blue-600"
                        >
                            Backend
                        </Tag>
                        <span className="ml-3 rtl:mr-3">2d ago</span>
                    </p>
                </Timeline.Item>
            </Timeline>
        </div>
    )
}

export default Advance
```
