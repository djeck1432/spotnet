import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Variant from './Variant'
import Size from './Size'
import Color from './Color'
import Disabled from './Disabled'
import Shape from './Shape'
import ButtonWithIcon from './ButtonWithIcon'
import Icon from './Icon'
import Loading from './Loading'
import Block from './Block'

const mdPath = 'Button'

const demoHeader = {
    title: 'Button',
    desc: 'Button is used to start an instant operation and is used when triggers an action or event',
}

const demos = [
    {
        mdName: 'Variant',
        mdPath: mdPath,
        title: 'Variant',
        desc: `There's few variant of appearance of the button, you can set the <code>variant</code> prop
		value to <code>default</code>, <code>twoTone</code>, <code>solid</code>, or <code>plain</code>.`,
        component: <Variant />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `Buttons come with four type of size, <code>xs</code>, <code>sm</code>, <code>md</code> & <code>lg</code>, The default size is <code>md</code>.`,
        component: <Size />,
    },
    {
        mdName: 'Color',
        mdPath: mdPath,
        title: 'Color',
        desc: `<code>twoTone</code> and <code>solid</code> button able to apply custom color, available colors option based on tailwind <code>theme.colors</code>`,
        component: <Color />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Disabled Button prevents user interaction, set <code>disabled</code> prop to <code>true</code> to disabled a button.`,
        component: <Disabled />,
    },
    {
        mdName: 'Shape',
        mdPath: mdPath,
        title: 'Shape',
        desc: `Button shape can be set to <code>none</code> or <code>circle</code>, the default shape is <code>round</code>`,
        component: <Shape />,
    },
    {
        mdName: 'Icon',
        mdPath: mdPath,
        title: 'Icon',
        desc: `Button can contain an icon by insert an icon to <code>icon</code> prop`,
        component: <Icon />,
    },
    {
        mdName: 'ButtonWithIcon',
        mdPath: mdPath,
        title: 'Button With Icon',
        desc: `Icons also can be added to buttons and combined with text as the examples below.`,
        component: <ButtonWithIcon />,
    },
    {
        mdName: 'Loading',
        mdPath: mdPath,
        title: 'Loading',
        desc: `Set <code>loading</code> prop to true to shows a loading indicator, it will disabled the button as well.`,
        component: <Loading />,
    },
    {
        mdName: 'Block',
        mdPath: mdPath,
        title: 'Block',
        desc: `Buttons can stretch to fill the width by adding <code>block</code> prop`,
        component: <Block />,
    },
]

const demoApi = [
    {
        component: 'Button',
        api: [
            {
                propName: 'variant',
                type: `<code>'solid'</code>  | <code>'twoTone'</code> | <code>'plain'</code> | <code>'default'</code>`,
                default: `<code>'default'</code>`,
                desc: 'The variant of the button',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code> | <code>'xs'</code>`,
                default: `<code>'md'</code>`,
                desc: 'Size of the button.',
            },
            {
                propName: 'color',
                type: `(available colors option based on tailwind <code>theme.colors</code>)`,
                default: 'current theme color',
                desc: 'Custom color for button',
            },
            {
                propName: 'shape',
                type: `<code>'round'</code>  | <code>'circle'</code> | <code>'none'</code>`,
                default: `<code>'round'</code>`,
                desc: 'Border radius of the button',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Prevents user interact with the button',
            },
            {
                propName: 'icon',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render icon',
            },
            {
                propName: 'active',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Set button to active status',
            },
            {
                propName: 'loading',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Show a loading spinner & disable the button',
            },
            {
                propName: 'block',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Make button fill to its container width',
            },
        ],
    },
]

const Button = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Button
