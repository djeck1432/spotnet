```jsx
import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="tsx">{`import React from 'react'
		 
const HelloWorld = () =>
{
	return <h1>Hello World!</h1>
}
	
export default HelloWorld`}</SyntaxHighlighter>
    )
}

export default Example
```
