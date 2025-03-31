```jsx
import Tabs from '@/components/ui/Tabs'
import { HiOutlineHome, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi'

const { TabNav, TabList, TabContent } = Tabs

const Icons = () => {
    return (
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1" icon={<HiOutlineHome />}>
                        Home
                    </TabNav>
                    <TabNav value="tab2" icon={<HiOutlineUser />}>
                        Profile
                    </TabNav>
                    <TabNav value="tab3" icon={<HiOutlinePhone />}>
                        Contact
                    </TabNav>
                </TabList>
                <div className="p-4">
                    <TabContent value="tab1">
                        <p>
                            If builders built buildings the way programmers
                            wrote programs, then the first woodpecker that came
                            along would destroy civilization. (Gerald Weinberg)
                        </p>
                    </TabContent>
                    <TabContent value="tab2">
                        <p>
                            A computer lets you make more mistakes faster than
                            any invention in human historywith the possible
                            exceptions of handguns and tequila. (Mitch
                            Radcliffe).
                        </p>
                    </TabContent>
                    <TabContent value="tab3">
                        <p>
                            In C++ its harder to shoot yourself in the foot, but
                            when you do, you blow off your whole leg. (Bjarne
                            Stroustrup)
                        </p>
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}

export default Icons
```
