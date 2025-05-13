import { useState, useEffect } from 'react'
import classNames from 'classnames'
import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import OrderProducts from './components/OrderProducts'
import PaymentSummary from './components/PaymentSummary'
import ShippingInfo from './components/ShippingInfo'
import Activity from './components/Activity'
import CustomerInfo from './components/CustomerInfo'
import { HiOutlineCalendar } from 'react-icons/hi'
import { apiGetSalesOrderDetails } from '@/services/SalesService'
import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'

type SalesOrderDetailsResponse = {
    id?: string
    progressStatus?: number
    payementStatus?: number
    dateTime?: number
    paymentSummary?: {
        subTotal: number
        tax: number
        deliveryFees: number
        total: number
    }
    shipping?: {
        deliveryFees: number
        estimatedMin: number
        estimatedMax: number
        shippingLogo: string
        shippingVendor: string
    }
    product?: {
        id: string
        name: string
        productCode: string
        img: string
        price: number
        quantity: number
        total: number
        details: Record<string, string[]>
    }[]
    activity?: {
        date: number
        events: {
            time: number
            action: string
            recipient?: string
        }[]
    }[]
    customer?: {
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

type PayementStatus = {
    label: string
    class: string
}

const paymentStatus: Record<number, PayementStatus> = {
    0: {
        label: 'Paid',
        class: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
    },
    1: {
        label: 'Unpaid',
        class: 'text-red-500 bg-red-100 dark:text-red-100 dark:bg-red-500/20',
    },
}

const progressStatus: Record<number, PayementStatus> = {
    0: {
        label: 'Fulfilled',
        class: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-100',
    },
    1: {
        label: 'Unfulfilled',
        class: 'text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20',
    },
}

const OrderDetails = () => {
    const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SalesOrderDetailsResponse>({})

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = async () => {
        const id = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1,
        )
        if (id) {
            setLoading(true)
            const response = await apiGetSalesOrderDetails<
                SalesOrderDetailsResponse,
                { id: string }
            >({ id })
            if (response) {
                setLoading(false)
                setData(response.data)
            }
        }
    }

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                                <h3>
                                    <span>Order</span>
                                    <span className="ltr:ml-2 rtl:mr-2">
                                        #{data.id}
                                    </span>
                                </h3>
                                <Tag
                                    className={classNames(
                                        'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                                        paymentStatus[data.payementStatus || 0]
                                            .class,
                                    )}
                                >
                                    {
                                        paymentStatus[data.payementStatus || 0]
                                            .label
                                    }
                                </Tag>
                                <Tag
                                    className={classNames(
                                        'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                                        progressStatus[data.progressStatus || 0]
                                            .class,
                                    )}
                                >
                                    {
                                        progressStatus[data.progressStatus || 0]
                                            .label
                                    }
                                </Tag>
                            </div>
                            <span className="flex items-center">
                                <HiOutlineCalendar className="text-lg" />
                                <span className="ltr:ml-1 rtl:mr-1">
                                    {dayjs
                                        .unix(data.dateTime || 0)
                                        .format('ddd DD-MMM-YYYY, hh:mm A')}
                                </span>
                            </span>
                        </div>
                        <div className="xl:flex gap-4">
                            <div className="w-full">
                                <OrderProducts data={data.product} />
                                <div className="xl:grid grid-cols-2 gap-4">
                                    <ShippingInfo data={data.shipping} />
                                    <PaymentSummary
                                        data={data.paymentSummary}
                                    />
                                </div>
                                <Activity data={data.activity} />
                            </div>
                            <div className="xl:max-w-[360px] w-full">
                                <CustomerInfo data={data.customer} />
                            </div>
                        </div>
                    </>
                )}
            </Loading>
            {!loading && isEmpty(data) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No order found!"
                    />
                    <h3 className="mt-8">No order found!</h3>
                </div>
            )}
        </Container>
    )
}

export default OrderDetails
