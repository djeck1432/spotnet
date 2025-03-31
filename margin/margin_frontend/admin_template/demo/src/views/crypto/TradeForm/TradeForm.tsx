import Tabs from '@/components/ui/Tabs'
import BuyForm, { BuyFormProps, FormModel as BuyForModel } from './BuyForm'
import SellForm, { SellFormProps, FormModel as SellForModel } from './SellForm'

type TradeFormProps = BuyFormProps & SellFormProps

type FormModel = BuyForModel | SellForModel

const { TabNav, TabList, TabContent } = Tabs

const TradeForm = (props: TradeFormProps) => {
    return (
        <Tabs defaultValue="buy">
            <TabList>
                <TabNav value="buy">Buy</TabNav>
                <TabNav value="sell">Sell</TabNav>
            </TabList>
            <div className="py-6">
                <TabContent value="buy">
                    <BuyForm {...props} />
                </TabContent>
                <TabContent value="sell">
                    <SellForm {...props} />
                </TabContent>
            </div>
        </Tabs>
    )
}

export type { FormModel }

export default TradeForm
