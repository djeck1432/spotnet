import { useState } from 'react'
import Switcher from '@/components/ui/Switcher'
import Loading from '@/components/shared/Loading'

const Custom = () => {
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
                    <div className="flex items-center justify-center p-5">
                        <div className="flex space-x-2 animate-pulse">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        </div>
                    </div>
                }
            >
                <div className="text-center">Finish loading</div>
            </Loading>
        </>
    )
}

export default Custom
