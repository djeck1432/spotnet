```jsx
import Dropdown from '@/components/ui/Dropdown'

const HeaderDivider = () => {
    return (
        <div>
            <Dropdown title="Click Me!">
                <Dropdown.Item variant="header">
                    <div className="pt-3 pb-1 px-3">
                        <span>Signed in as</span>
                        <div className="font-semibold mt-1 text-gray-800 dark:text-white">
                            alex_g@theme_nate.com
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                <Dropdown.Item>Item A</Dropdown.Item>
                <Dropdown.Item>Item B</Dropdown.Item>
                <Dropdown.Item>Item C</Dropdown.Item>
                <Dropdown.Item>Item D</Dropdown.Item>
                <Dropdown.Item variant="custom">
                    <div
                        className="
							cursor-pointer 
							px-3 
							py-2 
							text-indigo-600 
							font-semibold 
							hover:bg-gray-100 
							dark:hover:bg-black 
							dark:hover:bg-opacity-20
						"
                    >
                        Custom Dropdown Item
                    </div>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default HeaderDivider
```
