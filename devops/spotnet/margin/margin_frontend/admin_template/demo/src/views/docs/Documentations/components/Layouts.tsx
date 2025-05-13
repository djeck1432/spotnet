import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'
import DemoComponentApi from '@/components/docs/DemoComponentApi'
import type { CSSProperties, ReactNode } from 'react'

const Frame = ({ children }: { children: ReactNode }) => {
    return (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg my-4">
            {children}
        </div>
    )
}

const Layouts = () => {
    return (
        <>
            <p>
                Elstar provide 6 types of app layouts & 3 types of auth layouts,
                all layouts component can be found under directory{' '}
                <code>src/components/layout/*</code>
                and all the components used within layouts can be found under{' '}
                <code>src/components/template/*</code>
            </p>
            <ul>
                <li>
                    Classic - <code>&apos;classic&apos;</code>
                </li>
                <li>
                    Modern - <code>&apos;modern&apos;</code>
                </li>
                <li>
                    StackedSide - <code>&apos;stackedSide&apos;</code>
                </li>
                <li>
                    Simple - <code>&apos;simple&apos;</code>
                </li>
                <li>
                    Decked - <code>&apos;decked&apos;</code>
                </li>
                <li>
                    Blank - <code>&apos;blan&apos;</code>
                </li>
            </ul>
            <div className="mt-10" id="configuringLayout">
                <div className="mt-10" id="classic">
                    <h5>Configuring Layout</h5>
                    <p className="mt-1">
                        You can config the initial layout in{' '}
                        <code>src/configs/theme.config.ts</code> with the string
                        value above
                    </p>
                    <SyntaxHighlighter language="js">{`export const themeConfig = {
    ...
    layout: {
        type: 'modern',
        ...
    },
}`}</SyntaxHighlighter>
                    <p>
                        Here&apos;s available values & key for configuring the{' '}
                        <code>layout</code> field
                    </p>
                    <DemoComponentApi
                        hideApiTitle
                        keyText="properties"
                        api={[
                            {
                                api: [
                                    {
                                        propName: 'type',
                                        type: `<code>'blank'</code>  | <code>'classic'</code> | <code>'modern'</code> | <code>'simple'</code> | <code>'decked'</code> | <code>'stackedSide'</code>`,
                                        default: `<code>'modern'</code>`,
                                        desc: 'Type of the application layout',
                                    },
                                    {
                                        propName: 'sideNavCollapse',
                                        type: `<code>boolean</code>`,
                                        default: `<code>false</code>`,
                                        desc: `Whether to collapse the side navigation (only only applicable when <code>type</code> is <code>'classic'</code> or <code>'modern'</code>)`,
                                    },
                                ],
                            },
                        ]}
                    />
                </div>
            </div>
            <div className="mt-10" id="layoutTypes">
                <h5>Layout types</h5>
                <p className="mt-1">
                    The following explained each of layouts in details.
                </p>
                <ol>
                    <li>
                        <div id="classic">
                            <h6>Classic Layout</h6>
                            <Frame>
                                <DoubleSidedImage
                                    className="my-0 rounded-lg"
                                    src="/img/others/docs/classic.jpg"
                                    darkModeSrc="/img/others/docs/classic-dark.jpg"
                                />
                            </Frame>
                            <p className="mb-1">
                                config value: <code>&apos;classic&apos;</code>
                            </p>
                            <p className="my-1">template components used:</p>
                            <ul>
                                <li>
                                    <strong>View</strong> -{' '}
                                    <code>src/views/index.ts</code>
                                </li>
                                <li>
                                    <strong>Header</strong> -{' '}
                                    <code>
                                        src/components/template/Header.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SideNavToggle</strong> -{' '}
                                    <code>
                                        src/components/template/SideNavToggle.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Search</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Search.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>LanguageSelector</strong> (optional)
                                    -{' '}
                                    <code>
                                        src/components/template/LanguageSelector.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Notification</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Notification.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SidePanel</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/SidePanel/index.ts
                                    </code>
                                </li>
                                <li>
                                    <strong>UserDropdown</strong> -{' '}
                                    <code>
                                        src/components/template/UserDropdown.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SideNav</strong> -{' '}
                                    <code>
                                        src/components/template/SideNav.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>MobileNav</strong> -{' '}
                                    <code>
                                        src/components/template/MobileNav.tsx
                                    </code>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div id="modern">
                            <h6>Modern Layout</h6>
                            <Frame>
                                <DoubleSidedImage
                                    className="my-0 rounded-lg"
                                    src="/img/others/docs/modern.jpg"
                                    darkModeSrc="/img/others/docs/modern-dark.jpg"
                                />
                            </Frame>
                            <p className="mb-1">
                                config value: <code>&apos;modern&apos;</code>
                            </p>
                            <p className="my-1">template components used:</p>
                            <ul>
                                <li>
                                    <strong>View</strong> -{' '}
                                    <code>src/views/index.ts</code>
                                </li>
                                <li>
                                    <strong>Header</strong> -{' '}
                                    <code>
                                        src/components/template/Header.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SideNavToggle</strong> -{' '}
                                    <code>
                                        src/components/template/SideNavToggle.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Search</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Search.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>LanguageSelector</strong> (optional)
                                    -{' '}
                                    <code>
                                        src/components/template/LanguageSelector.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Notification</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Notification.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SidePanel</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/SidePanel/index.ts
                                    </code>
                                </li>
                                <li>
                                    <strong>UserDropdown</strong> -{' '}
                                    <code>
                                        src/components/template/UserDropdown.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SideNav</strong> -{' '}
                                    <code>
                                        src/components/template/SideNav.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>MobileNav</strong> -{' '}
                                    <code>
                                        src/components/template/MobileNav.tsx
                                    </code>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div id="stackedSide">
                            <h6>Stacked Side Layout</h6>
                            <Frame>
                                <DoubleSidedImage
                                    className="my-0 rounded-lg"
                                    src="/img/others/docs/stackedSide.jpg"
                                    darkModeSrc="/img/others/docs/stackedSide-dark.jpg"
                                />
                            </Frame>
                            <p className="mb-1">
                                config value:{' '}
                                <code>&apos;stackedSide&apos;</code>
                            </p>
                            <p className="my-1">template components used:</p>
                            <ul>
                                <li>
                                    <strong>View</strong> -{' '}
                                    <code>src/views/index.ts</code>
                                </li>
                                <li>
                                    <strong>Header</strong> -{' '}
                                    <code>
                                        src/components/template/Header.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SideNavToggle</strong> -{' '}
                                    <code>
                                        src/components/template/SideNavToggle.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Search</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Search.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>LanguageSelector</strong> (optional)
                                    -{' '}
                                    <code>
                                        src/components/template/LanguageSelector.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Notification</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Notification.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SidePanel</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/SidePanel/index.ts
                                    </code>
                                </li>
                                <li>
                                    <strong>UserDropdown</strong> -{' '}
                                    <code>
                                        src/components/template/UserDropdown.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SplittedSideNav</strong> -{' '}
                                    <code>
                                        src/components/template/SplittedSideNav.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>MobileNav</strong> -{' '}
                                    <code>
                                        src/components/template/MobileNav.tsx
                                    </code>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div id="Simple">
                            <h6>Simple Layout</h6>
                            <Frame>
                                <DoubleSidedImage
                                    className="my-0 rounded-lg"
                                    src="/img/others/docs/simple.jpg"
                                    darkModeSrc="/img/others/docs/simple-dark.jpg"
                                />
                            </Frame>
                            <p className="mb-1">
                                config value: <code>&apos;simple&apos;</code>
                            </p>
                            <p className="my-1">template components used:</p>
                            <ul>
                                <li>
                                    <strong>View</strong> -{' '}
                                    <code>src/views/index.ts</code>
                                </li>
                                <li>
                                    <strong>Header</strong> -{' '}
                                    <code>
                                        src/components/template/Header.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>HeaderLogo</strong> -{' '}
                                    <code>
                                        src/components/template/HeaderLogo.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>HorizontalNav</strong> -{' '}
                                    <code>
                                        src/components/template/HorizontalNav.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Search</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Search.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>LanguageSelector</strong> (optional)
                                    -{' '}
                                    <code>
                                        src/components/template/LanguageSelector.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Notification</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Notification.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SidePanel</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/SidePanel/index.ts
                                    </code>
                                </li>
                                <li>
                                    <strong>UserDropdown</strong> -{' '}
                                    <code>
                                        src/components/template/UserDropdown.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>MobileNav</strong> -{' '}
                                    <code>
                                        src/components/template/MobileNav.tsx
                                    </code>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div id="Decked">
                            <h6>Decked Layout</h6>
                            <Frame>
                                <DoubleSidedImage
                                    className="my-0 rounded-lg"
                                    src="/img/others/docs/decked.jpg"
                                    darkModeSrc="/img/others/docs/decked-dark.jpg"
                                />
                            </Frame>
                            <p className="mb-1">
                                config value: <code>&apos;decked&apos;</code>
                            </p>
                            <p className="my-1">template components used:</p>
                            <ul>
                                <li>
                                    <strong>View</strong> -{' '}
                                    <code>src/views/index.ts</code>
                                </li>
                                <li>
                                    <strong>Header</strong> -{' '}
                                    <code>
                                        src/components/template/Header.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>HeaderLogo</strong> -{' '}
                                    <code>
                                        src/components/template/HeaderLogo.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SecondaryHeader</strong> -{' '}
                                    <code>
                                        src/components/template/SecondaryHeader.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Search</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Search.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>LanguageSelector</strong> (optional)
                                    -{' '}
                                    <code>
                                        src/components/template/LanguageSelector.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>Notification</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/Notification.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>SidePanel</strong> (optional) -{' '}
                                    <code>
                                        src/components/template/SidePanel/index.ts
                                    </code>
                                </li>
                                <li>
                                    <strong>UserDropdown</strong> -{' '}
                                    <code>
                                        src/components/template/UserDropdown.tsx
                                    </code>
                                </li>
                                <li>
                                    <strong>MobileNav</strong> -{' '}
                                    <code>
                                        src/components/template/MobileNav.tsx
                                    </code>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div id="Blank">
                            <h6>Blank Layout</h6>
                            <Frame>
                                <DoubleSidedImage
                                    className="my-0 rounded-lg"
                                    src="/img/others/docs/blank.jpg"
                                    darkModeSrc="/img/others/docs/blank-dark.jpg"
                                />
                            </Frame>
                            <p className="mb-1">
                                config value: <code>&apos;blank&apos;</code>
                            </p>
                            <p className="my-1">template components used:</p>
                            <ul>
                                <li>
                                    <strong>View</strong> -{' '}
                                    <code>src/views/index.ts</code>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ol>
            </div>
            <div className="mt-10" id="overridingLayouts">
                <h5>Overriding layouts</h5>
                <p className="mt-1">
                    In general, all route views will follow the settings of the
                    layout in <code>theme.config.ts</code>. However, if there
                    are some cases where you want to show a different layout in
                    a certiain route view, you can the layout value you wish
                    under the route <code>meta</code> to overide the current
                    layout as we mentioned in <strong>Routing</strong> guide.
                </p>
                <SyntaxHighlighter language="js">{`export const protectedRoutes = [
    {
        key: 'a-unique-id-for-this-view'
        path: 'path',
        component: React.lazy(() => import('views/Component')),
        authority: [],
        meta: {
            ...,
            layout: 'blank'
        }
    },			
]`}</SyntaxHighlighter>
            </div>
            <div className="mt-10" id="authLayouts">
                <h5>Auth layouts</h5>
                <p>
                    Configuring auth layout is slightly different from the
                    above, just need to visit{' '}
                    <code>src/components/layout/AuthLayout/index.ts</code> and
                    replace the wrapper component. For example, switching{' '}
                    <code>Side</code> to <code>Cover</code>
                </p>
                <SyntaxHighlighter
                    language="js"
                    wrapLines={true}
                    showLineNumbers={true}
                    lineProps={(lineNumber) => {
                        const style: CSSProperties = { display: 'block' }
                        if ([4, 23, 24, 25].includes(lineNumber)) {
                            style.backgroundColor = '#00ff002e'
                        } else if ([3, 20, 21, 22].includes(lineNumber)) {
                            style.backgroundColor = '#ff00001f'
                        }
                        return { style }
                    }}
                >{`import React from 'react'
import Side from './Side'
// import Cover from './Cover'
import Cover from './Cover'
// import Simple from './Simple'
import View from 'views'
import { useAppSelector } from '@/store';
import { LAYOUT_TYPE_BLANK } from '@/constants/theme.constant'

const AuthLayout = () => {

    const layoutType = useAppSelector((state) => state.theme.layout.type)

    return (
        <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
            {
                layoutType === LAYOUT_TYPE_BLANK ? 
                <View {...props}/> 
                : 
                <Side>
                    <View {...props}/>
                </Side>
                <Cover>
                    <View {...props}/>
                </Cover>
            }
        </div>
    )
}

export default AuthLayout`}</SyntaxHighlighter>
            </div>
        </>
    )
}

export default Layouts
