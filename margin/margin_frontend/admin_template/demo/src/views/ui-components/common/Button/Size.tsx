import Button from '@/components/ui/Button'

const Size = () => {
    return (
        <div className="flex-wrap inline-flex xl:flex items-center gap-2">
            <Button size="xs">Extra Small (xs)</Button>
            <Button size="sm">Small (sm)</Button>
            <Button>Medium (md)</Button>
            <Button size="lg">Large (lg)</Button>
        </div>
    )
}

export default Size
