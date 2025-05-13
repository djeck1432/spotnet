import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Affix from '@/components/shared/Affix'
import DemoCard from './DemoCard'
import DemoTitleSection from './DemoTitleSection'
import DemoComponentApi from './DemoComponentApi'
// eslint-disable-next-line import/named
import { Link } from 'react-scroll'
import type { DemoComponentApiProps } from './DemoComponentApi'
import type { ReactNode, JSX } from 'react'

type Demo = {
    mdName: string
    mdPath: string
    title: string
    desc: string
    component: JSX.Element
}

interface DemoLayoutProps extends DemoComponentApiProps {
    demos?: Demo[]
    header?: {
        title?: string
        desc?: string
    }
    demoCardClass?: string
    hideFooter?: boolean
    extra?: ReactNode | string
    note?: ReactNode | string
    mdPrefixPath?: string
    innerFrame?: boolean
}

const DemoLayout = (props: DemoLayoutProps) => {
    const {
        demos = [],
        header = {},
        api,
        demoCardClass,
        hideApiTitle,
        hideFooter,
        extra,
        note,
        mdPrefixPath,
        innerFrame = true,
        keyText,
    } = props
    return (
        <Container>
            <AdaptableCard shadow={!innerFrame} isLastChild={!innerFrame}>
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                    <div className="xl:col-span-4">
                        <DemoTitleSection
                            className="mb-10"
                            title={header.title}
                            desc={header.desc}
                        />
                        {demos.map((card) => (
                            <div key={card.mdName} id={card.mdName}>
                                <DemoCard
                                    title={card.title}
                                    desc={card.desc}
                                    mdName={card.mdName}
                                    mdPath={card.mdPath}
                                    mdPrefixPath={mdPrefixPath}
                                    demoComponent={card.component}
                                    cardClass={demoCardClass}
                                    hideFooter={hideFooter}
                                />
                            </div>
                        ))}
                        {note && <div className="mt-10">{note}</div>}
                        {api && (
                            <div className="mt-10" id="api">
                                <DemoComponentApi
                                    hideApiTitle={hideApiTitle}
                                    api={api}
                                    keyText={keyText}
                                />
                            </div>
                        )}
                        {extra && <div className="mt-10">{extra}</div>}
                    </div>
                    <div className="hidden xl:block">
                        <Affix offset={80}>
                            <h6 className="text-gray-900 uppercase tracking-wide font-semibold mb-3 text-sm lg:text-xs">
                                TABLE OF CONTENT
                            </h6>
                            <ul className="overflow-x-hidden text-gray-500 dark:text-gray-400 font-medium">
                                {demos.map((link) => (
                                    <li key={`anchor${link.mdName}`}>
                                        <Link
                                            activeClass="text-gray-900 dark:text-gray-50"
                                            className="cursor-pointer block transform transition-colors duration-200 py-2 hover:text-gray-900 dark:hover:text-gray-100"
                                            to={link.mdName}
                                            spy={true}
                                            smooth={true}
                                            duration={500}
                                            offset={-80}
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Affix>
                    </div>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default DemoLayout
