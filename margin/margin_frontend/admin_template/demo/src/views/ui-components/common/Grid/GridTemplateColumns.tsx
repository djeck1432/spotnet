import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridTemplateColumns = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {[...Array(9).keys()].map((elm) => (
                <DemoBoxContent key={elm} className="shadow-lg bg-fuchsia-500">
                    {'0' + (elm + 1)}
                </DemoBoxContent>
            ))}
        </div>
    )
}

export default GridTemplateColumns
