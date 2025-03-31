import Button from '@/components/ui/Button'
import { HiXCircle } from 'react-icons/hi'

type FailedProps = {
    onDone: () => void
}

const Failed = (props: FailedProps) => {
    const { onDone } = props

    return (
        <>
            <div className="text-center my-10">
                <HiXCircle className="text-[70px] text-red-500 mx-auto" />
                <h4 className="mt-4 font-bold mb-2">Transaction failed!</h4>
                <p>Please try again later</p>
            </div>
            <div className="mt-8">
                <Button block className="mb-2" variant="solid" onClick={onDone}>
                    Close
                </Button>
            </div>
        </>
    )
}

export default Failed
