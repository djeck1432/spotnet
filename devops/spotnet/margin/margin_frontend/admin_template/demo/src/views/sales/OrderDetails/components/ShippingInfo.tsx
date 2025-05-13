import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { NumericFormat } from 'react-number-format'

type ShippingInfoProps = {
    data?: {
        deliveryFees: number
        estimatedMin: number
        estimatedMax: number
        shippingLogo: string
        shippingVendor: string
    }
}

const ShippingInfo = ({ data }: ShippingInfoProps) => {
    return (
        <Card className="mb-4">
            <h5 className="mb-4">Shipping</h5>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Avatar size={60} src={data?.shippingLogo} />
                    <div className="ltr:ml-2 rtl:mr-2">
                        <h6>{data?.shippingVendor}</h6>
                        <span>
                            Delivery in {data?.estimatedMin} ~{' '}
                            {data?.estimatedMax} days
                        </span>
                    </div>
                </div>
                <span className="font-semibold">
                    <NumericFormat
                        displayType="text"
                        value={(
                            Math.round((data?.deliveryFees || 0) * 100) / 100
                        ).toFixed(2)}
                        prefix={'$'}
                        thousandSeparator={true}
                    />
                </span>
            </div>
            <Button block>View Carrier Details</Button>
        </Card>
    )
}

export default ShippingInfo
