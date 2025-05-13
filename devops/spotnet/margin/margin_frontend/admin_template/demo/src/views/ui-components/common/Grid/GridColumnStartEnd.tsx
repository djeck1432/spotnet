import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridColumnStartEnd = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="...">
                <DemoBoxContent className="bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-400">
                    01
                </DemoBoxContent>
            </div>
            <div className="...">
                <DemoBoxContent className="bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-400">
                    02
                </DemoBoxContent>
            </div>
            <div className="...">
                <DemoBoxContent className="bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-400">
                    03
                </DemoBoxContent>
            </div>
            <div className="col-span-2 ...">
                <DemoBoxContent className="shadow-lg bg-indigo-500">
                    04
                </DemoBoxContent>
            </div>
            <div className="...">
                <DemoBoxContent className="bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-400">
                    05
                </DemoBoxContent>
            </div>
            <div className="...">
                <DemoBoxContent className="bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-400">
                    06
                </DemoBoxContent>
            </div>
            <div className="col-span-2 ...">
                <DemoBoxContent className="shadow-lg bg-indigo-500">
                    07
                </DemoBoxContent>
            </div>
        </div>
    )
}

export default GridColumnStartEnd
