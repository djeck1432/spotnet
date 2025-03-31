import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import HeaderFooter from './HeaderFooter'
import HeaderFooterBorder from './HeaderFooterBorder'
import Border from './Border'
import ExtraClass from './ExtraClass'
import Clickable from './Clickable'
import Media from './Media'

const mdPath = 'Cards'

const demoHeader = {
    title: 'Cards',
    desc: 'Card can be used to container a groups of related content.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Card`,
        component: <Basic />,
    },
    {
        mdName: 'HeaderFooter',
        mdPath: mdPath,
        title: 'Header & Footer',
        desc: `Card can set header & footer via <code>header</code> & <code>footer</code> props.`,
        component: <HeaderFooter />,
    },
    {
        mdName: 'HeaderFooterBorder',
        mdPath: mdPath,
        title: 'Header & Footer Border',
        desc: `Header & footer seperator can disabled by setting <code>headerBorder</code> & <code>footerBorder</code> to <code>false</code>.`,
        component: <HeaderFooterBorder />,
    },
    {
        mdName: 'Border',
        mdPath: mdPath,
        title: 'Border',
        desc: `Display Card with border (without shadow).`,
        component: <Border />,
    },
    {
        mdName: 'ExtraClass',
        mdPath: mdPath,
        title: 'Extra Class',
        desc: `Extra class can be apply via <code>bodyClass</code>, <code>headerClass</code> & <code>footerClass</code> to correspond section.`,
        component: <ExtraClass />,
    },
    {
        mdName: 'Clickable',
        mdPath: mdPath,
        title: 'Clickable',
        desc: `Set <code>click</code> prop to <code>true</code> to make cursor become pointer.`,
        component: <Clickable />,
    },
    {
        mdName: 'Media',
        mdPath: mdPath,
        title: 'Media',
        desc: ``,
        component: <Media />,
    },
]

const demoApi = [
    {
        component: 'Card',
        api: [
            {
                propName: 'header',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Card header',
            },
            {
                propName: 'footer',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Card footer',
            },
            {
                propName: 'headerExtra',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Extra content for header',
            },
            {
                propName: 'bordered',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Display Card with border (without shadow)',
            },
            {
                propName: 'clickable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Make cursor become pointer upon hover',
            },
            {
                propName: 'bodyClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Apply class to card body',
            },
            {
                propName: 'headerClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Apply class to card header',
            },
            {
                propName: 'footerClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Apply class to card footer',
            },
            {
                propName: 'headerBorder',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Show header seperator',
            },
            {
                propName: 'footerBorder',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Show footer seperator',
            },
            {
                propName: 'onClick',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Card is clicked',
            },
        ],
    },
]

const Cards = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Cards
