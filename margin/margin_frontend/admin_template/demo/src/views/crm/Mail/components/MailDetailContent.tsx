import { forwardRef, useMemo } from 'react'
import IconText from '@/components/shared/IconText'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import ScrollBar from '@/components/ui/ScrollBar'
import Tag from '@/components/ui/Tag'
import ReactHtmlParser from 'html-react-parser'
import { HiOutlineClock } from 'react-icons/hi'
import {
    BsFileEarmarkPdf,
    BsFileEarmarkWord,
    BsFileExcel,
    BsFileEarmark,
    BsCardImage,
} from 'react-icons/bs'
import { labelList } from '../constants'
import type { Mail } from '../store'
import type { PropsWithChildren } from 'react'
import type { ScrollbarRef } from '@/components/ui/ScrollBar'

type MailDetailContentProps = PropsWithChildren<{
    mail?: Partial<Mail>
}>

const fileIcon = (fileType: string) => {
    switch (fileType) {
        case 'doc':
            return <BsFileEarmarkWord className="text-blue-500" />
        case 'xls':
            return <BsFileExcel className="text-emerald-500" />
        case 'pdf':
            return <BsFileEarmarkPdf className="text-red-500" />
        case 'jpg':
            return <BsCardImage />
        case 'png':
            return <BsCardImage />
        default:
            return <BsFileEarmark />
    }
}

const MailDetailContent = forwardRef<ScrollbarRef, MailDetailContentProps>(
    (props, ref) => {
        const { mail = {}, children } = props

        const label = useMemo(
            () => labelList.find((label) => label.value === mail.label),
            [mail.label],
        )

        return (
            <>
                <div className="bg-white dark:bg-gray-800 px-4 py-8 shadow-sm border-b border-gray-200 dark:border-gray-600 md:flex items-center justify-between">
                    <h5>{mail.title}</h5>
                    {mail.label && (
                        <Tag prefix prefixClass={label?.dotClass}>
                            {label?.label}
                        </Tag>
                    )}
                </div>
                <ScrollBar ref={ref} autoHide>
                    <div className="m-6 h-full">
                        {children}
                        {mail.message?.map((msg) => (
                            <div key={msg.id} className="pb-6">
                                <Card>
                                    <div className="md:flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Avatar
                                                shape="circle"
                                                src={msg.avatar}
                                            />
                                            <div className="ltr:ml-2 rtl:mr-2">
                                                <div className="font-semibold truncate text-gray-900 dark:text-gray-100">
                                                    {msg.name}
                                                </div>
                                                <div>
                                                    To:{' '}
                                                    {mail.mail?.map(
                                                        (to, index) => (
                                                            <span
                                                                key={to + index}
                                                            >
                                                                {to}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <IconText
                                            icon={
                                                <HiOutlineClock className="text-lg" />
                                            }
                                        >
                                            <span className="font-semibold">
                                                {msg.date}
                                            </span>
                                        </IconText>
                                    </div>
                                    <div className="mt-8">
                                        {ReactHtmlParser(msg.content)}
                                    </div>
                                    {msg.attachment?.length > 0 && (
                                        <div className="mt-6 md:flex">
                                            {msg.attachment.map((item) => (
                                                <div
                                                    key={item.file}
                                                    className="min-w-full md:min-w-[200px] flex items-center md:mb-0 mb-2 ltr:md:mr-3 rtl:md:ml-3 cursor-pointer select-none border px-4 py-2 border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                    <div className="text-3xl">
                                                        {fileIcon(item.type)}
                                                    </div>
                                                    <div className="ltr:ml-2 rtl:mr-2">
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {item.file}
                                                        </div>
                                                        <span className="">
                                                            {item.size}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        ))}
                    </div>
                </ScrollBar>
            </>
        )
    },
)

MailDetailContent.displayName = 'MailDetailContent'

export default MailDetailContent
