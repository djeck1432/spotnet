import ReactHtmlParser from 'html-react-parser'

export interface DemoTitleSectionProps {
    title?: string
    desc?: string
    className?: string
}

const DemoTitleSection = (props: DemoTitleSectionProps) => {
    const { title, desc = '', className } = props

    return (
        <div className={className}>
            <h2 className="mb-2">{title}</h2>
            <p>{ReactHtmlParser(desc)}</p>
        </div>
    )
}

export default DemoTitleSection
