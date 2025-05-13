import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dropdown from '@/components/ui/Dropdown'
import { HiOutlineSearch } from 'react-icons/hi'

const _Example = () => {
    return (
        <Dropdown
            renderTitle={<HiOutlineSearch className={classNames('text-4xl')} />}
        >
            <Dropdown.Item eventKey="a">Item A</Dropdown.Item>
            <Dropdown.Item eventKey="b">Item B</Dropdown.Item>
            <Dropdown.Item eventKey="c">Item C</Dropdown.Item>
            <Dropdown.Item eventKey="d">Item D</Dropdown.Item>
        </Dropdown>
    )
}

const Example = withHeaderItem(_Example)

export default Example
