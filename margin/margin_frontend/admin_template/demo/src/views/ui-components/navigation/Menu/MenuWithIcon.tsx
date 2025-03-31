import Menu from '@/components/ui/Menu'
import {
    HiOutlineCog,
    HiOutlineChat,
    HiOutlineGlobeAlt,
    HiOutlineSupport,
    HiWifi,
} from 'react-icons/hi'
import type { ReactNode } from 'react'

const MenuContent = ({ icon, label }: { icon: ReactNode; label: string }) => {
    return (
        <div className="flex items-center gap-2">
            <span className={'text-2xl'}>{icon}</span>
            <span>{label}</span>
        </div>
    )
}

const MenuWithIcon = () => {
    return (
        <div className="border rounded-md p-2" style={{ maxWidth: 250 }}>
            <Menu>
                <Menu.MenuItem eventKey="settings">
                    <MenuContent icon={<HiOutlineCog />} label="Settings" />
                </Menu.MenuItem>
                <Menu.MenuItem eventKey="messages">
                    <MenuContent icon={<HiOutlineChat />} label="Messages" />
                </Menu.MenuItem>
                <Menu.MenuCollapse
                    eventKey="others"
                    label={
                        <MenuContent
                            icon={<HiOutlineGlobeAlt />}
                            label="Network"
                        />
                    }
                >
                    <Menu.MenuItem eventKey="wifi">
                        <MenuContent icon={<HiWifi />} label="Wifi" />
                    </Menu.MenuItem>
                    <Menu.MenuItem eventKey="support">
                        <MenuContent
                            icon={<HiOutlineSupport />}
                            label="Support"
                        />
                    </Menu.MenuItem>
                </Menu.MenuCollapse>
            </Menu>
        </div>
    )
}

export default MenuWithIcon
