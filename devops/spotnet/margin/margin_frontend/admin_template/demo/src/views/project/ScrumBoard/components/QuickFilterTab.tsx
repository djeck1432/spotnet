import Tabs from '@/components/ui/Tabs'
import { labelList } from '../utils'
import { setSelectedTab, useAppDispatch, useAppSelector } from '../store'

const { TabNav, TabList } = Tabs

const QuickFilterTab = () => {
    const dispatch = useAppDispatch()

    const selectedTab = useAppSelector(
        (state) => state.scrumBoard.data.selectedTab,
    )

    const handleTabChange = (val: string) => {
        dispatch(setSelectedTab(val))
    }

    return (
        <Tabs value={selectedTab} variant="pill" onChange={handleTabChange}>
            <TabList>
                <TabNav value="All">All</TabNav>
                {labelList.map((tab, index) => (
                    <TabNav key={`${tab}-${index}`} value={tab}>
                        {tab}
                    </TabNav>
                ))}
            </TabList>
        </Tabs>
    )
}

export default QuickFilterTab
