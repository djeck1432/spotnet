import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridColumnStartEndLine = () => {
    return (
        <div className="grid grid-cols-6 gap-4">
            <DemoBoxContent className="col-start-2 col-span-4 shadow-lg bg-sky-500">
                01
            </DemoBoxContent>
            <DemoBoxContent className="col-start-1 col-end-3 shadow-lg bg-sky-500">
                02
            </DemoBoxContent>
            <DemoBoxContent className="col-end-7 col-span-2 shadow-lg bg-sky-500">
                03
            </DemoBoxContent>
            <DemoBoxContent className="col-start-1 col-end-7 shadow-lg bg-sky-500">
                04
            </DemoBoxContent>
        </div>
    )
}

export default GridColumnStartEndLine
