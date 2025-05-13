import Steps from '@/components/ui/Steps'

const Basic = () => {
    return (
        <div>
            <Steps current={1}>
                <Steps.Item />
                <Steps.Item />
                <Steps.Item />
                <Steps.Item />
            </Steps>
        </div>
    )
}

export default Basic
