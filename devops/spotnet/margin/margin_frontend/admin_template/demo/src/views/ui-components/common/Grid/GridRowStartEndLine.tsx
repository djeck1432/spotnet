import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridRowStartEndLine = () => {
    return (
        <div className="grid grid-rows-3 grid-flow-col gap-4">
            <DemoBoxContent className="row-start-2 row-span-2 bg-blue-500 place-content-center">
                01
            </DemoBoxContent>
            <DemoBoxContent className="row-end-3 row-span-2 bg-blue-500 place-content-center">
                02
            </DemoBoxContent>
            <DemoBoxContent className="row-start-1 row-end-4 bg-blue-500 place-content-center">
                03
            </DemoBoxContent>
        </div>
    )
}

export default GridRowStartEndLine
