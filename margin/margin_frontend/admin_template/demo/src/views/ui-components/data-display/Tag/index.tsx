import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Affix from './Affix'
import Custom from './Custom'

const mdPath = 'Tag'

const demoHeader = {
    title: 'Tag',
    desc: 'Tag component is used for categorize content with a keyword.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Tag.`,
        component: <Basic />,
    },
    {
        mdName: 'Affix',
        mdPath: mdPath,
        title: 'Affix',
        desc: `Tag can have prefix and suffix, both affix can be customized as well.`,
        component: <Affix />,
    },
    {
        mdName: 'Custom',
        mdPath: mdPath,
        title: 'Custom',
        desc: `We can have different Tag style by applying tailwind css class.`,
        component: <Custom />,
    },
]

const demoApi = [
    {
        component: 'Tag',
        api: [
            {
                propName: 'prefix',
                type: `<code>boolean</code> | <code>ReactNode</code>`,
                default: `<code>false</code>`,
                desc: 'Tag prefix',
            },
            {
                propName: 'prefixClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Css class for Tag prefix, only available when prefix type is boolean',
            },
            {
                propName: 'suffix',
                type: `<code>boolean</code> | <code>ReactNode</code>`,
                default: `<code>false</code>`,
                desc: 'Tag suffix',
            },
            {
                propName: 'suffixClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Css class for Tag suffix, only available when suffix type is boolean',
            },
        ],
    },
]

const Tag = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Tag
