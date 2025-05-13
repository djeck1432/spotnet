import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Sizes from './Sizes'
import Disabled from './Disabled'
import Affix from './Affix'
import PasswordVisible from './PasswordVisible'
import Textarea from './Textarea'
import Invalid from './Invalid'
import ControlledInput from './ControlledInput'

const mdPath = 'Input'

const demoHeader = {
    title: 'Input',
    desc: 'Input component specifies an field where the user can enter data.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `The most basic usage of Input.`,
        component: <Basic />,
    },
    {
        mdName: 'Sizes',
        mdPath: mdPath,
        title: 'Sizes',
        desc: `There's three sizes of option for Input field.`,
        component: <Sizes />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Disabled Input.`,
        component: <Disabled />,
    },
    {
        mdName: 'Affix',
        mdPath: mdPath,
        title: 'Affix',
        desc: `Input can have <code>suffix</code> or <code>prefix</code> content inside.`,
        component: <Affix />,
    },
    {
        mdName: 'PasswordVisible',
        mdPath: mdPath,
        title: 'Password Visible',
        desc: `Example of controlling the Input type via prefix icon.`,
        component: <PasswordVisible />,
    },
    {
        mdName: 'Textarea',
        mdPath: mdPath,
        title: 'Textarea',
        desc: `Turn Input field to textarea by setting <code>textarea</code> prop to true.`,
        component: <Textarea />,
    },
    {
        mdName: 'Invalid',
        mdPath: mdPath,
        title: 'Invalid',
        desc: `Display Input as invalid status when <code>invalid</code> prop is set to true.`,
        component: <Invalid />,
    },
    {
        mdName: 'ControlledInput',
        mdPath: mdPath,
        title: 'Controlled Input',
        desc: `Controlled Input example.`,
        component: <ControlledInput />,
    },
]

const demoApi = [
    {
        component: 'Input',
        api: [
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Input is disabled',
            },
            {
                propName: 'invalid',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Input is invalid status',
            },
            {
                propName: 'onBlur',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when Input remove focus',
            },
            {
                propName: 'onChange',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when Input value changed',
            },
            {
                propName: 'onFocus',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when Input is focused',
            },
            {
                propName: 'prefix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a prefix content inside Input',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code>`,
                default: `<code>'md'</code>`,
                desc: 'Input size',
            },
            {
                propName: 'suffix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a suffix content inside Input',
            },
            {
                propName: 'textArea',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to turn Input into textarea field',
            },
            {
                propName: 'type',
                type: `<code>string</code>`,
                default: `<code>'text'</code>`,
                desc: 'Input type, refer to <a class="text-blue-500 underline" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types" target="_blank">MDN</a> for available types',
            },
            {
                propName: 'unstyle',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to remove input default style',
            },
        ],
    },
]

const Input = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Input
