import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridAutoRows = () => {
    return (
        <div className="grid grid-flow-row auto-rows-max gap-4">
            <DemoBoxContent className="shadow-lg bg-amber-500">
                01
            </DemoBoxContent>
            <DemoBoxContent className="shadow-lg bg-amber-500">
                02
            </DemoBoxContent>
            <DemoBoxContent className="shadow-lg bg-amber-500">
                03
            </DemoBoxContent>
        </div>
    )
}

export default GridAutoRows
