import { useConfig } from '../ConfigProvider'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

export type SorterProps = { sort?: boolean | 'asc' | 'desc' }

const Sorter = ({ sort }: SorterProps) => {
    const { themeColor, primaryColorLevel } = useConfig()

    const color = `text-${themeColor}-${primaryColorLevel}`

    const renderSort = () => {
        if (typeof sort === 'boolean') {
            return <FaSort />
        }

        if (sort === 'asc') {
            return <FaSortUp className={color} />
        }

        if (sort === 'desc') {
            return <FaSortDown className={color} />
        }

        return null
    }

    return <div className="inline-flex">{renderSort()}</div>
}

export default Sorter
