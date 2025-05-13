```jsx
import Tabs from '@/components/ui/Tabs'

const { TabNav, TabList, TabContent } = Tabs

const Default = () => {
    return (
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Home</TabNav>
                    <TabNav value="tab2">Profile</TabNav>
                    <TabNav value="tab3">Contact</TabNav>
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
                            any invention in human history with the possible
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

export default Default
```
