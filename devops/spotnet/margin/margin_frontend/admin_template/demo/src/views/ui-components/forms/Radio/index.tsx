import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Simple from './Simple'
import Group from './Group'
import Disabled from './Disabled'
import Vertical from './Vertical'
import Color from './Color'

const mdPath = 'Radio'

const demoHeader = {
    title: 'Radio',
    desc: 'Radios let users choose a single option in a series of options.',
}

const demos = [
    {
        mdName: 'Simple',
        mdPath: mdPath,
        title: 'Simple',
        desc: ` Simple Radio example.`,
        component: <Simple />,
    },
    {
        mdName: 'Group',
        mdPath: mdPath,
        title: 'Group',
        desc: `Controlled radio group example`,
        component: <Group />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `<code>Radio</code> & <code>Radio.Group</code> allow to <code>disabled</code> to prevent user execute click event.`,
        component: <Disabled />,
    },
    {
        mdName: 'Vertical',
        mdPath: mdPath,
        title: 'Vertical',
        desc: `Radio list can display in vertical.`,
        component: <Vertical />,
    },
    {
        mdName: 'Color',
        mdPath: mdPath,
        title: 'Color',
        desc: `Radio & group able to apply custom color via <code>color</code> prop.`,
        component: <Color />,
    },
]

const demoApi = [
    {
        component: 'Radio',
        api: [
            {
                propName: 'checked',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Radio is checked',
            },
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: 'current theme color',
                desc: 'Custom color for Radio, available colors option based on tailwind <code>theme.colors</code>',
            },
            {
                propName: 'defaultChecked',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Radio initial state is checked',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Radio is disabled',
            },
            {
                propName: 'labelRef',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Ref of Radio label element',
            },
            {
                propName: 'name',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'The name of the Radio input field',
            },
            {
                propName: 'onChange',
                type: `<code>(value: any, e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when Radio value is changed',
            },
            {
                propName: 'value',
                type: `<code>any</code>`,
                default: `-`,
                desc: 'Value of Radio',
            },
            {
                propName: 'vertical',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Display Radio in vertical',
            },
        ],
    },
    {
        component: 'Radio.Group',
        api: [
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: 'current theme color',
                desc: 'Custom color for all radio in the group, available colors option based on tailwind <code>theme.colors</code>',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: '-',
                desc: 'Whether to disable all radios',
            },
            {
                propName: 'name',
                type: `<code>string</code>`,
                default: '-',
                desc: 'Name of radios under radio group',
            },
            {
                propName: 'radioGutter',
                type: `<code>number</code>`,
                default: '-',
                desc: 'Gutter between radios',
            },
            {
                propName: 'onChange',
                type: `<code>(values: any, e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when value is changed',
            },
            {
                propName: 'value',
                type: `<code>any</code>`,
                default: `-`,
                desc: 'Specify selected value of radios',
            },
            {
                propName: 'vertical',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Display list of radios in vertical',
            },
        ],
    },
]

const Radio = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Radio
