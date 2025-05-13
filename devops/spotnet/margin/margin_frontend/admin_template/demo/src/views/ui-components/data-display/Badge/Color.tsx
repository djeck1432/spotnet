import Badge from '@/components/ui/Badge'

const Color = () => {
    return (
        <div>
            <div className="flex items-center">
                <Badge className="mr-4" innerClass="bg-blue-500" />
                <Badge
                    className="mr-4"
                    content={9}
                    innerClass="bg-emerald-500"
                />
                <Badge
                    className="mr-4 font-semibold"
                    content={99}
                    innerClass="bg-red-50 text-red-500"
                />
                <Badge
                    className="mr-4 border border-gray-400"
                    content={'New'}
                    innerClass="bg-white text-gray-500"
                />
            </div>
        </div>
    )
}

export default Color
