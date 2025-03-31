import { useState } from 'react'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import NavToggle from '@/components/shared/NavToggle'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { NavLink } from 'react-router-dom'
import type { DocumentationRoute } from '@/@types/docs'

type NavContentProps = {
    onLinkClick?: () => void
    routes: DocumentationRoute[]
    basePath?: string
}

const NavContent = ({ onLinkClick, routes, basePath = '' }: NavContentProps) => {
    const { textTheme, borderTheme } = useThemeClass()

    const activeClass = `${textTheme} hover:${textTheme} ${borderTheme}`

    return (
        <>
            {routes.map((group) => (
                <div key={group.groupName} className="mb-6">
                    <h6 className="mb-4">{group.groupName}</h6>
                    <div className="ltr:border-l rtl:border-r border-gray-200 dark:border-gray-600">
                        {group.nav.map((menu) => (
                            <NavLink
                                key={menu.label}
                                className={({ isActive }) =>
                                    `cursor-pointer font-semibold ltr:border-l rtl:border-r px-4 h-6 mb-4 flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-100 ltr:-ml-px rtl:-mr-px ${
                                        isActive
                                            ? activeClass
                                            : 'border-transparent'
                                    }`
                                }
                                to={`${basePath}${menu.path}`}
                                onClick={onLinkClick}
                            >
                                <span>{menu.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

const MobileNav = ({ routes }: { routes: DocumentationRoute[] }) => {
    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    return (
        <>
            <Button
                className="lg:hidden"
                shape="circle"
                variant="plain"
                icon={<NavToggle className="text-2xl" toggled={isOpen} />}
                onClick={openDrawer}
            />
            <Drawer
                title="Navigation"
                isOpen={isOpen}
                width={300}
                placement="left"
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                <NavContent routes={routes} onLinkClick={onDrawerClose} />
            </Drawer>
        </>
    )
}

const DocumentationNav = ({ routes, basePath }: { routes: DocumentationRoute[], basePath: string }) => {
    return (
        <div className="flex flex-col">
            <div className="hidden lg:block">
                <NavContent routes={routes} basePath={basePath} />
            </div>
            <MobileNav routes={routes} />
        </div>
    )
}

export default DocumentationNav
