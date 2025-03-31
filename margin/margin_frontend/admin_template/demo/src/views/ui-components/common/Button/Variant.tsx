import Button from '@/components/ui/Button'

const Variant = () => {
    return (
        <div className="inline-flex flex-wrap xl:flex gap-2">
            <Button>Default</Button>
            <Button variant="solid">Solid</Button>
            <Button variant="twoTone">Two Tone</Button>
            <Button variant="plain">Plain</Button>
        </div>
    )
}

export default Variant
