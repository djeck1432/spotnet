```jsx
import PasswordInput from '@/components/shared/PasswordInput'

const Example = () => {
    return (
        <PasswordInput
            onVisibleChange={(visible) => {
                console.log(visible)
            }}
        />
    )
}

export default Example
```
