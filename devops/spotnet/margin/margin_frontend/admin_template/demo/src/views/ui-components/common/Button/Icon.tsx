import Button from '@/components/ui/Button'
import { HiPhone } from 'react-icons/hi'

const Icon = () => {
    return (
        <>
            <div className="flex-wrap inline-flex xl:flex items-center gap-2">
                <Button
                    shape="circle"
                    variant="plain"
                    size="xs"
                    icon={<HiPhone />}
                />
                <Button
                    shape="circle"
                    size="sm"
                    variant="twoTone"
                    icon={<HiPhone />}
                />
                <Button shape="circle" icon={<HiPhone />} />
                <Button
                    shape="circle"
                    variant="solid"
                    size="lg"
                    icon={<HiPhone />}
                />
            </div>
            <br />
            <div className="flex-wrap inline-flex xl:flex items-center gap-2">
                <Button variant="plain" size="xs" icon={<HiPhone />} />
                <Button size="sm" variant="twoTone" icon={<HiPhone />} />
                <Button icon={<HiPhone />} />
                <Button variant="solid" size="lg" icon={<HiPhone />} />
            </div>
        </>
    )
}

export default Icon
