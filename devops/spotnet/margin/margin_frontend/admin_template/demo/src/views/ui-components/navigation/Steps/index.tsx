import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Title from './Title'
import Vertical from './Vertical'
import Description from './Description'
import CustomIcon from './CustomIcon'
import Error from './Error'
import Controlled from './Controlled'
import Clickable from './Clickable'

const mdPath = 'Steps'

const demoHeader = {
    title: 'Steps',
    desc: 'Steps component display progress & tasks through a sequence order.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `The default usage of Steps component.`,
        component: <Basic />,
    },
    {
        mdName: 'Title',
        mdPath: mdPath,
        title: 'Title',
        desc: `Example Steps with title.`,
        component: <Title />,
    },
    {
        mdName: 'Vertical',
        mdPath: mdPath,
        title: 'Vertical',
        desc: `Steps display in horizontal by default, but it be vertical using <code>vertical</code> props.`,
        component: <Vertical />,
    },
    {
        mdName: 'Description',
        mdPath: mdPath,
        title: 'Description',
        desc: `Steps can have description, but it only available for vertical layout.`,
        component: <Description />,
    },
    {
        mdName: 'CustomIcon',
        mdPath: mdPath,
        title: 'Custom Icon',
        desc: `Steps label can be replaced by icons.`,
        component: <CustomIcon />,
    },
    {
        mdName: 'Error',
        mdPath: mdPath,
        title: 'Error',
        desc: `Set the 'error' to <code>status</code> prop to indicate that step is in error state.`,
        component: <Error />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled steps',
        desc: `We can make Steps dynamic by controlling the <code>current</code> prop.`,
        component: <Controlled />,
    },
    {
        mdName: 'Clickable',
        mdPath: mdPath,
        title: 'Clickable',
        desc: `Setting <code>onChange</code> to make Steps clickable.`,
        component: <Clickable />,
    },
]

const demoApi = [
    {
        component: 'Steps',
        api: [
            {
                propName: 'current',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'The current step, counting from 0',
            },
            {
                propName: 'onChange',
                type: `<code>(index: number) => void</code>`,
                default: `-`,
                desc: 'Callback when Steps is changed',
            },
            {
                propName: 'status',
                type: `<code>'complete'</code> | <code>'pending'</code> | <code>'in-progress'</code> | <code>'error'</code>`,
                default: `<code>'in-progress'</code>`,
                desc: 'Status of current step',
            },
            {
                propName: 'vertical',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to display Steps in vertical',
            },
        ],
    },
    {
        component: 'Steps.Item',
        api: [
            {
                propName: 'customIcon',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Custom element for Step label',
            },
            {
                propName: 'description',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Step description, only available when Step is vertical',
            },
            {
                propName: 'title',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Step title',
            },
        ],
    },
]

const Steps = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Steps
