```jsx
import { useState } from 'react'
import Switcher from '@/components/ui/Switcher'
import Avatar from '@/components/ui/Avatar'
import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'

const WithLoding = () => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <>
            <div className="flex items-center mb-4 gap-2">
                <span>Loading State: </span>
                <Switcher
                    checked={isLoading}
                    onChange={(checked) => setIsLoading(!checked)}
                />
            </div>
            <Loading
                loading={isLoading}
                customLoader={
                    <MediaSkeleton
                        titleProps={{
                            width: 130,
                        }}
                        textProps={{
                            width: 150,
                        }}
                        avatarProps={{
                            width: 45,
                            height: 45,
                        }}
                    />
                }
            >
                <div className="flex items-center gap-2">
                    <Avatar
                        size={45}
                        src="/img/avatars/thumb-1.jpg"
                        shape="circle"
                    />
                    <div>
                        <h6>Carolyn Perkins</h6>
                        <p>carolyn.p@elstar.com</p>
                    </div>
                </div>
            </Loading>
        </>
    )
}

export default WithLoding
```
