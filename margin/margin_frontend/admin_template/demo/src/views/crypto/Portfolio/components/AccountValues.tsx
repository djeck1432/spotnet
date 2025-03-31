import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineCurrencyDollar, HiOutlineCash } from 'react-icons/hi'
import type { AccountValue } from '../store'

type AccountValuesProps = {
    className?: string
    data?: Partial<AccountValue>
}

const AccountValues = ({ data = {}, className }: AccountValuesProps) => {
    return (
        <Card
            className={className}
            bodyClass="h-full flex flex-col justify-between"
        >
            <h4>Account Values</h4>
            <div>
                <p className="mb-1">Net Value</p>
                <h3 className="font-bold flex items-end gap-1">
                    <span>{data.netValue}</span>
                    <span className="text-sm">USD</span>
                </h3>
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <div>
                        <Avatar
                            size={45}
                            className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                            icon={
                                <HiOutlineCurrencyDollar className="text-2xl" />
                            }
                        />
                    </div>
                    <div>
                        <p>Coins value</p>
                        <h5 className="flex items-end gap-1">
                            <span>{data.coinValue}</span>
                            <span className="text-sm">USD</span>
                        </h5>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div>
                        <Avatar
                            size={45}
                            className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                            icon={<HiOutlineCash className="text-2xl" />}
                        />
                    </div>
                    <div>
                        <p>Cash Balance</p>
                        <h5 className="flex items-end gap-1">
                            <span>{data.cashBalance}</span>
                            <span className="text-sm">USD</span>
                        </h5>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default AccountValues
