import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'

type MembersProps = {
    members: {
        name: string
        img: string
    }[]
}

const Members = ({ members }: MembersProps) => {
    return <UsersAvatarGroup users={members} />
}

export default Members
