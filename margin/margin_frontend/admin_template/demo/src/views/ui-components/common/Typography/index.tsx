import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Heading from './Heading'
import FontWeight from './FontWeight'
import Text from './Text'
import List from './List'
import TextOverflow from './TextOverflow'
import Prose from './Prose'

const mdPath = 'Typography'

const demoHeader = {
    title: 'Typography',
    desc: 'Examples of often used typography.',
}

const demos = [
    {
        mdName: 'Heading',
        mdPath: mdPath,
        title: 'Heading',
        desc: ``,
        component: <Heading />,
    },
    {
        mdName: 'Text',
        mdPath: mdPath,
        title: 'Text',
        desc: ``,
        component: <Text />,
    },
    {
        mdName: 'FontWeight',
        mdPath: mdPath,
        title: 'Font weight',
        desc: ``,
        component: <FontWeight />,
    },
    {
        mdName: 'List',
        mdPath: mdPath,
        title: 'List',
        desc: ``,
        component: <List />,
    },
    {
        mdName: 'TextOverflow',
        mdPath: mdPath,
        title: 'Text overflow',
        desc: ``,
        component: <TextOverflow />,
    },
    {
        mdName: 'Prose',
        mdPath: mdPath,
        title: 'Prose',
        desc: `Tailwind CSS Typography plugin provides a set of <code>prose</code> classes you can use to add beautiful typographic defaults to any vanilla HTML you don't control, like HTML rendered from Markdown, or pulled from a CMS.`,
        component: <Prose />,
    },
]

const Typography = () => {
    return <DemoLayout header={demoHeader} demos={demos} />
}

export default Typography
