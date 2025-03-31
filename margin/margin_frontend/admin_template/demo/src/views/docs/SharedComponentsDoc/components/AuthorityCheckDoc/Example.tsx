import AuthorityCheck from '@/components/shared/AuthorityCheck'

const Example = () => {
    const permissionRole = ['ADMIN', 'USER']

    const users = [
        {
            name: 'User A',
            roles: ['ADMIN'],
            color: 'text-indigo-500',
        },
        {
            name: 'User B',
            roles: ['USER'],
            color: 'text-emerald-500',
        },
        {
            name: 'User C',
            roles: ['GUEST'],
            color: 'text-rose-500',
        },
        {
            name: 'User D',
            roles: ['ADMIN', 'USER'],
            color: 'text-blue-500',
        },
    ]

    return (
        <>
            <h6 className="mb-4">Users with different role</h6>
            <div className="flex flex-col gap-2">
                {users.map((user, index) => (
                    <div key={index}>
                        <span className={user.color}>{user.name}</span>: {` `}
                        <span className="font-semibold">
                            {user.roles.toString()}
                        </span>
                    </div>
                ))}
            </div>
            <hr className="my-4" />
            <div className="mb-4">
                <span>Roles who can access: {` `}</span>
                <span className="font-semibold">
                    {permissionRole.toString()}
                </span>
            </div>
            <div>
                <span>Result (Users who able to access): </span>
                {users.map((user) => (
                    <AuthorityCheck
                        key={user.name}
                        authority={permissionRole}
                        userAuthority={user.roles}
                    >
                        <span className={`${user.color} font-semibold`}>
                            {user.name},{' '}
                        </span>
                    </AuthorityCheck>
                ))}
            </div>
        </>
    )
}

export default Example
