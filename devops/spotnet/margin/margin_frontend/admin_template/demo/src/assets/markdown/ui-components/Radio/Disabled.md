```jsx
import Radio from '@/components/ui/Radio'

const Disabled = () => {
    return (
        <div>
            <Radio disabled className="mr-4">
                Disabled Radio
            </Radio>
            <Radio disabled checked>
                Disabled Checked Radio
            </Radio>
            <div className="mt-4">
                <Radio.Group value={'Apple'} disabled>
                    <Radio value={'Apple'}>Apple</Radio>
                    <Radio value={'Banana'}>Banana</Radio>
                    <Radio value={'Cherry'}>Cherry</Radio>
                </Radio.Group>
            </div>
        </div>
    )
}

export default Disabled
```
