import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { APP_NAME } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import { HiOutlineLockClosed } from 'react-icons/hi'

type QuickStartType = {
    label: string
    desc: string
    btnText: string
    id: string
    disabled: boolean
    callBack?: () => void
    navigate?: string
}

type QuickStartItemProps = Omit<QuickStartType, 'id' | 'label' | 'disabled'> & {
    title: string
    available: boolean
    index: number
    textTheme?: string
    borderTheme?: string
    path?: string
}

const quickStartList: QuickStartType[] = [
    {
        label: 'Complete your Account Information',
        desc: 'Fill in your information to complete your account',
        btnText: 'Fill now',
        id: '0',
        disabled: false,
        navigate: '/app/account/kyc-form',
    },
    {
        label: 'Create your first workspace',
        desc: 'We recommend one project per workspace',
        btnText: 'Create Workspace',
        id: '1',
        disabled: true,
        callBack: () => ({}),
    },
    {
        label: 'Invite team members',
        desc: 'Show the team what you have completed so far.',
        btnText: 'Invite',
        id: '2',
        disabled: true,
    },
]

const QuickStartItem = (props: QuickStartItemProps) => {
    const {
        title,
        desc,
        btnText,
        index,
        available,
        textTheme = '',
        borderTheme = '',
        path = '',
        callBack,
    } = props

    const navigate = useNavigate()

    const handleClick = () => {
        if (available) {
            callBack?.()
            if (path) {
                navigate(path)
            }
        }
    }

    return (
        <Card className="mb-4">
            <div className="md:flex items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {!available ? (
                        <span className="text-3xl">
                            <HiOutlineLockClosed />
                        </span>
                    ) : (
                        <span
                            className={`font-semibold text-xl rounded-full border-2 min-w-[30px] h-[30px] flex items-center justify-center ${borderTheme} ${textTheme}`}
                        >
                            {index + 1}
                        </span>
                    )}
                    <div>
                        <h5>{title}</h5>
                        <p>{desc}</p>
                    </div>
                </div>
                <Button
                    disabled={!available}
                    variant="solid"
                    className="mt-4 md:mt-0"
                    size="sm"
                    onClick={handleClick}
                >
                    {btnText}
                </Button>
            </div>
        </Card>
    )
}

const QuickStart = () => {
    const { textTheme, borderTheme } = useThemeClass()

    const [completion] = useState([
        { value: '0', completed: false, current: true },
        { value: '1', completed: false, current: false },
        { value: '2', completed: false, current: false },
    ])

    return (
        <div>
            <h3 className="mb-2 text-center">
                <span>🚀 Let&apos;s get you set up with </span>
                <span className={textTheme}>{APP_NAME}</span>
            </h3>
            <div className="mt-8 max-w-[800px] lg:min-w-[800px]">
                {quickStartList.map((item, index) => (
                    <QuickStartItem
                        key={item.id}
                        index={index}
                        textTheme={textTheme}
                        borderTheme={borderTheme}
                        title={item.label}
                        btnText={item.btnText}
                        desc={item.desc}
                        available={completion.some(
                            (c) =>
                                c.value === item.id &&
                                (c.completed || c.current),
                        )}
                        path={item.navigate}
                        callBack={item.callBack}
                    />
                ))}
            </div>
        </div>
    )
}

export default QuickStart
