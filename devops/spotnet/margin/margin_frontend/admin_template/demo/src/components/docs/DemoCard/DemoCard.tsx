import Card from '@/components/ui/Card'
import CardFooter from './CardFooter'
import ReactHtmlParser from 'html-react-parser'
import type { ReactNode } from 'react'
import type { CardFooterProps } from './CardFooter'

export interface DemoCardProps extends CardFooterProps {
    demoComponent?: ReactNode
    id?: string
    title?: string
    desc?: string
    hideFooter?: boolean
    cardClass?: string
}

const DemoCard = (props: DemoCardProps) => {
    const { demoComponent, id, title, desc = '', hideFooter, ...rest } = props

    return (
        <div className="demo-card">
            <div className="mb-6">
                <h4>{title}</h4>
                {desc && (
                    <div className="mt-1 demo-card-description">
                        {ReactHtmlParser(desc)}
                    </div>
                )}
            </div>
            <Card
                bordered
                id={id}
                className={`mb-9`}
                footerClass="bg-gray-50 dark:bg-gray-700 pb-2 pt-2"
                footer={hideFooter ? false : <CardFooter {...rest} />}
            >
                {demoComponent}
            </Card>
        </div>
    )
}

export default DemoCard
