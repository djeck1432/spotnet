```jsx
import Steps from '@/components/ui/Steps'

const Vertical = () => {
    return (
        <div>
            <Steps vertical current={1}>
                <Steps.Item title="Login" />
                <Steps.Item title="Order Placed" />
                <Steps.Item title="In Review" />
                <Steps.Item title="Approved" />
            </Steps>
        </div>
    )
}

export default Vertical
```
