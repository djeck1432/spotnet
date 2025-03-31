import TextEllipsis from '@/components/shared/TextEllipsis'

const string =
    'Kopi-luwak, seasonal breve strong caffeine medium lungo grinder. Espresso filter, café au lait turkish, sweet.'

const Example = () => {
    return (
        <p className="text-base">
            <TextEllipsis text={string} maxTextCount={40} />
        </p>
    )
}

export default Example
