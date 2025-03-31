```jsx
import Steps from '@/components/ui/Steps'
import Spinner from '@/components/ui/Spinner'
import {
    HiOutlineLogin,
    HiOutlineDocumentSearch,
    HiOutlineClipboardCheck,
} from 'react-icons/hi'

const CustomIcon = () => {
    return (
        <div>
            <Steps current={1}>
                <Steps.Item title="Login" customIcon={<HiOutlineLogin />} />
                <Steps.Item title="Order Placed" customIcon={<Spinner />} />
                <Steps.Item
                    title="In Review"
                    customIcon={<HiOutlineDocumentSearch />}
                />
                <Steps.Item
                    title="Approved"
                    customIcon={<HiOutlineClipboardCheck />}
                />
            </Steps>
        </div>
    )
}

export default CustomIcon
```
