import { useMemo } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import Avatar from '@/components/ui/Avatar'
import acronym from '@/utils/acronym'
import useTwColorByName from '@/utils/hooks/useTwColorByName'
import type { AvatarProps, AvatarGroupProps } from '@/components/ui/Avatar'

type User = Record<string, string>

interface UsersAvatarGroupProps extends AvatarGroupProps {
    avatarGroupProps?: AvatarGroupProps
    avatarProps?: AvatarProps
    imgKey?: string
    nameKey?: string
    onAvatarClick?: (avatar: User) => void
    users?: User[]
}

const UsersAvatarGroup = (props: UsersAvatarGroupProps) => {
    const {
        avatarGroupProps = {},
        avatarProps = {},
        imgKey = 'img',
        nameKey = 'name',
        onAvatarClick,
        users = [],
        ...rest
    } = props

    const bgColor = useTwColorByName()

    const defaultAvatarProps = useMemo(() => {
        return {
            shape: 'circle' as 'round' | 'circle' | 'square',
            size: 30,
            className: 'cursor-pointer',
            ...avatarProps,
        }
    }, [avatarProps])

    const handleAvatarClick = (avatar: User) => {
        onAvatarClick?.(avatar)
    }

    return (
        <Avatar.Group
            omittedAvatarTooltip
            chained
            omittedAvatarProps={defaultAvatarProps}
            {...avatarGroupProps}
            {...rest}
        >
            {users.map((elm, index) => (
                <Tooltip key={elm[nameKey] + index} title={elm[nameKey]}>
                    <Avatar
                        {...defaultAvatarProps}
                        className={`${
                            elm[imgKey] ? '' : bgColor(elm[nameKey])
                        } ${defaultAvatarProps.className}`}
                        src={elm[imgKey]}
                        onClick={() => handleAvatarClick(elm)}
                    >
                        {acronym(elm.name)}
                    </Avatar>
                </Tooltip>
            ))}
        </Avatar.Group>
    )
}

export default UsersAvatarGroup
