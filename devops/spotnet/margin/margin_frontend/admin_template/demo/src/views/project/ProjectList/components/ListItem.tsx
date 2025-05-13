import Card from '@/components/ui/Card'
import ItemDropdown from './ItemDropdown'
import Members from './Members'
import ProgressionBar from './ProgressionBar'
import { HiOutlineClipboardCheck } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export type ListItemData = {
    id: number
    name: string
    category: string
    desc: string
    attachmentCount: number
    totalTask: number
    completedTask: number
    progression: number
    dayleft: number
    status: string
    member: {
        name: string
        img: string
    }[]
}

type ListItemProps = {
    data: ListItemData
    cardBorder?: boolean
}

const ListItem = ({ data, cardBorder }: ListItemProps) => {
    const { name, totalTask, completedTask, progression, member, category } =
        data

    return (
        <div className="mb-4">
            <Card bordered={cardBorder}>
                <div className="grid gap-x-4 grid-cols-12">
                    <div className="my-1 sm:my-0 col-span-12 sm:col-span-2 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                        <div className="flex flex-col">
                            <h6 className="font-bold">
                                <Link to="/app/project/scrum-board">
                                    {name}
                                </Link>
                            </h6>
                            <span>{category}</span>
                        </div>
                    </div>
                    <div className="my-1 sm:my-0 col-span-12 sm:col-span-2 md:col-span-2 lg:col-span-2 md:flex md:items-center md:justify-end">
                        <div className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-full">
                            <HiOutlineClipboardCheck className="text-base" />
                            <span className="ml-1 rtl:mr-1 whitespace-nowrap">
                                {completedTask} / {totalTask}
                            </span>
                        </div>
                    </div>
                    <div className="my-1 sm:my-0 col-span-12 md:col-span-2 lg:col-span-3 md:flex md:items-center">
                        <ProgressionBar progression={progression} />
                    </div>
                    <div className="my-1 sm:my-0 col-span-12 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                        <Members members={member} />
                    </div>
                    <div className="my-1 sm:my-0 col-span-12 sm:col-span-1 flex md:items-center justify-end">
                        <ItemDropdown />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ListItem
