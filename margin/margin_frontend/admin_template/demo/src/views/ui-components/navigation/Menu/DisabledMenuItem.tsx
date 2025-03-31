import Menu from '@/components/ui/Menu'

const DisabledMenuItem = () => {
    return (
        <div className="border rounded-md p-2" style={{ maxWidth: 250 }}>
            <Menu>
                <Menu.MenuItem eventKey="settings">Settings</Menu.MenuItem>
                <Menu.MenuItem disabled eventKey="message">
                    Message
                </Menu.MenuItem>
                <Menu.MenuItem eventKey="gallery">Gallery</Menu.MenuItem>
            </Menu>
        </div>
    )
}

export default DisabledMenuItem
