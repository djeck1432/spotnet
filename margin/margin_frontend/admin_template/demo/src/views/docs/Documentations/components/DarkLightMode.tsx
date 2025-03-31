import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const DarkLightMode = () => {
    return (
        <>
            <p>
                To initialize dark or light mode to the app, simply set{' '}
                <code>mode</code> field as
                <code>&apos;light&apos;</code> or <code>&apos;dark&apos;</code>{' '}
                in <code>src/configs/theme.config.ts</code>. For example:
            </p>
            <SyntaxHighlighter language="ts">{`export const themeConfig = {
    ...
    mode: 'dark'
}`}</SyntaxHighlighter>
            <div className="mt-10" id="hook">
                <h5>Hook</h5>
                <p className="mt-1">
                    You can access or update the mode in a component via our
                    prepared hook.
                </p>
                <SyntaxHighlighter language="tsx">{`import React from 'react'
import Switcher from '@/components/ui/Switcher'
import useDarkMode from '@/utils/hooks/useDarkMode'

const ModeSwitcher = () => {

    const [isDark, setIsDark] = useDarkMode()

    const onSwitchChange = (checked: boolean) => {
        setIsDark(checked ? 'dark' : 'light')
    }

    return (
        <div>
            <Switcher 
                value={isDark}
                onChange={checked => onSwitchChange(checked)}
            />
        </div>
    )
}

export default ModeSwitcher`}</SyntaxHighlighter>
            </div>
        </>
    )
}

export default DarkLightMode
