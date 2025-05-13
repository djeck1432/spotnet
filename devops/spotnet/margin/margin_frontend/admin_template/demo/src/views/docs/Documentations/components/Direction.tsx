import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Direction = () => {
    return (
        <>
            <p>
                To initialize the app direction, simply set{' '}
                <code>direction</code> field as
                <code>&apos;ltr&apos;</code> or <code>&apos;rtl&apos;</code> in{' '}
                <code>src/configs/theme.config.ts</code>. For example:
            </p>
            <SyntaxHighlighter language="ts">{`export const themeConfig = {
	...
	direction: 'rtl'
}`}</SyntaxHighlighter>
            <div className="mt-10" id="hook">
                <h5>Hook</h5>
                <p className="mt-1">
                    You can access or update the direction in a component via
                    our prepared hook.
                </p>
                <SyntaxHighlighter language="tsx">{`import React from 'react'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import useDirection from '@/utils/hooks/useDirection'
import type { Direction } from '@/@types/theme';

const dirList = [
	{ value: 'ltr', label: 'LTR' },
	{ value: 'rtl', label: 'RTL' }
]

const DirectionSwitcher = () => {

	const [direction, updateDirection] = useDirection()

	const onDirChange = (val: Direction) => {
		updateDirection(val)
	}

	return (
		<InputGroup size="sm">
			{
				dirList.map(dir => (
					<Button 
						key={dir.value}
						active={direction === dir.value}
						onClick={() => onDirChange(dir.value)}
					>
						{dir.label}
					</Button>
				))
			}
		</InputGroup>
	)
}

export default DirectionSwitcher
`}</SyntaxHighlighter>
            </div>
        </>
    )
}

export default Direction
