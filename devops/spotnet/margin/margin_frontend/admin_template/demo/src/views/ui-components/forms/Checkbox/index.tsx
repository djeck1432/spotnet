import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Default from './Default'
import Group from './Group'
import Disabled from './Disabled'
import Vertical from './Vertical'
import Color from './Color'
import Controlled from './Controlled'

const mdPath = 'Checkbox'

const demoHeader = {
    title: 'Checkbox',
    desc: 'Checkboxes let users select one or more options from a choice of list.',
}

const demos = [
    {
        mdName: 'Default',
        mdPath: mdPath,
        title: 'Default',
        desc: `A simple checkbox example.`,
        component: <Default />,
    },
    {
        mdName: 'Group',
        mdPath: mdPath,
        title: 'Group',
        desc: `<code>Checkbox.Group</code> help to manage state of checkboxes in a list.`,
        component: <Group />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Checkbox allow to <code>disabled</code> to prevent user execute click event.`,
        component: <Disabled />,
    },
    {
        mdName: 'Vertical',
        mdPath: mdPath,
        title: 'Vertical',
        desc: `Checkbox list can display in vertical too.`,
        component: <Vertical />,
    },
    {
        mdName: 'Color',
        mdPath: mdPath,
        title: 'Color',
        desc: `Checkbox & group able to apply custom color via <code>color</code> prop.`,
        component: <Color />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Controlled checkbox example.`,
        component: <Controlled />,
    },
]

const demoApi = [
    {
        component: 'Checkbox',
        api: [
            {
                propName: 'checked',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Checkbox is checked',
            },
            {
                propName: 'defaultChecked',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Checkbox initial state is checked',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Checkbox is disabled',
            },
            {
                propName: 'value',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'The value of the selected state (only valid when Checkbox.Group or the binding object type is array)',
            },
            {
                propName: 'labelRef',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Ref of Checkbox label element',
            },
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: 'current theme color',
                desc: 'Custom color for Checkbox, available colors option based on tailwind <code>theme.colors</code>',
            },
            {
                propName: 'onChange',
                type: `<code>(checked: boolean, e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when Checkbox value is changed',
            },
            {
                propName: 'name',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'The name of the Checkbox input field',
            },
        ],
    },
    {
        component: 'Checkbox.Group',
        api: [
            {
                propName: 'vertical',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Display list of checkbox in vertical',
            },
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: 'current theme color',
                desc: 'Custom color for all checkboxes in the group, available colors option based on tailwind <code>theme.colors</code>',
            },
            {
                propName: 'value',
                type: `<code>string[]</code> | <code>number[]</code>`,
                default: `-`,
                desc: 'Specify selected value of checkboxes',
            },
            {
                propName: 'onChange',
                type: `<code>(values: string[] | number[], e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when value is changed',
            },
            {
                propName: 'name',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Name of all checkboxes input field under the group',
            },
        ],
    },
]

const Checkbox = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Checkbox
