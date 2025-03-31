import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiMail, HiPhone, HiExternalLink } from 'react-icons/hi'
import { Link } from 'react-router-dom'

type CustomerInfoProps = {
    data?: {
        name: string
        email: string
        phone: string
        img: string
        previousOrder: number
        shippingAddress: {
            line1: string
            line2: string
            line3: string
            line4: string
        }
        billingAddress: {
            line1: string
            line2: string
            line3: string
            line4: string
        }
    }
}

const CustomerInfo = ({ data }: CustomerInfoProps) => {
    return (
        <Card>
            <h5 className="mb-4">Customer</h5>
            <Link
                className="group flex items-center justify-between"
                to="/app/crm/customer-details?id=11"
            >
                <div className="flex items-center">
                    <Avatar shape="circle" src={data?.img} />
                    <div className="ltr:ml-2 rtl:mr-2">
                        <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {data?.name}
                        </div>
                        <span>
                            <span className="font-semibold">
                                {data?.previousOrder}{' '}
                            </span>
                            previous orders
                        </span>
                    </div>
                </div>
                <HiExternalLink className="text-xl hidden group-hover:block" />
            </Link>
            <hr className="my-5" />
            <IconText
                className="mb-4"
                icon={<HiMail className="text-xl opacity-70" />}
            >
                <span className="font-semibold">{data?.email}</span>
            </IconText>
            <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                <span className="font-semibold">{data?.phone}</span>
            </IconText>
            <hr className="my-5" />
            <h6 className="mb-4">Shipping Address</h6>
            <address className="not-italic">
                <div className="mb-1">{data?.shippingAddress.line1}</div>
                <div className="mb-1">{data?.shippingAddress.line2}</div>
                <div className="mb-1">{data?.shippingAddress.line3}</div>
                <div>{data?.shippingAddress.line4}</div>
            </address>
            <hr className="my-5" />
            <h6 className="mb-4">Billing address</h6>
            <address className="not-italic">
                <div className="mb-1">{data?.billingAddress.line1}</div>
                <div className="mb-1">{data?.billingAddress.line2}</div>
                <div className="mb-1">{data?.billingAddress.line3}</div>
                <div>{data?.billingAddress.line4}</div>
            </address>
        </Card>
    )
}

export default CustomerInfo
