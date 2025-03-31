import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import TimeRangeInput from './TimeRangeInput'
import Controlled from './Controlled'
import Seconds from './Seconds'
import AmPm from './AmPm'
import Sizes from './Sizes'
import Disabled from './Disabled'
import Affix from './Affix'
import Invalid from './Invalid'

const mdPath = 'TimeInput'

const demoHeader = {
    title: 'TimeInput',
    desc: 'An input field alllow user enter specify time.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic example of TimeInput.`,
        component: <Basic />,
    },
    {
        mdName: 'TimeRangeInput',
        mdPath: mdPath,
        title: 'Time range input',
        desc: `Basic example for TimeInputRange.`,
        component: <TimeRangeInput />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Controlled usage.`,
        component: <Controlled />,
    },
    {
        mdName: 'Seconds',
        mdPath: mdPath,
        title: 'Display seconds',
        desc: `We can also enable seconds for input.`,
        component: <Seconds />,
    },
    {
        mdName: 'AmPm',
        mdPath: mdPath,
        title: 'Display AM or PM',
        desc: `Setting <code>format</code> prop to <code>'12'</code> to change time to 12 hours format`,
        component: <AmPm />,
    },
    {
        mdName: 'Sizes',
        mdPath: mdPath,
        title: 'Sizes',
        desc: `There's three sizes of option for TimeInput.`,
        component: <Sizes />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Disabled TimeInput.`,
        component: <Disabled />,
    },
    {
        mdName: 'Affix',
        mdPath: mdPath,
        title: 'Affix',
        desc: `TimeInput can have <code>suffix</code> or <code>prefix</code> content inside.`,
        component: <Affix />,
    },
    {
        mdName: 'Invalid',
        mdPath: mdPath,
        title: 'Invalid state',
        desc: `Display TimeInput as invalid status when <code>invalid</code> prop is set to true.`,
        component: <Invalid />,
    },
]

const demoApi = [
    {
        component: 'TimeInput',
        api: [
            {
                propName: 'amLabel',
                type: `<code>'string'</code>`,
                default: `<code>'am'</code>`,
                desc: 'Display string for AM',
            },
            {
                propName: 'amPmPlaceholder',
                type: `<code>'string'</code>`,
                default: `<code>'am'</code>`,
                desc: 'Placeholder for AM/PM field',
            },
            {
                propName: 'clearable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether allow to clear value',
            },
            {
                propName: 'defaultValue',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default value of TimeInput (use value instead if it is controlled)',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether TimeInput is disabled',
            },
            {
                propName: 'format',
                type: `<code>'12'</code> | <code>'24'</code>`,
                default: `<code>'24'</code>`,
                desc: 'Determine time format',
            },
            {
                propName: 'invalid',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the TimeInput is invalid status',
            },
            {
                propName: 'nextRef',
                type: `<code>RefObject</code>`,
                default: `-`,
                desc: 'Ref to focus after final TimeInput field, can be used by TimeInputRange',
            },
            {
                propName: 'onChange',
                type: `<code>(value: Date) => void</code>`,
                default: `-`,
                desc: 'Callback when TimeInput value changed',
            },
            {
                propName: 'pmLabel',
                type: `<code>'string'</code>`,
                default: `<code>'pm'</code>`,
                desc: 'Display string for PM',
            },
            {
                propName: 'prefix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a prefix content inside TimeInput',
            },
            {
                propName: 'showSeconds',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether display seconds input field',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code>`,
                default: `<code>'md'</code>`,
                desc: 'TimeInput size',
            },
            {
                propName: 'suffix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `<code>ReactNode</code>`,
                desc: 'Render a suffix content inside TimeInput',
            },
            {
                propName: 'timeFieldPlaceholder',
                type: `<code>'string'</code>`,
                default: `<code>'--'</code>`,
                desc: 'Time field placeholder',
            },
            {
                propName: 'timeFieldClass',
                type: `<code>'string'</code>`,
                default: `-`,
                desc: 'Extra class for time field',
            },
            {
                propName: 'value',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Value of TimeInput (Controlled)',
            },
        ],
    },
    {
        component: 'TimeInput.TimeInputRange',
        api: [
            {
                propName: 'amLabel',
                type: `<code>'string'</code>`,
                default: `<code>'am'</code>`,
                desc: 'Display string for AM',
            },
            {
                propName: 'amPmPlaceholder',
                type: `<code>'string'</code>`,
                default: `<code>'am'</code>`,
                desc: 'Placeholder for AM/PM field',
            },
            {
                propName: 'clearable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether allow to clear value',
            },
            {
                propName: 'defaultValue',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default value of TimeInputRange (use value instead if it is controlled)',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether TimeInputRange is disabled',
            },
            {
                propName: 'format',
                type: `<code>'12'</code> | <code>'24'</code>`,
                default: `<code>'24'</code>`,
                desc: 'Determine time format',
            },
            {
                propName: 'invalid',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the TimeInputRange is invalid status',
            },
            {
                propName: 'nextRef',
                type: `<code>RefObject</code>`,
                default: `-`,
                desc: 'Ref to focus after final TimeInputRange field, can be used by TimeInputRangeRange',
            },
            {
                propName: 'onChange',
                type: `<code>(value: Date) => void</code>`,
                default: `-`,
                desc: 'Callback when TimeInputRange value changed',
            },
            {
                propName: 'pmLabel',
                type: `<code>'string'</code>`,
                default: `<code>'pm'</code>`,
                desc: 'Display string for PM',
            },
            {
                propName: 'prefix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a prefix content inside TimeInputRange',
            },
            {
                propName: 'separator',
                type: `<code>'string'</code> | <code>'24'</code>`,
                default: `<code>'~'</code>`,
                desc: 'Seperator between time inputs ',
            },
            {
                propName: 'showSeconds',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether display seconds input field',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code>`,
                default: `<code>'md'</code>`,
                desc: 'TimeInputRange size',
            },
            {
                propName: 'suffix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `<code>ReactNode</code>`,
                desc: 'Render a suffix content inside TimeInputRange',
            },
            {
                propName: 'timeFieldPlaceholder',
                type: `<code>'string'</code>`,
                default: `<code>'--'</code>`,
                desc: 'Time field placeholder',
            },
            {
                propName: 'timeFieldClass',
                type: `<code>'string'</code>`,
                default: `-`,
                desc: 'Extra class for time field',
            },
            {
                propName: 'value',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Value of TimeInputRange (Controlled)',
            },
        ],
    },
]

const Switcher = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Switcher
