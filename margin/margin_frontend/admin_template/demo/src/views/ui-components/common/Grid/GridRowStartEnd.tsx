import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridRowStartEnd = () => {
    return (
        <div className="grid grid-rows-3 grid-flow-col gap-4">
            <DemoBoxContent className="row-span-3 bg-fuchsia-500 grid place-content-center">
                01
            </DemoBoxContent>
            <DemoBoxContent className="col-span-2 bg-fuchsia-300 grid place-content-center dark:bg-fuchsia-800 dark:text-fuchsia-400">
                02
            </DemoBoxContent>
            <DemoBoxContent className="row-span-2 col-span-2 bg-fuchsia-500 grid place-content-center">
                03
            </DemoBoxContent>
        </div>
    )
}

export default GridRowStartEnd
