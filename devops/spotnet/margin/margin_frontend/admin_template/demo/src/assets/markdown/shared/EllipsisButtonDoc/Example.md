```jsx
import Dropdown from '@/components/ui/Dropdown'
import EllipsisButton from '@/components/shared/EllipsisButton'

const dropdownList = [
    { label: 'Add Flag', value: 'addFlag' },
    { label: 'Move', value: 'move' },
    { label: 'Setting', value: 'projectSetting' },
]

const Example = () => {
    return (
        <Dropdown renderTitle={<EllipsisButton />}>
            {dropdownList.map((item) => (
                <Dropdown.Item eventKey={item.value} key={item.value}>
                    <span>{item.label}</span>
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

export default Example
```
