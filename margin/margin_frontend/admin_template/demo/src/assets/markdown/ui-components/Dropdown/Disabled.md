```jsx
import Dropdown from '@/components/ui/Dropdown'

const Disabled = () => {
    return (
        <div>
            <Dropdown disabled title="Click Me!">
                <Dropdown.Item>Item A</Dropdown.Item>
                <Dropdown.Item>Item B</Dropdown.Item>
                <Dropdown.Item>Item C</Dropdown.Item>
                <Dropdown.Item>Item D</Dropdown.Item>
            </Dropdown>
            <Dropdown title="Click Me!">
                <Dropdown.Item>Item A</Dropdown.Item>
                <Dropdown.Item disabled>Item B</Dropdown.Item>
                <Dropdown.Item>Item C</Dropdown.Item>
                <Dropdown.Item>Item D</Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default Disabled
```
