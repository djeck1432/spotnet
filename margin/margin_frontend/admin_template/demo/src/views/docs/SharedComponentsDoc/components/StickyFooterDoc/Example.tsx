import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'

const Example = () => {
    return (
        <div>
            <div className="h-screen">
                <h6>Scroll to bottom 👇</h6>
            </div>
            <StickyFooter
                className="px-8 flex items-center justify-between py-4"
                stickyClass="border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
                <div className="md:flex items-center">
                    <Button size="sm" className="ltr:mr-3 rtl:ml-3">
                        Discard
                    </Button>
                    <Button size="sm" variant="solid">
                        Save
                    </Button>
                </div>
            </StickyFooter>
        </div>
    )
}

export default Example
