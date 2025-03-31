```jsx
import Tooltip from '@/components/ui/Tooltip'

const Placement = () => {
    return (
        <div
            style={{ maxWidth: 700 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
            <div></div>
            <Tooltip title="Top start" placement="top-start">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Top start
                </div>
            </Tooltip>
            <Tooltip title="Top" placement="top">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Top
                </div>
            </Tooltip>
            <Tooltip title="Top end" placement="top-end">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Top end
                </div>
            </Tooltip>
            <div></div>
            <Tooltip title="Left start" placement="left-start">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Left start
                </div>
            </Tooltip>
            <div></div>
            <div></div>
            <div></div>
            <Tooltip title="Right start" placement="right-start">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Right start
                </div>
            </Tooltip>
            <Tooltip title="Left" placement="left">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Left
                </div>
            </Tooltip>
            <div></div>
            <div></div>
            <div></div>
            <Tooltip title="Right" placement="right">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Right
                </div>
            </Tooltip>
            <Tooltip title="Left end" placement="left-end">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Left end
                </div>
            </Tooltip>
            <div></div>
            <div></div>
            <div></div>
            <Tooltip title="Right end" placement="right-end">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Right end
                </div>
            </Tooltip>
            <div></div>
            <Tooltip title="Bottom start" placement="bottom-start">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Bottom start
                </div>
            </Tooltip>
            <Tooltip title="Bottom" placement="bottom">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Bottom
                </div>
            </Tooltip>
            <Tooltip title="Bottom end" placement="bottom-end">
                <div className="border border-gray-200 py-2 px-4 text-center cursor-pointer w-full">
                    Bottom end
                </div>
            </Tooltip>
            <div></div>
        </div>
    )
}

export default Placement
```
