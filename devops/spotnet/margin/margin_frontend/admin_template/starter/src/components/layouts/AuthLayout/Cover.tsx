import { cloneElement } from 'react'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import type { ReactNode, ReactElement } from 'react'

interface CoverProps extends CommonProps {
    content?: ReactNode
}

const Cover = ({ children, content, ...rest }: CoverProps) => {
    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="col-span-2 bg-no-repeat bg-cover py-6 px-16 flex-col justify-between bg-white dark:bg-gray-800 hidden lg:flex"
                style={{
                    backgroundImage: `url('/img/others/auth-cover-bg.jpg')`,
                }}
            >
                <Logo mode="dark" />
                <div>
                    <h3 className="text-white mb-4">
                        Jump start your project with Elstar
                    </h3>
                    <p className="text-lg text-white opacity-80 max-w-[700px]">
                        Elstar comes with a complete set of UI components
                        crafted with Tailwind CSS, it fulfilled most of the use
                        case to create modern and beautiful UI and application
                    </p>
                </div>
                <span className="text-white">
                    Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                    <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
                </span>
            </div>
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as ReactElement, { ...rest })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Cover
