import Skeleton from '@/components/ui/Skeleton'

const Variant = () => {
    return (
        <div className="flex items-center gap-4">
            <div>
                <Skeleton variant="circle" />
            </div>
            <Skeleton />
        </div>
    )
}

export default Variant
