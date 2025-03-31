import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Size from './Size'
import MultipleSelection from './MultipleSelection'
import Disabled from './Disabled'
import Custom from './Custom'
import Controlled from './Controlled'

const mdPath = 'Segment'

const demoHeader = {
    title: 'Segment',
    desc: 'Segments display a group of related options that allow user toggled on or off.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Segment.`,
        component: <Basic />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `Segment have exact size variation as <code>Button</code>`,
        component: <Size />,
    },
    {
        mdName: 'MultipleSelection',
        mdPath: mdPath,
        title: 'Multiple Selection',
        desc: `Segment support multiple selaction, by setting <code>selectionType</code> to <code>multiple</code>.`,
        component: <MultipleSelection />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Make Segment Item inactive by adding the <code>disabled</code> prop to.`,
        component: <Disabled />,
    },
    {
        mdName: 'Custom',
        mdPath: mdPath,
        title: 'Custom Segment',
        desc: `Segment Item allow us to render prop as children to create a more custom look options.`,
        component: <Custom />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Some example of controlled Segment.`,
        component: <Controlled />,
    },
]

const demoApi = [
    {
        component: 'Segment',
        api: [
            {
                propName: 'defaultValue',
                type: `<code>string[]</code>`,
                default: `-`,
                desc: 'Initial value for uncontrolled Segment',
            },
            {
                propName: 'onChange',
                type: `<code>(segmentValue: string[]) => void</code>`,
                default: `-`,
                desc: 'Callback when Segment value is changed',
            },
            {
                propName: 'selectionType',
                type: `<code>'single' | 'multiple'</code>`,
                default: `<code>'single'</code>`,
                desc: 'Whether a single or multiple items can be selected at a time',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code> | <code>'xs'</code>`,
                default: `<code>'md'</code>`,
                desc: 'Size of all segment item.',
            },
            {
                propName: 'value',
                type: `<code>string[]</code>`,
                default: `-`,
                desc: 'Controlled value of the Segment item to activate',
            },
        ],
    },
    {
        component: 'Segment.Item',
        api: [
            {
                propName: 'children',
                type: `<code>({active: boolean, disabled: boolean, value: string[], ref: string, onSegmentItemClick: () => void}) => ReactNode | ReactNode</code>`,
                default: `-`,
                desc: 'Children of Segment item',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to disable Segment item',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code> | <code>'xs'</code>`,
                default: `<code>'md'</code>`,
                desc: 'Size of the segment item.',
            },
            {
                propName: 'value',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'An unique value for Segment item',
            },
        ],
    },
]

const Segment = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Segment
